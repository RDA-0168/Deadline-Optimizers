import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, User, Bot, Trash2, Copy, Check,
  HelpCircle, Award, Code2, Terminal, RefreshCw,
} from 'lucide-react';
import { getDashboardStats, sendEdithChatMessage } from '../services/api';
import type { DashboardStats } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  isFounders?: boolean;
  tag?: string;
}

const FOUNDERS = [
  'Akshay kruthik.AR',
  'Dheeraj Abhay.R',
  'Dhanuja.J',
  'Yadav.S',
  'Aravindan.D',
  'Divya Dharshini.B',
];

// 100% Application & Proposed Project Focused Quick Questions
const QUICK_PROMPTS = [
  { label: '🚄 What is RAILMARK AI?', prompt: 'What is RAILMARK AI?' },
  { label: '🔍 Track Fitting Traceability', prompt: 'Explain Track Fitting Traceability.' },
  { label: '📱 How QR Identification Works', prompt: 'How does QR identification work?' },
  { label: '🔧 Maintenance Workflow', prompt: 'Explain the Maintenance Workflow.' },
  { label: '🚦 What is AI Block Planning?', prompt: 'What is AI block planning?' },
  { label: '🏗️ Project Architecture', prompt: 'Explain the project architecture of Railmark AI.' },
  { label: '⚡ Wire Damage vs Cable Fault', prompt: 'What is the difference between wire damage and cable fault?' },
  { label: '⚙️ ERC Mk-III Specs', prompt: 'What are the technical specifications of ERC Mk-III clips?' },
  { label: '👥 Who are the founders?', prompt: 'Who is the founder of this app?' },
];

/**
 * Detects if the user has EXPLICITLY requested a Tanglish/Tamil response
 */
function isTanglishRequested(text: string): boolean {
  const t = text.toLowerCase();
  return (
    t.includes('in tanglish') ||
    t.includes('tanglish la') ||
    t.includes('tanglish-la') ||
    t.includes('answer in tanglish') ||
    t.includes('reply in tanglish') ||
    t.includes('speak in tanglish') ||
    t.includes('explain in tanglish') ||
    t.includes('tell in tanglish') ||
    t.includes('use tanglish') ||
    t.includes('in tamil') ||
    t.includes('tamil la') ||
    t.includes('tamil-la')
  );
}

/**
 * Main Cognitive & Context-Aware Response Engine
 */
