import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

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
            contribution_days: [
              { count: 1 },
              { count: 2 },
              { count: 3 },
              { count: 4 },
              { count: 5 },
              { count: 6 },
              { count: 7 },
            ],
          },
        ],
      }),
    });
  });
}

async function readPngDimensions(path: string) {
  const buffer = await readFile(path);
  expect(buffer.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

test("Devemon downloads keep the Open to Work badge aligned", async ({
  page,
}, testInfo) => {
  await mockGitHubProfile(page);

  await page.goto("/", { waitUntil: "networkidle" });
  const usernameInput = page.getByLabel("GitHub Username");
  await usernameInput.fill("octocat");
  await expect(usernameInput).toHaveValue("octocat");
  await page.getByRole("button", { name: /generate/i }).click();
  await expect(page.getByText("@octocat").first()).toBeVisible();

  await page.getByRole("tab", { name: /devémon/i }).click();
  await page.locator("label", { hasText: "Available for Hire" }).click();
  await expect(page.locator('[class*="RarityBadgeText"]')).toBeVisible();
  await expect(page.locator('[class*="StatLabelText"]')).toHaveCount(6);
  await expect(page.locator('[data-open-to-work-badge="true"]')).toHaveCSS(
    "color",
    "rgb(1, 4, 9)"
  );
  const headerSpacing = await page.evaluate(() => {
    const username = document.querySelector('[class*="Username"]');
    const rarity = document.querySelector('[class*="RarityBadge"]');
    const usernameRect = username?.getBoundingClientRect();
    const rarityRect = rarity?.getBoundingClientRect();

    return usernameRect && rarityRect
      ? rarityRect.top - usernameRect.bottom
      : Number.NaN;
  });
  expect(headerSpacing).toBeGreaterThanOrEqual(6);

  const exportBadgeMetrics = await page.evaluate(() => {
    const exportBadge = [...document.querySelectorAll("span")].find(
      (element) =>
        element.textContent?.includes("OPEN TO WORK") &&
        element.getBoundingClientRect().x < -1000
    );

    if (!exportBadge) {
      return null;
    }

    const badgeRect = exportBadge.getBoundingClientRect();
    const icon = exportBadge.querySelector('[data-briefcase-icon="true"]');
    const iconRect = icon?.getBoundingClientRect();

    return {
      display: getComputedStyle(exportBadge).display,
      alignItems: getComputedStyle(exportBadge).alignItems,
      gap: getComputedStyle(exportBadge).gap,
      iconTag: icon?.tagName,
      iconWidth: iconRect?.width,
      iconHeight: iconRect?.height,
      iconCenterDelta: iconRect
        ? Math.abs(
            iconRect.y +
              iconRect.height / 2 -
              (badgeRect.y + badgeRect.height / 2)
          )
        : Number.NaN,
    };
  });

  expect(exportBadgeMetrics).toMatchObject({
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  });
  expect(exportBadgeMetrics?.iconTag).toBe("SPAN");
  expect(exportBadgeMetrics?.iconWidth).toBe(12);
  expect(exportBadgeMetrics?.iconHeight).toBe(10);
  expect(exportBadgeMetrics?.iconCenterDelta).toBeLessThanOrEqual(1);

  const [badgeDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /download badge/i }).click(),
  ]);
  const badgePath = testInfo.outputPath("devemon-badge.png");
  await badgeDownload.saveAs(badgePath);
  const badgeDimensions = await readPngDimensions(badgePath);
  expect(badgeDimensions.width).toBe(960);
  expect(badgeDimensions.height).toBeGreaterThanOrEqual(720);
  expect(badgeDimensions.height).toBeLessThanOrEqual(723);

  const [cardDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /^download card$/i }).click(),
  ]);
  const cardPath = testInfo.outputPath("devemon-card.png");
  await cardDownload.saveAs(cardPath);
  const cardDimensions = await readPngDimensions(cardPath);
  expect(cardDimensions.width).toBeGreaterThanOrEqual(900);
  expect(cardDimensions.width).toBeLessThanOrEqual(920);
  expect(cardDimensions.height).toBe(1650);
});
