---
version: alpha
name: Apple HomeView
description: A minimal, premium consumer system with bright whitespace, restrained chrome, and product-first storytelling.
colors:
  primary: "#0071e3"
  primary-60: "#2997ff"
  secondary: "#1d1d1f"
  tertiary: "#0066cc"
  neutral: "#ffffff"
  surface: "#f5f5f7"
  on-surface: "#1d1d1f"
  border: "#e5e7eb"
  muted: "#86868b"
  success: "#34c759"
  error: "#ff3b30"
typography:
  headline-display:
    fontFamily: "SF Pro Text"
    fontSize: "56px"
    fontWeight: 700
    lineHeight: "67px"
    letterSpacing: "0px"
  headline-lg:
    fontFamily: "SF Pro Display"
    fontSize: "47px"
    fontWeight: 600
    lineHeight: "60px"
    letterSpacing: "-0.28px"
  headline-md:
    fontFamily: "SF Pro Display"
    fontSize: "40px"
    fontWeight: 600
    lineHeight: "44px"
    letterSpacing: "0px"
  headline-sm:
    fontFamily: "SF Pro Text"
    fontSize: "33px"
    fontWeight: 600
    lineHeight: "40px"
    letterSpacing: "0px"
  body-lg:
    fontFamily: "SF Pro Display"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: "42px"
    letterSpacing: "0.196px"
  body-md:
    fontFamily: "SF Pro Display"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
  body-sm:
    fontFamily: "SF Pro Text"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "0px"
  label-lg:
    fontFamily: "SF Pro Text"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0px"
  label-md:
    fontFamily: "SF Pro Text"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "22px"
    letterSpacing: "0px"
  label-sm:
    fontFamily: "SF Pro Text"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "0.02em"
  nav-link:
    fontFamily: "SF Pro Text"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "0px"
  caption:
    fontFamily: "SF Pro Text"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: "14px"
    letterSpacing: "0.01em"
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 24px
  full: 9999px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 54px
  xl: 70px
  gutter: 24px
  margin: 16px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    padding: "11px 21px"
    size: "17px"
    height: "44px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary-60}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    padding: "11px 21px"
    size: "17px"
    height: "44px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.tertiary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: "16px"
  input:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.sm}"
    padding: "12px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.secondary}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.none}"
    padding: "0px"
---

## Overview
Apple’s HomeView presentation feels polished, restrained, and product-led. The experience is intentionally spacious, with a light visual tone that keeps attention on hero imagery, headlines, and clear calls to action. It reads as premium and approachable rather than playful, with a calm editorial rhythm and very little visual clutter.

