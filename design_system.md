# Onyx Health Flow Design System

This document outlines the visual identity, components, styling guidelines, and design tokens used in the Onyx Health Flow frontend web application.

---

## 1. Core Visual Concept
Onyx Health Flow uses a **premium, modern medical aesthetic** centered around soft pastel tones, high-gloss glassmorphism, smooth animations, and generous spacing. The layout is optimized to look premium, interactive, and visually stunning.

Key traits:
- **Soft Pastel Baby Blue Backgrounds:** Emphasizes clinical cleanliness and calm.
- **Glassmorphism Panels:** Semi-transparent cards with high backdrop blur that feel layered and floaty.
- **Pill-Shaped Rounded Corners:** Extreme corner rounding (`1.5rem` / `24px` radius) gives a friendly, state-of-the-art software feel.
- **Micro-Animations:** Subtle enter and hover transitions (e.g., hover scaling, slide-in-from-bottom, and pulse states) to keep the app feeling alive.

---

## 2. Color Palette (HSL)

All color tokens are declared as HSL variables in [index.css](file:///d:/Projects/ONYX/onyx-health-flow/src/index.css), allowing theme flexibility (light and dark mode support).

### Light Mode Color Tokens

| Token | HSL / Hex Representation | Description | Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `200 60% 96%` (Soft Pastel Blue) | Main body backdrop | Screen background |
| `--foreground` | `215 25% 27%` (Charcoal) | High contrast text color | Titles, body copy |
| `--primary` | `260 60% 65%` (Soft Royal Purple) | Main brand color | Focus, primary elements |
| `--accent` | `340 80% 65%` (Vibrant Rose/Pink) | Highlight/action color | CTAs, emphasis |
| `--secondary` | `199 89% 85%` (Baby Blue) | Soft companion color | Light contrast actions |
| `--destructive` | `0 84% 60%` (Bright Red) | Safety warnings/danger actions | Delete actions, errors |
| `--success` | `158 64% 52%` (Emerald Green) | Positive indicators | Completed states, active status |
| `--warning` | `43 96% 56%` (Golden Amber) | Informational warnings | Pending status |

### Color Utility Gradients

*   **Primary Gradient (`.gradient-primary`):** 
    `linear-gradient(135deg, hsl(260 60% 65%), hsl(340 80% 65%))` (Soft Royal Purple to Vibrant Rose/Pink)
    *Used for primary buttons, highlighted text states, and hero sections.*
*   **Login Button Gradient (`.gradient-login-btn`):** 
    `linear-gradient(90deg, #eb4e4e 0%, #b83d8a 100%)` (Coral Red to Deep Orchid Pink)
*   **Login Card Background (`.gradient-login-card`):** 
    `linear-gradient(180deg, #dfcbf7 0%, #d8b4e2 100%)` (Lilac Pastel to Soft Lavender)

---

## 3. Typography
The system uses premium sans-serif typefaces configured through Tailwind:

- **Font Family:** `Inter`, `Outfit`, `system-ui`, `sans-serif`
- **Headings (`h1`, `h2`, `h3`, etc.):** Proportioned with tighter tracking (`tracking-tight`) and semi-bold weights for readability.
- **Body Text:** Anti-aliased (`antialiased`) text rendering for ultra-crisp display across high-DPI screens.

---

## 4. UI Elements & Layout Styles

### Glassmorphism Panels (`.glass-panel`)
The core card wrapper uses semi-transparent backgrounds and heavy backdrop filters to float on top of the wavy backgrounds:
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
}
```

### Rounded Corners & Borders
- **Corners (`--radius`):** `1.5rem` / `24px` for main cards and tables.
- **Borders:** Thin, subtle separators (`border-border`, HSL `214 32% 91%`) that prevent clutter.

### Shadows
- **Card Shadow:** `0 4px 20px rgba(0, 0, 0, 0.05)` (subtle float).
- **Glass Shadow:** `0 8px 32px 0 rgba(31, 38, 135, 0.07)` (deep layered visual depth).

### Pastel Alert & Status Cards
Used to represent quick metrics or status items:
- **Green (Success):** `.card-pastel-green` (Soft emerald background with forest green text)
- **Red (Danger):** `.card-pastel-red` (Soft rose background with dark red text)
- **Purple (Primary info):** `.card-pastel-purple` (Soft lavender background with royal purple text)
- **Blue (General info):** `.card-pastel-blue` (Soft sky background with navy text)
- **Yellow (Warning):** `.card-pastel-yellow` (Soft cream background with amber text)

---

## 5. Standard Component Styling

### 1. Buttons
- **Primary CTAs:** Styled with `.gradient-primary`, white text, a rounded pill border (`rounded-2xl` / `rounded-[30px]`), and a soft shadow. Transitioned with scaling effects (`active:scale-95`).
- **Secondary Actions:** Outline buttons with primary-colored text and light borders (`border-primary/20 hover:border-primary/50`).

### 2. Form Inputs
- Fully rounded (`rounded-xl` or `rounded-2xl`).
- High-contrast border focusing (`focus:border-primary/50 focus:ring-primary/20`).

### 3. Tables
- Wrapped in borderless `.glass-panel` cards.
- **Header:** Sticky light-grey row (`bg-[#f8fafc]`) with uppercase, tracking-wide uppercase headings.
- **Rows:** Hover effects (`hover:bg-white/40`) to highlight user focus.
- **Action Buttons:** Displayed on hover inside row cells (`opacity-0 group-hover:opacity-100 transition-opacity`).
