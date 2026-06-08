# Design System: Uganda HIE — Public Health Intelligence Platform
## Adapted from Linear.app design system

## 1. Visual Theme & Atmosphere

The Uganda HIE platform is a dark-mode-first national
intelligence dashboard — a near-black canvas where health
data emerges with clinical precision. The design language
communicates institutional authority and data trust:
this is not a startup dashboard, it is a national health
system. The overall impression is precision engineering
applied to public health: every element in a carefully
calibrated hierarchy of luminance.

The palette is almost entirely achromatic — dark
backgrounds, white/gray text — punctuated by two
intentional accent colors:
- Uganda HIE Blue: #1a6b9a (primary interactive, CTAs)
- Alert Red: #dc2626 (critical health alerts only)
- Severity palette for the disease map only

**Key Characteristics:**
- Dark-mode-native: #08090a page background
- Inter Variable with "cv01", "ss03" globally
- Signature weight 510 for UI text
- Aggressive negative letter-spacing at display sizes
- Single brand accent: Uganda HIE Blue #1a6b9a
- Semi-transparent white borders throughout
- Alert red #dc2626 reserved exclusively for
  critical disease alerts and emergency access

## 2. Color Palette

### Backgrounds
- Page: #08090a
- Panel/Sidebar: #0f1011
- Card surface: #191a1b
- Elevated/hover: #28282c

### Text
- Primary: #f7f8f8
- Secondary: #d0d6e0
- Muted: #8a8f98
- Subtle: #62666d

### Brand & Interactive
- HIE Blue (primary CTA): #1a6b9a
- HIE Blue hover: #1d7fb8
- HIE Blue light (active state): #2596d4

### Severity (map + alerts only)
- Critical: #dc2626
- High: #f97316
- Moderate: #facc15
- Watch: #fef08a
- Safe: #22c55e
- Missing: #475569

### Borders
- Default: rgba(255,255,255,0.08)
- Subtle: rgba(255,255,255,0.05)
- Solid: #23252a

### Status
- Success: #10b981
- Warning: #f59e0b
- Error: #dc2626
- Info: #1a6b9a

## 3. Typography
- Font: Inter Variable, "cv01" "ss03"
- Fallback: SF Pro Display, -apple-system, system-ui
- Mono: Berkeley Mono, ui-monospace, SF Mono
- Weight scale: 400 (read) / 510 (navigate) / 590 (announce)
- Display sizes use negative letter-spacing:
  48px → -1.056px, 32px → -0.704px, 24px → -0.288px

## 4. Components (key rules)
- Cards: rgba(255,255,255,0.02) bg,
  1px solid rgba(255,255,255,0.08) border, 8px radius
- Buttons primary: #1a6b9a bg, white text, 6px radius
- Buttons ghost: rgba(255,255,255,0.04) bg,
  rgba(255,255,255,0.08) border, 6px radius
- Inputs: rgba(255,255,255,0.02) bg,
  rgba(255,255,255,0.08) border, 6px radius
- Badges: transparent bg, 9999px radius,
  rgba(255,255,255,0.08) border
- Severity badges: solid colored bg matching severity palette

## 5. Do's and Don'ts
DO:
- Use Inter Variable with "cv01" "ss03" everywhere
- Use weight 510 as default emphasis
- Keep backgrounds near-black
- Use semi-transparent white borders only
- Reserve HIE Blue for interactive elements only
- Reserve alert red for genuine critical health signals

DON'T:
- Use pure white (#ffffff) as text — use #f7f8f8
- Use solid colored card backgrounds
- Use HIE Blue decoratively
- Use weight 700+ anywhere
- Use warm colors in UI chrome
