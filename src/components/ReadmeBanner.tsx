/**
 * GitHub Profile README Banner Generator
 *
 * Creates a banner suitable for GitHub profile READMEs with:
 * - Username and stats (followers, repos, contributions, stars)
 * - Top programming languages (with GitHub color coding)
 * - Avatar art options: ASCII art, Pixel art, Grayscale, or Color (optional)
 * - "Available for Hire" badge (optional)
 * - Location and company info (if available)
 * - Account age
 *
 * Export format: 1280×320 (standard banner size)
 */

import { useState, useEffect, useRef, forwardRef } from "preact/compat";
import { useImperativeHandle } from "preact/hooks";
import html2canvas from "html2canvas";
import type { GitHubUser } from "./GitHubWallpaperApp";
import { Checkbox, PrimerSelect } from "./ui/FormControls";
import { Icon } from "./ui/Icon";
import { PrimaryButton, SecondaryButton } from "./ui/Button";
import styles from "./ReadmeBanner.module.css";
import sharedStyles from "./shared.module.css";

export interface ReadmeBannerRef {
  downloadBanner: () => Promise<void>;
  copyMarkdown: () => void;
  handleTwitterShare: () => Promise<void>;
  handleBlueskyShare: () => Promise<void>;
  handleThreadsShare: () => Promise<void>;
  handleInstagramShare: () => Promise<void>;
}

interface ReadmeBannerProps {
  user: GitHubUser;
  artType: "none" | "ascii" | "pixel" | "grayscale" | "color";
  availableForHire: boolean;
  showWebsite: boolean;
  showJoinDate: boolean;
  showBio: boolean;
}

