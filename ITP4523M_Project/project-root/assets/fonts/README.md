# Fonts Directory

This directory contains custom fonts used throughout the application.

## Primary Font: Inter

Inter is the primary typeface for the Premium Living Furniture system.

### Font Files
- `Inter-Thin.ttf` / .woff2
- `Inter-ExtraLight.ttf` / .woff2
- `Inter-Light.ttf` / .woff2
- `Inter-Regular.ttf` / .woff2
- `Inter-Medium.ttf` / .woff2
- `Inter-SemiBold.ttf` / .woff2
- `Inter-Bold.ttf` / .woff2
- `Inter-ExtraBold.ttf` / .woff2
- `Inter-Black.ttf` / .woff2

### Font Weights
- Thin: 100
- ExtraLight: 200
- Light: 300
- Regular: 400
- Medium: 500
- SemiBold: 600
- Bold: 700
- ExtraBold: 800
- Black: 900

## Secondary Font: Georgia (for print/PDF)

Georgia is used for print materials and PDF exports.

### Font Files
- `Georgia.ttf`
- `Georgia-Bold.ttf`
- `Georgia-Italic.ttf`
- `Georgia-BoldItalic.ttf`

## Icon Font (if not using SVG)

Fallback icon font if SVG icons are not available.

### Files
- `premium-living-icons.eot`
- `premium-living-icons.svg`
- `premium-living-icons.ttf`
- `premium-living-icons.woff`
- `premium-living-icons.woff2`

## Font Loading Strategy

### CSS @font-face Example
```css
@font-face {
    font-family: 'Inter';
    src: url('/assets/fonts/Inter-Regular.woff2') format('woff2'),
         url('/assets/fonts/Inter-Regular.woff') format('woff'),
         url('/assets/fonts/Inter-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
```

### Font Display
- `font-display: swap - Shows fallback font immediately, swaps when custom font loads`

### Variable Font (Optional)
Inter Variable font for more flexibility:

- `Inter-var.woff2 - Variable font with all weights in one file`

### License Information
- `Inter: SIL Open Font License, Version 1.1`
- `Georgia: System font, included with operating systems`

### CDN Fallback
If local fonts fail to load, fallback to system fonts:
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
sans-serif;