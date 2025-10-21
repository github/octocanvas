I want to build a GitHub-themed web app called "OCTOCANVAS" that creates personalized wallpapers based on GitHub user profiles.

**Core Requirements:**

1. **Design System:**
   - Use GitHub Universe 2025 theme with primary color #5fed83 (green)
   - Typography: Monaspace Neon monospace font
   - All headers and labels should be uppercase with 2px letter spacing
   - Box shadows with 0.5px/-0.5px offsets for depth
   - Glassmorphic, holographic design elements

2. **Tech Stack:**
   - Framework: Astro
   - UI Components: Preact
   - Styling: Tailwind CSS
   - Animations: Framer Motion
   - Export: html2canvas

3. **GitHub Profile Integration:**
   - Fetch user data via GitHub API (avatar, username, followers, repos, bio)
   - Fetch contribution data via special API: `https://contributions-api.me-5bd.workers.dev/?username=timrogers`, replacing `timrogers` with the inputted username
   - Display contribution calendar (52 weeks, colors returned in the contribution API)
   - Convert avatar to base64 to avoid CORS issues during PNG export
   - Always check for undefined/null in contribution data (some weeks may have < 7 days)

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
   - Use Tailwind responsive classes throughout (sm:, md: breakpoints)
   - Scale padding, text sizes, avatars, and grid layouts appropriately
   - Detect screen size with isMobile state and resize listener
   - Touch-friendly buttons and inputs
   - Proper viewport meta tags

7. **Key Technical Solutions:**
   - SVG generation with proper namespace and attributes
   - Convert SVG to Canvas, then to PNG blob
   - Use FileReader or URL.createObjectURL for downloads
   - Contribution graph rendering:
     * 7 rows (days of week) × 52 columns (weeks)
     * Color intensity based on contribution count
     * Proper spacing and sizing
   - Avatar loading with CORS support (use proxy if needed)
   - Responsive font sizing and element positioning in SVG

9. **User Flow:**
    1. User lands on homepage with centered input form
    2. User enters GitHub username
    3. App fetches profile data from GitHub API
    4. App fetches contributions from contributions API
    5. Preview card displays with user info
    6. Wallpaper previews generate in selected size
    7. User clicks download button for desired size
    8. PNG file downloads with appropriate filename

10. **Deployment:**
    - Deploy to GitHub Pages with base path
    - GitHub Actions workflow that auto-deploys main branch
    - Support prototype/test branches without auto-deploy

**Extensibility Note:**
Structure the code to allow for easy addition of new generator types (cards, banners, etc.) in the future. Use TypeScript interfaces for GitHub data types and keep components modular.

Build this step by step. 

Before finishing, ensure that:

* All animations work in preview, but are removed when downloading
* There is sufficient spacing between elements, so the UI looks clean and spacious, not cramped
* Mobile responsiveness is perfect
* The GitHub Universe design theme is applied consistently throughout

Use Playwright to validate that the download button works correctly, downloading the image, and does not return or display an error.