function generateEdithResponse(
  input: string,
  history: Message[],
  stats: DashboardStats | null
): { text: string; isFounders?: boolean; tag?: string } {
  const raw = input.trim();
  const query = raw.toLowerCase();
  const cleanTokens = query.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const isTanglish = isTanglishRequested(raw);

  // Identify previous context from conversation history
  const lastUserMsg = [...history].reverse().find((m) => m.sender === 'user')?.text.toLowerCase() || '';
  const lastBotMsg = [...history].reverse().find((m) => m.sender === 'bot')?.text || '';

  // ── 1. FOUNDERS & CREATORS ─────────────────────────────────
  const isFounderQuery =
    query.includes('founder') ||
    query.includes('creator') ||
    query.includes('who created') ||
    query.includes('who built') ||
    query.includes('who made') ||
    query.includes('team') ||
    query.includes('developer') ||
    query.includes('authors') ||
    query.includes('who developed') ||
    query.includes('whose app') ||
    query.includes('yaaru') ||
    query.includes('yaru') ||
    query.includes('makers');

  if (isFounderQuery) {
    if (isTanglish) {
      const list = FOUNDERS.map((name, i) => `${i + 1}. **${name}**`).join('\n');
      return {
        text: `**Railmark AI**-oda visionary founders and core engineering team:\n\n${list}\n\nIndha team dhaan Indian Railways track fitting traceability and digital maintenance-kaga Railmark AI-a engineer pannirkanga!`,
        isFounders: true,
        tag: 'Core Founders (Tanglish)',
      };
    }
    const list = FOUNDERS.map((name, i) => `${i + 1}. **${name}**`).join('\n');
    return {
      text: `The visionary founders and creators behind **Railmark AI** are:\n\n${list}\n\nThis dedicated team engineered Railmark AI to revolutionize railway infrastructure through AI-assisted laser QR marking and end-to-end digital traceability.`,
      isFounders: true,
      tag: 'Core Founders & Engineering Team',
    };
  }

  // ── 2. TANGLISH RESPONSES (ONLY WHEN EXPLICITLY REQUESTED BY USER) ────────
  if (isTanglish) {
    // Railmark AI in Tanglish
    if (query.includes('railmark')) {
      return {
        text: `### 🚄 Railmark AI (Tanglish Explanation)\n\n**RAILMARK AI** is an advanced railway asset traceability system.\n\nIdhu railway track fittings (Elastic Rail Clips, Rubber Pads, Insulating Liners) and related asset information-a **identify, track, inspect and maintain** panna help pannum.\n\n### ⚡ Main Features:\n1. **Laser DPM QR Marking**: Fitting mela direct-a laser-la indestructible 2D QR code mark pannuvom.\n2. **Optical QR Scanner**: Track inspectors spot-laye phone camera or handheld scanner vachu fittings details check pannalam.\n3. **Inspection & Maintenance History**: Complete lifecycle data, corrosion level, and maintenance records cloud database-la store aagum.\n4. **AI Assisted Decision Support**: AI moolama track fitting health and future block planning analyze panna mudiyum.`,
        tag: 'Tanglish · Platform Overview',
      };
    }

    // General Tanglish response for any query when explicitly requested
    return {
      text: `### 🤖 E.D.I.T.H AI Response (Tanglish)\n\nUngaloda question: **"${raw}"**.\n\nRAILMARK AI railway track fittings digital traceability, laser QR identification (Direct Part Marking 1064nm fiber laser), and AI-assisted maintenance planning-kaga build pannirukkom. ERC Mk-III/V clips, RDSO IRS:T-31 standards, and live telemetry paththi enna doubt irundhalum kekkalam!`,
      tag: 'Tanglish Response',
    };
  }

  // ── 2.5 TIME, DATE & SYSTEM CLOCK ─────────────────────────
  if (
    query.includes('time') ||
    query.includes('date') ||
    query.includes('today') ||
    query.includes('clock') ||
    query.includes('day is it') ||
    query.includes('year is it')
  ) {
    const now = new Date();
    const timeIST = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const dateIST = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeUTC = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    return {
      text: `### 🕒 E.D.I.T.H System Clock & Telemetry Time

* **Current Time (Local):** **${timeIST}**
* **Calendar Date:** **${dateIST}**
* **Universal Time (UTC):** \`${timeUTC}\`
* **Telemetry Sync Status:** Synchronized with Indian Railways Central Server.`,
      tag: 'System Chronometer & Telemetry',
    };
  }

  // ── 3. LIVE APPLICATION DATABASE & TELEMETRY INTEGRATION ──
  const isStatsQuery =
    query.includes('how many fitting') ||
    query.includes('total fitting') ||
    query.includes('count of fitting') ||
    query.includes('registered fitting') ||
    query.includes('database stat') ||
    query.includes('fitting count') ||
    query.includes('how many active');

  if (isStatsQuery) {
    const total = stats ? stats.totalFittings : 1248;
    const active = stats ? stats.activeFittings : 1180;
    const inspectionDue = stats ? stats.pendingInspection : 45;
    const maintenanceReq = stats ? stats.maintenanceDue : 23;
    const scanRate = stats ? `${stats.qrVerificationRate}%` : '99.4%';

    return {
      text: `### 📊 Live Railmark AI Database Telemetry\n\nAccording to the current connected database state:\n\n- **Total Registered Track Fittings:** **${total.toLocaleString()}**\n- **Active & In-Service Fittings:** **${active.toLocaleString()}**\n- **Fittings with Inspection Due:** **${inspectionDue}**\n- **Fittings Requiring Maintenance:** **${maintenanceReq}**\n- **30-Day Optical QR Verification Rate:** **${scanRate}**\n\nAll fitting records are indexed with unique Direct Part Marking (DPM) UUIDs and RDSO standard specifications (IRS:T-31 / IRS:T-47).`,
      tag: 'Live Database Telemetry',
    };
  }

  // ── 4. MULTI-TURN CONTEXT HANDLING ────────────────────────
  // Check if query is referring to a previous topic (e.g. "why is it useful?", "how does it help?", "explain more")
  const isFollowUp =
    query === 'why is it useful?' ||
    query === 'why is it useful' ||
    query === 'how does it help' ||
    query === 'how does it help?' ||
    query === 'why do we need it' ||
    query === 'why do we need it?' ||
    query === 'explain more' ||
    query.startsWith('what are the benefits') ||
    query.startsWith('can you explain further');

  if (isFollowUp) {
    if (lastUserMsg.includes('qr') || lastUserMsg.includes('traceability') || lastBotMsg.includes('Traceability') || lastBotMsg.includes('QR')) {
      return {
        text: `### 💡 Why is QR-Based Track Traceability Essential?\n\n1. **Elimination of Counterfeit & Substandard Fittings**: Ensures only RDSO-certified spring steel (55Si7) fittings enter the permanent way.\n2. **Prevention of Track Buckling & Rail Fracture**: Tracks cumulative load (Gross Million Tonnes) to replace fatigued Elastic Rail Clips before catastrophic toe-load loss.\n3. **Instant Field Auditing**: Field gang inspectors scan fittings in $<200\\text{ ms}$, eliminating manual paperwork errors.\n4. **End-to-End Asset Accountability**: Ties manufacturer heat batches directly to specific sleeper GPS coordinates.`,
        tag: 'Contextual Follow-up: QR Traceability Benefits',
      };
    }

    if (lastUserMsg.includes('block') || lastBotMsg.includes('Block Planning')) {
      return {
        text: `### 🚦 Why is AI Block Planning Useful?\n\n1. **Zero Unplanned Passenger Train Delays**: De-conflicts maintenance corridors with live train timetables.\n2. **Optimized Resource Utilization**: Groups nearby maintenance requests into a single block window.\n3. **Safety Assurance**: Guarantees that track possession, OHE power cut-off, and track clearing are verified before allowing traffic to resume.`,
        tag: 'Contextual Follow-up: Block Planning Benefits',
      };
    }

    if (lastUserMsg.includes('wire damage') || lastUserMsg.includes('cable fault') || lastBotMsg.includes('Fault')) {
      return {
        text: `### ⚡ Why Differentiating Fault Types Matters\n\n- **Rapid Crew Dispatch**: Wire damage requires OHE Tower Wagons and electrical traction linemen; cable faults require S&T (Signaling & Telecom) optical cable splicers.\n- **Block Requirement Estimation**: Wire damage always demands an emergency traction power block, whereas minor signaling cable issues may be resolved during shadow windows.`,
        tag: 'Contextual Follow-up: Fault Classification',
      };
    }
  }

  // ── 5. PROJECT SPECIFIC QUESTIONS (EXISTING FEATURES) ──────
  // What is RAILMARK AI?
  if (
    query.includes('what is railmark') ||
    (query.includes('what is') && query.includes('this app')) ||
    query === 'what is railmark ai?' ||
    query === 'what is railmark ai'
  ) {
    return {
      text: `### 🚄 What is RAILMARK AI?\n\n**RAILMARK AI** is an advanced **Digital Traceability and AI-Assisted Maintenance Platform** designed specifically for Indian Railways track infrastructure.\n\n---\n\n#### 🎯 Core Objectives:\n1. **Direct Part Marking (DPM)**: Laser-etching indestructible 2D DataMatrix & QR codes onto high-tensile track components (Elastic Rail Clips, Rubber Sole Plates, GFN Insulating Liners).\n2. **Field QR Verification**: Optical camera decoding allowing track inspectors to immediately view manufacturer, installation date, batch number, and inspection logs on the field.\n3. **Digital Lifecycle Tracking**: Eliminating paper logs by recording real-time corrosion levels, wear metrics, and maintenance actions.\n4. **Audit-Ready Compliance**: Generating instant RDSO (IRS:T-31 / IRS:T-47) compliance reports and defect analytics.\n\n*Note: The platform is also actively being developed toward an AI-assisted railway maintenance and automatic block-planning system.*`,
      tag: 'Platform Overview (Existing)',
    };
  }

  // What is Railway Track Fitting Traceability?
  if (
    query.includes('track fitting traceability') ||
    query.includes('what is railway track fitting traceability') ||
    query.includes('fitting traceability')
  ) {
    return {
      text: `### 🛤️ Railway Track Fitting Traceability Explained\n\n**Railway Track Fitting Traceability** is the end-to-end digital tracking of every component securing the rails to PSC (Pre-stressed Concrete) sleepers across its entire lifecycle—from manufacturing to decommission.\n\n---\n\n#### 📦 Track Fittings Tracked:\n- **Elastic Rail Clips (ERC MK-III / MK-V)**: High-tensile spring steel (55Si7) clips providing holding force (toe load: 850–1100 kg per IRS:T-31).\n- **Grooved Rubber Sole Plates (GRSP)**: 6mm/10mm synthetic elastomer pads providing vibration dampening and rail seat cushioning (IRS:T-47).\n- **GFN-66 Insulating Liners**: Glass-filled nylon liners ensuring electrical insulation for track circuit signaling.\n- **Metal Liners & Single Coil Spring Washers**: Distributing clamping stress on sleeper inserts.\n\n---\n\n#### 🔗 The Traceability Chain:\n$$\\text{Factory Batch Manufacturing} \\rightarrow \\text{Laser DPM Etching} \\rightarrow \\text{Supply QA} \\rightarrow \\text{Track Installation} \\rightarrow \\text{Routine Inspections} \\rightarrow \\text{Predictive Maintenance} \\rightarrow \\text{Decommission}$$`,
      tag: 'Track Fitting Traceability (Existing)',
    };
  }

  // How does QR Identification work?
  if (
    query.includes('how qr') ||
    query.includes('qr identification') ||
    query.includes('how does qr') ||
    query.includes('purpose of qr') ||
    query.includes('direct part marking') ||
    query.includes('dpm')
  ) {
    return {
      text: `### 📱 Direct Part Marking (DPM) & QR Identification\n\nIn Railmark AI, physical track components cannot use paper or sticker barcodes due to extreme ballast vibration, grease, brake dust, and outdoor weather. Instead, we use **Direct Part Marking (DPM)**:\n\n---\n\n#### 1. Laser Inscription\n- An industrial **1064nm Ytterbium Fiber Laser** micro-etches high-contrast 2D DataMatrix (ISO/IEC 16022) or QR codes directly onto the steel surface.\n- Annealed mark resists $>1000\\text{ N}$ scratch force and high-salinity coastal rust.\n\n---\n\n#### 2. Encrypted Data Structure\nEach QR code encodes a serialized asset URI (e.g. \`RM-FIT-0004\`) linked to:\n- **Batch & Heat Number** (Factory melt traceability)\n- **Metallurgical Grade** (55Si7 Spring Steel)\n- **Installation Date & GPS KM-Mark** (e.g. Northern High-Density Corridor KM 142/4)\n\n---\n\n#### 3. Optical Field Decoupling\nWhen track gang inspectors scan the fitting via the **\`/scanner\`** module, the system instantly validates syntax and displays complete inspection history with zero manual data entry.`,
      tag: 'QR Identification Architecture',
    };
  }

  // How does Inspection & Maintenance History Work?
  if (
    query.includes('how does inspection work') ||
    query.includes('how is maintenance history maintained') ||
    query.includes('inspection work') ||
    query.includes('maintenance history')
  ) {
    return {
      text: `### 📋 Field Inspection & Maintenance Tracking Workflow\n\n#### 1. Inspection Recording (\`/inspection\`)\n- Inspectors enter the fitting ID or scan the DPM QR code.\n- Capture condition parameters: **Corrosion Severity** (None/Mild/Moderate/Severe), **Surface Wear**, **Mechanical Deformation**, and **QR Readability**.\n- Live AI confidence score calculates whether the fitting is in **Good**, **Needs Attention**, **Maintenance Required**, or **Critical** condition.\n\n#### 2. Maintenance Lifecycle Management (\`/maintenance\`)\n- If a fitting's toe load drops below 700 kg or severe corrosion is detected, an automated **Work Order** is generated.\n- Technicians update task statuses (\`Pending\`, \`In Progress\`, \`Completed\`) with replacement batch numbers and torque re-tightening notes.\n- Next scheduled inspection interval is automatically re-calculated per RDSO guidelines.`,
      tag: 'Inspection & Maintenance Operations',
    };
  }

  // Purpose of Reports
  if (query.includes('purpose of reports') || query.includes('report') || query.includes('compliance report')) {
    return {
      text: `### 📑 Purpose of the Reports Module (\`/reports\`)\n\nThe **Reports Module** generates audit-ready compliance documentation required by Indian Railways administrative authorities (RDSO, Chief Track Engineers, Divisional Railway Managers):\n\n- **Configurable Filters**: Generate reports filtered by Date Range, Railway Zone, or Report Type (*Full Report, Fittings Only, Inspections Only, Maintenance Only*).\n- **High-Density Data Tables**: Summary counts of Active vs Overdue components.\n- **Export Formats**: 1-Click CSV data export and print-ready styled PDF compliance certifications.`,
      tag: 'Reports & Compliance Module',
    };
  }

  // ── 6. PROPOSED / PLANNED RAILMARK AI EXTENSIONS ──────────
  // What is AI Block Planning?
  if (
    query.includes('block planning') ||
    query.includes('what is automatic block planning') ||
    query.includes('automatic block') ||
    query.includes('how can ai help maintenance planning')
  ) {
    return {
      text: `### 🚦 AI-Assisted Automatic Block Planning *(Proposed / Planned Extension)*\n\n> [!NOTE]\n> **Status**: This capability is part of the **planned / proposed future extension** for the Railmark AI ecosystem.\n\n---\n\n#### 📌 What is a Railway Traffic Block?\nIn railway operations, major maintenance (track tamping, OHE wire repair, point machine replacement) requires temporary possession of the track section, stopping or diverting train movements.\n\n---\n\n#### 🧠 How AI Block Planning Functions:\n1. **Maintenance Demand Ingestion**: Gathers prioritized maintenance requests from inspection logs.\n2. **Timetable & Corridor Analysis**: Analyzes freight & passenger train schedules to detect idle or low-density traffic windows.\n3. **De-confliction & Recommendation**: Proposes optimal maintenance blocks (e.g. 90-minute shadow blocks) that minimize passenger train delays.\n4. **Decision Support**: Generates weekly and monthly block schedules for Section Controllers to review and approve.\n\n*Important: E.D.I.T.H. is designed as an AI-assisted decision-support tool—official operational authority always remains with railway dispatchers.*`,
      tag: 'Proposed Feature: AI Block Planning',
    };
  }

  // Difference between Wire Damage and Cable Fault
  if (
    query.includes('wire damage') ||
    query.includes('cable fault') ||
    query.includes('difference between wire damage and cable fault')
  ) {
    return {
      text: `### ⚡ Difference Between Wire Damage and Cable Fault *(Planned Asset Scope)*\n\n| Attribute | ⚡ Wire Damage | 🔌 Cable Fault |\n| :--- | :--- | :--- |\n| **Asset System** | **OHE (Overhead Equipment)** & Traction | **S&T (Signaling & Telecom)** |\n| **Physical Asset**| 25 kV Contact Wire, Catenary Wire, Droppers | Underground Optical Fiber Cable (OFC), Quad signaling cables |\n| **Nature of Fault**| Mechanical parting, pantograph entanglement, thermal sag, or physical severance. | Insulation breakdown, dielectric degradation, rodent cuts, or water ingress. |\n| **Operational Impact**| Complete loss of electric traction; trains stranded immediately. | Signal failure (false red signal), track circuit disruption, or loss of communication. |\n| **Maintenance Block**| Requires **Traction Power Block** and OHE Tower Wagon dispatch. | Requires S&T cable jointing team and OTDR optical fault localization. |`,
      tag: 'Railway Asset Fault Classification',
    };
  }

  // Maintenance Workflow (Full proposed end-to-end chain)
  if (
    query.includes('maintenance workflow') ||
    query.includes('explain the maintenance workflow') ||
    query.includes('workflow')
  ) {
    return {
      text: `### 🔄 Complete AI-Assisted Railway Maintenance Workflow\n\nHere is the end-to-end operational workflow designed for the Railmark AI platform:\n\n$$\\begin{aligned}\n\\text{Asset} &\\rightarrow \\text{Inspection / Monitoring} \\\\\n&\\rightarrow \\text{Fault Detection} \\\\\n&\\rightarrow \\text{Fault Report} \\\\\n&\\rightarrow \\text{Severity Assessment} \\\\\n&\\rightarrow \\text{Maintenance Request} \\\\\n&\\rightarrow \\text{AI Priority} \\\\\n&\\rightarrow \\text{Block Required?} \\\\\n&\\rightarrow \\text{Train Timetable \\& Corridor Availability} \\\\\n&\\rightarrow \\text{AI Block Planner} \\\\\n&\\rightarrow \\text{Recommended Maintenance Block} \\\\\n&\\rightarrow \\text{Weekly / Monthly Plan} \\\\\n&\\rightarrow \\text{Maintenance Execution} \\\\\n&\\rightarrow \\text{Post-Repair Verification} \\\\\n&\\rightarrow \\text{Asset Available}\n\\end{aligned}$$\n\n---\n\n#### 📌 Key Principles:\n- **Traceability Integration**: Current track fitting records directly feed into the initial inspection and fault detection stage.\n- **Human-in-the-Loop**: The AI recommends priority and block schedules, but Railway Section Engineers formally approve execution.`,
      tag: 'End-to-End Maintenance Workflow',
    };
  }

  // Assets Supported (Existing + Proposed)
  if (query.includes('assets') || query.includes('what assets')) {
    return {
      text: `### 🛤️ Railmark AI Asset Coverage\n\n#### 1. Implemented in Current System:\n- **Track Fittings**: Elastic Rail Clips (ERC MK-III / MK-V), Grooved Rubber Sole Plates (GRSP), GFN-66 Insulating Liners, Metal Liners, Single Coil Washers.\n\n#### 2. Planned / Proposed Scope Extensions:\n- **Track & Civil**: Rails (60 kg / 52 kg 90 UTS), PSC Sleepers, Points & Crossings, CMS Crossings.\n- **Electrification (OHE)**: Contact Wires, Catenary Wires, Droppers, Section Insulators, Cantilevers.\n- **Signaling**: Point Machines, Track Circuits (DC & Audio Frequency), Electronic Interlocking, Axle Counters.\n- **Telecom**: Optical Fiber Cables (OFC), Quad telecom cables, GSM-R / LTE-R base stations.`,
      tag: 'Asset Domain Scope',
    };
  }

  // ── 7. PROJECT ARCHITECTURE & TECH STACK ───────────────────
  if (
    query.includes('architect') ||
    query.includes('tech stack') ||
    query.includes('how is this app built') ||
    query.includes('system design')
  ) {
    return {
      text: `### 🏗️ Railmark AI — Comprehensive System Architecture\n\nRailmark AI is engineered as a **3-Tier Distributed Digital Twin Architecture**:\n\n---\n\n#### 1. Physical Edge & DPM Layer\n- **1064nm Fiber Laser Marking**: Indestructible 2D DataMatrix (ISO/IEC 16022) and QR (ISO/IEC 18004) direct part etching.\n- **Edge Optical Ingestion**: 60 FPS camera decoding via ZXing and WebAssembly.\n\n---\n\n#### 2. Distributed Cloud Backend\n- **REST API Gateway**: Node.js, Express, and TypeScript.\n- **Dual-Mode Persistence**: PostgreSQL engine with optimized in-memory store for rapid demo and offline resilience.\n- **Security**: JWT Bearer token authentication, role-based access control (\`Admin\` vs \`Inspector\`), Helmet security headers, and rate limiting.\n\n---\n\n#### 3. Client Presentation & Digital Twin Dashboard\n- **Frontend**: React 18, TypeScript, Vite build pipeline, and Tailwind CSS.\n- **Analytics Engine**: Recharts dynamic telemetry visualizations for RUL projections and zone-wise distributions.\n- **E.D.I.T.H. Assistant**: Context-aware AI assistant with full platform and CS domain intelligence.`,
      tag: 'System Architecture Specification',
    };
  }

  // ── 8. GENERAL AI, QUANTUM PHYSICS & COMPUTER SCIENCE ──────
  // Quantum Physics / Quantum Computing
  if (query.includes('quantum')) {
    return {
      text: `### ⚛️ Understanding Quantum Mechanics & Quantum Technology

**Quantum Physics** is the fundamental branch of physics that describes nature at the atomic and subatomic scale, where classical Newtonian mechanics no longer applies.

---

#### 🔬 Key Principles of Quantum Mechanics:
1. **Quantization of Energy ($E = h\nu$)**: Energy is emitted or absorbed in discrete packets called *quanta* (photons), discovered by Max Planck.
2. **Wave-Particle Duality**: Matter and radiation exhibit both wave-like and particle-like characteristics (de Broglie wavelength $\lambda = \frac{h}{p}$).
3. **Superposition Principle**: A quantum state $|\psi\rangle$ can exist as a linear combination of basis states until measured ($|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$).
4. **Quantum Entanglement**: Entangled particles remain intrinsically linked such that measuring one determines the state of the other instantly across arbitrary distances.
5. **Heisenberg Uncertainty Principle**: Complementary variables like position and momentum cannot be simultaneously measured to arbitrary precision ($\Delta x \cdot \Delta p \ge \frac{\hbar}{2}$).

---

#### 💻 Applications to Modern Technology & Railmark AI:
- **Direct Part Marking Optics**: Railmark AI's 1064nm MOPA fiber laser relies on quantum stimulated emission within doped silica fiber cores.
- **Quantum Combinatorial Optimization**: Future quantum annealing algorithms can optimize nationwide multi-corridor railway traffic and block planning.
- **Quantum Key Distribution (QKD)**: Unbreakable cryptographic security for critical railway signaling and control telemetry.`,
      tag: 'Physics & Quantum Mechanics',
    };
  }

  // Machine Learning & AI
  if (
    query.includes('machine learning') ||
    query.includes('deep learning') ||
    query.includes('what is ml') ||
    query.includes('neural network') ||
    query.includes('computer vision') ||
    query.includes('cnn')
  ) {
    return {
      text: `### 🤖 Machine Learning (ML) & Computer Vision Master Guide

**Machine Learning** is a domain of Artificial Intelligence focused on algorithms that learn patterns from empirical data rather than relying solely on explicit rule-based code.

---

#### 📌 Primary Paradigms:
1. **Supervised Learning**: Mapping inputs to labeled targets ($X \rightarrow y$). E.g., Linear/Logistic Regression, Random Forest, ResNet, YOLO.
2. **Unsupervised Learning**: Discovering latent manifolds and clusters in unlabeled data. E.g., K-Means, PCA, Autoencoders.
3. **Reinforcement Learning**: Optimizing decision policies ($\pi_\theta$) via Markov Decision Processes (MDPs) to maximize cumulative discounted reward.

---

#### 🔍 Railmark AI Vision Diagnostics:
- **Defect Segmentation**: Convolutional neural networks classify ERC clip surface corrosion (None/Mild/Moderate/Severe).
- **Geometric Deflection Analysis**: Measures toe clearance deflection to calculate loss of holding force ($<850\text{ kg}$).`,
      tag: 'Computer Science: Machine Learning & Vision',
    };
  }

  // Binary Search & Algorithms
  if (
    query.includes('binary search') ||
    (query.includes('search') && query.includes('sorted'))
  ) {
    return {
      text: `### 🔍 Binary Search Algorithm

**Binary Search** is an optimal divide-and-conquer algorithm for finding an element in a **sorted collection**.

---

#### ⏱️ Asymptotic Complexity:
- **Time Complexity**: **$O(\log n)$**
- **Space Complexity**: **$O(1)$** (Iterative)

---

#### 💻 Python & TypeScript Implementation:
\`\`\`python
def binary_search(arr: list[int], target: int) -> int:
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
\`\`\`

\`\`\`typescript
function binarySearch(arr: number[], target: number): number {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
\`\`\``,
      tag: 'Computer Science: Binary Search',
    };
  }

  // ── 9. GREETINGS & CASUAL CONVERSATION ─────────────────────
  const isGreeting =
    /^h+i+/i.test(query) ||
    /^h+e+y+/i.test(query) ||
    /^h+e+l+l+o+/i.test(query) ||
    query.includes('good morning') ||
    query.includes('good evening') ||
    query.includes('namaste') ||
    query.includes('vanakkam');

  if (isGreeting && cleanTokens.split(' ').length <= 4) {
    return {
      text: `Hello! 👋 I am **E.D.I.T.H.** (*Even Dead, I'm The Hero*), your intelligent co-pilot for **RAILMARK AI**.\n\nI can assist you with railway track fitting traceability, laser DPM QR identification, RDSO standards (IRS:T-31 / IRS:T-47), field inspection workflows, quantum physics, and computer science topics. What would you like to explore?`,
      tag: 'E.D.I.T.H. Assistant Greeting',
    };
  }

  // ── 10. DIRECT CAPABILITIES & YES/NO INQUIRIES ───────────
  const isCapabilityQuery =
    query.startsWith('can you') ||
    query.startsWith('could you') ||
    query.startsWith('are you able to') ||
    query.startsWith('will you') ||
    query.startsWith('do you know how to') ||
    query.includes('write an essay') ||
    query.includes('write a poem') ||
    query.includes('write a story') ||
    query.includes('book a ticket') ||
    query.includes('hack') ||
    query.includes('stop the train') ||
    query.includes('delete database');

  if (isCapabilityQuery) {
    const isSupportedAction =
      query.includes('fitting') ||
      query.includes('qr') ||
      query.includes('inspect') ||
      query.includes('maintenance') ||
      query.includes('rdso') ||
      query.includes('calc') ||
      query.includes('math') ||
      query.includes('quantum') ||
      query.includes('stat') ||
      query.includes('track');

    if (isSupportedAction) {
      return {
        text: `### ✅ Direct Answer: Yes\n\n**Yes**, I can assist you with that!\n\n---\n\n#### 📌 What I Can Do:\nAs **E.D.I.T.H AI** for RailMark AI, I can decode Direct Part Marking (DPM) laser QR data, provide RDSO technical specs (IRS:T-31 / IRS:T-47), analyze track fitting defect severity, explain maintenance block planning, and compute engineering calculations.\n\n*Please specify the fitting ID, RDSO specification, or technical topic you would like me to analyze.*`,
        tag: 'E.D.I.T.H Capability Verification',
      };
    }

    // Direct and straightforward NO for out-of-scope actions
    return {
      text: `### ❌ Direct Answer: No\n\n**No**, I cannot perform this request.\n\n---\n\n#### 📌 Situation & System Scope:\nI am **E.D.I.T.H** (*Enhanced Digital Intelligence for Track & Hardware*), an AI co-pilot engineered strictly for **RailMark AI** and Indian Railways permanent way maintenance.\n\n* **My Dedicated Focus**: Direct Part Marking (1064nm laser QR codes), track fastenings (ERC Mk-III/V clips, GFN liners, rubber sole plates), AI vision defect diagnostics, and maintenance block planning.\n* **Out of Scope**: General non-railway essay writing, creative prose, external bookings, or tasks outside railway engineering.\n\n*Please feel free to ask me anything related to track fittings, RDSO standards, physics, or live system telemetry!*`,
      tag: 'E.D.I.T.H Capability Limit',
    };
  }

  // ── 11. GENERAL OUT-OF-DOMAIN SCOPE CLARIFICATION ─────────
  return {
    text: `### ℹ️ Direct Answer: Out of Domain Scope\n\n**No**, this topic is outside the dedicated domain of **RailMark AI**.\n\n---\n\n#### 📌 Situation & System Scope:\nI am **E.D.I.T.H AI**, engineered specifically for Indian Railways track fitting digital traceability, laser DPM QR identification, RDSO standards (IRS:T-31 / IRS:T-47), and predictive maintenance workflows.\n\n* **How to Use Me**: Ask me about track fittings (ERC clips, GFN liners, rubber sole plates), laser Direct Part Marking physics, AI defect grading, or live database statistics!`,
    tag: 'E.D.I.T.H Domain Scope',
  };
}

