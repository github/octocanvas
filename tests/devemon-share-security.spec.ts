import { expect, test } from "@playwright/test";

const avatar = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64",
);

for (const [platform, origin] of [
  ["Twitter/X", "https://twitter.com"],
  ["Bluesky", "https://bsky.app"],
  ["Threads", "https://www.threads.net"],
  ["Instagram", "https://www.instagram.com"],
]) {
  test(`Devemon ${platform} sharing isolates the popup from its opener`, async ({
    page,
    context,
  }) => {
    await page.route("https://api.github.com/users/octocat", (route) =>
      route.fulfill({
        json: {
          login: "octocat",
          name: "The Octocat",
          avatar_url: "https://avatars.githubusercontent.com/u/583231",
          followers: 1234,
          public_repos: 8,
          created_at: "2011-01-25T18:44:36Z",
        },
      }),
    );
    await page.route("https://github.com/octocat.contribs", (route) =>
      route.fulfill({ json: { total_contributions: 42, weeks: [] } }),
    );
    await page.route("https://api.github.com/users/octocat/repos?*", (route) =>
      route.fulfill({ json: [] }),
    );
    await page.route("https://avatars.githubusercontent.com/**", (route) =>
      route.fulfill({ contentType: "image/png", body: avatar }),
    );
    await context.route("**/share-target", (route) =>
      route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Share target</title>" }),
    );
    await page.addInitScript(() => {
      window.alert = () => {};
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { write: () => Promise.resolve() },
      });
      const open = window.open.bind(window);
      window.open = (url, target, features) => {
        (window as typeof window & {
          __share: { url: string; target?: string; features?: string };
        }).__share = { url: String(url), target, features };
        return open("/share-target", target, features);
      };
    });

    await page.goto("/");
    const input = page.getByLabel("GitHub Username");
    await input.click();
    await input.pressSequentially("octocat");
    await expect(input).toHaveValue("octocat");
    await page.getByRole("button", { name: "Generate" }).click();
    await expect(page.getByText("Your Wallpaper", { exact: true })).toBeVisible();
    await page.getByRole("tab", { name: "Devémon Card" }).click();
    await expect(page.getByText("Your Devémon Card", { exact: true })).toBeVisible();
    await page.waitForLoadState("networkidle");

    const popupPromise = context.waitForEvent("page");
    await page.getByRole("button", { name: platform }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState();

    expect(await popup.evaluate(() => window.opener === null)).toBe(true);
    expect(await popup.evaluate(() => document.referrer)).toBe("");
    const share = await page.evaluate(
      () => (window as typeof window & {
        __share: { url: string; target?: string; features?: string };
      }).__share,
    );
    expect(new URL(share.url).origin).toBe(origin);
    expect(share.target).toBe(platform === "Instagram" ? "instagram-share" :
      platform === "Twitter/X" ? "twitter-share-dialog" :
      `${platform.toLowerCase()}-share-dialog`);
    expect(share.features?.split(",")).toEqual(
      expect.arrayContaining(["noopener", "noreferrer", "width=626"]),
    );
    await popup.close();
  });
}
