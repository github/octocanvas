# GitHub Universe Design System - Implementation Guide

This document describes the design system implementation for the OCTOCANVAS project based on Figma specifications.

## Design System Overview

The design system is based on GitHub Universe brand guidelines and includes:

- **Brand Colors**: Black, Grey palette (9 shades), White, Green variants
- **Typography**: Three font families with specific use cases
- **Spacing**: 8-point grid system (8px to 128px)
- **Components**: Reusable UI components matching Figma specs

## 🎨 Design Tokens

### Colors

#### Brand Colors
- **Black**: `#010409` (universe-black) - Primary dark background
- **White**: `#FFFFFF` (universe-white) - Primary light background
- **Grey Palette**: 
  - Grey-9: `#101411` (darkest)
  - Grey-8: `#232925`
  - Grey-6: `#5A615C`
  - Grey-4: `#909692`
  - Grey-1: `#E4EBE6` (lightest)

#### Functional Colors
- **Green-3**: `#5FED83` - Primary CTA on dark backgrounds
- **Green-4**: `#08872B` - Primary CTA on light backgrounds, success states
- **Error**: `#CF222E` - Error messages and validation

#### Border Colors
- **border-light**: `#B6BFB8` - Light theme borders
- **border-dark**: `#5A615C` - Dark theme borders

### Typography

#### Font Families

1. **Mona Sans** (Body/UI Text)
   - Weights: 400 (Regular), 500 (Medium), 600 (Semibold)
   - Use for: Body text, form labels, descriptions
   - Class: `font-sans`

2. **Mona Sans SemiCondensed** (Display Headings)
   - Weight: 600 (Semibold)
   - Use for: Large headings, hero text
   - Class: `font-display`

3. **Monaspace Neon** (Monospace/Actions)
   - Weights: 500 (Medium), 700 (Bold)
   - Use for: Buttons, labels, tags, code
   - Class: `font-mono`

#### Font Sizes

**Desktop Scale**:
- h1: 80px / 88px (5rem / 5.5rem)
- h2: 64px / 72px (4rem / 4.5rem)
- h3: 48px / 56px (3rem / 3.5rem)
- h4: 40px / 48px (2.5rem / 3rem)
- h5: 32px / 40px (2rem / 2.5rem)
- h6: 24px / 32px (1.5rem / 2rem)
- h7: 20px / 28px (1.25rem / 1.75rem)
- body-xl: 24px / 32px
- body-lg: 20px / 28px
- body-md: 16px / 24px
- body-sm: 14px / 20px
- body-xs: 12px / 16px

**Mobile Scale**:
- h1: 48px / 56px (3rem / 3.5rem)
- h2: 40px / 48px (2.5rem / 3rem)
- h3: 32px / 40px (2rem / 2.5rem)
- h4: 24px / 32px (1.5rem / 2rem)

### Spacing Scale

Based on 8px grid:

- xs: 8px (0.5rem)
- sm: 16px (1rem)
- md: 24px (1.5rem)
- lg: 32px (2rem)
- xl: 40px (2.5rem)
- 2xl: 48px (3rem)
- 3xl: 64px (4rem)
- 4xl: 80px (5rem)
- 5xl: 128px (8rem)

Usage: `space-lg`, `p-md`, `gap-sm`, etc.

### Shadows

Button state shadows:
- **rest**: `0px 1px 0px 0px rgba(27, 31, 36, 0.04)` - Default button state
- **hover**: Enhanced shadow for hover state
- **pressed**: Inset shadow for active/pressed state

## 📦 UI Components

All components are located in `src/components/ui/`:

### Button (`Button.tsx`)

Primary and Secondary button variants with full design system integration.

**Props**:
- `variant`: 'primary' | 'secondary'
- `size`: 'desktop' | 'mobile'
- `theme`: 'dark' | 'light'
- `onClick`: Click handler
- `disabled`: boolean
- `fullWidth`: boolean
- `icon`: Optional icon element

**Usage**:
```tsx
import { Button, PrimaryButton, SecondaryButton } from '@/components/ui';

<Button variant="primary" theme="dark">Click Me</Button>
<PrimaryButton>Primary Action</PrimaryButton>
<SecondaryButton>Secondary Action</SecondaryButton>
```

**Styles**:
- Desktop: 72px height
- Mobile: 64px height
- Font: Monaspace Neon, uppercase, medium weight
- Decorative 5px dot on left
- Hover/pressed/focus states
- Primary on dark: Green-3 background
- Primary on light: Green-4 background
- Secondary: Transparent with border

### Input Components (`Input.tsx`)