interface ExtendedStats {
  totalStars: number;
  totalForks: number;
  topLanguages: Array<{ name: string; count: number }>;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

const ReadmeBanner = forwardRef<ReadmeBannerRef, ReadmeBannerProps>(
  (
    { user, artType, availableForHire, showWebsite, showJoinDate, showBio },
    ref
  ) => {
    const [loading, setLoading] = useState(true);
    const [asciiArt, setAsciiArt] = useState<string>("");
    const [pixelArtData, setPixelArtData] = useState<string>("");
    const [grayscaleArtData, setGrayscaleArtData] = useState<string>("");
    const [colorArtData, setColorArtData] = useState<string>("");

    // New feature toggles - removed from state since they're now props
    const [showStreak, setShowStreak] = useState(false);

    const [extendedStats, setExtendedStats] = useState<ExtendedStats>({
      totalStars: 0,
      totalForks: 0,
      topLanguages: [],
    });

    const standardBannerRef = useRef<HTMLDivElement>(null);

    /**
     * Convert image to ASCII art with improved resolution and character set
     */
    const generateAsciiArt = async (imageUrl: string): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          // Create canvas for processing
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve("");
            return;
          }

          // Higher resolution for better detail
          const width = 60; // characters wide (increased from 40)
          const height = 40; // characters tall (increased from 20)
          canvas.width = width;
          canvas.height = height;

          // Draw and scale image
          ctx.drawImage(img, 0, 0, width, height);

          // Get image data
          const imageData = ctx.getImageData(0, 0, width, height);
          const pixels = imageData.data;

          // Improved ASCII characters gradient (more levels for smoother shading)
          // From darkest to lightest with better contrast
          const asciiChars = [
            " ",
            ".",
            "'",
            "`",
            "^",
            '"',
            ",",
            ":",
            ";",
            "I",
            "l",
            "!",
            "i",
            ">",
            "<",
            "~",
            "+",
            "_",
            "-",
            "?",
            "]",
            "[",
            "}",
            "{",
            "1",
            ")",
            "(",
            "|",
            "\\",
            "/",
            "t",
            "f",
            "j",
            "r",
            "x",
            "n",
            "u",
            "v",
            "c",
            "z",
            "X",
            "Y",
            "U",
            "J",
            "C",
            "L",
            "Q",
            "0",
            "O",
            "Z",
            "m",
            "w",
            "q",
            "p",
            "d",
            "b",
            "k",
            "h",
            "a",
            "o",
            "*",
            "#",
            "M",
            "W",
            "&",
            "8",
            "%",
            "B",
            "@",
            "$",
          ];

          let ascii = "";
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const offset = (y * width + x) * 4;
              const r = pixels[offset];
              const g = pixels[offset + 1];
              const b = pixels[offset + 2];
              const a = pixels[offset + 3];

              // Calculate brightness with better weighting (closer to human perception)
              const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

              // If transparent, use space
              if (a < 128) {
                ascii += " ";
              } else {
                // Map brightness to ASCII character with better distribution
                const charIndex = Math.floor(
                  (brightness / 255) * (asciiChars.length - 1)
                );
                ascii += asciiChars[charIndex];
              }
            }
            ascii += "\n";
          }

          resolve(ascii);
        };

        img.onerror = () => {
          resolve("");
        };

        // Use CORS proxy for avatar
        img.src = `https://images.weserv.nl/?url=${encodeURIComponent(
          imageUrl
        )}&w=200&h=200&fit=cover&a=attention`;
      });
    };

    /**
     * Generate pixel art data URL from avatar
     * 16-bit style with higher resolution and more detail
     */
    const generatePixelArt = async (imageUrl: string): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          // Create canvas for processing
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve("");
            return;
          }

          // 16-bit style dimensions (higher resolution than 8-bit)
          const pixelWidth = 64; // Number of pixels wide (doubled from 32)
          const pixelHeight = 64; // Number of pixels tall (doubled from 32)

          // Set canvas to pixelated size
          canvas.width = pixelWidth;
          canvas.height = pixelHeight;

          // Disable image smoothing for crisp pixels
          ctx.imageSmoothingEnabled = false;

          // Draw scaled-down image
          ctx.drawImage(img, 0, 0, pixelWidth, pixelHeight);

          // Get the data URL
          const dataUrl = canvas.toDataURL();
          resolve(dataUrl);
        };

        img.onerror = () => {
          resolve("");
        };

        // Use CORS proxy for avatar
        img.src = `https://images.weserv.nl/?url=${encodeURIComponent(
          imageUrl
        )}&w=200&h=200&fit=cover&a=attention`;
      });
    };

    /**
     * Generate grayscale art from avatar
     * Applies grayscale filter for a monochrome effect
     */
    const generateGrayscaleArt = async (imageUrl: string): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve("");
            return;
          }

          const size = 256;
          canvas.width = size;
          canvas.height = size;

          // Draw original image
          ctx.drawImage(img, 0, 0, size, size);

          // Get image data
          const imageData = ctx.getImageData(0, 0, size, size);
          const data = imageData.data;

          // Apply grayscale effect
          for (let i = 0; i < data.length; i += 4) {
            // Calculate grayscale value using luminosity method
            const gray =
              0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = gray; // Red
            data[i + 1] = gray; // Green
            data[i + 2] = gray; // Blue
            // Alpha remains unchanged
          }

          // Put modified data back
          ctx.putImageData(imageData, 0, 0);

          resolve(canvas.toDataURL("image/png"));
        };

        img.onerror = () => {
          resolve("");
        };

        // Use CORS proxy for avatar
        img.src = `https://images.weserv.nl/?url=${encodeURIComponent(
          imageUrl
        )}&w=256&h=256&fit=cover&a=attention`;
      });
    };

    /**
     * Generate color art from avatar
     * Returns the original avatar in color without any filters
     */
    const generateColorArt = async (imageUrl: string): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve("");
            return;
          }

          const size = 256;
          canvas.width = size;
          canvas.height = size;

          // Draw original image without any filters
          ctx.drawImage(img, 0, 0, size, size);

          resolve(canvas.toDataURL("image/png"));
        };

        img.onerror = () => {
          resolve("");
        };

        // Use CORS proxy for avatar
        img.src = `https://images.weserv.nl/?url=${encodeURIComponent(
          imageUrl
        )}&w=256&h=256&fit=cover&a=attention`;
      });
    };
    /**
     * Generate ASCII art on component mount
     */
    useEffect(() => {
      const loadArt = async () => {
        const [art, pixelData, grayscaleData, colorData] = await Promise.all([
          generateAsciiArt(user.avatar_url),
          generatePixelArt(user.avatar_url),
          generateGrayscaleArt(user.avatar_url),
          generateColorArt(user.avatar_url),
        ]);
        setAsciiArt(art);
        setPixelArtData(pixelData);
        setGrayscaleArtData(grayscaleData);
        setColorArtData(colorData);
      };

      loadArt();
    }, [user.avatar_url]);

    /**
     * Fetch repositories and calculate language stats
     */
    useEffect(() => {
      const fetchExtendedStats = async () => {
        try {
          const reposResponse = await fetch(
            `https://api.github.com/users/${user.login}/repos?per_page=100&sort=updated`
          );

          if (!reposResponse.ok) {
            console.error("Failed to fetch repos");
            setLoading(false);
            return;
          }

          const repos = await reposResponse.json();

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

          // Get top languages with counts
          const topLanguages = Object.entries(languageCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

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

    /**
     * Calculate account age
     */
    const getAccountAge = () => {
      const createdDate = new Date(user.created_at);
      const now = new Date();
      const years = now.getFullYear() - createdDate.getFullYear();
      const months = now.getMonth() - createdDate.getMonth();

      if (years > 0) {
        return `${years}+ year${years !== 1 ? "s" : ""}`;
      }
      return `${Math.max(1, months)} month${months !== 1 ? "s" : ""}`;
    };

    /**
     * Format join date
     */
    const getJoinDate = () => {
      const createdDate = new Date(user.created_at);
      return createdDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    };

    /**
     * Get streak information (mock for now - would need GitHub GraphQL API)
     */
    const getStreakInfo = () => {
      // Note: Real streak data would require GitHub GraphQL API or external service
      // For now, showing current year contributions as an approximation
      if (contributions > 0) {
        return `${contributions.toLocaleString()} this year`;
      }
      return null;
    };

    /**
     * Download banner as PNG
     */
    const downloadBanner = async () => {
      if (!standardBannerRef.current) return;

      try {
        const canvas = await html2canvas(standardBannerRef.current, {
          scale: 2,
          backgroundColor: null,
          useCORS: true,
        });

        canvas.toBlob((blob) => {
          if (!blob) return;

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${user.login}-readme-banner.png`;
          link.click();
          URL.revokeObjectURL(url);
        });
      } catch (error) {
        console.error("Error generating banner:", error);
      }
    };

    /**
     * Copy markdown code to clipboard
     */
    const copyMarkdown = () => {
      // You would typically host the image on GitHub or a CDN
      // For now, we'll provide a template markdown that users can update
      const markdown = `![${user.login}'s GitHub Banner](https://raw.githubusercontent.com/${user.login}/${user.login}/main/banner.png)`;

      navigator.clipboard
        .writeText(markdown)
        .then(() => {
          alert(
            "✓ Markdown copied to clipboard!\n\nUpload your banner.png to your profile repository and use this code in your README."
          );
        })
        .catch(() => {
          alert("Markdown code:\n\n" + markdown);
        });
    };

    /**
     * Share banner to Twitter/X
     */
    const handleTwitterShare = async () => {
      if (!standardBannerRef.current) return;

      try {
        const canvas = await html2canvas(standardBannerRef.current, {
          scale: 2,
          backgroundColor: null,
          useCORS: true,
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);

              alert(
                "✅ Banner copied to clipboard! You can now paste it in your tweet."
              );

              const tweetText =
                "Just created my custom GitHub Universe README banner using Octocanvas from #GitHubUniverse 🎉";
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
                "Failed to copy banner to clipboard. Please download it manually."
              );
            }
          }
        }, "image/png");
      } catch (error) {
        console.error("Error sharing to Twitter:", error);
        alert("Failed to generate banner image. Please try again.");
      }
    };

    /**
     * Share banner to Bluesky
     */
    const handleBlueskyShare = async () => {
      if (!standardBannerRef.current) return;

      try {
        const canvas = await html2canvas(standardBannerRef.current, {
          scale: 2,
          backgroundColor: null,
          useCORS: true,
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);

              alert(
                "✅ Banner copied to clipboard! You can now paste it in your Bluesky post."
              );

              const postText =
                "Just created my custom GitHub Universe README banner using Octocanvas from #GitHubUniverse 🎉";
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
                "Failed to copy banner to clipboard. Please download it manually."
              );
            }
          }
        }, "image/png");
      } catch (error) {
        console.error("Error sharing to Bluesky:", error);
        alert("Failed to generate banner image. Please try again.");
      }
    };

    /**
     * Share banner to Threads
     */
    const handleThreadsShare = async () => {
      if (!standardBannerRef.current) return;

      try {
        const canvas = await html2canvas(standardBannerRef.current, {
          scale: 2,
          backgroundColor: null,
          useCORS: true,
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);

              alert(
                "✅ Banner copied to clipboard! You can now paste it in your Threads post."
              );

              const postText =
                "Just created my custom GitHub Universe README banner using Octocanvas from #GitHubUniverse 🎉";
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
                "Failed to copy banner to clipboard. Please download it manually."
              );
            }
          }
        }, "image/png");
      } catch (error) {
        console.error("Error sharing to Threads:", error);
        alert("Failed to generate banner image. Please try again.");
      }
    };

    /**
     * Share banner to Instagram
     */
    const handleInstagramShare = async () => {
      if (!standardBannerRef.current) return;

      try {
        const canvas = await html2canvas(standardBannerRef.current, {
          scale: 2,
          backgroundColor: null,
          useCORS: true,
        });

        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);

              alert(
                "✅ Banner copied to clipboard!\n\n📱 To share on Instagram:\n1. Open the Instagram app on your device\n2. Tap the + button to create a new post\n3. Paste the image from your clipboard\n4. Add your caption and share!"
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
                "Failed to copy banner to clipboard. Please download it manually."
              );
            }
          }
        }, "image/png");
      } catch (error) {
        console.error("Error sharing to Instagram:", error);
        alert("Failed to generate banner image. Please try again.");
      }
    };

    // Expose functions via ref
    useImperativeHandle(
      ref,
      () => ({
        downloadBanner,
        copyMarkdown,
        handleTwitterShare,
        handleBlueskyShare,
        handleThreadsShare,
        handleInstagramShare,
      }),
      [user.login]
    );

    const contributions = user.contributions?.totalContributions || 0;
    const accountAge = getAccountAge();

    return (
      <div className={styles.Container}>
        {/* Banner Preview */}
        <div className={styles.ContentSection}>
          {/* Standard Banner (1280×320) */}
          <div className={sharedStyles.SharedPreviewBox}>
            <h2 className={sharedStyles.SharedPreviewTitle}>Your Banner</h2>
            <div className={styles.PreviewContainer}>
              <div
                ref={standardBannerRef}
                style={{
                  width: "1280px",
                  height: "320px",
                  background:
                    "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1c2128 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decorative Elements */}
                <div
                  style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "300px",
                    height: "300px",
                    background:
                      "radial-gradient(circle, rgba(94, 237, 131, 0.15) 0%, transparent 70%)",
                    borderRadius: "50%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-80px",
                    left: "-80px",
                    width: "400px",
                    height: "400px",
                    background:
                      "radial-gradient(circle, rgba(94, 237, 131, 0.1) 0%, transparent 70%)",
                    borderRadius: "50%",
                  }}
                />

                {/* Content Container */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 10,
                    padding: "40px 60px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                    gap: "40px",
                    justifyContent: "space-between",
                  }}
                >
                  {/* ASCII Art Column (Left) */}
                  {artType === "ascii" && asciiArt && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minWidth: "256px",
                      }}
                    >
                      <div
                        style={{
                          width: "256px",
                          height: "256px",
                          border: "4px solid #5fed83",
                          borderRadius: "8px",
                          boxShadow: "0 0 20px rgba(94, 237, 131, 0.3)",
                          backgroundColor: "#0d1117",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <pre
                          style={{
                            color: "#5fed83",
                            fontSize: "5.5px",
                            lineHeight: "5.5px",
                            fontFamily: "monospace",
                            margin: 0,
                            textShadow: "0 0 10px rgba(94, 237, 131, 0.5)",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {asciiArt}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Pixel Art Column (Left) */}
                  {artType === "pixel" && pixelArtData && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minWidth: "256px",
                      }}
                    >
                      <img
                        src={pixelArtData}
                        alt="Pixel Art Avatar"
                        style={{
                          width: "256px",
                          height: "256px",
                          imageRendering: "pixelated",
                          border: "4px solid #5fed83",
                          borderRadius: "8px",
                          boxShadow: "0 0 20px rgba(94, 237, 131, 0.3)",
                        }}
                      />
                    </div>
                  )}

                  {/* Grayscale Art Column (Left) */}
                  {artType === "grayscale" && grayscaleArtData && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minWidth: "256px",
                      }}
                    >
                      <img
                        src={grayscaleArtData}
                        alt="Grayscale Avatar"
                        style={{
                          width: "256px",
                          height: "256px",
                          border: "4px solid #5fed83",
                          borderRadius: "16px",
                          boxShadow: "0 0 30px rgba(94, 237, 131, 0.4)",
                        }}
                      />
                    </div>
                  )}

                  {/* Color Art Column (Left) */}
                  {artType === "color" && colorArtData && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minWidth: "256px",
                      }}
                    >
                      <img
                        src={colorArtData}
                        alt="Color Avatar"
                        style={{
                          width: "256px",
                          height: "256px",
                          border: "4px solid #5fed83",
                          borderRadius: "16px",
                          boxShadow: "0 0 30px rgba(94, 237, 131, 0.4)",
                        }}
                      />
                    </div>
                  )}

                  {/* Content Column (Right) */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Header */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                          marginBottom: "20px",
                        }}
                      >
                        <h1
                          style={{
                            fontSize: "48px",
                            fontWeight: "800",
                            color: "#5fed83",
                            margin: 0,
                            fontFamily: "monospace",
                          }}
                        >
                          {user.login}
                        </h1>
                        {availableForHire && (
                          <div
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#5FED83",
                              color: "#010409",
                              border: "2px solid #0d1117",
                              borderRadius: "8px",
                              whiteSpace: "nowrap",
                              fontSize: "14px",
                              fontWeight: "500",
                              fontFamily: "monospace",
                            }}
                          >
                            <Icon
                              name="briefcase"
                              size="functional"
                              color="currentColor"
                              label="Available for Hire"
                            />{" "}
                            OPEN TO WORK
                          </div>
                        )}
                      </div>

                      {/* Stats Row */}
                      <div
                        style={{
                          display: "flex",
                          gap: "30px",
                          marginBottom: "24px",
                        }}
                      >
                        <div
                          style={{
                            color: "#7d8590",
                            fontSize: "16px",
                            fontFamily: "monospace",
                          }}
                        >
                          <span style={{ color: "#ffffff", fontWeight: "700" }}>
                            {user.followers.toLocaleString()}
                          </span>{" "}
                          followers
                        </div>
                        <div
                          style={{
                            color: "#7d8590",
                            fontSize: "16px",
                            fontFamily: "monospace",
                          }}
                        >
                          <span style={{ color: "#ffffff", fontWeight: "700" }}>
                            {user.public_repos.toLocaleString()}
                          </span>{" "}
                          repos
                        </div>
                        {contributions > 0 && (
                          <div
                            style={{
                              color: "#7d8590",
                              fontSize: "16px",
                              fontFamily: "monospace",
                            }}
                          >
                            <span
                              style={{ color: "#ffffff", fontWeight: "700" }}
                            >
                              {contributions.toLocaleString()}
                            </span>{" "}
                            contributions
                          </div>
                        )}
                        {extendedStats.totalStars > 0 && (
                          <div
                            style={{
                              color: "#7d8590",
                              fontSize: "16px",
                              fontFamily: "monospace",
                            }}
                          >
                            ⭐{" "}
                            <span
                              style={{ color: "#ffffff", fontWeight: "700" }}
                            >
                              {extendedStats.totalStars.toLocaleString()}
                            </span>{" "}
                            stars
                          </div>
                        )}
                      </div>

                      {/* Additional Info */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "16px",
                          fontSize: "14px",
                          fontFamily: "monospace",
                          color: "#7d8590",
                          marginBottom: "16px",
                        }}
                      >
                        {user.location && <div>📍 {user.location}</div>}
                        {user.company && <div>🏢 {user.company}</div>}
                        {showWebsite && user.blog && (
                          <div>
                            🌐{" "}
                            <a
                              href={
                                user.blog.startsWith("http")
                                  ? user.blog
                                  : `https://${user.blog}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#7d8590",
                                textDecoration: "none",
                              }}
                            >
                              {user.blog
                                .replace(/^https?:\/\//, "")
                                .replace(/\/$/, "")}
                            </a>
                          </div>
                        )}
                        {showJoinDate && <div>📅 Joined {getJoinDate()}</div>}
                        {!showJoinDate && <div>🗓️ {accountAge} on GitHub</div>}
                        {showStreak && getStreakInfo() && (
                          <div>📊 {getStreakInfo()}</div>
                        )}
                      </div>

                      {/* Bio */}
                      {showBio && user.bio && (
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#c9d1d9",
                            fontFamily: "monospace",
                            fontStyle: "italic",
                            marginBottom: "16px",
                            maxWidth: "600px",
                            lineHeight: "1.5",
                          }}
                        >
                          "
                          {user.bio.length > 120
                            ? user.bio.substring(0, 120) + "..."
                            : user.bio}
                          "
                        </div>
                      )}
                    </div>

                    {/* Languages */}
                    {extendedStats.topLanguages.length > 0 && (
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#7d8590",
                            marginBottom: "12px",
                            fontFamily: "monospace",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          Top Languages
                        </div>
                        <div style={{ display: "flex", gap: "16px" }}>
                          {extendedStats.topLanguages.map((lang) => (
                            <div
                              key={lang.name}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "14px",
                                fontFamily: "monospace",
                              }}
                            >
                              <div
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "50%",
                                  background:
                                    LANGUAGE_COLORS[lang.name] || "#7d8590",
                                }}
                              />
                              <span
                                style={{ color: "#ffffff", fontWeight: "600" }}
                              >
                                {lang.name}
                              </span>
                              <span style={{ color: "#7d8590" }}>
                                ({lang.count})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ReadmeBanner;
