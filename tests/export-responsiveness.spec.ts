import { expect, test, type Page } from "@playwright/test";

const avatarPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64"
);
const interactionTimeoutMs = 750;

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
    window.alert = (message) => {
      (window as typeof window & { __octocanvasAlerts: string[] })
        .__octocanvasAlerts ??= [];
      (window as typeof window & { __octocanvasAlerts: string[] })
        .__octocanvasAlerts.push(String(message));
    };
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

    (window as typeof window & { __octocanvasTicks: number })
      .__octocanvasTicks = 0;
    window.setInterval(() => {
      (window as typeof window & { __octocanvasTicks: number })
        .__octocanvasTicks += 1;
    }, 50);

    const originalToBlob = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function delayedToBlob(
      callback,
      type,
      quality
    ) {
      return originalToBlob.call(
        this,
        (blob) => window.setTimeout(() => callback(blob), 1000),
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

async function showDevemonCard(page: Page) {
  await page.getByRole("tab", { name: "Devémon Card" }).click();
  await expect(page.getByText("Your Devémon Card")).toBeVisible();
}

async function expectNoGenerationFailureAlert(page: Page) {
  const alerts = await page.evaluate(
    () =>
      (window as typeof window & { __octocanvasAlerts?: string[] })
        .__octocanvasAlerts ?? []
  );

  expect(alerts).not.toContain("Failed to generate card image. Please try again.");
}

async function expectResponsiveInteraction(
  page: Page,
  action: () => Promise<unknown>,
  description: string
) {
  const startingTicks = await page.evaluate(
    () =>
      (window as typeof window & { __octocanvasTicks: number })
        .__octocanvasTicks
  );
  const startedAt = Date.now();

  await action();

  expect(
    Date.now() - startedAt,
    `${description} should not wait for image generation to finish`
  ).toBeLessThan(interactionTimeoutMs);

  await page.waitForFunction(
    (ticks) =>
      (window as typeof window & { __octocanvasTicks: number })
        .__octocanvasTicks > ticks,
    startingTicks,
    { timeout: interactionTimeoutMs }
  );
}

test("wallpaper sharing keeps the rest of the page interactive", async ({
  page,
}) => {
  await loadGeneratedProfile(page);

  await expectResponsiveInteraction(
    page,
    () => page.getByRole("button", { name: "Twitter/X" }).click(),
    "Wallpaper share click"
  );
  const devemonTab = page.getByRole("tab", { name: "Devémon Card" });
  await expectResponsiveInteraction(
    page,
    () => devemonTab.click(),
    "Tab switch during wallpaper share"
  );

  await expect(devemonTab).toHaveAttribute("aria-selected", "true");
});

test("wallpaper downloads keep the rest of the page interactive", async ({
  page,
}) => {
  await loadGeneratedProfile(page);

  await expectResponsiveInteraction(
    page,
    () => page.getByRole("button", { name: /Desktop/ }).click(),
    "Wallpaper download click"
  );
  const devemonTab = page.getByRole("tab", { name: "Devémon Card" });
  await expectResponsiveInteraction(
    page,
    () => devemonTab.click(),
    "Tab switch during wallpaper download"
  );

  await expect(devemonTab).toHaveAttribute("aria-selected", "true");
});

test("devemon card sharing generates an image without the failure alert", async ({
  page,
}) => {
  await loadGeneratedProfile(page);
  await showDevemonCard(page);

  await page.getByRole("button", { name: "Twitter/X" }).click();

  await expectNoGenerationFailureAlert(page);
});

test("devemon card sharing keeps the rest of the page interactive", async ({
  page,
}) => {
  await loadGeneratedProfile(page);
  await showDevemonCard(page);

  await expectResponsiveInteraction(
    page,
    () => page.getByRole("button", { name: "Twitter/X" }).click(),
    "Devémon share click"
  );
  const bannerTab = page.getByRole("tab", { name: "README Banner" });
  await expectResponsiveInteraction(
    page,
    () => bannerTab.click(),
    "Tab switch during Devémon share"
  );

  await expect(bannerTab).toHaveAttribute("aria-selected", "true");
});
