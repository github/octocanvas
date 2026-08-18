/**
 * Export fidelity regression tests (issue #59).
 *
 * Downloads are produced from the same DOM the user is looking at, so an exported PNG
 * must be a faithful copy of the on-screen render. The previous renderer reimplemented
 * text layout and painted every label a few pixels too low, which pushed pill labels
 * like "LEGENDARY" and "OPEN TO WORK" to the bottom of their pills.
 *
 * These tests compare the real download against a browser screenshot of the same node,
 * so any renderer that reinvents layout or text metrics fails loudly.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

/** Exports render at 3x, so screenshot at 3x to compare like for like. */
test.use({ deviceScaleFactor: 3 });

const avatarDataUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=";

async function mockGitHubProfile(page: Page) {
  await page.route("https://api.github.com/users/octocat", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        login: "octocat",
        name: "The Octocat",
        avatar_url: avatarDataUrl,
        html_url: "https://github.com/octocat",
        followers: 42,
        public_repos: 8,
        bio: "GitHub mascot",
        created_at: "2011-01-25T18:44:36Z",
      }),
    });
  });

  await page.route(
    "https://api.github.com/users/octocat/repos?per_page=100&sort=updated",
    async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify([
          { stargazers_count: 10, forks_count: 2, language: "TypeScript" },
          { stargazers_count: 4, forks_count: 1, language: "CSS" },
          { stargazers_count: 1, forks_count: 0, language: "TypeScript" },
        ]),
      });
    }
  );

  await page.route("https://github.com/octocat.contribs", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        total_contributions: 123,
        weeks: [
          {
            contribution_days: [{ count: 1 }, { count: 2 }, { count: 3 }],
          },
        ],
      }),
    });
  });
}

async function generateProfile(page: Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  const usernameInput = page.getByLabel("GitHub Username");
  await usernameInput.fill("octocat");
  await expect(usernameInput).toHaveValue("octocat");
  await page.getByRole("button", { name: /generate/i }).click();
  await expect(page.getByText("@octocat").first()).toBeVisible();
}

function assertPngHeader(buffer: Buffer) {
  expect(buffer.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
}

function readPngDimensions(buffer: Buffer) {
  assertPngHeader(buffer);

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

/**
 * Compare an exported PNG against a screenshot of the element it was rendered from.
 *
 * Both images come from the same browser at the same scale, so a faithful export only
 * differs by sub-pixel antialiasing. A renderer that lays text out itself shifts entire
 * glyph runs and blows past the threshold.
 */
async function comparePngToElement(page: Page, png: Buffer, element: Locator) {
  const reference = await element.screenshot();

  return page.evaluate(
    async ([exportedB64, referenceB64]) => {
      const load = (b64: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = `data:image/png;base64,${b64}`;
        });

      const [exported, expected] = await Promise.all([
        load(exportedB64),
        load(referenceB64),
      ]);

      // Rounding can differ by a pixel; compare the shared region.
      const width = Math.min(exported.width, expected.width);
      const height = Math.min(exported.height, expected.height);

      const pixels = (image: HTMLImageElement) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d")!;
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, width, height).data;
      };

      const a = pixels(exported);
      const b = pixels(expected);

      let differing = 0;
      for (let i = 0; i < a.length; i += 4) {
        const delta =
          Math.abs(a[i] - b[i]) +
          Math.abs(a[i + 1] - b[i + 1]) +
          Math.abs(a[i + 2] - b[i + 2]);
        if (delta > 30) differing++;
      }

      return {
        differingPercent: (differing / (width * height)) * 100,
        exported: { width: exported.width, height: exported.height },
        expected: { width: expected.width, height: expected.height },
      };
    },
    [png.toString("base64"), reference.toString("base64")] as const
  );
}

test("Devemon card download matches the on-screen card", async ({
  page,
}, testInfo) => {
  await mockGitHubProfile(page);
  await generateProfile(page);

  await page.getByRole("tab", { name: /devémon/i }).click();
  await page.locator("label", { hasText: "Available for Hire" }).click();

  const rarityBadge = page.locator('[class*="RarityBadge"]').first();
  await expect(rarityBadge).toBeVisible();

  // The rarity pill sits on the same line as "@login"; both must share a center line.
  // A renderer that sinks text makes the pill look like it floats above the handle.
  const headerAlignment = await page.evaluate(() => {
    const login = document.querySelector('[class*="DisplayName"]');
    const rarity = document.querySelector('[class*="RarityBadge"]');
    if (!login || !rarity) return null;

    const center = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return (rect.top + rect.bottom) / 2;
    };

    const usernameRect = document
      .querySelector('[class*="Username"]')!
      .getBoundingClientRect();

    return {
      centerDelta: Math.abs(center(rarity) - center(login)),
      gapUnderUsername:
        rarity.getBoundingClientRect().top - usernameRect.bottom,
    };
  });

  expect(headerAlignment).not.toBeNull();
  expect(headerAlignment!.centerDelta).toBeLessThanOrEqual(1);
  // The pill must never ride up into the display name.
  expect(headerAlignment!.gapUnderUsername).toBeGreaterThan(0);

  // "OPEN TO WORK" sits on the bright brand-green pill, so it needs dark text.
  await expect(page.locator('[data-open-to-work-badge="true"]')).toHaveCSS(
    "color",
    "rgb(1, 4, 9)"
  );

  const [cardDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /^download card$/i }).click(),
  ]);
  const cardPath = testInfo.outputPath("devemon-card.png");
  await cardDownload.saveAs(cardPath);
  const cardPng = await readFile(cardPath);

  const { width, height } = readPngDimensions(cardPng);
  expect(width).toBeGreaterThan(0);
  expect(height).toBeGreaterThan(0);

  const card = page.locator('[data-devemon-card="true"]');
  await expect(card).toBeVisible();
  const comparison = await comparePngToElement(page, cardPng, card);

  // Exported and on-screen renders line up to within antialiasing noise.
  expect(comparison.differingPercent).toBeLessThan(8);
});

test("Devemon badge download produces a valid PNG", async ({
  page,
}, testInfo) => {
  await mockGitHubProfile(page);
  await generateProfile(page);

  await page.getByRole("tab", { name: /devémon/i }).click();
  await page.locator("label", { hasText: "Available for Hire" }).click();
  await expect(page.locator('[class*="RarityBadge"]').first()).toBeVisible();

  const [badgeDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /download badge/i }).click(),
  ]);
  const badgePath = testInfo.outputPath("devemon-badge.png");
  await badgeDownload.saveAs(badgePath);

  const { width, height } = readPngDimensions(await readFile(badgePath));
  expect(width).toBeGreaterThan(0);
  expect(height).toBeGreaterThan(0);
});

test("README banner download produces a valid PNG", async ({
  page,
}, testInfo) => {
  await mockGitHubProfile(page);
  await generateProfile(page);

  await page.getByRole("tab", { name: /banner/i }).click();

  const [bannerDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download", exact: true }).click(),
  ]);
  const bannerPath = testInfo.outputPath("readme-banner.png");
  await bannerDownload.saveAs(bannerPath);

  const { width, height } = readPngDimensions(await readFile(bannerPath));
  expect(width).toBeGreaterThan(0);
  expect(height).toBeGreaterThan(0);
});
