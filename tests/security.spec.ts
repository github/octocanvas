import { test, expect, type Page } from '@playwright/test';

const PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
);

const XSS_NAME = '</text><image href=x onerror=alert(1)>';

async function mockProfile(page: Page, login: string, overrides: Record<string, unknown> = {}) {
  await page.route(`https://api.github.com/users/${login}`, (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        login,
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
        name: 'Test User',
        followers: 10,
        public_repos: 3,
        bio: '',
        created_at: '2011-01-25T18:44:36Z',
        ...overrides,
      }),
    }),
  );
  await page.route(`https://github.com/${login}.contribs`, (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ total_contributions: 5, weeks: [] }),
    }),
  );
  await page.route('https://avatars.githubusercontent.com/**', (route) =>
    route.fulfill({ contentType: 'image/png', body: PIXEL_PNG }),
  );
  await page.route('https://api.github.com/users/*/repos?*', (route) =>
    route.fulfill({ contentType: 'application/json', body: '[]' }),
  );
}

async function submitUsername(page: Page, username: string) {
  await page.goto('/');
  const input = page.locator('#github-handle');
  await input.click();
  await input.pressSequentially(username);
  await expect(input).toHaveValue(username);
  await page.getByRole('button', { name: 'Generate' }).click();
}

test('profile name with SVG markup renders as literal text in the wallpaper', async ({ page }) => {
  const dialogs: string[] = [];
  page.on('dialog', (d) => {
    dialogs.push(d.message());
    void d.dismiss();
  });
  await page.addInitScript(() => {
    (window as any).__xss = 0;
    window.alert = () => {
      (window as any).__xss++;
    };
  });

  await mockProfile(page, 'xsstester', {
    name: XSS_NAME,
    avatar_url: 'javascript:alert(1)',
  });
  await submitUsername(page, 'xsstester');

  const svg = page.locator('[class*="SVGContainer"] > svg').first();
  await expect(svg).toBeVisible();

  const injected = await svg.evaluate((el) => ({
    texts: Array.from(el.querySelectorAll('text')).map((t) => t.textContent ?? ''),
    handlers: Array.from(el.querySelectorAll('*')).filter((n) =>
      Array.from(n.attributes).some((a) => a.name.toLowerCase().startsWith('on')),
    ).length,
    badHrefs: Array.from(el.querySelectorAll('image')).filter((img) => {
      const href = img.getAttribute('href') ?? '';
      return href !== '' && !/^(https:|data:image\/)/i.test(href);
    }).length,
  }));

  expect(injected.texts).toContain(XSS_NAME);
  expect(injected.handlers).toBe(0);
  expect(injected.badHrefs).toBe(0);

  await page.waitForTimeout(300);
  expect(await page.evaluate(() => (window as any).__xss)).toBe(0);
  expect(dialogs).toEqual([]);
});

for (const bad of ['octocat/repos?x=', '../..', '-octocat', 'a'.repeat(40), 'octo--cat']) {
  test(`invalid username ${JSON.stringify(bad)} is rejected without calling the API`, async ({ page }) => {
    const apiCalls: string[] = [];
    await page.route(/https:\/\/(api\.)?github\.com\/.*/, (route) => {
      apiCalls.push(route.request().url());
      return route.abort();
    });

    await submitUsername(page, bad);

    await expect(page.getByText("That doesn't look like a GitHub username")).toBeVisible();
    expect(apiCalls).toEqual([]);
  });
}

test('valid username still generates a wallpaper', async ({ page }) => {
  await mockProfile(page, 'octo-cat');
  await submitUsername(page, '@octo-cat');

  const svg = page.locator('[class*="SVGContainer"] > svg').first();
  await expect(svg).toBeVisible();
  await expect(svg.locator('text', { hasText: '@octo-cat' }).first()).toBeAttached();
});
