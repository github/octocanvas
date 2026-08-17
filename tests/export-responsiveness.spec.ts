import { expect, test, type Page } from "@playwright/test";

const avatarPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64"
);

async function mockGitHubProfile(page: Page) {
  await page.route("**/users/octocat", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        login: "octocat",
        avatar_url: "http://localhost:4321/avatar.png",
        name: "The Octocat",
        followers: 1234,
        public_repos: 42,
        bio: "GitHub mascot",
        created_at: "2011-01-25T18:44:36Z",
        company: "@github",
        location: "San Francisco",
        blog: "https://github.com",
      }),
    });
  });

  await page.route("**/octocat.contribs", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        total_contributions: 1234,
        weeks: Array.from({ length: 53 }, () => ({
          contribution_days: Array.from({ length: 7 }, () => ({ count: 2 })),
        })),
      }),
    });
  });

  await page.route(
    "**/users/octocat/repos**",
    async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify([
          {
            stargazers_count: 10,
            forks_count: 5,
            language: "TypeScript",
          },
        ]),
      });
    }
  );

  await page.route("**/avatar.png", async (route) => {
    await route.fulfill({
      contentType: "image/png",
      body: avatarPng,
    });
  });
}

async function loadGeneratedProfile(page: Page) {
  await page.addInitScript(() => {
    window.alert = () => undefined;
    window.open = () => null;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        write: () =>
          new Promise<void>((resolve) => {
            window.setTimeout(resolve, 300);
          }),
        writeText: () => Promise.resolve(),
      },
    });

    const originalToBlob = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function delayedToBlob(
      callback,
      type,
      quality
    ) {
      return originalToBlob.call(
        this,
        (blob) => window.setTimeout(() => callback(blob), 300),
        type,
        quality
      );
    };
  });

  await mockGitHubProfile(page);
  await page.goto("/");
  const usernameInput = page.getByLabel("GitHub Username");
  await usernameInput.click();
  await page.keyboard.type("octocat");
  await expect(usernameInput).toHaveValue("octocat");
  await page.keyboard.press("Tab");
  await page.getByRole("button", { name: "Generate" }).click();
  await expect(page.getByText("Your Wallpaper")).toBeVisible();
}

test("wallpaper sharing keeps the rest of the page interactive", async ({
  page,
}) => {
  await loadGeneratedProfile(page);

  await page.getByRole("button", { name: "Twitter/X" }).click();
  const devemonTab = page.getByRole("tab", { name: "Devémon Card" });
  await devemonTab.click();

  await expect(devemonTab).toHaveAttribute("aria-selected", "true");
});

test("wallpaper downloads keep the rest of the page interactive", async ({
  page,
}) => {
  await loadGeneratedProfile(page);

  await page.getByRole("button", { name: /Desktop/ }).click();
  const devemonTab = page.getByRole("tab", { name: "Devémon Card" });
  await devemonTab.click();

  await expect(devemonTab).toHaveAttribute("aria-selected", "true");
});
