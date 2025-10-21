# OctoCanvas - Custom Instructions

## Project Overview
OctoCanvas is a GitHub-themed application that creates two types of collectibles based on GitHub user profiles:
1. **Wallpaper Generator**: Personalized wallpapers with contribution graphs
2. **Devémon Card**: Trading card-style collectibles with GitHub stats and rarity system

Built with Astro, Preact, TypeScript, and Tailwind CSS.

## Design Systems

### GitHub Universe Theme (Wallpaper Generator)
- **Primary Color**: `#5fed83` (Universe Green)
- **Secondary Colors**: 
  - `#08872B` (Dark Green)
  - `#bfffd1` (Light Green)
  - `#dcff96` (Pale Green)
  - `#1a7f37` (Medium Green)
- **Typography**: 
  - Font: Monaspace Neon (monospace)
  - Letter spacing: 2px
  - All uppercase for headers and labels
- **Effects**: 
  - Box shadows with 0.5px/-0.5px offsets
  - Gradient borders
  - Glow effects on hover

### GitHub Primer Colors (Devémon Card)
- **Green**: `#7ee787` (success, grass type)
- **Blue**: `#58a6ff` (water type)
- **Purple**: `#bc8cff` (psychic type)
- **Orange**: `#ffa657` (fire type)
- **Red**: `#ff7b72` (danger, dragon type)
- **Gray**: `#7d8590` (neutral, muted text)

### Color Palette (Tailwind Config)
```
universe-green: #5fed83
universe-green-light: #bfffd1
universe-green-hover: #4dd46e
universe-green-dark: #08872B
universe-green-border: #a8e6c5
universe-black: #0a0e0d
universe-dark-bg: #101411
universe-dark-surface: #1c201e
universe-dark-border: #2d3330
universe-gray-muted: #8b918f
```

## Core Features

### Feature 1: Wallpaper Generator

#### GitHub Profile Integration
- Fetches user data via GitHub API
- Displays:
  - Avatar (with CORS-safe base64 conversion)
  - Username and display name
  - Follower count
  - Repository count
  - **Total contributions** (accurate count from last 12 months)
  - Bio (if available)

#### Contribution Graph
- **Data Source**: Fetches contribution data via API (`https://contributions-api.me-5bd.workers.dev/?username=${encodeURIComponent(username)}`)
- **Visualization**: 
  - 53-week calendar (last year)
  - Color intensity based on contribution count:
    - 0 contributions: `#101411` (dark, 0.3 opacity)
    - 1-2 contributions: `#dcff96` (pale green, 0.35 opacity)
    - 2-5 contributions: `#bfffd1` (light green, 0.5 opacity)
    - 5-10 contributions: `#8cf2a6` (medium green, 0.6 opacity)
    - 10-15 contributions: `#5fed83` (bright green, 0.8 opacity)
    - 15+ contributions: `#5fed83` (bright green, 1.0 opacity)
  - Cell size: 12px (scaled), gap: 3px (scaled)
  - Properly centered on wallpaper

#### Wallpaper Sizes & Export
- **SVG-based**: Vector graphics with responsive scaling
- **Three Sizes**:
  - Desktop: 2560×1440 (16:9)
  - Mobile: 1170×2532 (portrait)
  - Badge: 320×240 (landscape)
- **Export**: PNG format via Canvas API
- **Content**:
  - Centered avatar with green border
  - User stats (followers, repos, contributions)
  - Contribution graph at bottom
  - Decorative floating circles
  - GitHub Universe branding

#### Animated Preview
- **AnimatedBackground Component**: 
  - 50 particles with random positions and velocities
  - Radial gradient circles (Universe Green)
  - Gentle floating animation
  - 0.4 opacity for subtle effect
  - Visible in black areas around wallpaper preview
- **SVG Animations** (preview only, not in downloads):
  - Pulsing glow on avatar border (3s cycle)
  - Floating decorative circles (6s cycle, staggered delays)
  - Fade-in animations on text and contribution squares
  - Smooth entrance effects
- **Responsive Preview**:
  - Mobile (<768px): Shows portrait wallpaper (9:19.5 aspect ratio)
  - Desktop (≥768px): Shows landscape wallpaper (16:9 aspect ratio)
  - Auto-adjusts on window resize

### Feature 2: Devémon Card (Trading Card System)

#### Card Formats
- **Card Format**: 350×550px (portrait, 7:11 aspect ratio)
  - Holographic border effect
  - Avatar at top center (96×96px)
  - Stats displayed below avatar
  - Power calculation shown
  - Rarity badge
  - Type indicator with icon
  - "Available for Hire" badge (optional)
  
