# RailMark AI — Backend REST API
> **AI-Assisted Laser QR Marking & Digital Traceability for Railway Track Fittings**  
> *Smart India Hackathon (SIH) Prototype*

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21+-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> [!IMPORTANT]
> **DISCLAIMER**: All data, schemas, fitting identifiers, and coordinates provided in this repository are **DEMO / PROTOTYPE DATA ONLY** designed for the Smart India Hackathon. This project is not affiliated with or utilizing live databases of Indian Railways / RDSO.

---

## 📖 Table of Contents
1. [System Architecture](#-system-architecture)
2. [Core Technology Stack](#-core-technology-stack)
3. [Quick Start & Setup](#-quick-start--setup)
4. [Demo Accounts & Authentication](#-demo-accounts--authentication)
5. [Database Architecture & Switching](#-database-architecture--switching)
6. [Interactive Swagger API Docs](#-interactive-swagger-api-docs)
7. [API Endpoints Catalog](#-api-endpoints-catalog)
8. [Sample Request & Response Contracts](#-sample-request--response-contracts)
9. [Frontend Integration Guide](#-frontend-integration-guide)
10. [Running Automated Tests](#-running-automated-tests)

---

## 🏛️ System Architecture

RailMark AI delivers an end-to-end digital traceability chain for railway track fittings:

```
+-----------------------------------------------------------------------------------+
|                                 CORE DATA FLOW                                    |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   +-------------------+          +-------------------+                            |
|   | Optical QR Scanner| -------> | POST /api/qr/     |                            |
|   | / Handheld Device |          | resolve           |                            |
|   +-------------------+          +---------+---------+                            |
|                                            |                                      |
|                                            v Resolves Fitting ID                  |
|                                  +-------------------+                            |
|                                  | GET /api/fittings/|                            |
|                                  | :fittingId        |                            |
|                                  +---------+---------+                            |
|                                            |                                      |
|                                            v Fetches Composite Profile            |
|                  +-------------------------+-------------------------+            |
|                  |                         |                         |            |
|                  v                         v                         v            |
|         [Basic & Location]        [Inspection Records]     [Maintenance & Timeline]|
|         - Fitting Type            - Field Condition         - Work Orders         |
|         - GPS Coordinates         - AI Vision Advisory      - Scheduled Next Date |
|         - Torque Specs            - QR Readability Score    - Full Lifecycle Logs |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Layered Architecture Structure:
```
railmark-backend/
├── src/
│   ├── app.ts                  # Express application setup, middlewares, Swagger
│   ├── server.ts               # Server startup & graceful shutdown
│   ├── config/                 # Typed environment & Swagger configuration
│   ├── constants/              # Roles, Fitting statuses, Event types
│   ├── types/                  # TypeScript interfaces for all domain models
│   ├── schemas/                # Zod request validation schemas
│   ├── middlewares/            # JWT authentication, RBAC, Rate Limiting, Error handling
│   ├── db/                     # Dual-mode DB Engine (Embedded & PostgreSQL) + Seed data
│   ├── services/               # Business logic layer
│   ├── controllers/            # Request & response controllers
│   └── routes/                 # Express route definitions
├── docs/                       # Ready-to-import Postman Collection
├── tests/                      # Automated Vitest integration tests
└── package.json
```

---

## 💻 Core Technology Stack
- **Runtime**: Node.js (v20+ / v24 LTS)
- **Language**: TypeScript (strict mode enabled)
- **Framework**: Express.js
- **Validation**: Zod
- **Authentication**: JSON Web Tokens (JWT) + Bcrypt password hashing
- **Security**: Helmet, CORS, Express Rate Limit
- **Documentation**: Swagger UI & OpenAPI 3.0 specification
- **Database Engine**: Pluggable PostgreSQL-compatible dual-mode architecture (embedded transactional in-memory engine out-of-the-box + PostgreSQL connection support via `pg`)

---

## 🚀 Quick Start & Setup

### 1. Prerequisites
- Node.js (v20 or higher) and npm installed.

### 2. Installation
```bash
# Navigate to the project directory
cd railmark-backend

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Default `.env` configuration:
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=railmark_secure_sih_prototype_jwt_secret_key_2026!
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
DB_TYPE=memory
```

### 4. Start Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

---

## 👥 Demo Accounts & Authentication

Pre-seeded prototype users with hashed credentials:

| Role | Username / Email | Password | Allowed Actions |
|---|---|---|---|
| **ADMIN** | `admin` / `admin@railmark.ai` | `Admin@123` | Full access (Create, Update, Delete fittings, View audit logs) |
| **INSPECTOR** | `inspector` / `inspector@railmark.ai` | `Inspector@123` | Create fittings, Submit inspections with AI advisory, Search |
| **MAINTENANCE** | `maintenance` / `maintenance@railmark.ai` | `Maintenance@123` | Submit maintenance logs, Update status, Search |

---

## 🗄️ Database Architecture & Switching

RailMark AI is built with a dual-mode database engine:

### Mode 1: Zero-Config In-Memory Engine (Default: `DB_TYPE=memory`)
- Runs instantly on any machine with zero external database dependencies.
- Automatically pre-seeded with 12 realistic railway track fittings, inspection histories with AI vision advisory scores, maintenance logs, and lifecycle event records.
- Perfect for hackathon presentations and frontend development.

### Mode 2: PostgreSQL Database (`DB_TYPE=postgres`)
To connect to an external PostgreSQL instance (local, Supabase, Neon, AWS RDS):
1. In `.env`, set:
   ```env
   DB_TYPE=postgres
   DATABASE_URL=postgresql://postgres:password@localhost:5432/railmark_db
   ```
2. Execute `schema.sql` found in `src/db/schema.sql` on your PostgreSQL instance.
3. Run the seeder script:
   ```bash
   npm run seed
   ```

---

## 📖 Interactive Swagger API Docs

Explore and test all endpoints interactively in your browser:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

---

## 📡 API Endpoints Catalog

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate user, receive JWT Bearer token |
| `POST` | `/api/auth/register` | Admin | Register a new user |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |

### 2. QR Code & Laser Marking (`/api/qr`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/qr/resolve` | Public | Resolve scanned QR payload/URL to Fitting ID |
| `GET` | `/api/qr/:fittingId` | Public | Retrieve laser marking technical specifications |

### 3. Fittings Management (`/api/fittings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/fittings` | Public | List all fittings with pagination & filters |
| `GET` | `/api/fittings/:fittingId` | Public | Full composite profile (Basic, Installation, QR, History) |
| `POST` | `/api/fittings` | Admin, Inspector | Register new fitting with initial lifecycle events |
| `PUT` | `/api/fittings/:fittingId` | Admin | Update fitting parameters & status |
| `DELETE` | `/api/fittings/:fittingId` | Admin | Delete fitting (Prototype admin use) |

### 4. Field Inspections & AI Advisory (`/api/fittings/:fittingId/inspections`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/fittings/:fittingId/inspections` | Public | List all inspections for a fitting |
| `POST` | `/api/fittings/:fittingId/inspections` | Inspector, Admin | Submit inspection with AI assistance results |

### 5. Maintenance Operations (`/api/fittings/:fittingId/maintenance`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/fittings/:fittingId/maintenance` | Public | List maintenance records for a fitting |
| `POST` | `/api/fittings/:fittingId/maintenance` | Maintenance, Admin | Submit maintenance activity & next scheduled date |

### 6. Digital Lifecycle Timeline (`/api/fittings/:fittingId/lifecycle`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/fittings/:fittingId/lifecycle` | Public | Get chronological lifecycle events |

### 7. Search & Analytics (`/api/search` & `/api/dashboard`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/search?q=` | Public | Global search (Fitting ID, QR, Type, Manufacturer, Location) |
| `GET` | `/api/dashboard/stats` | Public | Aggregate operational KPIs & condition breakdowns |
| `GET` | `/api/audit-logs` | Admin, Inspector | Audit logs with timestamp, actor, and action type |

---

## 📦 Sample Request & Response Contracts

### 1. QR Code Resolution
**`POST /api/qr/resolve`**
```json
// Request Body
{
  "qrValue": "RM-FIT-0001"
}

// Success Response (200 OK)
{
  "success": true,
  "fittingId": "RM-FIT-0001",
  "data": {
    "fittingId": "RM-FIT-0001",
    "qrValue": "RM-FIT-0001",
    "fittingType": "Elastic Rail Clip (ERC MK-III)",
    "manufacturer": "Demo Manufacturer A",
    "batchNumber": "BATCH-2026-001",
    "status": "Active",
    "verificationStatus": "Verified",
    "laserMarkDate": "2026-01-12T10:15:00.000Z"
  }
}
```

### 2. Composite Fitting Details
**`GET /api/fittings/RM-FIT-0001`**
```json
{
  "success": true,
  "data": {
    "basicInfo": {
      "fittingId": "RM-FIT-0001",
      "fittingType": "Elastic Rail Clip (ERC MK-III)",
      "manufacturer": "Demo Manufacturer A",
      "batchNumber": "BATCH-2026-001",
      "manufacturingDate": "2026-01-10",
      "materialGrade": "Spring Steel 55Si7",
      "standardSpec": "IRS:T-31-2021",
      "status": "Active"
    },
    "installationInfo": {
      "railLine": "Northern High-Density Corridor",
      "trackSection": "Section KM 142/4 - Up Main Line",
      "sleeperNumber": "PSC-SLP-4401",
      "gpsLatitude": 28.613939,
      "gpsLongitude": 77.209021,
      "installedBy": "Track Maintenance Gang #4",
      "installationDate": "2026-01-25",
      "torqueSpecNm": 110
    },
    "qrInfo": {
      "qrCodeValue": "RM-FIT-0001",
      "laserMarkDate": "2026-01-12T10:15:00.000Z",
      "markingMachineId": "LASER-ENG-MARK-04",
      "qrVerificationStatus": "Verified"
    },
    "inspections": [
      {
        "id": "INS-001",
        "fittingId": "RM-FIT-0001",
        "inspectionDate": "2026-02-15T10:30:00.000Z",
        "inspectorName": "Ananya Verma (Senior Track Inspector)",
        "condition": "Good",
        "qrReadability": "High",
        "corrosion": "None",
        "surfaceDamage": "None",
        "deformation": "None",
        "wear": "Minimal",
        "notes": "Fitting securely clamped into rail base. Laser QR crisp and easily scanable.",
        "aiAssistanceResult": "AI Vision Assist: Normal contour detected. Toe load calculated within nominal 850-1100 kgf range. No surface cracks identified.",
        "aiConfidence": 0.985
      }
    ],
    "maintenance": [
      {
        "id": "MNT-001",
        "fittingId": "RM-FIT-0001",
        "maintenanceDate": "2026-02-10T11:00:00.000Z",
        "maintenanceType": "Routine Torque Check & Anti-Corrosion Coating",
        "technicianName": "Vikram Singh (Track Maintenance Lead)",
        "description": "Verified clip toe load, applied RDSO-approved bituminous protective coat.",
        "status": "Completed",
        "nextMaintenance": "2026-08-10"
      }
    ],
    "lifecycle": [
      {
        "id": "LC-001-1",
        "eventType": "Manufactured",
        "eventDate": "2026-01-10T09:00:00.000Z",
        "actor": "Demo Manufacturer A (Plant #1)",
        "location": "Forging Bay 3, Industrial Area, Ghaziabad",
        "details": "Hot forged from 55Si7 alloy, heat-treated and quenched to 44-48 HRC."
      },
      {
        "id": "LC-001-3",
        "eventType": "Installed",
        "eventDate": "2026-01-25T14:30:00.000Z",
        "actor": "Track Maintenance Gang #4",
        "location": "Northern High-Density Corridor, KM 142/4 (Up Line, Sleeper 4401)",
        "details": "Inserted into PSC sleeper insert using hydraulic clip driving machine."
      },
      {
        "id": "LC-001-4",
        "eventType": "Inspected",
        "eventDate": "2026-02-15T10:30:00.000Z",
        "actor": "Ananya Verma (Senior Track Inspector)",
        "location": "Northern High-Density Corridor, KM 142/4",
        "details": "Routine periodic track inspection completed. Condition: Good. AI Vision Assist verified toe seat alignment."
      }
    ]
  }
}
```

### 3. Submit Field Inspection with AI Advisory
**`POST /api/fittings/RM-FIT-0001/inspections`**
```json
// Headers: Authorization: Bearer <INSPECTOR_OR_ADMIN_TOKEN>
// Request Body:
{
  "condition": "Good",
  "qrReadability": "High",
  "corrosion": "None",
  "surfaceDamage": "None",
  "deformation": "None",
  "wear": "Minimal",
  "notes": "Fastener fully locked into sleeper insert.",
  "aiAssistanceResult": "AI Vision Assist: Structural integrity 98.8%. No surface microcracks detected.",
  "aiConfidence": 0.988
}

// Response (201 Created)
{
  "success": true,
  "message": "Track inspection record submitted successfully",
  "data": {
    "id": "INS-1740801234567",
    "fittingId": "RM-FIT-0001",
    "condition": "Good",
    "aiAssistanceResult": "AI Vision Assist: Structural integrity 98.8%. No surface microcracks detected.",
    "aiConfidence": 0.988,
    "createdAt": "2026-02-28T10:00:00.000Z"
  }
}
```

---

## 🎨 Frontend Integration Guide

If you are building the React / Next.js / Mobile Frontend:

1. **Base URL**: `http://localhost:5000`
2. **Scanner Flow**:
   ```javascript
   // Step 1: User scans QR code using camera scanner library (e.g. html5-qrcode)
   const scannedText = "RM-FIT-0001"; // or full URL "https://railmark.ai/trace/RM-FIT-0001"

   // Step 2: Resolve QR code to unique Fitting ID
   const resolveRes = await fetch("http://localhost:5000/api/qr/resolve", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ qrValue: scannedText }),
   });
   const { fittingId } = await resolveRes.json();

   // Step 3: Fetch complete lifecycle record
   const detailsRes = await fetch(`http://localhost:5000/api/fittings/${fittingId}`);
   const { data } = await detailsRes.json();
   console.log(data.basicInfo, data.lifecycle, data.inspections);
   ```

3. **Postman Collection**:
   Directly import `docs/railmark-postman-collection.json` into Postman to test all endpoints.

---

## 🧪 Running Automated Tests

Run the automated integration test suite:
```bash
npm run test
```

Build production bundle:
```bash
npm run build
```
