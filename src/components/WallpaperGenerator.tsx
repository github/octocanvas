/**
 * Wallpaper Generator Component
 *
 * Generates SVG wallpapers from GitHub user data and exports them as PNG
 * in multiple sizes:
 * - Desktop: 2560x1440
 * - Mobile: 1179x2556
 * - Small: 320x240
 */

import { useRef, useState, useEffect, useImperativeHandle } from "preact/hooks";
import { forwardRef } from "preact/compat";
import type { GitHubUser } from "./GitHubWallpaperApp";
import styles from "./WallpaperGenerator.module.css";
import sharedStyles from "./shared.module.css";

interface WallpaperGeneratorProps {
  user: GitHubUser;
  selectedTheme: keyof typeof BACKGROUND_THEMES;
  avatarFilter: keyof typeof AVATAR_FILTERS;
}

export interface WallpaperGeneratorRef {
  downloadWallpaper: (sizeKey: SizeKey) => Promise<void>;
  handleTwitterShare: () => Promise<void>;
  handleBlueskyShare: () => Promise<void>;
  handleThreadsShare: () => Promise<void>;
  handleInstagramShare: () => Promise<void>;
}

// Wallpaper size configurations
const SIZES = {
  desktop: { width: 2560, height: 1440, label: "Desktop (2560x1440)" },
  mobile: { width: 1179, height: 2556, label: "Mobile (1179x2556)" },
  small: { width: 320, height: 240, label: "Badger (320x240)" },
};

type SizeKey = keyof typeof SIZES;

// Background theme configurations based on Figma brand guidelines
const BACKGROUND_THEMES = {
  "github-universe-green": {
    label: "GitHub Universe Green",
    gradient: {
      // Figma: linear-gradient(90deg, #BFFFD1 0%, #5FED83 100%)
      stops: [
        { offset: "0%", color: "#BFFFD1" },
        { offset: "100%", color: "#5FED83" },
      ],
    },
    overlay: {
      start: "#101411",
      end: "#101411",
    },
  },
  "github-universe-blue": {
    label: "GitHub Universe Blue",
    gradient: {
      // Figma: linear-gradient(90deg, #DEFEFA 8.15%, #3094FF 74.77%, #0527FC 119.18%)
      // SVG adaptation: Start earlier with cyan, hold blue longer, push deep blue to edge
      stops: [
        { offset: "0%", color: "#DEFEFA" },
        { offset: "100%", color: "#3094FF" },
      ],
    },
    overlay: {
      start: "#DEFEFA",
      end: "#3094FF",
    },
  },
  "universe-octocanvas": {
    label: "Universe Octocanvas",
    gradient: {
      // Solid color as a single-stop gradient
      stops: [
        { offset: "0%", color: "#DEFEFA" },
        { offset: "100%", color: "#DEFEFA" },
      ],
    },
    overlay: {
      start: "#DEFEFA",
      end: "#DEFEFA",
    },
    decorative: true, // Flag to indicate this theme has special decorative elements
  },
  "github-dark": {
    label: "GitHub Dark",
    gradient: {
      stops: [
        { offset: "0%", color: "#909692" },
        { offset: "100%", color: "#232925" },
      ],
      angle: 135,
    },
    overlay: {
      start: "#010409",
      end: "#0D1117",
    },
  },
};

type BackgroundThemeKey = keyof typeof BACKGROUND_THEMES;

// Avatar filter options
const AVATAR_FILTERS = {
  grayscale: { label: "Grayscale", filter: "grayscale(100%)" },
  color: { label: "Color", filter: "none" },
};

type AvatarFilterKey = keyof typeof AVATAR_FILTERS;

const WallpaperGenerator = forwardRef<
  WallpaperGeneratorRef,
  WallpaperGeneratorProps