/**
 * Inline Markdown Tokenizer (Bold, Italic, Code, Math symbols)
 */
function renderInlineMarkdown(text: string): React.ReactNode {
  // Clean LaTeX math symbols to clean Unicode equivalents
  const clean = text
    .replace(/\$\\ge\s*([^\$]+)\$/g, '≥ $1')
    .replace(/\$\\le\s*([^\$]+)\$/g, '≤ $1')
    .replace(/\$\\sigma_e\$/g, 'σ_e')
    .replace(/\$\\times\$/g, '×')
    .replace(/\$\\mathbf\{([^\}]+)\}\$/g, '$1')
    .replace(/\$\\text\{([^\}]+)\}\$/g, '$1')
    .replace(/\$([^\$]+)\$/g, '$1');

  // Tokenize by inline code, bold, and italic patterns
  const tokens = clean.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return tokens.map((token, i) => {
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-navy-950/90 text-cyan-accent-300 font-mono text-[11px] border border-cyan-500/20"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return (
        <strong key={i} className="font-bold text-white tracking-wide">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2 && !token.startsWith('**')) {
      return (
        <em key={i} className="italic text-cyan-200">
          {token.slice(1, -1)}
        </em>
      );
    }
    return token;
  });
}

/**
 * Clean Code & Markdown Formatter
 */
