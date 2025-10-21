# OctoCanvas Part 1: Core Site + Wallpaper Generator

I want to build a GitHub-themed wallpaper generator web app called "OctoCanvas" that creates personalized wallpapers based on GitHub user profiles.

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
   - Consistent GitHub Universe aesthetic throughout

2. **Tech Stack:**
   - Framework: Astro v5.14+
   - UI Components: Preact
   - Styling: Tailwind CSS with custom GitHub Universe theme colors
   - Export: Canvas API for wallpaper images
   - API: GitHub REST API for user data
   - Contributions API: https://contributions-api.me-5bd.workers.dev/?username={username}

3. **GitHub Profile Integration:**
   - Fetch user data via GitHub REST API:
     * Avatar URL
     * Username
     * Display name
     * Follower count
     * Public repository count
     * Account creation date
     * Bio
   - Get accurate total contributions from contributions API (structured JSON with total_contributions and weekly breakdown)
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
   - Always check for undefined/null in contribution data (some weeks may have < 7 days)
   - Use safety checks: `contributionDays[Math.min(dayIndex, contributionDays.length - 1)]`

4. **Wallpaper Generator:**
   - Create SVG-based wallpapers in three sizes:
     * Desktop: 2560×1440 (16:9 landscape)
     * Mobile: 1170×2532 (portrait)
     * Badge: 320×240 (small thumbnail)
   - Wallpaper components:
     * Centered avatar with green border glow
     * User stats (followers, repos, contributions)
     * Contribution graph (last 52 weeks with color intensity)
     * Decorative floating circles/particles
     * GitHub Universe gradient background
   - Export as PNG using Canvas API
   - Generate static SVG for clean PNG export (no animations in download)
   - Download functionality with proper filename: `{username}-wallpaper-{size}.png`

5. **User Interface:**
   - Clean, centered layout with GitHub Universe theme
   - Input form:
     * GitHub username text input
     * Submit/Generate button
   - Preview section:
     * Profile data card showing avatar, name, stats
     * Live wallpaper preview
   - Action buttons:
     * Download Desktop (2560×1440)
     * Download Mobile (1170×2532)
     * Download Badge (320×240)
   - Loading states while fetching data
   - Error handling for invalid usernames

6. **Mobile Responsiveness:**
   - Responsive preview: show portrait wallpaper on mobile (<768px), landscape on desktop
   - Use Tailwind responsive classes throughout (sm:, md:, lg: breakpoints)
   - Scale padding, text sizes, avatars, and grid layouts appropriately
   - Touch-friendly buttons and inputs
   - Proper viewport meta tags

7. **Key Technical Implementation:**
   - SVG generation with proper namespace and attributes
   - Convert SVG to Canvas, then to PNG blob
   - Use FileReader or URL.createObjectURL for downloads
   - Contribution graph rendering:
     * 7 rows (days of week) × 52 columns (weeks)
     * Color intensity based on contribution count
     * Proper spacing and sizing
   - Avatar loading with CORS support (use proxy if needed)
   - Responsive font sizing and element positioning in SVG

8. **Project Structure:**
   - `/src/components/GitHubWallpaperApp.tsx` - Main app component with form & state
   - `/src/components/GitHubPreviewCard.tsx` - User profile preview card
   - `/src/components/WallpaperGenerator.tsx` - SVG generation & PNG export
   - `/src/components/AnimatedBackground.tsx` - Canvas particle animation (optional)
   - `/src/pages/index.astro` - Landing page
   - `tailwind.config.mjs` - Custom GitHub Universe theme colors
   - `astro.config.mjs` - Astro configuration

9. **Deployment:**
   - Deploy to GitHub Pages with base path configuration
   - GitHub Actions workflow for automatic deployment from main branch
   - Support for development/prototype branches
   - Proper asset handling and build optimization

10. **User Flow:**
    1. User lands on homepage with centered input form
    2. User enters GitHub username
    3. App fetches profile data from GitHub API
    4. App fetches contributions from contributions API
    5. Preview card displays with user info
    6. Wallpaper previews generate in selected size
    7. User clicks download button for desired size
    8. PNG file downloads with appropriate filename

**Extensibility Note:**
Structure the code to allow for easy addition of new generator types (cards, banners, etc.) in the future. Use TypeScript interfaces for GitHub data types and keep components modular.

Please build this with clean, well-documented code, proper error handling, and a polished user experience that matches GitHub's design aesthetic.
