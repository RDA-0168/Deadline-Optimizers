# RailMark AI — Frontend

> **AI-Assisted Laser QR Marking & Digital Traceability for Railway Track Fittings**
> Smart India Hackathon 2026 Prototype

⚠ **DISCLAIMER:** This is a prototype/demo frontend. All data is simulated mock data for demonstration purposes only. Not affiliated with or endorsed by Indian Railways or any government body.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS v3 | Styling |
| React Router v6 | Client-side routing |
| Recharts | Data visualisation |
| Lucide React | Icons |

---

## Quick Start

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# 1. Navigate to the project folder
cd railmark-ai

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@railmark.demo | admin123 |
| Inspector | inspector@railmark.demo | demo123 |

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Hero, workflow, tech pillars |
| `/login` | Login Page | Demo credential sign-in |
| `/dashboard` | Dashboard | Stats cards + Recharts charts |
| `/scanner` | QR Scanner | Camera + manual entry |
| `/fittings` | Fitting Database | Searchable/filterable table |
| `/fittings/:id` | Fitting Details | Full record + timeline |
| `/inspection` | Inspection | Form + AI assessment panel |
| `/maintenance` | Maintenance | Records table + add form |
| `/lifecycle/:id` | Lifecycle History | Full visual timeline |
| `/analytics` | Analytics | Charts: line, bar, pie, radial |
| `/admin` | Admin Dashboard | Management table with actions |
| `/reports` | Reports | Configurable report generation |

---

## Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   └── Layout.tsx          # Sidebar + top nav
│   └── UI/
│       ├── StatusBadge.tsx     # Dynamic status indicator
│       └── LoadingSpinner.tsx  # Loading state
├── context/
│   └── AuthContext.tsx         # Auth state (mock login)
├── data/
│   └── mockData.ts             # 12 fitting records + all mock data
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── Dashboard.tsx
│   ├── QRScanner.tsx
│   ├── FittingDatabase.tsx
│   ├── FittingDetails.tsx
│   ├── InspectionPage.tsx
│   ├── MaintenancePage.tsx
│   ├── LifecycleHistory.tsx
│   ├── AnalyticsPage.tsx
│   ├── AdminDashboard.tsx
│   └── ReportsPage.tsx
├── services/
│   └── api.ts                  # API contract (currently mocked)
├── types/
│   └── index.ts                # All TypeScript types
├── App.tsx                     # Router setup
├── main.tsx                    # Entry point
└── index.css                   # Tailwind + custom styles
```

---

## Connecting to a Real Backend

All API calls are in **`src/services/api.ts`**.  
Replace the mock implementations while keeping the function signatures identical:

```typescript
// Current (mock)
export async function getFittingById(id: string): Promise<ApiResponse<Fitting>> {
  await delay();
  const fitting = MOCK_FITTINGS.find((f) => f.id === id);
  ...
}

// Replace with real API
export async function getFittingById(id: string): Promise<ApiResponse<Fitting>> {
  const res = await fetch(`/api/fittings/${id}`);
  const data = await res.json();
  return { data, error: null, success: true };
}
```

### Available API Functions

| Function | Endpoint (future) | Description |
|----------|--------------------|-------------|
| `getFittings()` | GET /api/fittings | All fittings |
| `getFittingById(id)` | GET /api/fittings/:id | Single fitting |
| `createFitting(data)` | POST /api/fittings | Create fitting |
| `updateFitting(id, data)` | PUT /api/fittings/:id | Update fitting |
| `getInspectionHistory(id)` | GET /api/fittings/:id/inspections | Inspection records |
| `addInspection(data)` | POST /api/inspections | Add inspection |
| `getAllInspections()` | GET /api/inspections | All inspections |
| `getMaintenanceHistory(id)` | GET /api/fittings/:id/maintenance | Maintenance records |
| `addMaintenance(data)` | POST /api/maintenance | Add maintenance |
| `getAllMaintenance()` | GET /api/maintenance | All maintenance |
| `getLifecycle(id)` | GET /api/fittings/:id/lifecycle | Lifecycle events |
| `getDashboardStats()` | GET /api/dashboard/stats | Dashboard data |
| `scanQrCode(qrValue)` | GET /api/scan/:qrValue | QR lookup |
| `generateReport(params)` | GET /api/reports | Report generation |

---

## Mock Data

12 fitting records covering:
- Elastic Rail Clip, Liner, GFN Shoulder, Rail Anchor, Fish Plate
- PSC Sleeper Bolt, Tie Bar, Guard Rail, Spike, Rail Pad, Bearing Plate
- Multiple railway zones: Central, Eastern, Western, Southern, etc.

---

## Design Principles

- **Dark Navy theme** — professional railway engineering aesthetic
- **No cartoons, no gaming aesthetics** — clean technical interface
- **Responsive** — desktop, tablet, mobile
- **Demo banners** — clearly marked as prototype data throughout

---

## Known Limitations (Prototype)

1. **QR decode** is simulated — use Manual Entry with demo IDs
2. **Login** uses hardcoded mock users
3. **Form submissions** save to in-memory state only (no persistence)
4. **Edit fitting** UI is stubbed (alert shown)
5. **PDF/CSV export** is stubbed (alert shown)
6. No real AI model — AI assessment is rule-based mock logic

These are all integration points for the backend team to replace.