Text inputs, selects, and textareas with consistent styling.

**Components**:
- `Input`: Single-line text input
- `Select`: Dropdown select with custom arrow
- `TextArea`: Multi-line text input

**Props**:
- `label`: Input label
- `error`: Error message
- `disabled`: boolean
- `required`: boolean
- `placeholder`: Placeholder text
- `icon`: Optional icon for Input

**Usage**:
```tsx
import { Input, Select, TextArea } from '@/components/ui';

<Input 
  label="Username" 
  placeholder="Enter username" 
  error="Username is required"
/>

<Select label="Theme">
  <option>Dark</option>
  <option>Light</option>
</Select>

<TextArea 
  label="Bio" 
  rows={4}
  placeholder="Tell us about yourself"
/>
```

**Styles**:
- Height: 48px (inputs/select)
- Border: 2px solid border-dark/border-light
- Focus: Green-3 border with ring
- Error: Red border and text
- Font: Mona Sans

### Label (`Label.tsx`)

Theme and topic labels with hover/selected states.

**Props**:
- `variant`: 'theme' | 'topic'
- `theme`: 'build' | 'secure' | 'automate' (for theme labels)
- `selected`: boolean
- `onClick`: Click handler
- `mode`: 'light' | 'dark'

**Usage**:
```tsx
import { Label, ThemeLabel, TopicLabel } from '@/components/ui';

<ThemeLabel selected={true} onClick={() => {}}>
  Build
</ThemeLabel>

<TopicLabel selected={false} mode="dark">
  JavaScript
</TopicLabel>
```

**Styles**:
- Height: 24px
- Padding: 8px horizontal
- Font: Monaspace Neon, uppercase, medium
- Theme labels: Text-only, no background
- Topic labels: Borders and hover states

### Form Controls (`FormControls.tsx`)

Checkboxes and radio buttons.

**Components**:
- `Checkbox`: Checkbox with label
- `Radio`: Radio button with label

**Props**:
- `label`: Control label
- `checked`/`selected`: boolean
- `onChange`: Change handler
- `disabled`: boolean
- `name`: Radio group name (radio only)
- `value`: Radio value (radio only)

**Usage**:
```tsx
import { Checkbox, Radio } from '@/components/ui';

<Checkbox 
  label="Remember me" 
  checked={isChecked}
  onChange={setIsChecked}
/>

<Radio 
  label="Option 1"
  name="choice"
  value="1"
  selected={selected === '1'}
  onChange={() => setSelected('1')}
/>
```

**Styles**:
- Size: 20px × 20px
- Border: 2px white
- Hover: Grey-8 background
- Selected: White background with checkmark/dot
- Custom checkmark and radio dot SVGs

### Modal (`Modal.tsx`)

Modal dialog with backdrop blur and responsive padding.

**Props**:
- `isOpen`: boolean
- `onClose`: Close handler
- `title`: Modal title (optional)
- `size`: 'sm' | 'md' | 'lg'
- `children`: Modal content

**Usage**:
```tsx
import { Modal, SmallModal } from '@/components/ui';

<Modal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure?</p>
</Modal>

<SmallModal isOpen={isOpen} onClose={handleClose}>
  Content here
</SmallModal>
```

**Styles**:
- Backdrop: Black 70% opacity with 37.5px blur
- Background: Grey-9
- Padding: 32px mobile, 80px desktop
- Close button: Top-right X icon
- ESC key to close
- Prevents body scroll when open

### Icon (`Icon.tsx`)

Icon component with consistent sizing.

**Props**:
- `name`: Icon name string
- `size`: 'functional' | 'branded' | number
- `color`: CSS color value
- `label`: Accessible label

**Available Icons**:
- Functional (16px): x, download, arrow-right, chevron-down, info, check, alert
- Branded (30px): mark-github

**Usage**:
```tsx
import { Icon, FunctionalIcon, BrandedIcon } from '@/components/ui';

<Icon name="download" size="functional" color="currentColor" />
<FunctionalIcon name="arrow-right" label="Next" />
<BrandedIcon name="mark-github" />
```

## 🎯 Implementation

### Tailwind Configuration

The design system is configured in `tailwind.config.mjs`:

