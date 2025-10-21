/**
 * Devémon Card Component
 *
 * Trading card style component featuring:
 * - Holographic/prismatic card design
 * - User avatar as main character
 * - GitHub stats (repos, followers, contributions, stars, forks)
 * - Rarity levels (Common, Uncommon, Rare, Epic, Legendary, Mythical)
 * - "User since" date
 * - Pokemon/Baseball card aesthetic
 */

import { useState, useEffect, useRef, useImperativeHandle } from "preact/hooks";
import { forwardRef } from "preact/compat";
import type { GitHubUser } from "./GitHubWallpaperApp";
import { Icon } from "./ui/Icon";
import { Checkbox, PrimerSelect } from "./ui/FormControls";
import { Button } from "./ui/Button";
import styles from "./DevemonCard.module.css";
import sharedStyles from "./shared.module.css";

interface DevemonCardProps {
  user: GitHubUser;
  avatarFilter: "grayscale" | "color";
  availableForHire: boolean;
}

export interface DevemonCardRef {
  downloadCard: (format: "card" | "badge") => Promise<void>;
  handleTwitterShare: () => Promise<void>;
  handleBlueskyShare: () => Promise<void>;
  handleThreadsShare: () => Promise<void>;
  handleInstagramShare: () => Promise<void>;
}

// Rarity levels with colors - GitHub Universe label colors for dark backgrounds
const RARITY_LEVELS = {
  common: {
    name: "Common",
    color: "#909692",
    gradient: "from-gray-500 to-gray-600",
  },
  uncommon: {
    name: "Uncommon",
    color: "#8CF2A6",
    gradient: "from-green-400 to-green-500",
  },
  rare: {
    name: "Rare",
    color: "#58A6FF",
    gradient: "from-blue-400 to-blue-500",
  },
  epic: {
    name: "Epic",
    color: "#DCFF96",
    gradient: "from-yellow-400 to-lime-400",
  },
  legendary: {
    name: "Legendary",
    color: "#BC8CFF",
    gradient: "from-purple-400 to-purple-500",
  },
  mythical: {
    name: "Mythical",
    color: "#5FED83",
    gradient: "from-green-300 to-green-400",
  },
};

interface ExtendedStats {
  totalStars: number;
  totalForks: number;
  topLanguages: string[];
}

type AvatarFilterType = "grayscale" | "color";

