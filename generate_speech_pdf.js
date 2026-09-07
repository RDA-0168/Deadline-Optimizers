const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputPath = path.join(__dirname, 'RAILMARK_AI_PRESENTATION_SPEECH_AND_QA.pdf');
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 36, bottom: 36, left: 36, right: 36 },
  bufferPages: true,
  autoFirstPage: true,
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Colors
const NAVY_DARK = '#0B192C';
const NAVY_MID = '#1E3E62';
const CYAN_ACCENT = '#0284C7';
const CYAN_LIGHT = '#0EA5E9';
const TEXT_DARK = '#0F172A';
const TEXT_BODY = '#334155';
const TEXT_MUTED = '#64748B';
const BG_CARD = '#F8FAFC';
const BORDER_COLOR = '#E2E8F0';

function drawHeaderBanner(title, subtitle, badge) {
  const startY = doc.y;
  doc.rect(36, startY, 523, 62).fill(NAVY_DARK);
  doc.rect(36, startY + 60, 523, 2).fill(CYAN_ACCENT);

  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(16).text(title, 48, startY + 12);
  doc.fillColor('#94A3B8').font('Helvetica').fontSize(9).text(subtitle, 48, startY + 34);

  doc.fillColor(CYAN_LIGHT).font('Helvetica-Bold').fontSize(8).text(badge, 380, startY + 18, { width: 165, align: 'right' });
  doc.y = startY + 74;
}

function drawSectionHeader(title) {
  doc.moveDown(0.5);
  const y = doc.y;
  doc.rect(36, y, 523, 22).fill(BG_CARD);
  doc.rect(36, y, 4, 22).fill(CYAN_ACCENT);
  doc.fillColor(NAVY_DARK).font('Helvetica-Bold').fontSize(11).text(title, 46, y + 6);
  doc.y = y + 28;
}

function drawSpeechBlock(timeBadge, sectionTitle, content, bullets) {
  const startY = doc.y;
  doc.fontSize(9.5);

  // Time Badge
  doc.fillColor(CYAN_ACCENT).font('Helvetica-Bold').fontSize(8.5).text(`[ ${timeBadge} ]  ${sectionTitle}`, 40, startY);
  doc.moveDown(0.3);

  // Text
  doc.fillColor(TEXT_BODY).font('Helvetica').fontSize(9).text(content, { lineGap: 2 });

  if (bullets && bullets.length > 0) {
    doc.moveDown(0.2);
    bullets.forEach(b => {
      doc.fillColor(TEXT_BODY).font('Helvetica').fontSize(8.5).text(`  •  ${b}`, { indent: 10, lineGap: 1.5 });
    });
  }
  doc.moveDown(0.6);
}

function drawQABlock(num, question, answer, bullets) {
  // Check if we need page break
  if (doc.y > 680) {
    doc.addPage();
  }

  const startY = doc.y;
  doc.rect(36, startY, 523, 20).fill('#F1F5F9');
  doc.fillColor(NAVY_DARK).font('Helvetica-Bold').fontSize(9).text(`Q${num}: ${question}`, 42, startY + 5);

  doc.y = startY + 24;
  doc.fillColor(TEXT_BODY).font('Helvetica').fontSize(8.5).text(answer, 42, doc.y, { width: 510, lineGap: 2 });

  if (bullets && bullets.length > 0) {
    doc.moveDown(0.2);
    bullets.forEach(b => {
      doc.fillColor(TEXT_BODY).font('Helvetica').fontSize(8.5).text(`  •  ${b}`, { width: 510, indent: 8, lineGap: 1.5 });
    });
  }
  doc.moveDown(0.5);
}

// ── PAGE 1: Presentation Pitch Script ───────────────────────
drawHeaderBanner(
  'RAILMARK AI',
  'AI-Assisted Laser QR Marking & Digital Traceability for Railway Track Fittings',
  'SIH 2026 PROTOTYPE\nrailmark-ai.onrender.com'
);

drawSectionHeader('🎙️ PART 1: 5-Minute Pitch Presentation Script (SIH Demonstration)');

drawSpeechBlock(
  '0:00 - 0:45',
  'The Hook & Critical Problem Statement',
  '"Respected Judges, Evaluators, and Dignitaries, Good Morning. Across the 68,000+ route kilometers of Indian Railways, over 1.2 billion elastic track fittings hold rails securely to concrete sleepers. These components—Elastic Rail Clips (ERC), rubber pads, and insulating liners—bear dynamic loads of 10,000+ trains carrying 24 million passengers daily. Today, the biggest bottleneck is The Lack of Component Traceability:"',
  [
    'Track fittings are anonymous bulk items with zero record of factory melt or installation date.',
    'Inspection is manual on paper loggers, causing critical delays in catching fatigue cracks or pitting corrosion.',
    'Substandard or counterfeit fittings can enter supply lines without an immutable digital footprint.'
  ]
);

