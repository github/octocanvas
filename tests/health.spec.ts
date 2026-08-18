import { test, expect, type Page } from '@playwright/test';

async function mockOctocatProfile(page: Page) {
  await page.route('https://api.github.com/users/octocat', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        login: 'octocat',
        avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
        name: 'The Octocat',
        followers: 1234,
        public_repos: 8,
        bio: 'GitHub mascot',
        created_at: '2011-01-25T18:44:36Z',
        company: '@github',
        location: 'San Francisco',
        blog: 'github.blog',
      }),
    });
  });

  await page.route('https://github.com/octocat.contribs', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        total_contributions: 42,
        weeks: [],
      }),
    });
  });

  await page.route('https://api.github.com/users/octocat/repos?*', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([
        { stargazers_count: 10, forks_count: 2, language: 'TypeScript' },
      ]),
    });
  });
}

async function openOctocatReadmeBanner(page: Page) {
  await page.goto('/');
  const usernameInput = page.locator('#github-handle');
  await usernameInput.click();
  await usernameInput.pressSequentially('octocat');
  await expect(usernameInput).toHaveValue('octocat');
  await page.getByRole('button', { name: 'Generate' }).click();
  await page.getByRole('tab', { name: 'README Banner' }).click();
}

async function copyMarkdownDialog(page: Page) {
  const dialogPromise = page.waitForEvent('dialog');
  const copyMarkdownPromise = page.getByRole('button', { name: 'Copy Markdown' }).evaluate((button: HTMLButtonElement) => {
    button.click();
  });
  const dialog = await dialogPromise;

  return { dialog, copyMarkdownPromise };
}

test('octocanvas homepage responds with expected title text', async ({ request }) => {
  const res = await request.get('/');
  expect(res.status(), 'status should be 200').toBe(200);
  const body = await res.text();
  expect(body).toContain('OCTOCANVAS');
  expect(body).toContain('Collectibles');
});

test('README banner markdown popup explains where to place the image', async ({ page }) => {
  await mockOctocatProfile(page);
  await openOctocatReadmeBanner(page);
  const { dialog, copyMarkdownPromise } = await copyMarkdownDialog(page);

  expect(dialog.message()).toContain('Download the banner and save it as banner.png.');
  expect(dialog.message()).toContain('Upload banner.png to the root of your octocat/octocat profile repository.');
  expect(dialog.message()).toContain('The Markdown points to /banner.png on the main branch:');
  expect(dialog.message()).toContain('https://raw.githubusercontent.com/octocat/octocat/main/banner.png');

  await dialog.dismiss();
  await copyMarkdownPromise;
});

test('README banner markdown popup exposes markdown when clipboard copy fails', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'clipboard', {
      value: {
        writeText: () => Promise.reject(new Error('Clipboard denied')),
      },
      configurable: true,
    });
  });

  await mockOctocatProfile(page);
  await openOctocatReadmeBanner(page);
  const { dialog, copyMarkdownPromise } = await copyMarkdownDialog(page);

  expect(dialog.message()).toContain('Markdown could not be copied automatically.');
  expect(dialog.message()).toContain('Copy the Markdown below into README.md.');
  expect(dialog.message()).toContain('https://raw.githubusercontent.com/octocat/octocat/main/banner.png');
  expect(dialog.message()).not.toContain('Markdown copied to clipboard');

  await dialog.dismiss();
  await copyMarkdownPromise;
});
