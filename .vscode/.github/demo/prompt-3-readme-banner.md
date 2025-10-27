# OctoCanvas Part 3: README Banner Generator

Add a GitHub Profile README banner generator to the existing OctoCanvas application. This feature creates customizable 1280×320px banners with avatar art styles and profile information.

**Prerequisites:**
- Existing OctoCanvas site with GitHub API integration
- GitHub Universe theme colors configured in Tailwind
- html2canvas library installed for image export

**New Requirements:**

1. **Banner System Overview:**
   - Generate standard GitHub README banners (1280×320px)
   - Multiple avatar art style options
   - Customizable display toggles for profile information
   - GitHub Universe gradient background
   - Easy export as PNG or Markdown snippet

2. **Avatar Art Styles:**
   Provide 4 avatar transformation options:
   
   - **None** (Default):
     * Original GitHub avatar displayed at 256×256px
     * Clean, professional look
   
   - **ASCII Art**:
     * Convert avatar to 60×40 character ASCII art
     * Use 69-level grayscale gradient for detail:
       ```
       ` .'^\`":;Il!i><~+_-?][}{1)(|\/tfjrxnuvcz XYUJCLQOZmwqpdbkhao*#MW&8%B@$`
       ```
     * Calculate brightness using perceptual weighting: `0.299*r + 0.587*g + 0.114*b`
     * Display in monospace font with proper line-height
     * Render at 4.5px font size for optimal banner fit
   
   - **Pixel Art** (16-bit style):
     * Downscale avatar to 64×64 pixels
     * Disable image smoothing for sharp pixel edges
     * Scale up to 256×256px for display
     * Creates retro 16-bit aesthetic
   
   - **Cartoon**:
     * Resize to 256×256px
     * Apply posterization (4 color levels per channel)
     * Enhance contrast (1.3×) and saturation (1.4×)
     * Edge detection with Sobel operator
     * Composite edges over posterized image
     * Creates stylized cartoon/illustration effect

3. **Display Toggle Options:**
   Provide 5 toggles to customize banner content:
   
   - **For Hire**: Shows "💼 Available for Hire" badge
   - **Website**: Displays user's website URL
   - **Join Date**: Shows "Joined {Month Year}" (e.g., "Joined Oct 2020")
   - **Bio**: Includes GitHub profile bio text
   - **Streak**: Shows current contribution streak (e.g., "🔥 42 day streak")
   
   All toggles default to OFF for clean, minimal banners.

4. **Banner Layout (1280×320px):**
   - **Background**: GitHub Universe gradient (green tones)
   - **Left side**: Avatar with selected art style (256×256px)
   - **Right side**: Profile information
     * Name and @username at top
     * Stats row: Followers • Repos • Contributions
     * Conditional rows based on toggles:
       - Available for Hire badge (if enabled)
       - Website URL (if enabled and available)
       - Join date (if enabled)
       - Bio text (if enabled and available)
       - Contribution streak (if enabled)
   - **Decorative elements**: Floating circles/particles
   - **Typography**: Monospace font, proper sizing and spacing

5. **UI Components:**
   - **Section header**: "README Banner Generator"
   - **Controls section** with clean, compact layout:
     * **Display Options**: 5 iOS-style toggle switches in inline row
       - Switches: 32×16px (w-8 h-4)
       - Labels: Short, 11px text ("For Hire", "Website", "Join Date", "Bio", "Streak")
       - Layout: Single row with flex-wrap, gaps between items
     * **Avatar Style**: 4 buttons for art selection
       - Options: "None", "ASCII Art", "Pixel Art", "Cartoon"
       - Active state highlighting
   - **Action buttons**:
     * "Download" - Exports banner as PNG
     * "Copy Markdown" - Copies Markdown image syntax to clipboard
   - **Instructions**: Minimal one-line guide
     * "Download → Upload as `banner.png` → Copy Markdown → Add to README"

6. **Technical Implementation:**
   
   **ASCII Art Generation:**
   ```typescript
   const generateAsciiArt = async (avatarUrl: string): Promise<string> => {
     // 1. Load image to canvas (60×40)
     // 2. Get pixel data
     // 3. Calculate brightness for each pixel
     // 4. Map to character gradient (69 levels)
     // 5. Return formatted string with line breaks
   };
   ```
   
   **Pixel Art Generation:**
   ```typescript
   const generatePixelArt = async (avatarUrl: string): Promise<string> => {
     // 1. Create 64×64 canvas
     // 2. Draw image with imageSmoothingEnabled: false
     // 3. Scale to 256×256 for display
     // 4. Return data URL
   };
   ```
   
   **Cartoon Generation:**
   ```typescript
   const generateCartoonArt = async (avatarUrl: string): Promise<string> => {
     // 1. Load to 256×256 canvas
     // 2. Posterize colors (4 levels)
     // 3. Enhance contrast and saturation
     // 4. Apply edge detection (Sobel)
     // 5. Composite edges over posterized image
     // 6. Return data URL
   };
   ```

7. **Export Functionality:**
   
   **PNG Download:**
   - Use html2canvas with scale: 2 for high quality
   - Capture banner at exact 1280×320px
   - Filename: `{username}-readme-banner.png`
   - Trigger download via blob URL
   
   **Markdown Copy:**
   - Generate Markdown image syntax:
     ```markdown
     ![GitHub Banner](./banner.png)
     ```
   - Copy to clipboard using navigator.clipboard API
   - Show success feedback to user

8. **Styling & Design:**
   - **Clean, uncluttered layout**: Reduced visual noise
   - **Section hierarchy**: Subtle labels (10px uppercase, muted green)
   - **Compact toggles**: Small switches (32×16px) with short labels
   - **Inline layout**: All toggles in single row with wrapping
   - **Border separators**: Divide header from content, actions from controls
   - **Consistent spacing**: 16px (p-4) padding, 16px (space-y-4) between sections
   - **GitHub Universe colors**: Green accents, dark backgrounds
   - **Responsive text**: Scales appropriately for readability

9. **Integration with Existing App:**
   - Create `/src/components/ReadmeBanner.tsx` component
   - Add to generation type selector alongside Wallpaper and Devémon Card
   - Share GitHub data fetching logic
   - Fetch additional data needed:
     * User's website URL
     * Account creation date
     * Bio text
     * Calculate contribution streak from contributions API
   - Maintain consistent UI patterns with other generators

10. **Key Implementation Details:**
    - **Avatar processing happens client-side** using Canvas API
    - **CORS considerations**: GitHub avatars may need proxy
    - **Streak calculation**: Count consecutive days with contributions > 0
    - **Date formatting**: Use locale-aware formatting (e.g., "Oct 2020")
    - **Bio text**: Truncate if too long, respect line breaks
    - **Website URL**: Strip https:// prefix for cleaner display
    - **Banner structure**: Fixed container with proper positioning for html2canvas
    - **Art style state**: Persist selection while toggling between options
    - **Loading states**: Show while generating art transformations

11. **User Flow:**
    1. User selects "README Banner" generation type
    2. User enters GitHub username
    3. App fetches profile data (avatar, stats, bio, website, etc.)
    4. Default banner displays with no toggles, original avatar
    5. User selects avatar art style (ASCII/Pixel/Cartoon)
    6. Avatar transforms in real-time preview
    7. User toggles display options (For Hire, Website, etc.)
    8. Banner updates dynamically with selected information
    9. User downloads PNG or copies Markdown
    10. User uploads PNG to their repo and adds Markdown to README

12. **Avatar Art Quality Guidelines:**
    - **ASCII**: 60×40 characters provides good detail without being too large
    - **Pixel**: 64×64 resolution gives 16-bit aesthetic (vs 32×32 for 8-bit)
    - **Cartoon**: Balance posterization (4 levels) with edge detection strength
    - All art styles should be recognizable as the original avatar
    - Render at appropriate sizes for 1280×320px banner space

13. **Accessibility & UX:**
    - Clear labels for all toggles and buttons
    - Visual feedback on button clicks
    - Success message on Markdown copy
    - Error handling for failed avatar loading
    - Loading indicators during art generation
    - Keyboard navigation support
    - Proper contrast ratios for text

**Testing Considerations:**
- Test ASCII art with avatars of varying contrast/complexity
- Verify pixel art maintains recognizability at 64×64
- Check cartoon effect on photos vs illustrations
- Test all toggle combinations
- Ensure banner exports at exact 1280×320px
- Verify Markdown copy functionality
- Test with users who have missing data (no website, no bio, etc.)
- Check text wrapping for long bios
- Validate streak calculation accuracy

**Example Banner Configurations:**
1. **Minimal**: No toggles, original avatar
2. **Professional**: Website + Join Date, original avatar
3. **Complete**: All toggles, ASCII art
4. **Creative**: For Hire + Bio + Streak, Cartoon art
5. **Retro**: Pixel art, minimal text

Please implement this feature while maintaining the existing wallpaper and Devémon card functionality, using the same GitHub Universe design theme throughout.