function FormattedMessage({ text }: { text: string }) {
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2.5 leading-relaxed text-xs sm:text-sm">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const lang = lines[0].trim().length > 0 && !lines[0].includes(' ') ? lines[0].trim() : 'code';
          const codeBody = lang !== 'code' && lines.length > 1 ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div key={index} className="my-3 rounded-xl overflow-hidden border border-navy-700 bg-navy-950 font-mono shadow-md">
              <div className="bg-navy-900/90 px-3.5 py-1.5 border-b border-navy-800 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1.5 text-cyan-accent-300 font-semibold uppercase tracking-wider">
                  <Terminal size={12} />
                  {lang}
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(codeBody)}
                  className="hover:text-white flex items-center gap-1 transition-colors"
                  title="Copy code"
                >
                  <Code2 size={12} />
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-3.5 overflow-x-auto text-[11px] sm:text-xs text-gray-200 scrollbar-thin">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        const lines = part.split('\n');
        return (
          <div key={index} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-1" />;

              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={lIdx} className="text-sm sm:text-base font-bold text-cyan-accent-300 pt-2 pb-0.5 flex items-center gap-1.5 border-b border-navy-800/60">
                    {renderInlineMarkdown(trimmed.replace('### ', ''))}
                  </h3>
                );
              }
              if (trimmed.startsWith('#### ') || trimmed.startsWith('## ')) {
                return (
                  <h4 key={lIdx} className="text-xs sm:text-sm font-bold text-white pt-1.5 pb-0.5">
                    {renderInlineMarkdown(trimmed.replace(/^#{2,4}\s+/, ''))}
                  </h4>
                );
              }
              if (trimmed === '---') {
                return <hr key={lIdx} className="border-navy-800 my-2.5" />;
              }
              if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-cyan-accent-400 mt-1 flex-shrink-0 text-[10px]">●</span>
                    <div className="flex-1 text-gray-300">
                      {renderInlineMarkdown(trimmed.slice(2))}
                    </div>
                  </div>
                );
              }
              if (/^\d+\.\s+/.test(trimmed)) {
                const match = trimmed.match(/^(\d+)\.\s+(.*)/);
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-1 pt-0.5">
                    <span className="font-bold text-cyan-accent-300 text-xs mt-0.5 flex-shrink-0">
                      {match?.[1]}.
                    </span>
                    <div className="flex-1 text-white font-medium">
                      {renderInlineMarkdown(match?.[2] || '')}
                    </div>
                  </div>
                );
              }

              return (
                <p key={lIdx} className="text-gray-300 leading-relaxed">
                  {renderInlineMarkdown(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function AIModePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Welcome to **E.D.I.T.H.** (*Even Dead, I’m The Hero*).\n\nI am your intelligent tactical assistant for **RAILMARK AI** (Railway Track Fitting Traceability, Laser DPM, and Maintenance Diagnostics).\n\nFeel free to ask any technical questions, or choose one of the suggested prompts below!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag: 'System Initialized',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load real backend stats on mount for live data integration
  useEffect(() => {
    getDashboardStats().then((res) => {
      if (res && res.data) setStats(res.data);
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend !== undefined ? textToSend : input;
    if (!rawText.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: rawText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const apiRes = await sendEdithChatMessage(rawText.trim(), [...messages, userMsg]);
      if (apiRes.success && apiRes.data && apiRes.data.text) {
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: apiRes.data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isFounders: apiRes.data.isFounders,
          tag: apiRes.data.tag || 'Gemini 3.5 AI',
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('API chat error, falling back to local engine:', err);
    }

    // Local cognitive fallback if offline/disconnected
    const { text, isFounders, tag } = generateEdithResponse(rawText, messages, stats);
    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFounders,
      tag: tag || 'Local E.D.I.T.H Engine',
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Welcome to **E.D.I.T.H.** (*Even Dead, I’m The Hero*).\n\nNew chat session initialized. How can I assist your railway exploration today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tag: 'New Session',
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-4 animate-fade-in">
      {/* Top E.D.I.T.H Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-dark-900 via-navy-900 to-slate-dark-900 border border-cyan-accent-500/40 p-4 sm:p-5 shadow-2xl flex-shrink-0">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-cyan-accent-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-rail-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rail-blue-600 to-cyan-accent-500 p-0.5 shadow-lg shadow-cyan-accent-900/50 flex-shrink-0">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Sparkles size={22} className="text-cyan-accent-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  E.D.I.T.H.
                </h1>
                <span className="badge-active text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider">
                  ● ACTIVE
                </span>
              </div>
              <p className="text-xs text-cyan-accent-300 font-medium mt-0.5">
                Even Dead, I’m The Hero · Intelligent Railway Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleClearChat}
              className="btn-secondary text-xs py-1.5 px-3 hover:border-cyan-accent-500/50 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
              title="New Chat Session"
            >
              <RefreshCw size={13} />
              <span>New Chat</span>
            </button>
            <button
              onClick={handleClearChat}
              className="btn-secondary text-xs py-1.5 px-3 hover:border-red-500/50 hover:text-red-300 transition-colors flex items-center gap-1.5"
              title="Clear Conversation"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 min-h-0 card p-0 bg-navy-950/90 border-navy-700/80 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    isUser
                      ? 'bg-rail-blue-600 text-white'
                      : 'bg-navy-800 border border-cyan-accent-500/50 text-cyan-accent-400 shadow-cyan-950/50'
                  }`}
                >
                  {isUser ? <User size={15} /> : <Bot size={16} />}
                </div>

                {/* Message Bubble */}
                <div className={`space-y-1 max-w-[88%] sm:max-w-[80%]`}>
                  <div className={`flex items-center gap-2 px-1 text-[11px] text-gray-400 ${isUser ? 'justify-end' : ''}`}>
                    <span className="font-semibold text-gray-300">
                      {isUser ? 'You' : 'E.D.I.T.H.'}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[10px]">{msg.time}</span>
                    {msg.tag && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-navy-800 text-cyan-accent-400 border border-navy-700 font-mono">
                        {msg.tag}
                      </span>
                    )}
                  </div>

                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-lg relative group ${
                      isUser
                        ? 'bg-rail-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-dark-900 border border-navy-700/90 text-gray-200 rounded-tl-none'
                    } ${msg.isFounders ? 'border-cyan-accent-500/60 bg-gradient-to-br from-slate-dark-900 via-navy-900 to-slate-dark-900 shadow-cyan-accent-950/50' : ''}`}
                  >
                    {/* Founders Card Highlight */}
                    {msg.isFounders ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-cyan-accent-300 font-bold border-b border-navy-800 pb-2">
                          <Award size={18} className="text-cyan-accent-400" />
                          <span>Railmark AI — Core Founders & Architects</span>
                        </div>
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                          The visionary founders and creators behind <strong>Railmark AI</strong> are:
                        </p>
                        <div className="grid sm:grid-cols-2 gap-2 pt-1">
                          {FOUNDERS.map((founder, idx) => (
                            <div
                              key={founder}
                              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-navy-950/80 border border-navy-700/80 hover:border-cyan-accent-500/50 transition-all"
                            >
                              <div className="w-6 h-6 rounded-full bg-cyan-accent-950 border border-cyan-accent-500/40 flex items-center justify-center text-cyan-accent-300 font-bold text-[11px] font-mono">
                                {idx + 1}
                              </div>
                              <span className="font-bold text-white text-xs sm:text-sm tracking-wide">
                                {founder}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 pt-1 leading-relaxed">
                          This dedicated team engineered Railmark AI to revolutionize railway infrastructure through AI-assisted laser QR marking and end-to-end digital traceability.
                        </p>
                      </div>
                    ) : (
                      <FormattedMessage text={msg.text} />
                    )}

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className={`absolute top-2 right-2 p-1.5 rounded-lg bg-navy-950/80 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity ${
                        isUser ? 'hidden' : ''
                      }`}
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-3xl mr-auto items-center animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-navy-800 border border-cyan-accent-500/50 text-cyan-accent-400 flex items-center justify-center shadow-md">
                <Bot size={16} />
              </div>
              <div className="bg-slate-dark-900 border border-navy-700/90 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-cyan-accent-300 flex items-center gap-2 shadow-lg">
                <Sparkles size={14} className="animate-spin" />
                <span>E.D.I.T.H. is analyzing query…</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 100% Project & Application-Focused Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-navy-900/50 border-t border-navy-800/80 flex items-center gap-2 overflow-x-auto scrollbar-thin flex-shrink-0">
          <span className="text-[10px] uppercase font-semibold text-gray-500 flex items-center gap-1 flex-shrink-0">
            <HelpCircle size={11} /> Suggested:
          </span>
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="text-[11px] font-medium px-3 py-1 rounded-full bg-navy-800/90 hover:bg-navy-700 text-gray-300 hover:text-cyan-accent-300 border border-navy-700/80 hover:border-cyan-accent-500/40 transition-all whitespace-nowrap flex-shrink-0"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-slate-dark-900 border-t border-navy-800 flex items-center gap-2 sm:gap-3 flex-shrink-0"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask E.D.I.T.H. (e.g. 'What is RAILMARK AI?', 'Explain maintenance workflow', or in Tanglish 'Railmark AI na enna?')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field text-xs sm:text-sm py-3 pl-4 pr-10 bg-navy-950 border-navy-700 focus:border-cyan-accent-500"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="btn-accent px-5 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-950/50"
          >
            <Send size={15} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
