# 🔴 ONYX Health+ Flow

ONYX Health+ Flow is a premium, multi-role healthcare management system and medical command center dashboard. It is designed to track clinical diagnostics, manage user/staff shifts, monitor connected medical devices, and streamline workflow operations across different organizational tiers.

Developed using **Vite**, **React**, **TypeScript**, and **Tailwind CSS**, the platform incorporates state-of-the-art glassmorphic aesthetics, micro-animations, and live data telemetry representations.

---

## ✨ Design & Experience Highlights

- **Vibrant Theme & Brand Identity**: The interface features a tailored high-fidelity HSL color palette featuring ONYX Crimson, Vibrant Teal (`#35B7C9`), and Aqua Blue, accented by Deep Navy Indigo (`#14213D`) backing panels.
- **Glassmorphic Component Layering**: All main cards and metrics views leverage translucent panels (`backdrop-filter: blur(16px)`) with glowing borders and subtle drop shadows.
- **Interactive Constellation Landing Page**: An interactive, animated SVG node constellation connects the 6 primary hospital roles directly to the pulsing ONYX Core node in a viewport-locked layout (`h-screen`, `overflow-hidden`).
- **Unified Navigation & Layout Flow**: System-wide routing duplication is prevented by modularizing the page headers and breadcrumbs. All child pages render dedicated headers dynamically, avoiding duplicate layout wraps.
- **Responsive Command Grids**: Primary interfaces are designed to fit the viewport grid without unnecessary scrolling, ensuring rapid legibility for clinical and administrative staff.

---

## 🔑 Role-Based Dashboards & Feature Matrix

ONYX Health+ Flow provides tailored dashboards for seven distinct roles inside the healthcare organization:

### 1. 👑 Super Admin
- **Role Management**: Interactive matrix for adjusting application scopes and permission toggles, featuring a visual role hierarchy hierarchy tree.
- **User Management**: Searchable and sortable master user table with action buttons, toggleable online status chips, and user profile detail panels.
- **Audit Logs**: Vertical log timeline with severity badges (Critical, Warning, Info), search filters, and JSON payload inspect drawers.

### 2. 💼 Executive Admin
- **Dashboard Overview**: Multi-metric clinical overview cards, monthly insight summaries, and organizational health dials.
- **Analytics & Reports**: Visualized clinical metrics using customized area charts and radial gauges.
- **Organizations Directory**: Glassmorphic status cards listing hospital groups, locations, and linked clusters.
- **Device Telemetry**: Real-time signal strength trackers, battery level bars, and live connection logs.

### 3. 🌐 Cluster Head
- **Dashboard Overview**: Local cluster metrics, provider maps, and quick alert tickers.
- **Linked Accounts**: External integrations, token managers, and partner authentication scopes.
- **Team Listings & Nurses**: Profiles of active healthcare providers detailing assigned portable devices, shift assignments, and quick actions.
- **Devices Inventory**: Grid tracking payment structures, connectivity status, and software versions.

### 4. 👥 User Head
- **Nurses Roster**: Rich nurse profile deck showing current schedule status, shift badge timings, and active device pairings.

### 5. 🩺 Doctor
- **Schedule**: Weekly agenda planner grid, shift duration countdown, and immediate appointment scheduling dialogs.
- **Consultations**: Patient profile cards listing diagnostic vital ranges, mock video call triggers, and quick-access clinical history sidebars.
- **Prescriptions**: Medication tracker with prescription issue panels and printable PDF layout previews.

### 6. 🩹 Nurse & 🛠️ Technician
- **Nurse Dashboard**: Vital statistics upload portal, record timeline tracking, and shift checklists.
- **Technician Dashboard**: Hardware diagnostics workspace, maintenance log dropzones, and calibration details.

---

## ⚙️ Tech Stack & Dependencies

- **Framework**: [React 18](https://react.dev/) with [Vite](https://vitejs.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Tailwindcss-Animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **UI Components**: [Radix UI Primitives](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Charts & Graphs**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Networking**: [Axios](https://axios-http.com/) & [TanStack React Query v5](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and npm/bun installed.

### Installation
1. Clone the repository and navigate to the project root:
   ```bash
   git clone <repository-url>
   cd onyx-health-flow
   ```

2. Install the project dependencies:
   ```bash
   npm install
   # or if using bun:
   bun install
   ```

3. Setup environment variables:
   Create a `.env` file in the root directory (based on `.env.example`):
   ```env
   VITE_BACKEND_URL="https://lia-unmilked-jagger.ngrok-free.dev"
   ```

4. Run the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080` (or the terminal-assigned port) to view the application.

### Build & Production
To compile and preview the production build:
```bash
npm run build
npm run preview
```

---

## 📂 Project Directory Structure

```text
onyx-health-flow/
├── public/                 # Branding assets (logos, icons)
├── src/
│   ├── components/         # Reusable UI elements & layouts
│   │   ├── auth/           # Login & authorization panels
│   │   ├── layout/         # Sidebars, Navbars, PageHeaders
│   │   └── ui/             # Radix & shadcn primitives
│   ├── hooks/              # Custom React hooks (toast, mobile-checks, theme)
│   ├── lib/                # Library configurations (utils, api-clients)
│   ├── pages/
│   │   ├── Index.tsx       # Viewport-locked Role Constellation Page
│   │   ├── NotFound.tsx    # 404 Route
│   │   └── dashboard/      # Role-based dashboards & sub-pages
│   ├── services/           # Backend API network integrations
│   └── types/              # TypeScript interfaces & API schemas
└── vite.config.ts          # Build configuration & dev proxies
```