>(({ user, selectedTheme, avatarFilter }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [avatarBase64, setAvatarBase64] = useState<string>("");
  const avatarBase64Ref = useRef<string>(""); // Ref to hold current avatar value for imperative handle
  const [isMobile, setIsMobile] = useState(false);
  const [downloadingSize, setDownloadingSize] = useState<SizeKey | null>(null);

  // Shared social media post text
  const SHARE_POST_TEXT =
    "Just created my custom GitHub Universe wallpaper using Octocanvas from #GitHubUniverse 🎨";

  /**
   * Expose functions to parent component via ref
   */
  useImperativeHandle(
    ref,
    () => ({
      downloadWallpaper,
      handleTwitterShare,
      handleBlueskyShare,
      handleThreadsShare,
      handleInstagramShare,
    }),
    [selectedTheme, avatarFilter, user, avatarBase64]
  );

  /**
   * Detect mobile screen size for responsive preview
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /**
   * Convert avatar URL to base64 data URL to avoid CORS issues during canvas export
   */
  useEffect(() => {
    const convertAvatarToBase64 = async () => {
      try {
        const response = await fetch(user.avatar_url);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64Data = reader.result as string;
          setAvatarBase64(base64Data);
          avatarBase64Ref.current = base64Data; // Update ref as well
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Failed to convert avatar to base64:", error);
        // Fallback to original URL if conversion fails
        setAvatarBase64(user.avatar_url);
        avatarBase64Ref.current = user.avatar_url; // Update ref as well
      }
    };

    convertAvatarToBase64();
  }, [user.avatar_url]);

  /**
   * Generate decorative elements for Universe Octocanvas theme
   * Based on Figma design with sun, plant, cloud, and box elements
   */
  const generateDecorativeElements = (
    width: number,
    height: number,
    scale: number
  ): string => {
    // Calculate grid-based sizing to fill the background densely like Figma
    // Increased grid density: 10 columns × 8 rows for fuller coverage
    const gridCols = 10;
    const gridRows = 8;
    const gridCellWidth = width / gridCols;
    const gridCellHeight = height / gridRows;

    // Element size should fill most of the grid cell
    const elementSize = Math.min(gridCellWidth, gridCellHeight) * 0.85;

    // Decorative sun icon - Figma SVG: 110px × 108px star-burst with gradient
    const sunIcon = (x: number, y: number) => {
      const sunWidth = elementSize * 0.9; // Sun slightly smaller
      const sunHeight = elementSize * 0.88;
      // Create unique gradient ID for each sun instance
      const gradientId = `sun_gradient_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      return `
        <svg x="${x}" y="${y}" width="${sunWidth}" height="${sunHeight}" viewBox="0 0 110 108" fill="none">
          <defs>
            <linearGradient id="${gradientId}" x1="55.0005" y1="0.829102" x2="55.0005" y2="107.171" gradientUnits="userSpaceOnUse">
              <stop stop-color="white"/>
              <stop offset="1" stop-color="#D3FA37"/>
            </linearGradient>
          </defs>
          <path d="M66.0269 31.1025L89.0044 11.3604L74.8706 38.1543L104.137 30.3369L79.7778 48.3447L109.539 54L79.7778 59.6553L104.137 77.6631L74.8706 69.8457L89.0044 96.6396L66.0269 76.8975L67.1362 107.171L55.0005 79.415L42.8647 107.171L43.9731 76.8975L20.9966 96.6396L35.1304 69.8457L5.86377 77.6631L30.2231 59.6553L0.462402 54L30.2231 48.3447L5.86377 30.3369L35.1304 38.1543L20.9966 11.3604L43.9731 31.1025L42.8647 0.829102L55.0005 28.585L67.1362 0.829102L66.0269 31.1025Z" fill="url(#${gradientId})"/>
        </svg>
      `;
    };

    // Decorative plant icon - Figma SVG: 125px × 125px with curved leaf paths
    const plantIcon = (x: number, y: number) => {
      const plantSize = elementSize;

      return `
        <svg x="${x}" y="${y}" width="${plantSize}" height="${plantSize}" viewBox="0 0 125 125" fill="none">
          <path d="M0.000320223 58.3709L0.000319967 55.4453C33.8676 55.4453 60.4313 81.7862 61.7935 113.132L62.2888 113.132C63.7749 80.0741 91.6321 55.4453 124.082 55.4453L124.015 58.1075C124.015 90.0836 97.21 116.293 64.5308 117.548L59.3168 117.548C26.6246 116.161 1.23867 90.7421 0.000320223 58.3709Z" fill="#08872B"/>
          <path d="M0.000327852 9.23516L0.000327597 6.30958C33.8676 6.30958 60.4313 32.6505 61.7935 63.9962L62.2888 63.9962C63.7749 30.9383 91.6321 6.30957 124.082 6.30957L124.015 8.97174C124.015 40.9479 97.21 67.1571 64.5308 68.412L59.3168 68.412C26.6247 67.0254 1.23867 41.6064 0.000327852 9.23516Z" fill="#08872B"/>
        </svg>
      `;
    };

    // Decorative cloud icon - Figma spec: 143px × 143px, light green rounded square
    const cloudIcon = (x: number, y: number) => {
      const cloudSize = elementSize;
      const borderRadius = cloudSize * 0.16; // 23/143 ratio from Figma

      return `
        <rect
          x="${x}"
          y="${y}"
          width="${cloudSize}"
          height="${cloudSize}"
          rx="${borderRadius}"
          fill="#8CF2A6"
          opacity="1"
        />
      `;
    };

    // Decorative green circle - Figma spec: 143px × 143px, border-radius: 120px, gradient fill
    const greenCircle = (x: number, y: number) => {
      const circleSize = elementSize;
      const borderRadius = circleSize * 0.84; // 120/143 ratio
      // Create unique gradient ID for each circle instance
      const gradientId = `green_circle_gradient_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      return `
        <defs>
          <linearGradient id="${gradientId}" x1="50%" y1="0%" x2="50%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="27.53%" stop-color="#BFFFD1"/>
            <stop offset="102.62%" stop-color="#5FED83"/>
          </linearGradient>
        </defs>
        <rect
          x="${x}"
          y="${y}"
          width="${circleSize}"
          height="${circleSize}"
          rx="${borderRadius}"
          fill="url(#${gradientId})"
          opacity="0.85"
        />
      `;
    };

    // Decorative rounded box - Figma spec: 143px × 143px, rotated -90deg, border-radius: 23px
    const boxIcon = (x: number, y: number, rotation: number = -90) => {
      const boxSize = elementSize;
      const borderRadius = boxSize * 0.16; // 23/143 ratio
      // Calculate center point for rotation
      const centerX = x + boxSize / 2;
      const centerY = y + boxSize / 2;

      return `
        <rect
          x="${x}"
          y="${y}"
          width="${boxSize}"
          height="${boxSize}"
          rx="${borderRadius}"
          fill="#DDF4FF"
          opacity="0.8"
          transform="rotate(${rotation} ${centerX} ${centerY})"
        />
      `;
    };

    // Helper function to center an element within a grid cell
    const centerInCell = (
      col: number,
      row: number,
      elemSize: number = elementSize
    ) => {
      return {
        x: col * gridCellWidth + (gridCellWidth - elemSize) / 2,
        y: row * gridCellHeight + (gridCellHeight - elemSize) / 2,
      };
    };

    // Create a varied pattern of decorative elements
    const elements = [];
    const elementTypes = [
      {
        type: "sun",
        render: (col: number, row: number) =>
          sunIcon(
            centerInCell(col, row, elementSize * 0.9).x,
            centerInCell(col, row, elementSize * 0.88).y
          ),
      },
      {
        type: "plant",
        render: (col: number, row: number) =>
          plantIcon(centerInCell(col, row).x, centerInCell(col, row).y),
      },
      {
        type: "cloud",
        render: (col: number, row: number) =>
          cloudIcon(centerInCell(col, row).x, centerInCell(col, row).y),
      },
      {
        type: "circle",
        render: (col: number, row: number) =>
          greenCircle(centerInCell(col, row).x, centerInCell(col, row).y),
      },
      {
        type: "box",
        render: (col: number, row: number) =>
          boxIcon(centerInCell(col, row).x, centerInCell(col, row).y),
      },
    ];

    // Fill the grid with varied decorative elements
    // Skip center area (cols 3-6, rows 2-5) for profile card
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        // Skip center area for profile card
        if (col >= 3 && col <= 6 && row >= 2 && row <= 5) {
          continue;
        }

        // Create a varied pattern using modulo to cycle through element types
        const elementIndex = (col + row * 2) % elementTypes.length;
        elements.push(elementTypes[elementIndex].render(col, row));
      }
    }

    return `
      <!-- Decorative Elements - Dense Grid Layout (${gridCols} cols × ${gridRows} rows) -->
      ${elements.join("\n      ")}
    `;
  };

  /**
   * Generate SVG wallpaper markup
   * This function creates the SVG structure with user data
   *
   * Theme customization point: Modify colors, gradients, and layout here
   */
  const generateSVG = (
    width: number,
    height: number,
    isStatic: boolean = false
  ): string => {
    // Get current avatar value from ref (not stale closure)
    const currentAvatarBase64 = avatarBase64Ref.current;

    // Calculate responsive sizing based on dimensions
    const scale = Math.min(width, height) / 1000;
    const avatarSize = 200 * scale;
    const fontSize = 48 * scale;
    const smallFontSize = 32 * scale;

    // Get selected theme colors
    const theme = BACKGROUND_THEMES[selectedTheme];

    // Set text colors based on theme (white for GitHub Dark, black for others)
    const textColor = selectedTheme === "github-dark" ? "#FFFFFF" : "#000000";
    const handleColor = selectedTheme === "github-dark" ? "#FFFFFF" : "#4F4F4F";

    // Set avatar border color based on theme
    const avatarBorderColor =
      selectedTheme === "github-universe-blue" ? "#9EECFF" : "#5fed83";

    // Center positioning
    const centerX = width / 2;
    const centerY = height / 2;

    // Contribution graph settings
    const contributions = user.contributions;
    const cellSize = 12 * scale; // Increased from 8
    const cellGap = 3 * scale; // Increased from 2
    const graphY = height - 300 * scale; // Adjust this value: higher number = graph moves up

    // Calculate year range for contributions
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const contributionYearText = `${lastYear} - ${currentYear}`;

    // Generate contribution squares
    let contributionSquares = "";
    let actualGraphWidth = 0;
    let graphX = centerX; // Will be adjusted after calculating actual width

    // Check if we're using the Universe theme (needs different positioning)
    const isUniverseTheme = selectedTheme === "universe-octocanvas";
    const universeGraphScale = 0.5; // Increased from 0.4 for better visibility

    if (contributions && contributions.weeks.length > 0) {
      // Take last 53 weeks to show full year
      const recentWeeks = contributions.weeks.slice(-53);
      const totalWeeks = recentWeeks.length;

      // Adjust cell size for Universe theme
      const adjustedCellSize = isUniverseTheme
        ? cellSize * universeGraphScale
        : cellSize;
      const adjustedCellGap = isUniverseTheme
        ? cellGap * universeGraphScale
        : cellGap;

      // Calculate the actual width the graph will take
      actualGraphWidth =
        totalWeeks * adjustedCellSize + (totalWeeks - 1) * adjustedCellGap;

      // Center the graph horizontally (for non-Universe themes)
      graphX = centerX - actualGraphWidth / 2;

      for (let weekIdx = 0; weekIdx < totalWeeks; weekIdx++) {
        const week = recentWeeks[weekIdx];
        const daysInWeek = week.contributionDays?.length || 0;

        for (let dayIdx = 0; dayIdx < daysInWeek; dayIdx++) {
          const day = week.contributionDays[dayIdx];
          if (!day) continue; // Skip if day is undefined

          // For Universe theme, use relative positioning (will be transformed)
          const x = isUniverseTheme
            ? weekIdx * (adjustedCellSize + adjustedCellGap)
            : graphX + weekIdx * (adjustedCellSize + adjustedCellGap);
          const y = isUniverseTheme
            ? dayIdx * (adjustedCellSize + adjustedCellGap)
            : graphY + dayIdx * (adjustedCellSize + adjustedCellGap);

          // Color intensity based on contribution count
          // GitHub Universe Blue theme uses blue shades, others use green shades
          let fillColor = "#000000";
          let opacityAttr = ' opacity="0.2"'; // Only for empty squares

          if (selectedTheme === "github-universe-blue") {
            // Blue color scheme for GitHub Universe Blue theme
            if (day.contributionCount === 0) {
              fillColor = "#FFFFFF";
              opacityAttr = ' opacity="0.5"'; // 50% opacity for empty squares
            } else {
              opacityAttr = ""; // Remove opacity for colored squares (100% opaque)
              if (day.contributionCount >= 10) {
                fillColor = "#0527FC"; // Darkest blue for highest contributions
              } else if (day.contributionCount >= 5) {
                fillColor = "#3094FF"; // Medium blue
              } else {
                fillColor = "#9EECFF"; // Light blue for lowest contributions
              }
            }
          } else {
            // Green color scheme for other themes
            if (day.contributionCount > 0) {
              opacityAttr = ""; // Remove opacity for colored squares (100% opaque)
              if (day.contributionCount >= 15) {
                fillColor = "#5fed83";
              } else if (day.contributionCount >= 10) {
                fillColor = "#5fed83";
              } else if (day.contributionCount >= 5) {
                fillColor = "#8cf2a6";
              } else if (day.contributionCount >= 2) {
                fillColor = "#bfffd1";
              } else {
                fillColor = "#dcff96";
              }
            }
          }

          contributionSquares += `<rect ${isStatic ? "" : 'class="contribution-square" '
            }x="${x}" y="${y}" width="${adjustedCellSize}" height="${adjustedCellSize}" fill="${fillColor}"${opacityAttr} rx="2"/>`;
        }
      }
    }

    if (isUniverseTheme) {
      // Universe Octocanvas theme with profile card and decorative elements
      const cardWidth = width * 0.25; // 35% of width
      const cardHeight = height * 0.8; // 70% of height
      const cardX = centerX - cardWidth / 2;
      const cardY = centerY - cardHeight / 2;
      const cardRadius = 20 * scale;

      const cardAvatarSize = cardWidth * 0.75;
      const cardAvatarY = cardY + cardHeight * 0.25;

      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          <defs>
            <!-- Universe Octocanvas gradient -->
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              ${theme.gradient.stops
          .map(
            (stop: any) =>
              `<stop offset="${stop.offset}" style="stop-color:${stop.color};stop-opacity:1" />`
          )
          .join("\n              ")}
            </linearGradient>

            <!-- Avatar clip path for card -->
            <clipPath id="cardAvatarClip">
              <circle cx="${centerX}" cy="${cardAvatarY}" r="${cardAvatarSize / 2
        }" />
            </clipPath>
          </defs>
          
          ${!isStatic
          ? `<!-- CSS Animations for preview -->
          <style>
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .username-universe { animation: fadeIn 1.5s ease-in; }
            .stats-universe { animation: fadeIn 2s ease-in; }
          </style>`
          : ""
        }
          
          <!-- Background gradient -->
          <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>

          <!-- Decorative elements -->
          ${generateDecorativeElements(width, height, scale)}

          <!-- Profile card with beige background -->
          <rect
            x="${cardX}"
            y="${cardY}"
            width="${cardWidth}"
            height="${cardHeight}"
            rx="${cardRadius}"
            fill="#F8FFDC"
            opacity="1"
          />

          <!-- Avatar in card -->
          <image 
            ${isStatic ? "" : 'class="avatar-universe"'}
            href="${currentAvatarBase64 || user.avatar_url}" 
            x="${centerX - cardAvatarSize / 2}" 
            y="${cardAvatarY - cardAvatarSize / 2}" 
            width="${cardAvatarSize}" 
            height="${cardAvatarSize}"
            clip-path="url(#cardAvatarClip)"
            style="filter: ${AVATAR_FILTERS[avatarFilter].filter};"
          />

          <!-- Avatar border -->
          <circle 
            ${isStatic ? "" : 'class="avatar-universe"'}
            cx="${centerX}" 
            cy="${cardAvatarY}" 
            r="${cardAvatarSize / 2 + 4 * scale}" 
            fill="none" 
            stroke="#000000" 
            stroke-width="${1 * scale}"
            opacity=".1"
          />

          <!-- Name - bold uppercase -->
          <text 
            ${isStatic ? "" : 'class="username-universe"'}
            x="${centerX}" 
            y="${cardAvatarY + cardAvatarSize / 2 + 50 * scale}" 
            font-family="'Monaspace Neon'" 
            font-size="${32 * scale}"
            font-style="normal"
            font-weight="500"
            fill="#000000"
            text-anchor="middle"
            letter-spacing="2"
          >${(user.name || user.login).toUpperCase()}</text>

          <!-- Username -->
          <text 
            ${isStatic ? "" : 'class="username-universe"'}
            x="${centerX}" 
            y="${cardAvatarY + cardAvatarSize / 2 + 85 * scale}" 
            font-family="'Monaspace Neon', system-ui, sans-serif" 
            font-size="${25 * scale}" 
            font-style="normal"
            font-weight="400"
            fill="#000000"
            text-anchor="middle"
          >@${user.login}</text>

          <!-- Stats - three columns -->
          <text 
            ${isStatic ? "" : 'class="stats-universe"'}
            x="${centerX - cardWidth * 0.28}" 
            y="${cardY + cardHeight * 0.75}" 
            font-family="'Monaspace Neon', monospace, sans-serif" 
            font-size="${42 * scale}"
            font-style="normal"
            font-weight="400"
            fill="#000000"
            text-anchor="middle"
            letter-spacing="1"
          >${contributions?.totalContributions.toLocaleString() || 0}</text>
          <text 
            ${isStatic ? "" : 'class="stats-universe"'}
            x="${centerX - cardWidth * 0.28}" 
            y="${cardY + cardHeight * 0.75 + 20 * scale}" 
            font-family="'Monaspace Neon', monospace, sans-serif" 
            font-size="${11 * scale}" 
            fill="#000000" 
            text-anchor="middle"
            letter-spacing="1.5"
            line-height="1.2"
          >CONTRIBUTIONS</text>
          
          <text 
            ${isStatic ? "" : 'class="stats-universe"'}
            x="${centerX}" 
            y="${cardY + cardHeight * 0.75}" 
            font-family="'Monaspace Neon', monospace, sans-serif" 
            font-size="${42 * scale}" 
            font-weight="400" 
            fill="#000000" 
            text-anchor="middle"
            letter-spacing="1"
          >${user.public_repos.toLocaleString()}</text>
          <text 
            ${isStatic ? "" : 'class="stats-universe"'}
            x="${centerX}" 
            y="${cardY + cardHeight * 0.75 + 20 * scale}" 
            font-family="'Monaspace Neon', monospace, sans-serif" 
            font-size="${11 * scale}" 
            fill="#000000" 
            text-anchor="middle"
            letter-spacing="1.5"
            line-height="1.2"
          >REPOS</text>
          
          <text 
            ${isStatic ? "" : 'class="stats-universe"'}
            x="${centerX + cardWidth * 0.28}" 
            y="${cardY + cardHeight * 0.75}" 
            font-family="'Monaspace Neon', monospace, sans-serif" 
            font-size="${42 * scale}" 
            font-weight="400" 
            fill="#000000" 
            text-anchor="middle"
            letter-spacing="1"
          >${user.followers.toLocaleString()}</text>
          <text 
            ${isStatic ? "" : 'class="stats-universe"'}
            x="${centerX + cardWidth * 0.28}" 
            y="${cardY + cardHeight * 0.75 + 20 * scale}" 
            font-family="'Monaspace Neon', monospace, sans-serif" 
            font-size="${11 * scale}" 
            fill="#000000" 
            text-anchor="middle"
            letter-spacing="1.5"
            line-height="1.2"
          >FOLLOWERS</text>

          <!-- Simple contribution graph at bottom -->
          ${contributionSquares
          ? `
          <g transform="translate(${centerX - actualGraphWidth / 2}, ${cardY + cardHeight * 0.88
          })">
            ${contributionSquares}
          </g>
          `
          : ""
        }
        </svg>
      `;
    }

    // Default theme rendering (existing themes)
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <!-- Dynamic theme gradient background -->
          <linearGradient id="bgGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            ${theme.gradient.stops
        .map(
          (stop: any) =>
            `<stop offset="${stop.offset}" style="stop-color:${stop.color};stop-opacity:1" />`
        )
        .join("\n            ")}
          </linearGradient>

          <!-- Dark overlay for better text contrast (subtle) -->
          <linearGradient id="darkOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${(theme as any).overlay.start
      };stop-opacity:0.15" />
            <stop offset="100%" style="stop-color:${(theme as any).overlay.end
      };stop-opacity:0.25" />
          </linearGradient>

          <!-- Avatar circle clip path -->
          <clipPath id="avatarClip">
            <circle cx="${centerX}" cy="${centerY - avatarSize * 1.0}" r="${avatarSize / 2
      }" />
          </clipPath>
        </defs>
        
        ${!isStatic
        ? `<!-- CSS Animations for preview -->
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          @keyframes glow {
            0%, 100% { filter: drop-shadow(0 0 8px rgba(95, 237, 131, 0.8)); }
            50% { filter: drop-shadow(0 0 20px rgba(95, 237, 131, 1)); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
          }
          .avatar-border { animation: glow 3s ease-in-out infinite; }
          .decorative-circle { animation: float 6s ease-in-out infinite; }
          .username { animation: fadeIn 1s ease-in forwards; }
          .stats { animation: fadeIn 1.5s ease-in forwards; }
          .contribution-square { animation: fadeIn 2s ease-in forwards; }
        </style>`
        : ""
      }
        
        <!-- Background with GitHub Universe green gradient -->
        <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
        <rect width="${width}" height="${height}" fill="url(#darkOverlay)"/>

        <!-- Avatar image with better centering and filter -->
        <image
          href="${currentAvatarBase64 || user.avatar_url}"
          x="${centerX - avatarSize / 2}"
          y="${centerY - avatarSize * 1.5}"
          width="${avatarSize}"
          height="${avatarSize}"
          clip-path="url(#avatarClip)"
          style="filter: ${AVATAR_FILTERS[avatarFilter].filter};"
        />

        <!-- Avatar border circle with GitHub Universe green -->
        <circle 
          ${isStatic ? "" : 'class="avatar-border"'}
          cx="${centerX}" 
          cy="${centerY - avatarSize * 1.0}" 
          r="${avatarSize / 2 + 5 * scale}" 
          fill="none" 
          stroke="${avatarBorderColor}" 
          stroke-width="${6 * scale}"
        />

        <!-- Username centered -->
        <text 
          ${isStatic ? "" : 'class="username"'}
          x="${centerX}" 
          y="${centerY - avatarSize * 0.2}" 
          font-family="'Mona Sans', system-ui, sans-serif" 
          font-size="${fontSize}" 
          font-weight="600" 
          fill="${textColor}" 
          text-anchor="middle"
          letter-spacing="2"
        >${user.name || user.login}</text>

        <!-- GitHub handle centered with monospace -->
        <text 
          ${isStatic ? "" : 'class="username"'}
          x="${centerX}" 
          y="${centerY - avatarSize * 0.2 + fontSize * 0.9}" 
          font-family="'Mona Sans', system-ui, sans-serif" 
          font-size="${smallFontSize}" 
          fill="${handleColor}" 
          opacity="0.95" 
          text-anchor="middle"
          letter-spacing="1"
        >@${user.login}</text>

        <!-- Stats centered with GitHub Universe styling -->
        <text 
          ${isStatic ? "" : 'class="stats"'}
          x="${centerX}" 
          y="${centerY + avatarSize * 0.2 + fontSize * 0.9 + smallFontSize * 2.5
      }" 
          font-family="'Mona Sans', system-ui, sans-serif" 
          font-size="${smallFontSize * 0.75}" 
          fill="${textColor}" 
          opacity="0.9" 
          text-anchor="middle"
          letter-spacing="1.5"
        >${user.followers.toLocaleString()} FOLLOWERS · ${user.public_repos.toLocaleString()} REPOS${contributions
        ? " · " +
        contributions.totalContributions.toLocaleString() +
        " CONTRIBUTIONS"
        : ""
      }</text>
        
        ${contributionSquares
        ? `
        <!-- Contribution Graph -->
        ${contributionSquares}
        <text 
          x="${centerX}" 
          y="${graphY + 7 * (cellSize + cellGap) + 30 * scale}" 
          font-family="'Monaspace Neon', monospace, Arial, sans-serif" 
          font-size="${smallFontSize * 0.5}" 
          fill="${handleColor}" 
          opacity="1" 
          letter-spacing="2"
          text-anchor="middle"
        >${contributions?.totalContributions.toLocaleString() || 0
        } CONTRIBUTIONS IN ${contributionYearText}</text>
        `
        : ""
      }
        
        <!-- GitHub Universe branding -->
        <text
          x="${centerX}"
          y="${height - 80 * scale}"
          font-family="'Monaspace Neon', monospace, Arial, sans-serif"
          font-size="${smallFontSize * 0.5}"
          fill="${handleColor}"
          opacity="1"
          text-anchor="middle"
          letter-spacing="2"
          text-transform="uppercase"
        >GITHUB UNIVERSE · OCTOCANVAS</text>
      </svg>
    `;
  };

  /**
   * Convert SVG to PNG blob (for clipboard or download)
   * Reusable function for both download and share operations
   */
  const copyToClipboard = async (
    sizeKey: SizeKey = "desktop"
  ): Promise<Blob> => {
    const size = SIZES[sizeKey];

    // Ensure avatar is loaded as base64 (use ref to get current value)
    const currentAvatarBase64 = avatarBase64Ref.current;
    if (!currentAvatarBase64) {
      throw new Error("Avatar not loaded yet");
    }

    const svgString = generateSVG(size.width, size.height, true); // true = static version

    // Create canvas for PNG conversion
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: false });

    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    // Encode SVG string properly for data URL
    const encodedSvg = encodeURIComponent(svgString)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");

    const dataUrl = `data:image/svg+xml,${encodedSvg}`;

    // Create image and wait for it to load
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Image load timeout after 10 seconds"));
      }, 10000); // 10 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        resolve();
      };

      img.onerror = (e) => {
        clearTimeout(timeout);
        console.error("Failed to load SVG image:", e);
        reject(new Error("Failed to load SVG image"));
      };

      img.src = dataUrl;
    });

    // Draw the SVG image onto canvas
    ctx.drawImage(img, 0, 0);

    // Convert canvas to PNG blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Failed to create blob from canvas"));
        },
        "image/png",
        1.0
      );
    });

    return blob;
  };

  /**
   * Convert SVG to PNG and trigger download
   * This is fully client-side using Canvas API
   */
  const downloadWallpaper = async (sizeKey: SizeKey) => {
    setDownloadingSize(sizeKey);

    try {
      const blob = await copyToClipboard(sizeKey);

      const pngUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `github-wallpaper-${user.login}-${sizeKey}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(pngUrl);
      }, 100);

      console.log(`Successfully downloaded ${sizeKey} wallpaper`);
    } catch (error) {
      console.error("Error downloading wallpaper:", error);
      alert(
        `Failed to download wallpaper: ${error instanceof Error ? error.message : "Unknown error"
        }\n\nPlease check the browser console for more details.`
      );
    } finally {
      setDownloadingSize(null);
    }
  };

  /**
   * Share wallpaper to Twitter/X
   * Copies desktop wallpaper to clipboard and opens Twitter with pre-filled text
   */
  const handleTwitterShare = async () => {
    // Check if avatar is loaded before proceeding
    // Use ref to get current value (not closure value)
    const currentAvatarBase64 = avatarBase64Ref.current;
    if (!currentAvatarBase64) {
      alert(
        "⏳ Please wait - your avatar is still loading. Try again in a moment!"
      );
      return;
    }

    try {
      // Copy wallpaper to clipboard first
      const blob = await copyToClipboard("desktop");

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      // Show success message
      alert(
        "✅ Wallpaper copied to clipboard! You can now paste it in your tweet."
      );

      // Open Twitter with pre-filled text
      const tweetText = SHARE_POST_TEXT;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweetText
      )}`;

      window.open(
        twitterUrl,
        "twitter-share-dialog",
        "width=626,height=436,toolbar=0,menubar=0,location=0,status=0"
      );
    } catch (error) {
      console.error("Error sharing to Twitter:", error);
      alert(
        "Failed to copy wallpaper to clipboard. Please download it manually and attach to your tweet."
      );

      // Still open Twitter even if clipboard fails
      const tweetText = SHARE_POST_TEXT;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweetText
      )}`;
      window.open(twitterUrl, "twitter-share-dialog", "width=626,height=436");
    }
  };

  /**
   * Share wallpaper to Bluesky
   * Copies desktop wallpaper to clipboard and opens Bluesky with pre-filled text
   */
  const handleBlueskyShare = async () => {
    const currentAvatarBase64 = avatarBase64Ref.current;
    if (!currentAvatarBase64) {
      alert(
        "⏳ Please wait - your avatar is still loading. Try again in a moment!"
      );
      return;
    }

    const postText = SHARE_POST_TEXT;
    const blueskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(
      postText
    )}`;

    try {
      const blob = await copyToClipboard("desktop");

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      alert(
        "✅ Wallpaper copied to clipboard! You can now paste it in your Bluesky post."
      );

      window.open(
        blueskyUrl,
        "bluesky-share-dialog",
        "width=626,height=600,toolbar=0,menubar=0,location=0,status=0"
      );
    } catch (error) {
      console.error("Error sharing to Bluesky:", error);
      alert(
        "Failed to copy wallpaper to clipboard. Please download it manually and attach to your post."
      );

      window.open(blueskyUrl, "bluesky-share-dialog", "width=626,height=600");
    }
  };

  /**
   * Share wallpaper to Threads
   * Copies desktop wallpaper to clipboard and opens Threads with pre-filled text
   */
  const handleThreadsShare = async () => {
    const currentAvatarBase64 = avatarBase64Ref.current;
    if (!currentAvatarBase64) {
      alert(
        "⏳ Please wait - your avatar is still loading. Try again in a moment!"
      );
      return;
    }

    const postText = SHARE_POST_TEXT;
    const threadsUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(
      postText
    )}`;

    try {
      const blob = await copyToClipboard("desktop");

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      alert(
        "✅ Wallpaper copied to clipboard! You can now paste it in your Threads post."
      );

      window.open(
        threadsUrl,
        "threads-share-dialog",
        "width=626,height=600,toolbar=0,menubar=0,location=0,status=0"
      );
    } catch (error) {
      console.error("Error sharing to Threads:", error);
      alert(
        "Failed to copy wallpaper to clipboard. Please download it manually and attach to your post."
      );

      window.open(threadsUrl, "threads-share-dialog", "width=626,height=600");
    }
  };

  /**
   * Share wallpaper to Instagram
   * Copies desktop wallpaper to clipboard and shows instructions for Instagram app
   */
  const handleInstagramShare = async () => {
    const currentAvatarBase64 = avatarBase64Ref.current;
    if (!currentAvatarBase64) {
      alert(
        "⏳ Please wait - your avatar is still loading. Try again in a moment!"
      );
      return;
    }

    try {
      const blob = await copyToClipboard("desktop");

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      alert(
        "✅ Wallpaper copied to clipboard!\n\n📱 To share on Instagram:\n1. Open the Instagram app on your device\n2. Tap the + button to create a new post\n3. Paste the image from your clipboard\n4. Add your caption and share!"
      );

      // Try to open Instagram app (works on mobile devices)
      window.location.href = "instagram://library";

      // Fallback to web after a delay (if app doesn't open)
      setTimeout(() => {
        window.open(
          "https://www.instagram.com/",
          "instagram-share",
          "width=626,height=600"
        );
      }, 1500);
    } catch (error) {
      console.error("Error sharing to Instagram:", error);
      alert(
        "Failed to copy wallpaper to clipboard. Please download it manually and upload to Instagram."
      );

      // Still try to open Instagram
      window.location.href = "instagram://library";
      setTimeout(() => {
        window.open(
          "https://www.instagram.com/",
          "instagram-share",
          "width=626,height=600"
        );
      }, 1500);
    }
  };

  // Generate responsive preview SVG based on screen size
  // Mobile: show mobile wallpaper (1170x2532 scaled to 585x1266)
  // Desktop: show desktop wallpaper (1280x720)
  const previewSVG = isMobile
    ? generateSVG(585, 1266) // Mobile wallpaper aspect ratio, scaled down
    : generateSVG(1280, 720); // Desktop wallpaper

  // Show loading state while avatar is being converted
  if (!avatarBase64) {
    return (
      <div className={sharedStyles.SharedLoadingContainer}>
        <div className={styles.LoadingContent}>
          <p className={sharedStyles.SharedLoadingText}>Loading avatar...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={sharedStyles.SharedPreviewBox}>
        <h2 className={sharedStyles.SharedPreviewTitle}>Your Wallpaper</h2>

        {/* SVG Preview with GitHub Universe border and animated background */}
        <div className={styles.PreviewContainer}>
          {/* SVG Preview on top - with proper aspect ratio */}
          <div
            className={styles.PreviewContainer}
            style={{
              maxHeight: isMobile ? "70vh" : "500px",
              maxWidth: "100%",
              aspectRatio: isMobile ? "9/19.5" : "16/9",
            }}
          >
            <div
              className={styles.SVGContainer}
              dangerouslySetInnerHTML={{ __html: previewSVG }}
            />
          </div>
        </div>
      </div>
    </>
  );
});

WallpaperGenerator.displayName = "WallpaperGenerator";

export default WallpaperGenerator;