- **Badge Format**: 320×240px (landscape, 4:3 aspect ratio)
  - Compact horizontal layout
  - Avatar left side (80×80px)
  - Stats in center column
  - Contribution graph visualization
  - Rarity indicator
  - "Available for Hire" badge (optional, bottom placement)

#### Rarity System
Power is calculated based on GitHub stats:
```
power = (followers × 10) + (repos × 5) + (totalContributions × 0.1)
```

Rarity levels based on power thresholds:
1. **Common** (0-99): Gray (`#7d8590`) - "Normal" type, ⭐
2. **Uncommon** (100-499): Green (`#7ee787`) - "Grass" type, ⭐⭐
3. **Rare** (500-999): Blue (`#58a6ff`) - "Water" type, ⭐⭐⭐
4. **Epic** (1000-4999): Purple (`#bc8cff`) - "Psychic" type, 🌟
5. **Legendary** (5000-9999): Orange (`#ffa657`) - "Fire" type, 🌟🌟
6. **Mythical** (10000+): Red (`#ff7b72`) - "Dragon" type, 🌟🌟🌟

#### Available for Hire Badge
- **Toggle**: Checkbox control to enable/disable badge
- **Display**: 
  - Card format: "💼 OPEN TO WORK" badge below avatar
  - Badge format: "💼 OPEN TO WORK" badge at bottom of layout
- **Styling**: 
  - Green background (`#7ee787`)
  - Dark text for contrast
  - Small font size (9px for badge format)
  - Rounded corners with padding
  - Inline CSS for html2canvas compatibility

#### Data Sources
- **GitHub REST API**: User profile, follower count, public repos
- **Contributions API**: `https://contributions-api.me-5bd.workers.dev/?username=${username}`
  - Returns structured JSON with total contributions
  - More reliable than HTML scraping
  - Provides last 12 months of data

#### Export Technology
- **html2canvas**: Captures card/badge as PNG
  - Scale: 3 (for high resolution)
  - backgroundColor: null (transparent)
  - useCORS: true (for avatar images)
- **Important**: Elements must be inside the ref container to be captured
- **Styling**: Inline CSS styles work better than Tailwind classes

#### Technical Gotchas
1. **Badge Positioning**: Must be inside flex-col container with h-full for proper capture
2. **Text Sizing**: Badge format uses very small text (9-10px) due to space constraints
3. **Avatar Loading**: Requires CORS proxy or proper headers
4. **Contribution Graph**: Must use API instead of scraping for reliability
5. **Color Consistency**: Use GitHub Primer colors for authentic look

### Mobile Responsiveness
- **Header**: Scales from 4xl → 6xl → 8xl
- **Padding**: Responsive (px-3 sm:px-4, py-4 sm:py-8)
- **Profile Card**: 
  - Avatar: 80px → 96px → 128px
  - Stats centered on mobile, left-aligned on desktop
  - Flexible text wrapping
- **Wallpaper Preview**:
  - Portrait mode on mobile (9:19.5 ratio)
  - Landscape on desktop (16:9 ratio)
  - Particles contained properly
- **Buttons**: 2-column grid on tablets, 3-column on desktop
- **Typography**: Scales appropriately (text-xs sm:text-sm md:text-base)
- **Devémon Cards**: Stack vertically on mobile, side-by-side on desktop

### Fixed Issues
- Avatar CORS issue → Base64 conversion before SVG embedding
- Contribution count inaccuracy → API instead of HTML parsing
- Preview centering → Flexbox and proper calculations
- Contribution graph centering → actualGraphWidth calculation
- Emoji rendering → Proper Unicode characters
- Download wallpapers missing content → Static SVG generation (no animation classes)
- Mobile preview showing desktop → Responsive SVG generation
- Animated background stretched → Proper aspect ratio containers
- Badge cutoff on download → Proper positioning inside capture container
- "Available for Hire" badge not visible → Moved inside flex-col container


## Technical Architecture

### Component Structure
```
src/
├── components/
│   ├── AnimatedBackground.tsx - Canvas particle animation
│   ├── DevemonCard.tsx - Trading card component with rarity system
│   ├── GitHubPreviewCard.tsx - Profile preview with stats
│   ├── GitHubWallpaperApp.tsx - Main app logic and data fetching
│   └── WallpaperGenerator.tsx - SVG generation and export
└── pages/
    └── index.astro - Landing page
```

### Key Functions

#### WallpaperGenerator: `generateSVG(width, height, isStatic)`
- Creates SVG wallpaper at specified dimensions
- `isStatic = true`: Removes animation classes for clean PNG export
- `isStatic = false`: Includes CSS animations for preview
- Uses base64 avatar to avoid CORS issues
- Properly centers all elements