const DevemonCard = forwardRef<DevemonCardRef, DevemonCardProps>(
  ({ user, avatarFilter, availableForHire }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const [extendedStats, setExtendedStats] = useState<ExtendedStats>({
      totalStars: 0,
      totalForks: 0,
      topLanguages: [],
    });
    const [loading, setLoading] = useState(true);

    /**
     * Expose functions to parent component via ref
     */
    useImperativeHandle(
      ref,
      () => ({
        downloadCard,
        handleTwitterShare,
        handleBlueskyShare,
        handleThreadsShare,
        handleInstagramShare,
      }),
      []
    );

    /**
     * Calculate rarity based on overall power level
     */
    const calculateRarity = (): keyof typeof RARITY_LEVELS => {
      const powerLevel =
        user.followers * 2 +
        user.public_repos * 1 +
        (user.contributions?.totalContributions || 0) * 0.1 +
        extendedStats.totalStars * 3 +
        extendedStats.totalForks * 2;

      if (powerLevel >= 5000) return "mythical";
      if (powerLevel >= 2000) return "legendary";
      if (powerLevel >= 800) return "epic";
      if (powerLevel >= 300) return "rare";
      if (powerLevel >= 100) return "uncommon";
      return "common";
    };

    /**
     * Fetch extended stats from GitHub API
     */
    useEffect(() => {
      const fetchExtendedStats = async () => {
        try {
          // Fetch user's repositories
          const reposResponse = await fetch(
            `https://api.github.com/users/${user.login}/repos?per_page=100&sort=updated`
          );
          if (!reposResponse.ok) {
            console.error("Failed to fetch repos");
            setLoading(false);
            return;
          }

          const repos = await reposResponse.json();

          // Calculate total stars and forks
          let totalStars = 0;
          let totalForks = 0;
          const languageCount: Record<string, number> = {};

          repos.forEach((repo: any) => {
            totalStars += repo.stargazers_count || 0;
            totalForks += repo.forks_count || 0;

            if (repo.language) {
              languageCount[repo.language] =
                (languageCount[repo.language] || 0) + 1;
            }
          });

          // Get top 3 languages
          const topLanguages = Object.entries(languageCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([lang]) => lang);

          setExtendedStats({
            totalStars,
            totalForks,
            topLanguages,
          });
        } catch (error) {
          console.error("Error fetching extended stats:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchExtendedStats();
    }, [user.login]);

    const rarity = calculateRarity();
    const rarityInfo = RARITY_LEVELS[rarity];

    // Format user since date
    const userSince = new Date(user.created_at);
    const formattedDate = userSince.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    /**
     * Download card as PNG
     */
    const downloadCard = async (format: "card" | "badge" = "card") => {
      const targetRef = format === "badge" ? badgeRef : cardRef;
      if (!targetRef.current) return;

      try {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(targetRef.current, {
          backgroundColor: null,
          scale: 3,
          useCORS: true,
          logging: false,
        });

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `devemon-${format}-${user.login}.png`;
            link.click();
            URL.revokeObjectURL(url);
          }
        }, "image/png");
      } catch (error) {
        console.error("Failed to download card:", error);
      }
    };

    /**
     * Share card to Twitter/X
     */
    const handleTwitterShare = async () => {
      if (!cardRef.current) return;

      try {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: null,
          scale: 3,
          useCORS: true,
          logging: false,
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);

              alert(
                "✅ Devémon card copied to clipboard! You can now paste it in your tweet."
              );

              const tweetText =
                "Just created my custom GitHub Universe Devémon card using Octocanvas from #GitHubUniverse 🎴";
              const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                tweetText
              )}`;
              window.open(
                twitterUrl,
                "twitter-share-dialog",
                "width=626,height=436"
              );
            } catch (error) {
              console.error("Error copying to clipboard:", error);
              alert(
                "Failed to copy card to clipboard. Please download it manually."
              );
            }
          }
        }, "image/png");
      } catch (error) {
        console.error("Error sharing to Twitter:", error);
        alert("Failed to generate card image. Please try again.");
      }
    };

    /**
     * Share card to Bluesky
     */
    const handleBlueskyShare = async () => {
      if (!cardRef.current) return;

      try {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: null,
          scale: 3,
          useCORS: true,
          logging: false,
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);

              alert(
                "✅ Devémon card copied to clipboard! You can now paste it in your Bluesky post."
              );

              const postText =
                "Just created my custom GitHub Universe Devémon card using Octocanvas from #GitHubUniverse 🎴";
              const blueskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(
                postText
              )}`;
              window.open(
                blueskyUrl,
                "bluesky-share-dialog",
                "width=626,height=600"
              );
            } catch (error) {
              console.error("Error copying to clipboard:", error);
              alert(
                "Failed to copy card to clipboard. Please download it manually."
              );
            }
          }
        }, "image/png");
      } catch (error) {
        console.error("Error sharing to Bluesky:", error);
        alert("Failed to generate card image. Please try again.");
      }
    };

    /**
     * Share card to Threads
     */
    const handleThreadsShare = async () => {
      if (!cardRef.current) return;

      try {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: null,
          scale: 3,
          useCORS: true,
          logging: false,
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);

              alert(
                "✅ Devémon card copied to clipboard! You can now paste it in your Threads post."
              );

              const postText =
                "Just created my custom GitHub Universe Devémon card using Octocanvas from #GitHubUniverse 🎴";
              const threadsUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(
                postText
              )}`;
              window.open(
                threadsUrl,
                "threads-share-dialog",
                "width=626,height=600"
              );
            } catch (error) {
              console.error("Error copying to clipboard:", error);
              alert(
                "Failed to copy card to clipboard. Please download it manually."
              );
            }
          }
        }, "image/png");
      } catch (error) {
        console.error("Error sharing to Threads:", error);
        alert("Failed to generate card image. Please try again.");
      }
    };

    /**
     * Share card to Instagram
     */
    const handleInstagramShare = async () => {
      if (!cardRef.current) return;

      try {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: null,
          scale: 3,
          useCORS: true,
          logging: false,
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);

              alert(
                "✅ Devémon card copied to clipboard!\n\n📱 To share on Instagram:\n1. Open the Instagram app on your device\n2. Tap the + button to create a new post\n3. Paste the image from your clipboard\n4. Add your caption and share!"
              );

              window.location.href = "instagram://library";
              setTimeout(() => {
                window.open(
                  "https://www.instagram.com/",
                  "instagram-share",
                  "width=626,height=600"
                );
              }, 1500);
            } catch (error) {
              console.error("Error copying to clipboard:", error);
              alert(
                "Failed to copy card to clipboard. Please download it manually."
              );
            }
          }
        }, "image/png");
      } catch (error) {
        console.error("Error sharing to Instagram:", error);
        alert("Failed to generate card image. Please try again.");
      }
    };

    if (loading) {
      return (
        <div className={sharedStyles.SharedLoadingContainer}>
          <p className={sharedStyles.SharedLoadingText}>Loading Devémon stats... ⚡</p>
        </div>
      );
    }

    const avatarFilterStyle =
      avatarFilter === "grayscale" ? "grayscale(100%)" : "none";

    return (
      <div className={sharedStyles.SharedPreviewBox}>
        <h2 className={sharedStyles.SharedPreviewTitle}>Your Devémon Card</h2>

        {/* Card Container */}
        <div className={styles.PreviewSection}>
          <div
            ref={cardRef}
            className={styles.Card}
            style={{
              background: `linear-gradient(135deg, ${rarityInfo.color}15, ${rarityInfo.color}30)`,
            }}
          >
            {/* Holographic border effect */}
            <div
              className={styles.HolographicBorder}
              style={{
                background: `linear-gradient(135deg, ${rarityInfo.color}, transparent, ${rarityInfo.color})`,
                backgroundSize: "200% 200%",
                animation: "shimmer 3s ease-in-out infinite",
              }}
            />

            {/* Card Content */}
            <div
              className={styles.CardContent}
              style={{ borderColor: rarityInfo.color }}
            >
              {/* Header: Name and Rarity */}
              <div className={styles.Header}>
                <h2 className={styles.Username}>{user.name || user.login}</h2>
                <div className={styles.UserMeta}>
                  <span className={styles.DisplayName}>@{user.login}</span>
                  <span className={styles.Separator}>•</span>
                  <span
                    className={styles.RarityBadge}
                    style={{
                      backgroundColor: `${rarityInfo.color}30`,
                      color: rarityInfo.color,
                    }}
                  >
                    {rarityInfo.name.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Avatar Section */}
              <div className={styles.AvatarSection}>
                <div className={styles.AvatarContainer}>
                  {/* Glow effect */}
                  <div
                    className={styles.AvatarGlow}
                    style={{ backgroundColor: rarityInfo.color }}
                  />

                  {/* Avatar with dynamic filter */}
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className={styles.Avatar}
                    style={{
                      borderColor: rarityInfo.color,
                      filter: avatarFilterStyle,
                    }}
                  />

                  {/* Available for Hire Badge */}
                  {availableForHire && (
                    <div className={styles.HireBadgeContainer}>
                      <span className={styles.HireBadge}>
                        <Icon
                          name="briefcase"
                          size={12}
                          color="currentColor"
                          label=""
                          className={styles.HireBadgeIcon}
                        />
                        <span className={styles.HireBadgeText}>
                          OPEN TO WORK
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Section */}
              <div className={styles.StatsSection}>
                {/* Power Stats */}
                <div className={styles.StatsGrid}>
                  <div className={styles.StatCard}>
                    <div className={styles.StatLabel}>
                      <Icon
                        name="repo"
                        size="functional"
                        color="currentColor"
                        label="Repositories"
                      />
                      Repositories
                    </div>
                    <div className={styles.StatValue}>{user.public_repos}</div>
                  </div>
                  <div className={styles.StatCard}>
                    <div className={styles.StatLabel}>
                      <Icon
                        name="people"
                        size="functional"
                        color="currentColor"
                        label="Followers"
                      />
                      Followers
                    </div>
                    <div className={styles.StatValue}>{user.followers}</div>
                  </div>
                  <div className={styles.StatCard}>
                    <div className={styles.StatLabel}>
                      <Icon
                        name="star"
                        size="functional"
                        color="currentColor"
                        label="Stars"
                      />
                      Stars
                    </div>
                    <div className={styles.StatValue}>
                      {extendedStats.totalStars}
                    </div>
                  </div>
                  <div className={styles.StatCard}>
                    <div className={styles.StatLabel}>
                      <Icon
                        name="repo-forked"
                        size="functional"
                        color="currentColor"
                        label="Forks"
                      />
                      Forks
                    </div>
                    <div className={styles.StatValue}>
                      {extendedStats.totalForks}
                    </div>
                  </div>
                </div>

                {/* Contributions */}
                <div className={styles.StatCard}>
                  <div className={styles.StatLabel}>
                    <Icon
                      name="stack"
                      size="functional"
                      color="currentColor"
                      label="Contributions"
                    />
                    Contributions
                  </div>
                  <div className={styles.StatValue}>
                    {user.contributions?.totalContributions || 0}
                  </div>
                </div>

                {/* Languages */}
                {extendedStats.topLanguages.length > 0 && (
                  <div className={styles.StatCard}>
                    <div className={styles.StatLabel}>
                      <Icon
                        name="languages-mastered"
                        size="functional"
                        color="currentColor"
                        label="Languages"
                      />
                      Languages Mastered
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {extendedStats.topLanguages.map((lang) => (
                        <span
                          key={lang}
                          className="text-xs font-mono px-2 py-1 rounded bg-universe-green/20 text-universe-green-light"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-3 pt-2.5 border-t borderColor-muted text-center">
                <p className="text-xs text-gray-400 font-mono">
                  Developer since {formattedDate}
                </p>
              </div>
            </div>

            {/* CSS for shimmer animation */}
            <style>{`
            @keyframes shimmer {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
          `}</style>
          </div>
        </div>

        {/* Hidden Badge Version (320x240 landscape) */}
        <div className="fixed -left-[9999px] top-0">
          <div
            ref={badgeRef}
            className="relative w-[320px] h-[240px] rounded-xl overflow-visible shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${rarityInfo.color}15, ${rarityInfo.color}30)`,
            }}
          >
            {/* Holographic border effect */}
            <div
              className="absolute inset-0 rounded-xl opacity-50"
              style={{
                background: `linear-gradient(135deg, ${rarityInfo.color}, transparent, ${rarityInfo.color})`,
                backgroundSize: "200% 200%",
                animation: "shimmer 3s ease-in-out infinite",
              }}
            />

            {/* Badge Content - Horizontal Layout */}
            <div
              className="relative z-10 h-full flex flex-col justify-center gap-2 p-2.5 bg-gradient-to-br from-universe-dark-bg/95 via-universe-dark-surface/95 to-universe-dark-bg/95 rounded-xl border-4"
              style={{ borderColor: rarityInfo.color }}
            >
              {/* Top Section: Avatar and Info */}
              <div className="flex items-center gap-2">
                {/* Left: Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full blur-lg opacity-60"
                      style={{ backgroundColor: rarityInfo.color }}
                    />
                    <img
                      src={user.avatar_url}
                      alt={user.login}
                      className="relative w-[72px] h-[72px] rounded-full border-4 object-cover"
                      style={{
                        borderColor: rarityInfo.color,
                        filter: avatarFilterStyle,
                      }}
                    />
                  </div>
                </div>

                {/* Right: Info */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "8px",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                    maxWidth: "calc(100% - 80px)",
                  }}
                >
                  {/* Name and Rarity - Centered */}
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <h3
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "white",
                        fontFamily: "monospace",
                        lineHeight: "1.3",
                        margin: 0,
                        padding: 0,
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        hyphens: "auto",
                      }}
                    >
                      {user.name || user.login}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        marginTop: "4px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Mona Sans SemiCondensed, sans-serif",
                          fontWeight: "600",
                          color: "#d1d5db",
                          fontSize: "12px",
                        }}
                      >
                        @{user.login}
                      </span>
                      <span
                        style={{
                          fontWeight: "500",
                          fontFamily: "monospace",
                          padding: "7px 8px",
                          height: "24px",
                          borderRadius: "4px",
                          fontSize: "9px",
                          whiteSpace: "nowrap",
                          backgroundColor: `${rarityInfo.color}30`,
                          color: rarityInfo.color,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {rarityInfo.name.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="bg-universe-dark-bg/50 rounded p-1.5 border borderColor-muted flex flex-col items-center justify-center">
                      <div className="text-universe-green font-mono uppercase text-[8px] leading-tight">
                        Repos
                      </div>
                      <div className="text-white font-bold font-mono text-sm mt-0.5">
                        {user.public_repos}
                      </div>
                    </div>
                    <div className="bg-universe-dark-bg/50 rounded p-1.5 border borderColor-muted flex flex-col items-center justify-center">
                      <div className="text-universe-green font-mono uppercase text-[8px] leading-tight">
                        Followers
                      </div>
                      <div className="text-white font-bold font-mono text-sm mt-0.5">
                        {user.followers}
                      </div>
                    </div>
                    <div className="bg-universe-dark-bg/50 rounded p-1.5 border borderColor-muted flex flex-col items-center justify-center">
                      <div className="text-universe-green font-mono uppercase text-[8px] leading-tight">
                        Stars
                      </div>
                      <div className="text-white font-bold font-mono text-sm mt-0.5">
                        {extendedStats.totalStars}
                      </div>
                    </div>
                  </div>

                  {/* Languages - Centered */}
                  {extendedStats.topLanguages.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {extendedStats.topLanguages.slice(0, 3).map((lang) => (
                        <span
                          key={lang}
                          className="text-[9px] font-mono px-2 py-1 rounded bg-universe-green/20 text-universe-green-light"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Available for Hire Badge - Bottom */}
                  {availableForHire && (
                    <div
                      style={{
                        textAlign: "center",
                        paddingTop: "6px",
                        paddingBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 8px",
                          height: "24px",
                          fontFamily: "monospace",
                          fontWeight: "500",
                          fontSize: "9px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          borderRadius: "4px",
                          backgroundColor: "#5FED83",
                          color: "#010409",
                          border: "2px solid #0d1117",
                          whiteSpace: "nowrap",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          style={{
                            width: "12px",
                            height: "12px",
                            marginRight: "4px",
                          }}
                        >
                          <path d="M7.5 1.75C7.5.784 8.284 0 9.25 0h5.5c.966 0 1.75.784 1.75 1.75v11.5A1.75 1.75 0 0 1 14.75 15h-5.5a1.75 1.75 0 0 1-1.75-1.75V1.75zm1.75-.25a.25.25 0 0 0-.25.25v11.5c0 .138.112.25.25.25h5.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-5.5zM4.943 9.25A.75.75 0 0 1 4 8.5h-.2a1.55 1.55 0 0 0-1.55 1.55v5.2c0 .856.694 1.55 1.55 1.55h.2a.75.75 0 0 1 0 1.5h-.2A3.05 3.05 0 0 1 .75 15.25v-5.2A3.05 3.05 0 0 1 3.8 7h.2a.75.75 0 0 1 .75.75v1.5z" />
                        </svg>
                        OPEN TO WORK
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Close Top Section */}
            </div>
          </div>
        </div>
        {/* Close main container */}
      </div>
    );
  }
);

DevemonCard.displayName = "DevemonCard";

export default DevemonCard;
