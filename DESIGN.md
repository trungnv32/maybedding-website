---
name: Linen & Hue
colors:
  surface: '#fff8f6'
  surface-dim: '#f7d2cb'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ee'
  surface-container: '#ffe9e5'
  surface-container-high: '#ffe2dd'
  surface-container-highest: '#ffdad4'
  on-surface: '#2a1613'
  on-surface-variant: '#5f3e39'
  inverse-surface: '#412b27'
  inverse-on-surface: '#ffedea'
  outline: '#946e67'
  outline-variant: '#eabcb4'
  surface-tint: '#bf0800'
  primary: '#ba0800'
  on-primary: '#ffffff'
  primary-container: '#e90c00'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a7'
  secondary: '#b42818'
  on-secondary: '#ffffff'
  secondary-container: '#fe5d46'
  on-secondary-container: '#600200'
  tertiary: '#0059ba'
  on-tertiary: '#ffffff'
  tertiary-container: '#0071e8'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a7'
  on-primary-fixed: '#400100'
  on-primary-fixed-variant: '#920500'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a7'
  on-secondary-fixed: '#400100'
  on-secondary-fixed-variant: '#910902'
  tertiary-fixed: '#d7e2ff'
  tertiary-fixed-dim: '#acc7ff'
  on-tertiary-fixed: '#001a40'
  on-tertiary-fixed-variant: '#004491'
  background: '#fff8f6'
  on-background: '#2a1613'
  surface-variant: '#ffdad4'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 80px
---

## Brand & Style

This design system is built on a "Soft Minimalism" philosophy tailored for a premium Vietnamese home textile experience. It balances the cultural vibrancy of a Vivid Red with the warm, earthen energy of Terracotta and a striking Sky Blue accent. The aesthetic focuses on breathability, comfort, and high-end hospitality.

The target audience seeks quality, longevity, and a sense of "home sanctuary." The UI should feel airy and expansive, utilizing generous whitespace to mirror the feeling of fresh, crisp linens. High-quality photography of fabric textures and lifestyle settings is the primary visual driver, supported by a structured, systematic UI that remains unobtrusive.

## Colors

The palette is rooted in a triad of energy, earthiness, and clarity.

- **Primary (Vivid Red):** Used for critical call-to-actions, promotional accents, and heritage elements. It represents luck and vitality.
- **Secondary (Terracotta):** A grounding, organic red-brown ($secondary_color_hex) used for secondary UI elements, supporting the brand with a more muted, natural tone.
- **Tertiary (Sky Blue):** Used as a functional accent color ($tertiary_color_hex) for highlighting specific features or providing visual relief from the warm tones.
- **Text (Neutral):** A soft, organic taupe ($neutral_color_hex) provides high legibility while appearing more natural than pure black or cool greys.

## Typography

The design system utilizes **Be Vietnam Pro** for its excellent Unicode support and contemporary, friendly geometric construction. 

- **Hierarchical Scale:** Headlines use tighter tracking and heavier weights to command attention. 
- **Readability:** Body text maintains a generous line height (1.6) to ensure long-form reading (blogs/product descriptions) is effortless.
- **Micro-copy:** Labels and captions use increased letter spacing and uppercase styling to provide a clean, "catalog" feel.
- **Mobile scaling:** Display sizes drop by approximately 20% on mobile devices to maintain vertical rhythm without crowding the viewport.

## Layout & Spacing

The design system employs a **Fluid-Fixed Hybrid** model. While the grid is fluid on mobile, it caps at 1280px for desktop to maintain optimal line lengths for reading.

- **Mobile (Default):** A 4-column grid with 20px outside margins. 
- **Desktop:** A 12-column grid with 64px outside margins and 24px gutters.
- **Vertical Rhythm:** Large "Section Gaps" (80px+) are used to separate major content areas like Hero, Product Grid, and About Us, emphasizing the minimalist style.
- **Padding:** Use a base-4 system (4, 8, 16, 24, 32, 48, 64) for all internal component spacing.

## Elevation & Depth

To maintain the "clean" aesthetic, this design system avoids heavy shadows. 

- **Tonal Layers:** Depth is created primarily through color blocking (e.g., a white card on a light taupe background) rather than shadows.
- **Low-Contrast Outlines:** Use 1px borders in $neutral_color_hex at low opacity or the secondary color to define card boundaries.
- **Interaction Depth:** On hover, elements may lift slightly using a very soft, diffused ambient shadow (0px 4px 20px rgba(0,0,0,0.05)) to indicate interactivity without breaking the flat aesthetic.

## Shapes

The shape language is **Soft**. Corners are slightly rounded (0.25rem - 0.75rem) to suggest the softness of fabrics and home comfort, avoiding the clinical feel of sharp 90-degree angles while remaining more sophisticated than hyper-rounded "bubbly" designs.

- **Buttons/Inputs:** 4px radius.
- **Product Cards:** 8px radius.
- **Images:** 12px radius when used as standalone editorial pieces.

## Components

### Product Cards
- **Visuals:** Full-width image with no border. Product title in $neutral_color_hex, price in $secondary_color_hex.
- **Interactions:** Image zoom-in on hover. Quick-add button appears as a slide-up overlay.

### Service Highlight Cards
- **Style:** Icons in $tertiary_color_hex (Sky Blue) inside a circular container. Minimal text.
- **Layout:** Horizontal scroll on mobile, 4-column grid on desktop.

### Buttons
- **Primary:** Vivid Red background, White text. No border.
- **Secondary:** Terracotta background, White text.
- **Ghost:** Transparent background, 1px Terracotta border.
- **Hover:** All buttons transition to a slightly darker shade or gain a subtle lift shadow on hover.

### Blog List
- **Editorial Style:** Large typography for titles. Date and Category labels use $label-sm style. 
- **Images:** 16:9 aspect ratio to showcase bedroom setups.

### About Us Section
- **Composition:** Asymmetric layout. A large portrait image of fabric artisans or textile close-ups paired with a centered column of $body-lg text. Use the $primary_color_hex for a small accent line or lead-in character.

### Input Fields
- **Style:** Underlined or 1px bordered. Focus state uses $secondary_color_hex border. Labels are small and positioned above the field.