drawSpeechBlock(
  '0:45 - 2:00',
  'The Solution & Four Technical Pillars',
  '"RAILMARK AI transforms track fittings into intelligent digital twins through four foundational pillars:"',
  [
    '1. Direct Part Marking (DPM) Laser QR: 1064nm Fiber Laser micro-etches high-contrast 2D DataMatrix on 55Si7 Spring Steel (IRS:T-31), resisting >1000 N ballast scratch force.',
    '2. Sub-200ms Optical QR Field Scanner: Field inspectors scan fittings with mobile cameras to decode encrypted UUIDs and load lifecycle logs instantly.',
    '3. AI Vision Defect Inspection: YOLOv8-Rail segments pitting corrosion (C0–C4), wear, and deformation. Confidence is strictly capped at 99.0% for human-in-the-loop safety.',
    '4. Physics-Informed Predictive RUL: Paris-Erdogan fatigue crack law combined with cumulative Gross Million Tonnes (GMT) forecasts clip lifespan before toe load drops <700 kg.'
  ]
);

drawSpeechBlock(
  '2:00 - 3:30',
  'Live Product Demonstration Walkthrough',
  '"Our live deployed platform at railmark-ai.onrender.com provides a comprehensive end-to-end suite:"',
  [
    'Dashboard: Real-time command center with high-level KPI cards, status distributions, and active alert feeds.',
    'Fitting Database: Master registry indexing 1,248+ track components with multi-factor filtering by Zone and Status.',
    'QR Scanner & Inspection: Field camera ingestion generating deterministic AI condition evaluations.',
    'Maintenance Work Orders: Automatic dispatch of gang intervention tasks when wear crosses safety limits.',
    'Compliance Reports: 1-Click export of RDSO-compliant PDF and CSV audit certificates.',
    'AI Mode (E.D.I.T.H.): Conversational assistant providing live database telemetry and English + Tanglish support.'
  ]
);

drawSpeechBlock(
  '3:30 - 4:15',
  'Future Vision: Multi-Asset Scope & AI Block Planning',
  '"Looking forward, Railmark AI is architected to scale into a Unified AI Maintenance Ecosystem:"',
  [
    'Multi-Asset Scope: Expanding to OHE Contact Wires, Points & Crossings, Signals, and S&T OFC Cables.',
    'AI Automatic Block Planning: Ingesting passenger train timetables to allocate optimal maintenance shadow blocks without passenger train delays.'
  ]
);

drawSpeechBlock(
  '4:15 - 5:00',
  'Conclusion & Impact',
  '"In summary, RAILMARK AI delivers 100% digital component accountability, zero counterfeit fittings, and proactive predictive maintenance to prevent derailments before they occur. Built proudly for Indian Railways by our team: Akshay kruthik.AR, Dheeraj Abhay.R, Dhanuja.J, Yadav.S, Aravindan.D, and Divya Dharshini.B. Thank you!"'
);

// ── PAGE 2: Jury Q&A Defense Guide ──────────────────────────
doc.addPage();

drawHeaderBanner(
  'RAILMARK AI — JURY DEFENSE GUIDE',
  'Technical Q&A Defense & Architecture Clarifications',
  'SIH 2026 JURY DEFENSE'
);

drawSectionHeader('🎯 PART 2: Comprehensive Jury Q&A Defense Guide');

drawQABlock(
  1,
  'Why Direct Part Marking (DPM) Laser Etching instead of RFID tags or barcode stickers?',
  'Barcode stickers peel off within days due to weather, grease, and ballast vibration. Traditional RFID tags fail because RFID chips/antennas shatter under high-frequency ballast vibrations (up to 2,000 Hz) caused by 25-tonne axle loads, and nearby ferromagnetic rails create severe electromagnetic shielding.',
  [
    'Laser DPM Annealing (1064nm Fiber Laser) alters surface microstructure of 55Si7 Spring Steel without inducing thermal micro-cracks.',
    'Resists >1,000 N ballast scratch force and lasts for the entire 15+ year operational lifespan.'
  ]
);

drawQABlock(
  2,
  'Does laser marking weaken the Elastic Rail Clip (ERC) or cause premature fatigue failure?',
  'No. We utilize Fiber Laser Annealing rather than aggressive laser ablation or deep mechanical stamping.',
  [
    'Etching depth is constrained to <= 15 microns, well within the allowable decarburized surface layer permitted under RDSO IRS:T-31-2021.',
    'The laser operates at high repetition rates (20–80 kHz) with controlled pulse duration to prevent localized heat-affected zones (HAZ).'
  ]
);

