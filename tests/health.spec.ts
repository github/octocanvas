import { test, expect } from '@playwright/test';

test('octocanvas homepage responds with expected title text', async ({ request }) => {
  const res = await request.get('/');
  expect(res.status(), 'status should be 200').toBe(200);
  const body = await res.text();
  expect(body).toContain('OCTOCANVAS');
  expect(body).toContain('Collectibles');
});

test('README banner markdown popup explains where to place the image', async ({ page }) => {
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

  await page.goto('/');
  const usernameInput = page.locator('#github-handle');
  await usernameInput.click();
  await usernameInput.pressSequentially('octocat');
  await expect(usernameInput).toHaveValue('octocat');
  await page.getByRole('button', { name: 'Generate' }).click();
  await page.getByRole('tab', { name: 'README Banner' }).click();

  const dialogPromise = page.waitForEvent('dialog');
  await page.getByRole('button', { name: 'Copy Markdown' }).click();
  const dialog = await dialogPromise;

  expect(dialog.message()).toContain('Download the banner and save it as banner.png.');
  expect(dialog.message()).toContain('Upload banner.png to the root of your octocat/octocat profile repository.');
  expect(dialog.message()).toContain('The Markdown points to /banner.png on the main branch:');
  expect(dialog.message()).toContain('https://raw.githubusercontent.com/octocat/octocat/main/banner.png');

  await dialog.dismiss();
});
