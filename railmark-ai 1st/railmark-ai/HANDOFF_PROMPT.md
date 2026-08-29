PROJECT: RailMark AI — SIH 2026 Prototype
STACK: React 18 + TypeScript + Vite + Tailwind CSS v3 + React Router v6 + Recharts + Lucide React
LOCATION: c:\Users\velam\Videos\SIH\railmark-ai\

## WHAT'S ALREADY BUILT (do not rebuild from scratch — read/extend these files)

Config: package.json, vite.config.ts, tsconfig.json, tsconfig.node.json,
tailwind.config.js (custom navy/rail-blue/cyan-accent theme), postcss.config.js,
index.html (Google Fonts: Inter + JetBrains Mono)

Core:
- src/main.tsx, src/App.tsx (router + protected routes)
- src/index.css (Tailwind + custom component classes, scan animation, custom scrollbar)
- src/types/index.ts (all TS interfaces)
- src/data/mockData.ts (12 mock fittings, inspections, maintenance, lifecycle events, dashboard stats)
- src/services/api.ts (full API contract, currently all mocked — shaped to swap in real fetch() calls)
- src/context/AuthContext.tsx (mock login, 2 demo accounts)
- src/components/Layout/Layout.tsx (responsive sidebar + topbar)
- src/components/UI/StatusBadge.tsx, LoadingSpinner.tsx

All 12 pages exist and are functional against mock data:
LandingPage, LoginPage, Dashboard, QRScanner, FittingDatabase, FittingDetails,
InspectionPage, MaintenancePage, LifecycleHistory, AnalyticsPage, AdminDashboard, ReportsPage

Demo credentials:
- Admin: admin@railmark.demo / admin123
- Inspector: inspector@railmark.demo / demo123

Design tokens: navy-950 #080f1c (bg), slate-dark-900 #0f1623 (card/sidebar),
rail-blue-600 #0058b0 (primary), cyan-accent-500 #00b8e6 (accent), navy-700 #1e3560 (borders)

README.md in the repo has full setup instructions and the API contract — read it first.

## WHAT STILL NEEDS TO BE DONE (in priority order)

1. Environment setup (user action, verify first): Confirm Node.js LTS is installed
   (`node -v`). If not, user installs from nodejs.org, then:
   `cd "c:\Users\velam\Videos\SIH\railmark-ai" && npm install && npm run dev` -> http://localhost:5173

2. TypeScript build check: Run `npm run build` and fix any strict-mode errors.
   Likely spots: noUnusedLocals/noUnusedParameters in tsconfig, Recharts `<Cell>` missing `key` props.

3. Real QR decoding: Camera viewfinder works but QR decode is simulated in QRScanner.tsx.
   Add `html5-qrcode` package, initialize `Html5QrcodeScanner` in a useEffect, wire its success
   callback to the existing `scanQrCode()` handler.

4. Stubbed UI features that need real implementation:
   - Register New Fitting modal — button exists in FittingDatabase.tsx, no form yet
   - Edit Fitting modal — AdminDashboard.tsx button currently just shows an alert
   - PDF/CSV Export — ReportsPage.tsx button currently just shows an alert
   - Notification list — bell icon in Layout.tsx shows a badge but no dropdown/list

5. Optional enhancements if time allows (for SIH demo polish):
   - Map view of fitting locations (Leaflet.js or Google Maps)
   - Image upload in Inspection form (types.ts already has an optional `images?: string[]` field)
   - Bulk QR code generation/preview page
   - Dark/light mode toggle
   - PWA/offline support for field use

6. Backend integration: All API calls are centralized in src/services/api.ts as mocks.
   Replace each function's body with a real `fetch()` call following the existing return shape
   `{ data, error, success }`, e.g.:

   export async function getFittingById(id: string): Promise<ApiResponse<Fitting>> {
     const res = await fetch(`/api/fittings/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
     const json = await res.json();
     return res.ok ? { data: json, error: null, success: true } : { data: null, error: json.message, success: false };
   }

   Once a real backend exists, remove src/data/mockData.ts.

7. Real authentication: Replace the `login()` implementation in src/context/AuthContext.tsx
   with a real API call, keeping the existing interface `{ user, login, logout, isAuthenticated }`
   unchanged so no consuming component needs to change.

## INSTRUCTIONS FOR THE NEXT AI
Start by reading the existing files listed above (especially README.md, types/index.ts, and
services/api.ts) before writing any code, so new work matches existing patterns, naming, and the
navy/rail-blue/cyan design system. Tackle the numbered list in order unless the user says otherwise.