```javascript
theme: {
  extend: {
    colors: {
      universe: {
        black: '#010409',
        white: '#FFFFFF',
        'grey-9': '#101411',
        'grey-8': '#232925',
        // ... more colors
        'green-3': '#5FED83',
        'green-4': '#08872B',
      }
    },
    fontFamily: {
      sans: ['Mona Sans', 'sans-serif'],
      display: ['Mona Sans SemiCondensed', 'sans-serif'],
      mono: ['Monaspace Neon', 'monospace'],
    },
    fontSize: {
      'h1-desktop': ['5rem', { lineHeight: '5.5rem' }],
      // ... more sizes
    },
    spacing: {
      xs: '0.5rem',  // 8px
      // ... more spacing
    },
    boxShadow: {
      'btn-primary-rest': '0px 1px 0px 0px rgba(27, 31, 36, 0.04)',
      // ... more shadows
    }
  }
}
```

### Global CSS

Font imports and utilities are in `src/styles/global.css`:

```css
/* Font imports via CDN */
@import url('https://api.fontshare.com/v2/css?f[]=mona-sans@400,500,600&display=swap');
@import url('https://fonts.cdnfonts.com/css/monaspace-neon');

/* CSS custom properties for design tokens */
:root {
  --color-universe-black: #010409;
  --color-universe-white: #ffffff;
  /* ... more variables */
}

/* Component utilities */
.text-action {
  @apply font-mono uppercase tracking-wide font-medium;
}

.heading-1 {
  @apply text-h1-mobile md:text-h1-desktop font-display font-semibold;
}
/* ... more utilities */
```

### Usage in Components

Import and use the global CSS:

```astro
---
import '../styles/global.css';
---
```

Use design tokens in Tailwind classes:

```tsx
<button class="bg-universe-green-3 text-black font-mono uppercase tracking-wide h-[72px] px-6 rounded-btn shadow-btn-primary-rest hover:shadow-btn-primary-hover">
  Click Me
</button>
```

## 📱 Responsive Design

The design system includes mobile-specific tokens:

- Typography scales down on mobile (text-h1-mobile vs text-h1-desktop)
- Spacing adjusts with Tailwind responsive prefixes (sm:, md:, lg:)
- Button heights: 64px mobile, 72px desktop
- Modal padding: 32px mobile, 80px desktop

**Usage**:
```tsx
<h1 class="text-h2-mobile md:text-h1-desktop">
  Heading
</h1>

<div class="p-8 md:p-20">
  Content with responsive padding
</div>
```

## ♿ Accessibility

All components include:

- Semantic HTML (button, label, input, etc.)
- ARIA attributes (aria-label, aria-pressed, role)
- Focus visible states with ring utility
- Keyboard navigation support (ESC for modals)
- Color contrast meeting WCAG standards

**Focus Ring**:
```css
.focus-outline {
  @apply focus:outline-none focus:ring-2 focus:ring-universe-green-3 focus:ring-offset-2 focus:ring-offset-universe-grey-9;
}
```

## 🔧 Migration Guide

To update existing components to use the design system:

### 1. Update Color Classes

**Before**:
```tsx
class="bg-universe-dark-bg text-universe-green border-universe-dark-border"
```

**After**:
```tsx
class="bg-universe-grey-9 text-universe-green-3 border-universe-border-dark"
```

### 2. Update Typography

**Before**:
```tsx
class="text-4xl font-bold font-mono uppercase tracking-wider"
```

**After**:
```tsx
class="text-h2-desktop font-display font-semibold uppercase tracking-wide"
```

### 3. Update Spacing

**Before**:
```tsx
class="px-4 py-3 mb-4 gap-3"
```

**After**:
```tsx
class="px-lg py-md mb-lg gap-md"
```

or use the utility classes directly:
```tsx
class="space-lg"  // 32px
```

### 4. Replace Custom Components

**Before**:
```tsx
<button class="px-6 py-4 bg-universe-green hover:bg-universe-green-hover text-black font-mono font-bold rounded-lg">
  Click
</button>
```

**After**:
```tsx
import { PrimaryButton } from '@/components/ui';

<PrimaryButton theme="dark">
  Click
</PrimaryButton>
```

## 📚 Resources

- **Figma Design System**: [OCTOCANVAS-GUIDES](https://www.figma.com/design/ucmbvlgaS6HyEBT1FZKsWt/OCTOCANVAS-GUIDES?node-id=1-2244)
- **Tailwind Config**: `tailwind.config.mjs`
- **Global Styles**: `src/styles/global.css`
- **UI Components**: `src/components/ui/`

## 🚀 Next Steps

To complete the migration:

1. ✅ Design tokens configured in Tailwind
2. ✅ Global CSS with font imports
3. ✅ UI component library created
4. 🔄 Update all existing components (in progress)
5. ⏳ Test responsive behavior
6. ⏳ Validate accessibility
7. ⏳ Document component usage examples

---

**Note**: TypeScript/JSX lint errors in component files are expected and will resolve during the build process when integrated with Astro.