drawQABlock(
  3,
  'What if the QR code is covered in track grease, mud, or brake dust on the field?',
  'We implement a 3-tier optical recovery pipeline:',
  [
    'Level H Error Correction: Encoded using ECC 200 Reed-Solomon algorithms, scanning successfully even if up to 30% of the code is obscured.',
    'Optical Pre-Processing: Adaptive Otsu binarization and contrast stretching on the camera video stream.',
    'Human-Readable Serial: Every DPM code includes a laser-etched alphanumeric UUID (e.g. RM-FIT-0004) for manual lookup.'
  ]
);

drawQABlock(
  4,
  'How does AI Vision Defect model work and why is confidence capped at 99.0%?',
  'We use a fine-tuned YOLOv8-Rail segmentation network evaluating pitting corrosion (C0-C4), surface wear, and deformation.',
  [
    'Loss function: L_total = lambda_box * L_CIoU + lambda_cls * L_BCE + lambda_dfl * L_DFL.',
    '99.0% Confidence Capping: Under railway safety standards (CENELEC EN 50126/50128), 100% confidence is technically dangerous. Capping at 99.0% enforces an architectural Human-in-the-Loop paradigm where AI assists but the certifying engineer retains statutory authority.'
  ]
);

drawQABlock(
  5,
  'How is Remaining Useful Life (RUL) calculated mathematically?',
  'RUL couples cumulative Gross Million Tonnes (GMT) load data with physical fatigue degradation laws:',
  [
    'Paris-Erdogan Crack Growth Law: da/dN = C * (Delta K)^m = C * (Delta sigma * sqrt(pi * a) * Y)^m',
    'Toe Load Exponential Decay (IRS:T-31): T(t) = T0 * exp(-kappa * (GMT/100)^alpha) - delta_corrosion',
    'When projected toe load reaches <700 kg (nominal: 850-1100 kg), an automated replacement work order is scheduled.'
  ]
);

drawQABlock(
  6,
  'How does the application work in remote rural track sections with zero internet connectivity?',
  'Railmark AI utilizes a Local-First Edge Architecture (Progressive Web App):',
  [
    'YOLOv8 vision weights and ZXing QR decoders run locally on the device via WebAssembly.',
    'Offline inspection logs queue in an encrypted local IndexedDB store with GPS coordinates and timestamps.',
    'When the device reconnects to 4G/5G or station Wi-Fi, background delta synchronization automatically updates the central PostgreSQL database.'
  ]
);

drawQABlock(
  7,
  'What is E.D.I.T.H. and why does it support Tanglish?',
  'E.D.I.T.H. (Even Dead, I’m The Hero) is our multi-domain AI assistant:',
  [
    'Provides live database telemetry (1,248 registered fittings, 1,180 active) and explains technical algorithms on-demand.',
    'Tanglish Support: Ground-level track maintainers, keymen, and gangmen in Southern divisions often communicate in conversational Tanglish (e.g. "Railmark AI na enna?"). E.D.I.T.H. eliminates language friction and makes AI accessible to all railway field staff.'
  ]
);

// ── Team Box ────────────────────────────────────────────────
doc.moveDown(0.3);
const teamBoxY = doc.y;
doc.rect(36, teamBoxY, 523, 40).fill(BG_CARD);
doc.rect(36, teamBoxY, 523, 40).stroke(BORDER_COLOR);
doc.fillColor(NAVY_DARK).font('Helvetica-Bold').fontSize(8.5).text('RAILMARK AI — CORE ENGINEERING & DEVELOPMENT TEAM', 46, teamBoxY + 7);
doc.fillColor(TEXT_BODY).font('Helvetica').fontSize(8).text(
  '1. Akshay kruthik.AR   |   2. Dheeraj Abhay.R   |   3. Dhanuja.J   |   4. Yadav.S   |   5. Aravindan.D   |   6. Divya Dharshini.B',
  46,
  teamBoxY + 22
);

// ── Page Numbers ────────────────────────────────────────────
const pageRange = doc.bufferedPageRange();
for (let i = pageRange.start; i < pageRange.start + pageRange.count; i++) {
  doc.switchToPage(i);
  doc.fillColor(TEXT_MUTED).font('Helvetica').fontSize(8).text(
    `RAILMARK AI · SIH 2026 Pitch Document — Page ${i + 1} of ${pageRange.count}`,
    36,
    800,
    { width: 523, align: 'center' }
  );
}

doc.end();

writeStream.on('finish', () => {
  console.log('✅ PDF generated successfully:', outputPath);
});
