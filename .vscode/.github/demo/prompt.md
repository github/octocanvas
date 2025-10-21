I want to build a GitHub-themed collectible generator web app called "OctoCanvas" that creates personalized wallpapers and trading card-style profile cards based on GitHub user profiles.

**Core Requirements:**

1. **Design System:**
   - Use GitHub Universe theme with official GitHub Primer colors:
     * Success green: #7ee787
     * Accent blue: #58a6ff
     * Done purple: #bc8cff
     * Severe orange: #ffa657
     * Danger red: #ff7b72
     * Gray: #7d8590
   - Typography: Monaspace Neon monospace font
   - All headers and labels should be uppercase
   - Box shadows for depth
   - Holographic, prismatic design elements for cards

2. **Tech Stack:**
   - Framework: Astro
   - UI Components: Preact
   - Styling: Tailwind CSS with custom GitHub Universe theme colors
   - Export: html2canvas for card images
   - API: GitHub REST API for user data and repos
   - Contributions API: https://contributions-api.me-5bd.workers.dev/?username={username}

3. **GitHub Profile Integration:**
   - Fetch user data via GitHub REST API (avatar, username, name, followers, public_repos, created_at, bio)
   - Get accurate total contributions from contributions API (structured JSON with total_contributions and weekly breakdown)
   - Fetch repository data for extended stats (total stars, total forks, top 3 languages)
   - Display contribution calendar with proper date handling and null checks
   - IMPORTANT: Parse contributions API response structure:
     ```json
     {
       "total_contributions": number,
       "weeks": [{
         "contribution_days": [{
           "date": "YYYY-MM-DD",
           "count": number
         }]
       }]
     }
     ```

4. **Wallpaper Generator:**
   - Create SVG-based wallpapers in three sizes:
     * Desktop: 2560×1440 (16:9)
     * Mobile: 1170×2532 (portrait)
     * Small: 320×240
   - Include: centered avatar with green border, user stats, contribution graph, decorative floating circles
   - Export as PNG using Canvas API
   - Generate static SVG for clean PNG export (no animations in download)

5. **Devémon Card Feature (Trading Card):**
   - Pokemon/Baseball card style GitHub profile display
   - Two formats:
     * Card: 350×550px portrait (full card view)
     * Badge: 320×240px landscape (compact badge view)
   - Card components:
     * Header: Name, @username, rarity badge
     * Avatar: Centered with holographic glow effect (border color matches rarity)
     * Stats grid: Repositories, Followers, Stars, Forks (2×2 grid on card, 1×3 on badge)
     * Contributions: Total contributions displayed
     * Languages: Top 3 languages as badges
     * Footer: "Developer since {date}"
     * Optional: "Available for Hire" badge (toggle-able)
   - Rarity system based on power level calculation:
     * Formula: (followers × 2) + (repos × 1) + (contributions × 0.1) + (stars × 3) + (forks × 2)
     * Levels:
       - Common: < 100 (Gray #7d8590)
       - Uncommon: 100-299 (Green #7ee787)
       - Rare: 300-799 (Blue #58a6ff)
       - Epic: 800-1999 (Purple #bc8cff)
       - Legendary: 2000-4999 (Orange #ffa657)
       - Mythical: 5000+ (Red #ff7b72)
   - Badge layout (320×240px):
     * Horizontal layout: Avatar (72×72px) on left, info on right
     * Centered name/username/rarity at top
     * Compact 3-column stats grid
     * Languages centered at bottom
     * "Available for Hire" badge at very bottom (if enabled)
   - Download options: Separate buttons for card and badge formats
   - Toggle: "Available for Hire" checkbox to display hiring status badge

6. **Generation Type Selector:**
   - Toggle between two generation modes:
     * Wallpaper: Classic SVG wallpaper with contribution graph
     * Devémon Card: Trading card style profile display
   - UI: Radio-style button toggle before username input

7. **Key Technical Solutions:**
   - Use contributions API (contributions-api.me-5bd.workers.dev) for structured contribution data
   - Parse API response correctly with safety checks for undefined days
   - Fetch extended stats from GitHub repos API to calculate total stars/forks and get languages
   - Calculate top 3 languages by sorting repos by size
   - For badge downloads: Use inline CSS styles for better html2canvas compatibility
   - Text sizing for compact spaces:
     * Badge name: 12px (with word-break for long names)
     * Card name: 20px (text-xl)
     * Stats labels: 8-11px depending on format
     * Stats numbers: 14-18px depending on format
   - "Available for Hire" positioning:
     * Card: Below avatar with "💼 OPEN TO WORK" text
     * Badge: At bottom of layout (inside flex-col container for proper download)
   - Proper div structure for html2canvas capture:
     * Badge must have all content inside the main flex-col container
     * Use overflow-visible on outer container for shadows
     * Keep content within 320×240px bounds

8. **Mobile Responsiveness:**
   - Responsive preview: show portrait wallpaper on mobile (<768px), landscape on desktop
   - Use Tailwind responsive classes throughout (sm:, md: breakpoints)
   - Scale padding, text sizes, avatars, and grid layouts appropriately
   - Card display centered and properly sized on all devices

9. **User Flow:**
   - Select generation type (Wallpaper or Devémon Card)
   - Input: GitHub username
   - Preview: Profile data loads and displays chosen format
   - Toggle: Enable/disable "Available for Hire" badge (for cards)
   - Actions: 
     * Wallpaper: Download in 3 sizes
     * Devémon Card: Download as Card or Badge format
   - All downloads use html2canvas with scale: 3 for high quality

10. **Deployment:**
    - Deploy to GitHub Pages with base path
    - GitHub Actions workflow that auto-deploys main branch
    - Support prototype/test branches without auto-deploy

11. **Important Implementation Details:**
   - Always check for undefined/null in contribution data (some weeks may have < 7 days)
   - Use safety checks: `contributionDays[Math.min(dayIndex, contributionDays.length - 1)]`
   - For badge text cutoff issues: Use smaller fonts and proper padding
   - For name wrapping: Set wordBreak, overflowWrap, and hyphens CSS properties
   - Badge container structure must be: fixed container → rounded-xl → flex-col (with h-full) → content
   - "Available for Hire" badge must be inside the flex-col container, not outside
   - All rarity colors should use GitHub Primer color palette
   - Avatar glow effect should use rarity color with blur and opacity

Please build this step by step, ensuring the Devémon Card feature works alongside the wallpaper generator, all downloads capture properly with html2canvas, mobile responsiveness is perfect, and the GitHub Universe design theme with Primer colors is applied consistently throughout.