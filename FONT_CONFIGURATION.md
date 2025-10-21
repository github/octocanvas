# Font Configuration Fix - GitHub Universe Design System

## Issue
The global.css was using `@font-face` declarations with `src` URLs pointing to GitHub's internal asset URLs, which were returning 404 errors. Figma only specifies `font-family` names, not font file sources.

## Root Cause
- Figma design specs only reference font families by name (e.g., "Mona Sans", "Monaspace Neon")
- The implementation incorrectly assumed GitHub's internal font URLs would be publicly accessible
- Font files need to be sourced from public CDNs or hosted locally

## Solution

### 1. Updated Font Loading Strategy (`src/styles/global.css`)

**Before:**
```css
/* Using non-existent URLs */
@font-face {
  font-family: 'Mona Sans';
  src: url('https://github.githubassets.com/assets/Mona-Sans-400.woff2') format('woff2');
  /* ... more @font-face rules with bad URLs */
}
```

**After:**
```css
/* Using public CDN sources */
@import url('https://api.fontshare.com/v2/css?f[]=mona-sans@400,500,600&display=swap');
@import url('https://fonts.cdnfonts.com/css/monaspace-neon');
```

### 2. Updated Font Stack (`tailwind.config.mjs`)

**Changed font-display fallback:**
```javascript
'display': ['"Mona Sans"', '"Mona Sans SemiCondensed"', 'system-ui', '-apple-system', 'sans-serif'],
```

Added Mona Sans as the primary font with SemiCondensed as a fallback, since the SemiCondensed variant is not widely available via public CDNs.

## Font Sources

### Mona Sans
- **Source**: Fontshare (https://www.fontshare.com/fonts/mona-sans)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold)
- **License**: Free for commercial use via Fontshare
- **Usage**: Primary body text, UI elements

### Monaspace Neon
- **Source**: CDN Fonts (https://www.cdnfonts.com/monaspace-neon.font)
- **Weights**: 500 (Medium), 700 (Bold)
- **License**: SIL Open Font License
- **Usage**: Monospace text, actions, labels, buttons

### Mona Sans SemiCondensed
- **Status**: Not publicly available via CDN
- **Fallback**: Using regular Mona Sans
- **Note**: For production, may need to host locally if the condensed variant is critical
- **Usage**: Display headings (H1-H7)

## Figma Alignment

The implementation now correctly aligns with Figma specifications:

1. **Figma specifies**: `font-family: "Mona Sans"`
   - **Implementation**: Using Fontshare CDN for public access

2. **Figma specifies**: `font-family: "Mona Sans SemiCondensed"`
   - **Implementation**: Fallback to regular Mona Sans (functionally similar)

3. **Figma specifies**: `font-family: "Monaspace Neon"`
   - **Implementation**: Using CDN Fonts for public access

## Typography Classes (Unchanged)

Tailwind config maintains all the Figma typography specifications:

```javascript
fontSize: {
  'h1-desktop': ['80px', { lineHeight: '0.9', letterSpacing: '-1.6px', fontWeight: '600' }],
  'h2-desktop': ['72px', { lineHeight: '0.9', letterSpacing: '-0.72px', fontWeight: '600' }],
  'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '500' }],
  'action-desktop': ['16px', { lineHeight: '1', letterSpacing: '2px', fontWeight: '500' }],
  // ... etc
}
```

## Production Recommendations

For production deployment, consider:

1. **Host fonts locally** in `/public/fonts/` for:
   - Better performance (no external requests)
   - Guaranteed availability
   - License compliance

2. **Download font files**:
   - Mona Sans: Download from [GitHub's fonts repository](https://github.com/github/mona-sans)
   - Monaspace: Download from [GitHub's Monaspace repository](https://github.com/githubnext/monaspace)

3. **Update @font-face rules** to reference local files:
   ```css
   @font-face {
     font-family: 'Mona Sans';
     src: url('/fonts/Mona-Sans-Medium.woff2') format('woff2');
     font-weight: 500;
     font-display: swap;
   }
   ```

4. **Subset fonts** to include only used characters for smaller file sizes

## Testing

Verify fonts are loading correctly:
1. Open browser DevTools → Network tab
2. Check for successful font loads (200 status)
3. Inspect computed styles on text elements
4. Verify no 404 errors in console

## References

- Mona Sans on Fontshare: https://www.fontshare.com/fonts/mona-sans
- Monaspace on GitHub: https://github.com/githubnext/monaspace
- Figma Design System: Node 1:2244 (🔒 Shared - Web Guides)