#### WallpaperGenerator: `fetchContributionData(username)`
- Fetches from contributions API
- Returns structured JSON with:
  - Total contributions count
  - Daily contribution data
  - Week-by-week breakdown
- Builds 53-week calendar with accurate counts

#### WallpaperGenerator: `downloadWallpaper(sizeKey)`
- Generates static SVG (no animations)
- Converts to PNG via Canvas API
- Triggers browser download

#### DevemonCard: `calculatePower(userData, contributionData)`
- Formula: `(followers × 10) + (repos × 5) + (totalContributions × 0.1)`
- Returns power value and rarity object
- Rarity object contains: level, color, type, stars

#### DevemonCard: `getRarity(power)`
- Maps power value to rarity tier
- Returns: { level, color, type, stars }
- 6 tiers from Common (0-99) to Mythical (10000+)

#### DevemonCard: `downloadCard()` / `downloadBadge()`
- Uses html2canvas to capture card/badge
- Scale: 3 for high resolution
- Downloads as PNG with username in filename
- Must capture elements inside ref container

#### DevemonCard: Contribution Graph Rendering
- Displays last 52 weeks of contributions
- Color intensity based on contribution count
- Uses GitHub Primer green (#7ee787) with varying opacity
- Week labels and month labels for context


## Deployment

### GitHub Actions Workflow
- **Main Branch**: Auto-deploys to GitHub Pages (production)
- **Prototype Branch**: Builds but doesn't auto-deploy (safe testing)
- **Manual Deploy**: Can deploy any branch via workflow_dispatch
- **Base Path**: `/octocanvas`

### Configuration
```javascript
// astro.config.mjs
base: '/octocanvas'
```

## User Experience Flow

### Wallpaper Generator Flow
1. Enter GitHub username
2. View profile preview with stats and contribution graph
3. Preview wallpaper with animated particles (responsive to device)
4. Download wallpaper in desired size (Desktop/Mobile/Badge)

### Devémon Card Flow
1. Enter GitHub username
2. View profile data loading
3. System calculates power and assigns rarity
4. Preview card format (350×550px portrait)
5. Preview badge format (320×240px landscape)
6. Toggle "Available for Hire" badge (optional)
7. Download card or badge as PNG

## Best Practices
- ✅ All GitHub Universe styling applied consistently to wallpapers
- ✅ GitHub Primer colors used for Devémon Cards
- ✅ Monospace font (Monaspace Neon) for wallpaper generator
- ✅ Uppercase text for wallpaper headers and labels
- ✅ Box shadows with offset for depth
- ✅ Responsive design for mobile/tablet/desktop
- ✅ Accessible color contrast
- ✅ Smooth animations (60 FPS)
- ✅ Client-side processing (no backend required)
- ✅ CORS-safe asset handling
- ✅ Static wallpapers (no animations in exports)
- ✅ High-resolution exports (3× scale for cards/badges)
- ✅ Inline CSS for html2canvas compatibility

## Future Enhancements (Ideas)
- [ ] Theme customization (color palettes)
- [ ] Additional wallpaper layouts
- [ ] Social sharing functionality
- [ ] Multiple profile comparison
- [ ] Animated GIF export option
- [ ] Custom quotes/text overlay
- [ ] Achievement badges integration
- [ ] Dark/light mode toggle
- [ ] Export to multiple formats (WebP, AVIF)
- [ ] Card battle system (compare stats)
- [ ] Leaderboard by power/rarity
- [ ] Team cards (organization-based)
- [ ] Evolution system (track progress over time)

## Dependencies
- **Astro**: Static site framework
- **Preact**: Lightweight React alternative for UI components
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **html2canvas**: Client-side screenshot library for card exports
- **Monaspace Neon**: Monospace font for retro-tech aesthetic

## APIs
- **GitHub REST API**: `https://api.github.com/users/{username}`
  - User profile data
  - Follower count
  - Public repository count
  
- **Contributions API**: `https://contributions-api.me-5bd.workers.dev/?username={username}`
  - Total contributions (last 12 months)
  - Daily contribution data
  - Structured JSON response

## Project Links
- Repository: github.com/jldeen/octocanvas
- Deployment: GitHub Pages
- Main Branch: Production
- Prototype Branch: Testing/Development

## Development Notes

### Running Locally
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```

### Deployment
- **Main Branch**: Auto-deploys to GitHub Pages (production)
- **Prototype Branch**: Builds but doesn't auto-deploy (safe testing)
- **Manual Deploy**: Can deploy any branch via workflow_dispatch
- **Base Path**: `/octocanvas`

### Configuration
```javascript
// astro.config.mjs
base: '/octocanvas'
```

