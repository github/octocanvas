/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // GitHub Universe 2025 Design System - Brand Colors
      colors: {
        // Legacy (keep for backward compatibility)
        'github-dark': '#0d1117',
        'github-border': '#30363d',

        // Universe Design System Colors from Figma
        'universe': {
          // Brand Colors
          'black': '#010409',           // Dark section background
          'grey-9': '#101411',          // Card background, Pricing cards
          'grey-8': '#232925',          // Calendar highlight, Border on dark
          'white': '#FFFFFF',           // Primary text
          'grey-1': '#E4EBE6',          // Secondary text
          'grey-4': '#909692',          // Body text on dark backgrounds
          'grey-6': '#5A615C',          // Muted text
          'green-3': '#5FED83',         // Button on dark, Decorative icons
          'green-3-hover': '#BFFFD1',   // Button hover state on dark
          'green-4': '#08872B',         // Button on light, Text on light
          'blue-link': '#96D0FF',       // Link color on dark

          // Functional Colors
          'success': '#08872B',         // Success state
          'error': '#CF222E',           // Error state

          // Additional shades for states
          'green-hover': '#BFFFD1',     // Hover state
          'green-pressed': '#13BD44',   // Pressed state shadow
          'green-gradient': '#8CF2A6',  // Decorative gradient

          // Border colors
          'border-light': '#B6BFB8',    // Form borders
          'border-dark': '#232925',     // Dark borders

          // Legacy aliases (backwards compatibility)
          'green': '#5fed83',
          'green-dark': '#08872B',
          'green-accent': '#1a7f37',
          'green-border': '#12662a',
          'green-light': '#bfffd1',
          'green-lightest': '#dcff96',
          'dark-bg': '#101411',
          'dark-border': '#232925',
          'dark-surface': '#3b453e',
          'gray-muted': '#909692',
          'gray-border': '#e4ebe6',
        },
      },

      // Typography from Figma Design System
      fontFamily: {
        // Mona Sans - Primary body and UI text
        'sans': ['"Mona Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        // Mona Sans - Headings
        'display': ['"Mona Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        // Monaspace Neon - Actions, eyebrows, labels
        'mono': ['"Mona Sans"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },

      // Font sizes matching Figma typography scale
      fontSize: {
        // Desktop Typography
        'h1-desktop': ['80px', { lineHeight: '0.9', letterSpacing: '-1.6px', fontWeight: '600' }],
        'h2-desktop': ['72px', { lineHeight: '0.9', letterSpacing: '-0.72px', fontWeight: '600' }],
        'h3-desktop': ['48px', { lineHeight: '1', letterSpacing: '-0.96px', fontWeight: '600' }],
        'h4-desktop': ['40px', { lineHeight: '1', fontWeight: '600' }],
        'h5-desktop': ['32px', { lineHeight: '1.3', letterSpacing: '-0.32px', fontWeight: '600' }],
        'h6-desktop': ['24px', { lineHeight: '1.35', letterSpacing: '0.12px', fontWeight: '500' }],
        'h7-desktop': ['20px', { lineHeight: '1.6', letterSpacing: '-0.1px', fontWeight: '500' }],

        // Mobile Typography
        'h1-mobile': ['44px', { lineHeight: '0.9', letterSpacing: '-0.44px', fontWeight: '600' }],
        'h2-mobile': ['36px', { lineHeight: '0.9', letterSpacing: '-0.36px', fontWeight: '600' }],
        'h3-mobile': ['32px', { lineHeight: '0.9', letterSpacing: '-0.32px', fontWeight: '600' }],
        'h4-mobile': ['28px', { lineHeight: '0.9', fontWeight: '600' }],
        'h5-mobile': ['22px', { lineHeight: '1.4', fontWeight: '500' }],
        'h6-mobile': ['20px', { lineHeight: '1.4', letterSpacing: '0.2px', fontWeight: '500' }],
        'h7-mobile': ['18px', { lineHeight: '1', letterSpacing: '-0.09px', fontWeight: '500' }],

        // Body text
        'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '500' }],

        // Action/Eyebrow text
        'action-desktop': ['16px', { lineHeight: '1', letterSpacing: '2px', fontWeight: '500' }],
        'action-mobile': ['14px', { lineHeight: '1', letterSpacing: '1px', fontWeight: '500' }],
        'eyebrow': ['16px', { lineHeight: '1', letterSpacing: '2px', fontWeight: '500' }],
      },

      // Spacing scale from Figma
      spacing: {
        'xs': '8px',      // XXS - spacing between text boxes
        'sm': '16px',     // XS - general spacing between text boxes
        'md': '24px',     // Small - global margin on mobile, padding in modals
        'lg': '32px',     // Small desktop - padding between elements in cards
        'xl': '40px',     // Medium mobile - general spacing
        '2xl': '48px',    // Medium desktop - form height, icon size, padding in modals
        '3xl': '64px',    // Large desktop - global margin, full-width module padding
        '4xl': '80px',    // XL mobile - vertical spacing between modules
        '5xl': '128px',   // XL desktop - vertical spacing between modules
      },

      // Letter spacing
      letterSpacing: {
        'tighter-2': '-1.6px',
        'tighter': '-0.72px',
        'tight': '-0.32px',
        'normal': '0px',
        'wide': '0.12px',
        'wider': '1px',
        'wider-2': '2px',
      },

      // Box shadows from Figma
      boxShadow: {
        // Button shadows - Primary Button on Dark
        'btn-primary-rest': '0px 1px 0px 0px rgba(27, 31, 36, 0.04)',
        'btn-primary-hover': '-4px 4px 0px 0px #5fed83',
        'btn-primary-pressed': 'inset -2px 2px 0px 0px rgba(0, 0, 0, 0.25)',
        'btn-secondary-pressed': 'inset -2px 2px 0 rgba(0, 0, 0, 0.25)',

        // Modal shadows
        'modal': '0px 4px 134px 20px rgba(0, 0, 0, 0.05)',

        // Legacy
        'universe': '-2px 2px 0 #12662a',
        'universe-hover': '-4px 4px 0 #80f29d',
        'universe-glow': '0 2px 250px 0 rgba(255, 227, 254, 0.75) inset',
      },

      // Border radius
      borderRadius: {
        'btn': '8px',
        'input': '6px',
        'modal': '12px',
        'card': '8px',
      },

      // Backdrop blur for modals
      backdropBlur: {
        'modal': '37.5px',
        'pearl': '37.5px', // Pearl texture overlay
      },

      // Background images for wallpaper foundations
      backgroundImage: {
        'clouds-bg-1': "url('/octocanvas/assets/clouds-bg-1.svg')",
        'clouds-bg-2': "url('/octocanvas/assets/clouds-bg-2.svg')",
        'clouds-bg-3': "url('/octocanvas/assets/clouds-bg-3.svg')",
        'clouds-fg-1': "url('/octocanvas/assets/clouds-fg-1.svg')",
        'clouds-fg-2': "url('/octocanvas/assets/clouds-fg-2.svg')",
        'pearl-texture': "url('/octocanvas/assets/pearl-texture.svg')",
        'wonder-cube': "url('/octocanvas/assets/wonder-cube.svg')",
        'star-motif': "url('/octocanvas/assets/star-motif.svg')",
        'butterfly': "url('/octocanvas/assets/butterfly.svg')",
      },
    },
  },
  plugins: [],
}
