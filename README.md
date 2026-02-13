# kushmanmb 🎨

A static web application that creates GitHub-themed collectibles from GitHub profiles. Build custom wallpapers, generate profile README banners with avatar art styles, and create trading card-style Devémon Cards with rarity systems. Built with Astro, Preact, TypeScript, and Tailwind CSS—fully client-side and deployable to GitHub Pages.

![Astro](https://img.shields.io/badge/Astro-5.14-blueviolet)
![Preact](https://img.shields.io/badge/Preact-10.24-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

### 🖼️ Wallpaper Generator
- 🔍 **GitHub Profile Lookup**: Enter any GitHub username to fetch public profile data
- 👀 **Live Preview**: See a preview card with avatar, name, followers, and repository count
- 📊 **Contribution Graph**: Displays last 52 weeks of contributions with color intensity
- 🎨 **SVG Wallpaper Generation**: Dynamically generated SVG wallpapers with GitHub Universe theme
- 📱 **Multiple Sizes**: Export wallpapers in three sizes:
  - **Desktop**: 2560×1440 (ideal for monitors)
  - **Mobile**: 1170×2532 (ideal for modern smartphones)
  - **Badge**: 320×240 (ideal for thumbnails or social media)
- 💾 **Client-Side Export**: Convert SVG to PNG and download directly in the browser
- ✨ **Animated Preview**: Particle effects and smooth animations in the preview

### 🎴 Devémon Card System
- 🃏 **Trading Card Generator**: Create collectible trading cards from GitHub profiles
- ⚡ **Power Calculation**: Calculates power based on followers, repositories, and contributions
- 🌟 **6 Rarity Tiers**: From Common to Mythical with unique colors and types
  - **Common** (0-99): Gray, Normal type ⭐
  - **Uncommon** (100-499): Green, Grass type ⭐⭐
  - **Rare** (500-999): Blue, Water type ⭐⭐⭐
  - **Epic** (1000-4999): Purple, Psychic type 🌟
  - **Legendary** (5000-9999): Orange, Fire type 🌟🌟
  - **Mythical** (10000+): Red, Dragon type 🌟🌟🌟
- 🎨 **Dual Formats**: 
  - **Card**: 350×550px portrait format with holographic effects
  - **Badge**: 320×240px landscape format with compact layout
- 💼 **Available for Hire Badge**: Toggle badge to show hiring availability
- 📊 **Stats Display**: Followers, repositories, contributions, and calculated power
- 📈 **Mini Contribution Graph**: Visual representation of GitHub activity
- 🎨 **GitHub Primer Colors**: Authentic GitHub design system colors
- 💾 **High-Res Export**: 3× scale PNG downloads via html2canvas

### 🎯 README Banner Generator
- 🎨 **Profile Banner Creation**: Generate custom 1280×320px banners for GitHub profile READMEs
- 🖼️ **Avatar Art Styles**: Transform your GitHub avatar into unique art styles:
  - **None**: Original avatar (default)
  - **ASCII Art**: 60×40 character art with 69-level grayscale gradient
  - **Pixel Art**: 16-bit style pixelated avatar (64×64 resolution)
  - **Cartoon**: Posterized and edge-detected cartoon effect
- 🎛️ **Display Toggles**: Customize what information appears on your banner:
  - **For Hire**: Show "Available for Hire" badge
  - **Website**: Display your website URL
  - **Join Date**: Show when you joined GitHub
  - **Bio**: Include your GitHub bio
  - **Streak**: Display your contribution streak
- 📊 **GitHub Stats**: Automatically fetches and displays:
  - Username and name
  - Follower count
  - Repository count
  - Total contributions
  - Current streak information
- 💾 **Easy Export**: Download as PNG or copy Markdown snippet for README
- 🎨 **GitHub Universe Theme**: Matches GitHub's design aesthetic with gradient backgrounds

### 🚀 General Features
- 🚀 **Static Site**: No backend required—fully client-side using GitHub's public API
- 📱 **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- 🎯 **Easily Extensible**: Well-structured TypeScript code for adding features

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/github/octocanvas
   cd octocanvas
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:4321`

## 📦 Building for Production

Build the static site:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🎨 Customization & Extension

The codebase is designed to be easily extensible. Here are some ideas:

### Devémon Card Customization

The rarity system uses this power calculation formula:
```typescript
power = (followers × 10) + (repos × 5) + (totalContributions × 0.1)
```

You can customize rarity tiers in `src/components/DevemonCard.tsx`:

```typescript
const getRarity = (power: number) => {
  if (power >= 10000) return { level: 'Mythical', color: '#ff7b72', type: 'Dragon', stars: '🌟🌟🌟' };
  if (power >= 5000) return { level: 'Legendary', color: '#ffa657', type: 'Fire', stars: '🌟🌟' };
  if (power >= 1000) return { level: 'Epic', color: '#bc8cff', type: 'Psychic', stars: '🌟' };
  if (power >= 500) return { level: 'Rare', color: '#58a6ff', type: 'Water', stars: '⭐⭐⭐' };
  if (power >= 100) return { level: 'Uncommon', color: '#7ee787', type: 'Grass', stars: '⭐⭐' };
  return { level: 'Common', color: '#7d8590', type: 'Normal', stars: '⭐' };
};
```

### Adding New Wallpaper Themes

Edit `src/components/WallpaperGenerator.tsx` in the `generateSVG` function:

```typescript
// Current GitHub Universe Green gradient
<linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" style="stop-color:#08872B;stop-opacity:1" />
  <stop offset="100%" style="stop-color:#1a7f37;stop-opacity:1" />
</linearGradient>

// Add theme selection and conditionally render different gradients
```

### Adding Custom Wallpaper Sizes

In `src/components/WallpaperGenerator.tsx`, update the `SIZES` constant:

```typescript
const SIZES = {
  desktop: { width: 2560, height: 1440, label: 'Desktop (2560x1440)' },
  mobile: { width: 1170, height: 2532, label: 'Mobile (1170x2532)' },
  tablet: { width: 2048, height: 2732, label: 'iPad Pro (2048x2732)' },
  badge: { width: 320, height: 240, label: 'Badge (320x240)' },
};
```

### Customizing Colors

Update `tailwind.config.mjs` to add your own color palette:

```javascript
theme: {
  extend: {
    colors: {
      'universe-green': '#5fed83',
      'universe-green-dark': '#08872B',
      'custom-primary': '#your-color',
    },
  },
}
```

## 🤝 Contributing

Contributions are welcome! Here are some ways you can contribute:

- Add new wallpaper themes or layouts
- Implement custom color pickers
- Add pattern/background options
- Create new card types or rarities
- Improve responsive design
- Add more export formats (WEBP, JPEG, etc.)
- Enhance SVG designs
- Add animations or effects

## License 

This project is licensed under the terms of the MIT open source license. Please refer to the [LICENSE](./LICENSE) file for the full terms.

## Maintainers 

@Damovisa @jldeen

## 🙏 Acknowledgments

- GitHub API for providing free public data access
- Contributions API for structured contribution data
- Astro team for the amazing framework
- Tailwind CSS for beautiful utilities
- html2canvas for client-side image generation

---

Made with ❤️ using Astro, Preact, TypeScript, Tailwind CSS and GitHub Copilot