## Colors
- **Primary (#0071e3):** The signature Apple blue used for the main CTA and high-priority interaction points. It is vivid but controlled, giving the interface its strongest accent without overwhelming the imagery.
- **Primary-60 (#2997ff):** A lighter interactive blue used for secondary emphasis, especially links and outline-style actions. It softens the primary accent while preserving brand consistency.
- **Secondary (#1d1d1f):** The deep graphite text color used for headings, navigation, and body copy. It provides the high contrast that defines the brand’s crisp, premium look.
- **Tertiary (#0066cc):** A link blue used for understated text actions. It feels slightly more editorial than the filled button blue and works well for inline CTA text.
- **Neutral (#ffffff):** The dominant base color for the page and component surfaces. White space is a key part of the system, so this neutral stays clean and bright.
- **Surface (#f5f5f7):** A soft off-white used for subtle section separation or page backdrops when a pure white surface would feel too stark.
- **On-surface (#1d1d1f):** The default readable foreground on light backgrounds, matching the brand’s main text tone.
- **Border (#e5e7eb):** A faint neutral border for cards, dividers, and low-emphasis structure.
- **Muted (#86868b):** A quiet gray for auxiliary metadata, supporting text, and inactive chrome.
- **Success (#34c759):** A positive status green that fits the system’s clean, high-clarity palette.
- **Error (#ff3b30):** A strong alert red reserved for destructive or invalid states.

## Typography
The system uses SF Pro Text and SF Pro Display, mirroring Apple’s own typographic split between UI clarity and display elegance. SF Pro Text carries navigation, labels, buttons, and smaller utility copy, while SF Pro Display supports larger marketing headlines and more expressive body text. Headlines are strong but not overly heavy, with careful line heights and subtle negative tracking in the largest display style to keep the composition compact and refined.

The hierarchy is simple: `headline-display` and `headline-lg` for hero statements, `headline-md` and `headline-sm` for section titles, `body-lg` for promotional subhead copy, and `body-md` / `body-sm` for standard UI prose. Labels and navigation rely on `label-lg`, `label-md`, and `nav-link` to maintain crisp legibility at small sizes. Uppercase treatment is not a defining pattern in the screenshot; the system instead depends on weight, size, and spacing rather than lettercase for emphasis.

## Layout
The layout is centered and fluid, with a large hero zone and a strong vertical flow from navigation to headline to CTA to product imagery. Content is given generous breathing room, and spacing scales up quickly between major storytelling blocks rather than relying on dense modular grids. Section separation is achieved through whitespace and image-led composition rather than complex containers.

The spacing rhythm is anchored by 8px, 16px, 24px, 54px, and 70px steps. Smaller increments support tight UI structures like navigation and button padding, while larger increments create the signature Apple page openness. Cards and minor containers should favor compact internal padding, but larger promotional panels can use wider margins and substantial negative space around imagery.

## Elevation & Depth
This system is intentionally flat in the UI chrome. Instead of heavy shadows or layered surfaces, hierarchy is created through scale, contrast, image prominence, and whitespace. When depth appears, it is subtle and product-based rather than structural: soft ambient shadows beneath devices and restrained tonal separation between sections.

Borders are minimal and light, used more as a quiet boundary than a visual effect. Avoid strong material cues, glossy overlays, or aggressive shadow stacks; the brand language relies on clarity and precision, not dimensional ornament.

## Shapes
The shape language is soft and highly rounded for interactive controls, with `rounded.full` defining the familiar pill button. Cards and panels use modest radii like `rounded.sm` to keep the interface crisp and understated. Overall, the feel is polished and approachable, with rounded geometry that supports the smooth, consumer-friendly tone.

## Components
Buttons are the most distinctive interactive element. `button-primary` is a filled blue pill with white text, 11px vertical and 21px horizontal padding, and a 44px minimum height for comfortable tapping. `button-secondary` keeps the same pill shape and sizing but uses a transparent background with a blue outline and blue text. `button-link` is text-only, underlined, and visually quiet; use it for secondary navigation or inline actions rather than prominent tasks.

Buttons should remain lightweight in appearance: no shadows, no gradients, and no heavy borders beyond the 1px outline on secondary variants. Hover and focus states should feel subtle, preserving the calm premium tone. On dense interfaces, keep button labels short and use the pill silhouette to signal action without needing extra decoration.

Cards use `card` styling: white backgrounds, a 1px neutral border, small radius, and 16px padding. They should feel like content holders rather than elevated widgets. Inputs should follow the same restrained logic as cards, with soft borders, simple surfaces, and compact padding. Keep form elements visually quiet so they do not compete with product imagery.

Navigation items should use `nav-item` styling: transparent background, small text, and no visible chrome. Links and utility text should remain understated, with color doing most of the work. Chips, toggles, and other compact controls should inherit the same low-contrast, rounded, minimal language if introduced later.

## Do's and Don'ts
- Do keep layouts spacious and centered, with clear visual hierarchy driven by size and whitespace.
- Do use SF Pro Text for controls and SF Pro Display for larger editorial headlines.
- Do favor pill buttons for primary actions and keep their states subtle.
- Do preserve the bright white or near-white canvas as the dominant background.
- Don't introduce heavy shadows, glassmorphism, or decorative depth effects.
- Don't use loud accent colors beyond the established blue, graphite, and restrained utility tones.
- Don't crowd sections with dense copy or excessive UI chrome.
- Don't round every surface equally; reserve full pills for actions and keep cards modest.
