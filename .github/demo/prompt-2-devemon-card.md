# OctoCanvas Part 2: Devémon Card Generator

Add a trading card-style profile generator to the existing OctoCanvas application. This feature creates Pokemon/Baseball card-style GitHub profile displays called "Devémon Cards."

**Prerequisites:**
- Existing OctoCanvas site with GitHub API integration
- GitHub Universe theme colors configured in Tailwind
- html2canvas library installed for image export

**New Requirements:**

1. **Card System Overview:**
   - Create Pokemon/Baseball card style GitHub profile displays
   - Two export formats:
     * **Card**: 350×550px portrait (full card view)
     * **Badge**: 320×240px landscape (compact badge view)
   - Rarity-based design system with color-coded tiers
   - Holographic, prismatic visual effects

2. **Extended GitHub Data Fetching:**
   - In addition to basic profile data, fetch:
     * Total stars across all repos
     * Total forks across all repos
     * Top 3 programming languages (by repo size)
   - Fetch repository data from GitHub repos API
   - Calculate top languages by sorting repos and aggregating language data
   - Calculate power level from aggregated stats

3. **Rarity System:**
   - Calculate power level using formula:
     ```
     power = (followers × 2) + (repos × 1) + (contributions × 0.1) + (stars × 3) + (forks × 2)
     ```
   - Rarity tiers (with GitHub Primer colors):
     * **Common**: < 100 power (Gray #7d8590, Normal type) ⭐
     * **Uncommon**: 100-299 power (Green #7ee787, Grass type) ⭐⭐
     * **Rare**: 300-799 power (Blue #58a6ff, Water type) ⭐⭐⭐
     * **Epic**: 800-1999 power (Purple #bc8cff, Psychic type) 🌟
     * **Legendary**: 2000-4999 power (Orange #ffa657, Fire type) 🌟🌟
     * **Mythical**: 5000+ power (Red #ff7b72, Dragon type) 🌟🌟🌟
   - Each rarity has unique color scheme for borders, glows, and badges

4. **Card Format (350×550px Portrait):**
   - Layout structure:
     * **Header**: Name, @username, rarity badge with stars
     * **Avatar section**: Centered avatar (200px) with holographic glow effect
       - Glow color matches rarity color
       - Multiple box shadows for depth
     * **Stats grid**: 2×2 grid showing:
       - Repositories (count)
       - Followers (count)
       - Stars (total across repos)
       - Forks (total across repos)
     * **Contributions**: Total contributions displayed prominently
     * **Languages**: Top 3 languages as colored badges
     * **Optional hiring badge**: "💼 OPEN TO WORK" below avatar (toggle-able)
     * **Footer**: "Developer since {join_date}"
   - Font sizes: Name 20px, stats numbers 18px, labels 11px
   - Holographic border effect matching rarity color

5. **Badge Format (320×240px Landscape):**
   - Compact horizontal layout:
     * **Left side**: Avatar (72×72px) with rarity glow
     * **Right side**: Profile info
     * **Top**: Centered name, username, rarity
     * **Middle**: 3-column stats grid (repos, followers, contributions)
     * **Bottom**: Top 3 languages as small badges
     * **Very bottom**: "Available for Hire" badge (if enabled)
   - Font sizes: Name 12px, stats 14px, labels 8px
   - Proper text wrapping with word-break and overflow-wrap
   - All content must be inside main flex-col container for proper html2canvas capture

6. **UI Components:**
   - **Generation type selector**:
     * Radio-style toggle before username input
     * Options: "Wallpaper" or "Devémon Card"
     * Changes what preview/download options are shown
   - **Card-specific controls**:
     * Checkbox: "Available for Hire" toggle
     * Shows/hides hiring status badge on card
   - **Download buttons**:
     * "Download Card" - exports 350×550px portrait
     * "Download Badge" - exports 320×240px landscape
     * Both use html2canvas with scale: 3 for high quality

7. **Technical Implementation:**
   - Install html2canvas: `npm install html2canvas`
   - Create `/src/components/DevemonCard.tsx` component
   - Download function:
     ```typescript
     import html2canvas from 'html2canvas';
     
     const downloadCard = async (format: 'card' | 'badge') => {
       const element = format === 'card' ? cardRef.current : badgeRef.current;
       const canvas = await html2canvas(element, { scale: 3 });
       const blob = await canvas.toBlob();
       // Trigger download
     };
     ```
   - Use inline styles for better html2canvas compatibility
   - Proper div structure for capture:
     * Fixed size outer container with overflow-visible (for shadows)
     * Inner content container with exact dimensions
     * All content inside flex-col for proper layout
   - Badge "Available for Hire" must be inside flex-col, not outside

8. **Styling Requirements:**
   - Use GitHub Primer colors consistently
   - Holographic glow effect: multiple box-shadows with rarity color
   - Avatar glow: `box-shadow: 0 0 20px ${rarityColor}, 0 0 40px ${rarityColor}80`
   - Proper spacing and padding for readability
   - Stats grid with clear labels and values
   - Language badges with proper color coding
   - Rarity badge with star icons
   - Responsive text sizing that fits within containers

9. **Integration with Existing App:**
   - Add toggle in `GitHubWallpaperApp.tsx` to switch between wallpaper and card mode
   - Conditional rendering: show wallpaper controls OR card controls
   - Share GitHub data fetching logic
   - Extend data fetching to include repos for extended stats
   - Maintain consistent loading and error states

10. **Key Implementation Details:**
    - Text cutoff prevention:
      * Use smaller fonts in badge format
      * Set `wordBreak: 'break-word'`
      * Set `overflowWrap: 'break-word'`
      * Set `hyphens: 'auto'`
    - Avatar border must match rarity color with glow effect
    - Stats should use compact number formatting (1.2k instead of 1200)
    - Language badges should use official GitHub language colors if available
    - Download filenames: `{username}-devemon-{format}.png`
    - Mobile responsive: cards stack vertically on small screens

**User Flow:**
1. User selects "Devémon Card" generation type
2. User enters GitHub username
3. App fetches profile data + repos for extended stats
4. App calculates power level and determines rarity
5. Card preview displays with calculated stats and rarity
6. User optionally toggles "Available for Hire"
7. User downloads card or badge format (or both)

**Testing Considerations:**
- Test with users of varying follower/repo counts to verify rarity calculations
- Verify card downloads capture properly with html2canvas
- Check text wrapping on long names/usernames
- Ensure mobile responsiveness for previews
- Test "Available for Hire" badge positioning in both formats

Please implement this feature while maintaining the existing wallpaper generator functionality and GitHub Universe design theme.
