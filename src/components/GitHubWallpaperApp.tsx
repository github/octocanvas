/**
 * Main GitHub Wallpaper Generator Component
 *
 * This component handles:
 * - GitHub username input form
 * - API data fetching and display
 * - SVG wallpaper generation
 * - PNG export in multiple sizes
 *
 * Future extensibility:
 * - Add theme selection (dark, light, gradient, etc.)
 * - Add customizable color schemes
 * - Add pattern/background options
 */

// @ts-nocheck

import { useState, useRef } from "preact/hooks";
import type { JSX } from "preact";
import WallpaperGenerator, {
  type WallpaperGeneratorRef,
} from "./WallpaperGenerator";
import DevemonCard, { type DevemonCardRef } from "./DevemonCard";
import ReadmeBanner, { type ReadmeBannerRef } from "./ReadmeBanner";
import ActionButtonsArea from "./ActionButtonsArea";
import { TextInput, PrimerSelect, Checkbox } from "./ui/FormControls";
import { PrimaryButton, SecondaryButton } from "./ui/Button";
import { Icon } from "./ui/Icon";
import styles from "./GitHubWallpaperApp.module.css";

// GitHub API response type
export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  followers: number;
  public_repos: number;
  bio: string | null;
  created_at: string;
  company: string | null;
  location: string | null;
  blog: string | null;
  contributions?: ContributionData;
}

// Contribution data interface
export interface ContributionData {
  totalContributions: number;
  weeks: Array<{
    contributionDays: Array<{
      contributionCount: number;
      date: string;
    }>;
  }>;
}

const getCleanUsername = (username: string) =>
  username.replace(/^@/, "").trim();

// Background theme configurations for wallpaper
const BACKGROUND_THEMES = {
  "github-universe-green": { label: "GitHub Universe Green", type: "gradient" },
  "github-universe-blue": { label: "GitHub Universe Blue", type: "gradient" },
  "universe-octocanvas": { label: "Universe Octocanvas", type: "gradient" },
  "github-dark": { label: "GitHub Dark", type: "gradient" },
  "bg-images": { label: "Background Image 1", type: "image", imagePath: "/backgrounds/images.jpg" },
  "bg-wallpaper": { label: "Background Image 2", type: "image", imagePath: "/backgrounds/wallpaper_footer_4KUHD_16_9.webp" },
  "custom": { label: "Custom Upload", type: "image" },
} as const;

// Avatar filter options
const AVATAR_FILTERS = {
  grayscale: { label: "Grayscale" },
  color: { label: "Color" },
};

