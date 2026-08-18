/**
 * Icon geometry regression tests.
 *
 * The Contributions icon shipped with a hand-edited `package-16` path whose final
 * subpath ("M2.5 13.677v-2.3L6.5 13.8v2.3Z") was a leftover sliver extending to
 * y=16.1 — past the bottom of the 16x16 viewBox, so it rendered as a stray line
 * poking out of the cube.
 *
 * Artwork that escapes its own viewBox is silently clipped by the renderer, which
 * makes it easy to ship and hard to spot in review. These tests measure the real
 * geometry of every icon the card renders and fail when any of it falls outside
 * the box it declares.
 */
import { expect, test, type Page } from '@playwright/test';

const avatarDataUrl =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';

async function mockGitHubProfile(page: Page) {
  await page.route('https://api.github.com/users/octocat', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        login: 'octocat',
        name: 'The Octocat',
        avatar_url: avatarDataUrl,
        html_url: 'https://github.com/octocat',
        followers: 42,
        public_repos: 8,
        bio: 'GitHub mascot',
        created_at: '2011-01-25T18:44:36Z',
      }),
    });
  });

  await page.route(
    'https://api.github.com/users/octocat/repos?per_page=100&sort=updated',
    async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([
          { stargazers_count: 10, forks_count: 2, language: 'TypeScript' },
        ]),
      });
    }
  );

  await page.route('https://github.com/octocat.contribs', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        total_contributions: 123,
        weeks: [{ contribution_days: [{ count: 1 }] }],
      }),
    });
  });
}

async function openDevemonCard(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' });
  const usernameInput = page.getByLabel('GitHub Username');
  await usernameInput.fill('octocat');
  await page.getByRole('button', { name: /generate/i }).click();
  await expect(page.getByText('@octocat').first()).toBeVisible();
  await page.getByRole('tab', { name: /devémon/i }).click();
  await expect(page.locator('[data-devemon-card="true"]')).toBeVisible();
}

/**
 * Measure each rendered icon's true path geometry against the viewBox it declares.
 */
async function measureIcons(page: Page) {
  return page.evaluate(() => {
    const card = document.querySelector('[data-devemon-card="true"]')!;

    return [...card.querySelectorAll('svg')].map((svg) => {
      const [vx, vy, vw, vh] = (svg.getAttribute('viewBox') ?? '0 0 16 16')
        .split(/\s+/)
        .map(Number);

      let box: { x: number; y: number; mx: number; my: number } | null = null;
      for (const path of svg.querySelectorAll('path')) {
        const b = path.getBBox();
        box = box
          ? {
              x: Math.min(box.x, b.x),
              y: Math.min(box.y, b.y),
              mx: Math.max(box.mx, b.x + b.width),
              my: Math.max(box.my, b.y + b.height),
            }
          : { x: b.x, y: b.y, mx: b.x + b.width, my: b.y + b.height };
      }

      return {
        label: svg.getAttribute('aria-label') ?? '(unlabelled)',
        viewBox: { x: vx, y: vy, mx: vx + vw, my: vy + vh },
        box,
      };
    });
  });
}

test('card icons stay inside their viewBox', async ({ page }) => {
  await mockGitHubProfile(page);
  await openDevemonCard(page);

  const icons = await measureIcons(page);
  expect(icons.length).toBeGreaterThan(0);

  // Sub-pixel slack: stroke joins can round a hair past the edge legitimately.
  const tolerance = 0.02;

  const escaping = icons.filter(
    (icon) =>
      icon.box !== null &&
      (icon.box.x < icon.viewBox.x - tolerance ||
        icon.box.y < icon.viewBox.y - tolerance ||
        icon.box.mx > icon.viewBox.mx + tolerance ||
        icon.box.my > icon.viewBox.my + tolerance)
  );

  expect(
    escaping.map(
      (i) =>
        `${i.label}: [${i.box!.x.toFixed(2)}, ${i.box!.y.toFixed(2)} -> ` +
        `${i.box!.mx.toFixed(2)}, ${i.box!.my.toFixed(2)}] outside ` +
        `[${i.viewBox.x}, ${i.viewBox.y} -> ${i.viewBox.mx}, ${i.viewBox.my}]`
    )
  ).toEqual([]);
});

test('contributions icon is a closed, centered cube', async ({ page }) => {
  await mockGitHubProfile(page);
  await openDevemonCard(page);

  const contributions = await page.evaluate(() => {
    const svg = document
      .querySelector('[data-devemon-card="true"]')!
      .querySelector('svg[aria-label="Contributions"]');
    if (!svg) return null;

    const paths = [...svg.querySelectorAll('path')];
    const b = paths[0].getBBox();

    return {
      pathCount: paths.length,
      x: b.x,
      y: b.y,
      mx: b.x + b.width,
      my: b.y + b.height,
    };
  });

  expect(contributions).not.toBeNull();

  // A single path draws the whole cube; a stray leftover subpath is what broke it.
  expect(contributions!.pathCount).toBe(1);

  // The cube is horizontally symmetric within the 16x16 box. The broken version
  // started at x=0.378 on the left but stopped at x=15 on the right.
  const leftGap = contributions!.x;
  const rightGap = 16 - contributions!.mx;
  expect(Math.abs(leftGap - rightGap)).toBeLessThan(0.05);

  // ...and it must not hang below the box, which is what produced the stray line.
  expect(contributions!.my).toBeLessThanOrEqual(16);
});