// Tab stuff mostly copied from https://github.com/github/githubuniverse.com/blob/main/components/Tickets/Tickets.tsx
export default function GitHubWallpaperApp() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Wallpaper form controls
  const [wallpaperTheme, setWallpaperTheme] = useState<
    keyof typeof BACKGROUND_THEMES
  >("github-universe-green");
  const [wallpaperAvatarFilter, setWallpaperAvatarFilter] =
    useState<keyof typeof AVATAR_FILTERS>("grayscale");
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState<string>("");

  // Devemon Card form controls
  const [devemonAvatarFilter, setDevemonAvatarFilter] = useState<
    "grayscale" | "color"
  >("grayscale");
  const [devemonAvailableForHire, setDevemonAvailableForHire] = useState(false);

  // README Banner form controls
  const [bannerArtType, setBannerArtType] = useState<
    "none" | "ascii" | "pixel" | "grayscale" | "color"
  >("grayscale");
  const [bannerAvailableForHire, setBannerAvailableForHire] = useState(false);
  const [bannerShowWebsite, setBannerShowWebsite] = useState(true);
  const [bannerShowJoinDate, setBannerShowJoinDate] = useState(true);
  const [bannerShowBio, setBannerShowBio] = useState(false);

  // Component refs for calling functions
  const wallpaperGeneratorRef = useRef<WallpaperGeneratorRef>(null);
  const devemonCardRef = useRef<DevemonCardRef>(null);
  const readmeBannerRef = useRef<ReadmeBannerRef>(null);

  // Tab configuration
  const tabs = [
    { label: "Wallpaper", shortLabel: "Wallpaper" },
    { label: "Devémon Card", shortLabel: "Devémon" },
    { label: "README Banner", shortLabel: "Banner" },
  ];

  // Support left/right arrow key navigation (adapted from Universe Tickets)
  const handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    const parent = target.closest('[role="tablist"]');
    if (!parent) return;

    const tabElements = Array.from(
      parent.querySelectorAll('[role="tab"]')
    ) as HTMLElement[];

    if (document.activeElement instanceof HTMLElement) {
      const currentTabIndex = tabElements.indexOf(document.activeElement);
      let newTabIndex = currentTabIndex;

      if (event.key === "ArrowLeft") {
        // Move to the previous tab, wrapping around if necessary
        newTabIndex =
          currentTabIndex === 0 ? tabElements.length - 1 : currentTabIndex - 1;
      } else if (event.key === "ArrowRight") {
        // Move to the next tab, wrapping around if necessary
        newTabIndex =
          currentTabIndex === tabElements.length - 1 ? 0 : currentTabIndex + 1;
      }

      if (newTabIndex !== currentTabIndex) {
        tabElements[newTabIndex].focus();
        setSelectedTab(newTabIndex);
      }
    }
  };

  /**
   * Fetch contribution data using contributions API
   * API endpoint provides structured contribution data without HTML scraping
   */
  const fetchContributionData = async (
    username: string
  ): Promise<ContributionData> => {
    try {
      // Strip out @ character if present
      const cleanUsername = getCleanUsername(username);
      console.log("Fetching contributions for:", cleanUsername);

      const baseUrl = `https://github.com/${encodeURIComponent(
        cleanUsername
      )}.contribs`;

      console.log("Fetching from:", baseUrl);

      const response = await fetch(baseUrl);

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        const data = await response.json();

        console.log("API data received:", data);

        // Extract contribution data from API response
        // New API returns: { total_contributions: number, weeks: Array<{ contribution_days: Array<{ count: number, weekday: number }> }> }
        const totalContributions = data.total_contributions || 0;
        const apiWeeks = data.weeks || [];

        console.log("Total contributions:", totalContributions);
        console.log("Number of weeks:", apiWeeks.length);

        // Convert API format to our ContributionData format
        const weeks: Array<{
          contributionDays: Array<{
            contributionCount: number;
            date: string;
          }>;
        }> = [];

        apiWeeks.forEach((week: any) => {
          const contributionDays = week.contribution_days.map((day: any) => ({
            contributionCount: day.count,
            date: "", // API doesn't provide individual dates, but we have first_day
          }));

          weeks.push({ contributionDays });
        });

        console.log("Transformed weeks:", weeks.length);

        return {
          totalContributions,
          weeks,
        };
      } else {
        console.error(
          "Failed to fetch contributions from API, status:",
          response.status
        );
      }
    } catch (err) {
      console.error("Failed to fetch contribution data:", err);
      console.error(
        "Error details:",
        err instanceof Error ? err.message : String(err)
      );
    }

    // Return empty contribution data if fetch fails
    return {
      totalContributions: 0,
      weeks: [],
    };
  };

  /**
   * Handle custom background image upload
   */
  const handleBackgroundUpload = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCustomBackgroundUrl(dataUrl);
        setWallpaperTheme("custom");
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Fetch GitHub user data from public API
   * No authentication required for public profiles
   */
  const fetchGitHubUser = async (
    e: JSX.TargetedEvent<HTMLFormElement, Event>
  ) => {
    e.preventDefault();

    const cleanUsername = getCleanUsername(username);

    if (!cleanUsername) {
      setError("Please enter a valid GitHub username");
      return;
    }

    setLoading(true);
    setError("");
    setUserData(null);
    setHasSubmitted(true);

    try {
      const response = await fetch(
        `https://api.github.com/users/${cleanUsername}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found");
        }
        throw new Error("Failed to fetch user data");
      }

      const data: GitHubUser = await response.json();

      // Fetch contribution data
      const contributions = await fetchContributionData(cleanUsername);
      data.contributions = contributions;

      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${userData
        ? `${styles.MainLayout} ${styles["MainLayout--active"]}`
        : styles.MainLayout
        }`}
    >
      {/* Left Column - Form and Controls */}
      <div className={styles.LeftColumn}>
        {/* Tabbed Container */}
        <div className={styles.TabContainer}>
          {/* Tab Navigation */}
          <div
            className={styles.TabList}
            role="tablist"
            aria-label="Generation options"
          >
            {tabs.map((tab, index) => (
              <button
                key={index}
                role="tab"
                className={`${styles.TabButton} ${selectedTab === index ? styles.isSelected : ""
                  }`}
                onClick={() => setSelectedTab(index)}
                onKeyDown={handleKeyDown}
                aria-selected={selectedTab === index}
                tabIndex={selectedTab === index ? 0 : -1}
                aria-controls={`tabpanel-generation-${index}`}
                id={`tab-generation-${index}`}
                aria-label={tab.label}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Panel Container */}
          <div className={styles.TabPanelContainer}>
            <div>
              <form onSubmit={fetchGitHubUser} className={styles.FormContent}>
                <div>
                  <label
                    htmlFor="github-handle"
                    className={styles.ControlLabel}
                  >
                    GitHub Username
                  </label>
                  <TextInput
                    id="github-handle"
                    value={username}
                    onChange={(value) => {
                      setUsername(value);
                      // Reset hasSubmitted when user changes input
                      if (hasSubmitted) {
                        setHasSubmitted(false);
                      }
                    }}
                    placeholder="Enter GitHub handle..."
                    error={!!error}
                    errorMessage={error}
                  />
                </div>

                {/* Only show button if not submitted OR if user has changed input after submission */}
                {(!hasSubmitted || loading) && (
                  <PrimaryButton
                    type="submit"
                    disabled={loading}
                    fullWidth={true}
                    size="large"
                  >
                    {loading ? "⏳ Loading..." : "Generate"}
                  </PrimaryButton>
                )}
              </form>

              {/* Asset-specific Form Controls */}
              {userData && (
                <div className={styles.Section}>
                  {/* Wallpaper Controls */}
                  {selectedTab === 0 && (
                    <div className={styles.TabSections}>
                      <div>
                        <label
                          htmlFor="wallpaper-avatar-filter-selector"
                          className={styles.ControlLabel}
                        >
                          Avatar Filter
                        </label>
                        <PrimerSelect
                          id="wallpaper-avatar-filter-selector"
                          value={wallpaperAvatarFilter}
                          onChange={(value) =>
                            setWallpaperAvatarFilter(
                              value as keyof typeof AVATAR_FILTERS
                            )
                          }
                        >
                          {Object.entries(AVATAR_FILTERS).map(
                            ([key, filter]) => (
                              <option key={key} value={key}>
                                {filter.label}
                              </option>
                            )
                          )}
                        </PrimerSelect>
                      </div>

                      <div>
                        <label
                          htmlFor="wallpaper-theme-selector"
                          className={styles.ControlLabel}
                        >
                          Background Theme
                        </label>
                        <PrimerSelect
                          id="wallpaper-theme-selector"
                          value={wallpaperTheme}
                          onChange={(value) =>
                            setWallpaperTheme(
                              value as keyof typeof BACKGROUND_THEMES
                            )
                          }
                        >
                          {Object.entries(BACKGROUND_THEMES).map(
                            ([key, theme]) => (
                              <option key={key} value={key}>
                                {theme.label}
                              </option>
                            )
                          )}
                        </PrimerSelect>
                      </div>

                      {wallpaperTheme === "custom" && (
                        <div>
                          <label
                            htmlFor="custom-background-upload"
                            className={styles.ControlLabel}
                          >
                            Upload Custom Background
                          </label>
                          <input
                            id="custom-background-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleBackgroundUpload}
                            style={{
                              display: "block",
                              marginTop: "0.5rem",
                              fontSize: "14px",
                              color: "#E6EDF3",
                            }}
                          />
                          <p className={styles.HelpText}>
                            Upload a custom image for your wallpaper background
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Devemon Controls */}
                  {selectedTab === 1 && (
                    <div className={styles.TabSections}>
                      <div>
                        <label
                          htmlFor="devemon-avatar-filter-selector"
                          className={styles.ControlLabel}
                        >
                          Avatar Filter
                        </label>
                        <PrimerSelect
                          id="devemon-avatar-filter-selector"
                          value={devemonAvatarFilter}
                          onChange={(value) =>
                            setDevemonAvatarFilter(
                              value as "grayscale" | "color"
                            )
                          }
                        >
                          <option value="grayscale">Grayscale</option>
                          <option value="color">Color</option>
                        </PrimerSelect>
                      </div>

                      {/* Theme Selector */}
                      <div>
                        <label
                          htmlFor="devemon-theme-selector"
                          className={styles.ControlLabel}
                        >
                          Theme
                        </label>
                        <PrimerSelect
                          id="devemon-theme-selector"
                          value="default"
                          disabled={true}
                        >
                          <option value="default">Default</option>
                        </PrimerSelect>
                        <p className={styles.HelpText}>
                          More themes coming soon!
                        </p>
                      </div>

                      <div>
                        <Checkbox
                          id="devemon-available-for-hire"
                          label="Available for Hire"
                          checked={devemonAvailableForHire}
                          onChange={setDevemonAvailableForHire}
                        />
                      </div>
                    </div>
                  )}

                  {/* Banner Controls */}
                  {selectedTab === 2 && (
                    <div className={styles.TabSections}>
                      <div>
                        <label
                          htmlFor="banner-avatar-style-selector"
                          className={styles.ControlLabel}
                        >
                          Avatar Style
                        </label>
                        <PrimerSelect
                          id="banner-avatar-style-selector"
                          value={bannerArtType}
                          onChange={(value) =>
                            setBannerArtType(
                              value as
                              | "none"
                              | "ascii"
                              | "pixel"
                              | "grayscale"
                              | "color"
                            )
                          }
                        >
                          <option value="none">None</option>
                          <option value="grayscale">Grayscale</option>
                          <option value="color">Color</option>
                          <option value="ascii">ASCII Art</option>
                          <option value="pixel">Pixel Art</option>
                        </PrimerSelect>
                      </div>

                      <div>
                        <p className={styles.CheckboxGroupLabel}>
                          Display Options
                        </p>
                        <div className={styles.CheckboxContainer}>
                          <Checkbox
                            id="banner-available-for-hire"
                            label="Available for Hire"
                            checked={bannerAvailableForHire}
                            onChange={setBannerAvailableForHire}
                          />
                          <Checkbox
                            id="banner-show-website"
                            label="Website"
                            checked={bannerShowWebsite}
                            onChange={setBannerShowWebsite}
                          />
                          <Checkbox
                            id="banner-show-join-date"
                            label="Join Date"
                            checked={bannerShowJoinDate}
                            onChange={setBannerShowJoinDate}
                          />
                          <Checkbox
                            id="banner-show-bio"
                            label="Bio"
                            checked={bannerShowBio}
                            onChange={setBannerShowBio}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Preview and Actions */}
      {userData && (
        <div className={styles.RightColumn}>
          {/* Wallpaper Generator */}
          <div
            role="tabpanel"
            id="tabpanel-generation-0"
            aria-labelledby="tab-generation-0"
            hidden={selectedTab !== 0}
            className={styles.TabPanel}
          >
            <WallpaperGenerator
              ref={wallpaperGeneratorRef}
              user={userData}
              selectedTheme={wallpaperTheme}
              avatarFilter={wallpaperAvatarFilter}
              customBackgroundUrl={customBackgroundUrl}
            />
          </div>

          {/* Devémon Card */}
          <div
            role="tabpanel"
            id="tabpanel-generation-1"
            aria-labelledby="tab-generation-1"
            hidden={selectedTab !== 1}
            className={styles.TabPanel}
          >
            <DevemonCard
              ref={devemonCardRef}
              user={userData}
              avatarFilter={devemonAvatarFilter}
              availableForHire={devemonAvailableForHire}
            />
          </div>

          {/* README Banner */}
          <div
            role="tabpanel"
            id="tabpanel-generation-2"
            aria-labelledby="tab-generation-2"
            hidden={selectedTab !== 2}
            className={styles.TabPanel}
          >
            <ReadmeBanner
              ref={readmeBannerRef}
              user={userData}
              artType={bannerArtType}
              availableForHire={bannerAvailableForHire}
              showWebsite={bannerShowWebsite}
              showJoinDate={bannerShowJoinDate}
              showBio={bannerShowBio}
            />
          </div>

          {/* Action Buttons Area */}
          {selectedTab === 0 && (
            <ActionButtonsArea
              actionType="wallpaper"
              onDownloadDesktop={() =>
                wallpaperGeneratorRef.current?.downloadWallpaper("desktop")
              }
              onDownloadMobile={() =>
                wallpaperGeneratorRef.current?.downloadWallpaper("mobile")
              }
              onDownloadSmall={() =>
                wallpaperGeneratorRef.current?.downloadWallpaper("small")
              }
              onShareTwitter={() =>
                wallpaperGeneratorRef.current?.handleTwitterShare()
              }
              onShareBluesky={() =>
                wallpaperGeneratorRef.current?.handleBlueskyShare()
              }
              onShareThreads={() =>
                wallpaperGeneratorRef.current?.handleThreadsShare()
              }
              onShareInstagram={() =>
                wallpaperGeneratorRef.current?.handleInstagramShare()
              }
            />
          )}

          {selectedTab === 1 && (
            <ActionButtonsArea
              actionType="devemon"
              onDownloadCard={() =>
                devemonCardRef.current?.downloadCard("card")
              }
              onDownloadBadge={() =>
                devemonCardRef.current?.downloadCard("badge")
              }
              onShareTwitter={() =>
                devemonCardRef.current?.handleTwitterShare()
              }
              onShareBluesky={() =>
                devemonCardRef.current?.handleBlueskyShare()
              }
              onShareThreads={() =>
                devemonCardRef.current?.handleThreadsShare()
              }
              onShareInstagram={() =>
                devemonCardRef.current?.handleInstagramShare()
              }
            />
          )}

          {selectedTab === 2 && (
            <ActionButtonsArea
              actionType="banner"
              onDownloadBanner={() => readmeBannerRef.current?.downloadBanner()}
              onCopyMarkdown={() => readmeBannerRef.current?.copyMarkdown()}
              onShareTwitter={() =>
                readmeBannerRef.current?.handleTwitterShare()
              }
              onShareBluesky={() =>
                readmeBannerRef.current?.handleBlueskyShare()
              }
              onShareThreads={() =>
                readmeBannerRef.current?.handleThreadsShare()
              }
              onShareInstagram={() =>
                readmeBannerRef.current?.handleInstagramShare()
              }
            />
          )}
        </div>
      )}

      {/* Footer - positioned via CSS Grid */}
      <footer className={styles.Footer}>
        <p className={styles.FooterText}>
          <span>Built with</span> <a href="https://astro.build">Astro</a>
          <span className={styles.FooterSeparator}> · </span>
          <a href="https://preactjs.com">Preact</a>
          <span className={styles.FooterSeparator}> · </span>
          <a href="https://tailwindcss.com">Tailwind CSS</a>
          <span className={styles.FooterSeparator}> · </span>
          <a href="https://github.com/features/copilot">GitHub Copilot</a>
        </p>
        <p className={styles.FooterCopyright}>
          © <a href="https://githubuniverse.com/">2025 GitHub Universe</a> | <a href="https://github.com/github/octocanvas"><Icon name="mark-github" size="functional" color="white" className="align-middle" /> Octocanvas on GitHub</a>
        </p>
      </footer>
    </div>
  );
}
