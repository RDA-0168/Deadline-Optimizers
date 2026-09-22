// =============================================================================
// RailMark AI — Database Seed Script
// AI-Assisted Laser QR Marking & Digital Traceability for Railway Track Fittings
// =============================================================================

import { PrismaClient, Role, FittingStatus, ConditionStatus, QRReadability, QRVerificationStatus, MaintenanceType, MaintenanceStatus, LifecycleEventType, MediaType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting RailMark AI database seed...');

  // 1. Clear existing records safely
  await prisma.mediaMetadata.deleteMany();
  await prisma.aiAssessment.deleteMany();
  await prisma.lifecycleEvent.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.fitting.deleteMany();
  await prisma.user.deleteMany();
  await prisma.railwayZone.deleteMany();
  await prisma.auditLog.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 2. Seed Railway Zones
  const nr = await prisma.railwayZone.create({
    data: {
      code: 'NR',
      name: 'Northern Railway',
      headquarters: 'Baroda House, New Delhi',
      divisions: ['Delhi', 'Ambala', 'Firozpur', 'Lucknow', 'Moradabad'],
      active: true,
    },
  });

  const cr = await prisma.railwayZone.create({
    data: {
      code: 'CR',
      name: 'Central Railway',
      headquarters: 'CSMT, Mumbai',
      divisions: ['Mumbai CST', 'Bhusawal', 'Nagpur', 'Pune', 'Solapur'],
      active: true,
    },
  });

  const wr = await prisma.railwayZone.create({
    data: {
      code: 'WR',
      name: 'Western Railway',
      headquarters: 'Churchgate, Mumbai',
      divisions: ['Mumbai Central', 'Vadodara', 'Ahmedabad', 'Ratlam', 'Rajkot', 'Bhavnagar'],
      active: true,
    },
  });

  const sr = await prisma.railwayZone.create({
    data: {
      code: 'SR',
      name: 'Southern Railway',
      headquarters: 'Chennai Central, Chennai',
      divisions: ['Chennai', 'Tiruchirappalli', 'Madurai', 'Palakkad', 'Salem', 'Thiruvananthapuram'],
      active: true,
    },
  });

  console.log('✅ Seeded 4 Railway Zones (NR, CR, WR, SR).');

  // 3. Seed Users with Roles
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const inspectorPassword = await bcrypt.hash('Inspector@123', 10);
  const techPassword = await bcrypt.hash('Tech@123', 10);
  const viewerPassword = await bcrypt.hash('Viewer@123', 10);

  const adminUser = await prisma.user.create({
    data: {
      id: 'USR-ADM-001',
      username: 'admin',
      email: 'admin@railmark.ai',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      fullName: 'Vikramaditya Sharma',
      badgeNumber: 'RM-HQ-ADM-01',
      zoneId: nr.id,
      zoneName: nr.name,
    },
  });

  const inspectorUser = await prisma.user.create({
    data: {
      id: 'USR-INS-002',
      username: 'inspector',
      email: 'inspector@railmark.ai',
      passwordHash: inspectorPassword,
      role: Role.INSPECTOR,
      fullName: 'Rajesh Kumar Verma',
      badgeNumber: 'RM-DEL-INS-4421',
      zoneId: nr.id,
      zoneName: nr.name,
    },
  });

  const technicianUser = await prisma.user.create({
    data: {
      id: 'USR-MNT-003',
      username: 'technician',
      email: 'tech@railmark.ai',
      passwordHash: techPassword,
      role: Role.MAINTENANCE,
      fullName: 'Sunil Mohan Joshi',
      badgeNumber: 'RM-MUM-MNT-9932',
      zoneId: cr.id,
      zoneName: cr.name,
    },
  });

  await prisma.user.create({
    data: {
      id: 'USR-VIW-004',
      username: 'viewer',
      email: 'viewer@railmark.ai',
      passwordHash: viewerPassword,
      role: Role.VIEWER,
      fullName: 'Ananya Deshmukh',
      badgeNumber: 'RM-OBS-1002',
      zoneId: wr.id,
      zoneName: wr.name,
    },
  });

  console.log('✅ Seeded Demo Users (Admin, Inspector, Technician, Viewer).');

  // 4. Seed Track Fittings with Unique QR codes
  const fittingsData = [
    {
      id: 'RM-FIT-0001',
      qrCodeValue: 'RM-FIT-0001',
      fittingType: 'Elastic Rail Clip (ERC MK-III)',
      manufacturer: 'Bhilai Steel Plant / RDSO Approved',
      batchNumber: 'BATCH-2025-Q4-082',
      manufacturingDate: new Date('2025-11-10'),
      materialGrade: 'Spring Steel 55Si7',
      standardSpec: 'IRS:T-31-2021',
      status: FittingStatus.Active,
      railLine: 'Delhi-Agra Main High Speed Corridor',
      trackSection: 'Section KM 142/4 - Up Main Line',
      sleeperNumber: 'PSC-SLP-4482',
      railwayZoneId: nr.id,
      railwayZoneName: nr.name,
      division: 'Delhi Division',
      kmMark: 'KM 142/4',
      trackType: 'Broad Gauge (1676mm)',
      gpsLatitude: 28.6139,
      gpsLongitude: 77.2090,
      installedBy: 'Northern Track Maintenance Wing',
      installationDate: new Date('2025-12-01'),
      torqueSpecNm: 110.0,
      laserMarkDate: new Date('2025-11-15'),
      markingMachineId: 'LM-RDSO-04',
      qrVerificationStatus: QRVerificationStatus.Verified,
      lastInspectionDate: new Date('2026-02-15'),
      nextInspectionDate: new Date('2026-05-15'),
      maintenanceStatus: MaintenanceStatus.Completed,
      material: 'Silico-Manganese Spring Steel',
      weight: '0.92 kg',
      description: 'Heavy duty elastic rail clip providing 1000kg toe load for 60kg rails.',
    },
    {
      id: 'RM-FIT-0002',
      qrCodeValue: 'RM-FIT-0002',
      fittingType: 'Glass Filled Nylon Insulating Liner (GFN-66)',
      manufacturer: 'Polymers India Ltd',
      batchNumber: 'BATCH-2025-GFN-331',
      manufacturingDate: new Date('2025-10-05'),
      materialGrade: 'GFN 66 (Glass Reinforced Polyamide)',
      standardSpec: 'IRS:T-44-2020',
      status: FittingStatus.Active,
      railLine: 'Delhi-Agra Main High Speed Corridor',
      trackSection: 'Section KM 142/4 - Up Main Line',
      sleeperNumber: 'PSC-SLP-4482',
      railwayZoneId: nr.id,
      railwayZoneName: nr.name,
      division: 'Delhi Division',
      kmMark: 'KM 142/4',
      trackType: 'Broad Gauge (1676mm)',
      gpsLatitude: 28.6141,
      gpsLongitude: 77.2093,
      installedBy: 'Northern Track Maintenance Wing',
      installationDate: new Date('2025-12-01'),
      torqueSpecNm: 0.0,
      laserMarkDate: new Date('2025-10-20'),
      markingMachineId: 'LM-RDSO-02',
      qrVerificationStatus: QRVerificationStatus.Verified,
      lastInspectionDate: new Date('2026-02-15'),
      nextInspectionDate: new Date('2026-05-15'),
      maintenanceStatus: MaintenanceStatus.Completed,
      material: 'GFN-66 Polymer',
      weight: '0.18 kg',
      description: 'Electrical isolation liner preventing signal track circuit leakage.',
    },
    {
      id: 'RM-FIT-0003',
      qrCodeValue: 'RM-FIT-0003',
      fittingType: 'Grooved Rubber Sole Plate 6mm (GRSP)',
      manufacturer: 'Apex Elastomers Corp',
      batchNumber: 'BATCH-2025-GRSP-901',
      manufacturingDate: new Date('2025-09-18'),
      materialGrade: 'High Damping Synthetic Elastomer',
      standardSpec: 'IRS:T-47-2022',
      status: FittingStatus.InspectionDue,
      railLine: 'Mumbai-Pune Ghat Section',
      trackSection: 'Section KM 88/2 - Down Main Line',
      sleeperNumber: 'PSC-SLP-1120',
      railwayZoneId: cr.id,
      railwayZoneName: cr.name,
      division: 'Mumbai CST',
      kmMark: 'KM 88/2',
      trackType: 'Broad Gauge (1676mm)',
      gpsLatitude: 18.9872,
      gpsLongitude: 73.1234,
      installedBy: 'Central Railway Ghat Division',
      installationDate: new Date('2025-10-15'),
      torqueSpecNm: 0.0,
      laserMarkDate: new Date('2025-09-25'),
      markingMachineId: 'LM-RDSO-06',
      qrVerificationStatus: QRVerificationStatus.Verified,
      lastInspectionDate: new Date('2025-12-20'),
      nextInspectionDate: new Date('2026-03-20'),
      maintenanceStatus: MaintenanceStatus.Scheduled,
      material: 'Elastomeric Rubber Compound',
      weight: '0.45 kg',
      description: 'Vibration absorbing sole pad under rail seat protecting concrete sleeper.',
    },
    {
      id: 'RM-FIT-0004',
      qrCodeValue: 'RM-FIT-0004',
      fittingType: 'Metal Liner 60kg Rail (SGCI)',
      manufacturer: 'Howrah Foundry Works',
      batchNumber: 'BATCH-2025-ML-412',
      manufacturingDate: new Date('2025-08-20'),
      materialGrade: 'Spheroidal Graphite Cast Iron Grade 400/12',
      standardSpec: 'IRS:T-46-2021',
      status: FittingStatus.MaintenanceRequired,
      railLine: 'Western Freight Dedicated Line',
      trackSection: 'Section KM 204/1 - Freight Chord',
      sleeperNumber: 'PSC-SLP-7814',
      railwayZoneId: wr.id,
      railwayZoneName: wr.name,
      division: 'Vadodara',
      kmMark: 'KM 204/1',
      trackType: 'Broad Gauge (1676mm)',
      gpsLatitude: 22.3072,
      gpsLongitude: 73.1812,
      installedBy: 'Western Railway Track Wing',
      installationDate: new Date('2025-09-10'),
      torqueSpecNm: 120.0,
      laserMarkDate: new Date('2025-08-30'),
      markingMachineId: 'LM-RDSO-03',
      qrVerificationStatus: QRVerificationStatus.Degraded,
      lastInspectionDate: new Date('2026-01-10'),
      nextInspectionDate: new Date('2026-02-10'),
      maintenanceStatus: MaintenanceStatus.Overdue,
      material: 'Ductile Cast Iron SGCI',
      weight: '1.25 kg',
      description: 'Provides lateral restraint to rail and distributes clip toe load.',
    },
  ];

  for (const f of fittingsData) {
    await prisma.fitting.create({ data: f });
  }

  console.log(`✅ Seeded ${fittingsData.length} Track Fittings.`);

  // 5. Seed Inspections, AI Assessments, and Append-Only Lifecycle
  const insp1 = await prisma.inspection.create({
    data: {
      id: 'INSP-2026-001',
      fittingId: 'RM-FIT-0001',
      inspectionDate: new Date('2026-02-15T10:30:00Z'),
      inspector: inspectorUser.fullName,
      inspectorId: inspectorUser.badgeNumber,
      condition: ConditionStatus.Good,
      qrReadability: QRReadability.Excellent,
      corrosion: 'None',
      surfaceDamage: 'None',
      deformation: 'None',
      wear: 'Normal',
      notes: 'Direct optical scan verified. QR laser etching intact with zero contrast degradation.',
      imageUrl: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=600&q=80',
    },
  });

  await prisma.aiAssessment.create({
    data: {
      inspectionId: insp1.id,
      fittingId: 'RM-FIT-0001',
      confidence: 98.6,
      conditionAssessment: ConditionStatus.Good,
      qrQuality: 96.2,
      defectDetected: false,
      recommendation: 'Fitting in optimal operational condition. Continue routine 90-day cycle.',
      imageUrl: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=600&q=80',
      metadata: {
        laserContrastScore: 0.94,
        surfaceCrackProbability: 0.01,
        alignmentConfidence: 0.99,
      },
    },
  });

  const insp2 = await prisma.inspection.create({
    data: {
      id: 'INSP-2026-002',
      fittingId: 'RM-FIT-0004',
      inspectionDate: new Date('2026-01-10T14:15:00Z'),
      inspector: inspectorUser.fullName,
      inspectorId: inspectorUser.badgeNumber,
      condition: ConditionStatus.MaintenanceRequired,
      qrReadability: QRReadability.Fair,
      corrosion: 'Moderate',
      surfaceDamage: 'Minor',
      deformation: 'None',
      wear: 'Moderate',
      notes: 'Surface oxidation and rust accumulation near laser marking border. Re-cleaning required.',
      imageUrl: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=600&q=80',
    },
  });

  await prisma.aiAssessment.create({
    data: {
      inspectionId: insp2.id,
      fittingId: 'RM-FIT-0004',
      confidence: 91.4,
      conditionAssessment: ConditionStatus.MaintenanceRequired,
      qrQuality: 74.5,
      defectDetected: true,
      defectType: 'Surface Rust & QR Border Degradation',
      recommendation: 'Execute anti-corrosion cleaning and re-verify optical QR contrast.',
      imageUrl: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=600&q=80',
      metadata: {
        laserContrastScore: 0.68,
        surfaceCrackProbability: 0.12,
        alignmentConfidence: 0.93,
      },
    },
  });

  console.log('✅ Seeded Field Inspections & AI Assessments.');

  // 6. Seed Maintenance Records
  await prisma.maintenanceRecord.create({
    data: {
      id: 'MNT-2026-001',
      fittingId: 'RM-FIT-0001',
      maintenanceDate: new Date('2026-02-15T11:00:00Z'),
      maintenanceType: MaintenanceType.Routine,
      technician: technicianUser.fullName,
      technicianId: technicianUser.badgeNumber,
      description: 'Scheduled torque verification (110 Nm applied) and high-pressure debris purge.',
      status: MaintenanceStatus.Completed,
      nextMaintenance: new Date('2026-05-15'),
      cost: '₹ 250',
      partsReplaced: [],
    },
  });

  await prisma.maintenanceRecord.create({
    data: {
      id: 'MNT-2026-002',
      fittingId: 'RM-FIT-0004',
      maintenanceDate: new Date('2026-01-12T09:30:00Z'),
      maintenanceType: MaintenanceType.Corrective,
      technician: technicianUser.fullName,
      technicianId: technicianUser.badgeNumber,
      description: 'Anti-corrosion solvent treatment and laser QR surface re-conditioning.',
      status: MaintenanceStatus.Scheduled,
      nextMaintenance: new Date('2026-02-28'),
      cost: '₹ 450',
      partsReplaced: ['Liner Pad', 'Nylon Collar'],
    },
  });

  console.log('✅ Seeded Maintenance Records.');

  // 7. Seed Immutable Append-Only Lifecycle Events
  const lifecycleEntries = [
    {
      id: 'LC-0001-MFG',
      fittingId: 'RM-FIT-0001',
      event: LifecycleEventType.Manufactured,
      eventDate: new Date('2025-11-10T08:00:00Z'),
      actor: 'Bhilai Steel Plant - Automated Line 4',
      location: 'Bhilai Plant, Chhattisgarh',
      notes: 'Forged from 55Si7 steel under RDSO specification IRS:T-31-2021.',
    },
    {
      id: 'LC-0001-QR',
      fittingId: 'RM-FIT-0001',
      event: LifecycleEventType.QRVerified,
      eventDate: new Date('2025-11-15T14:30:00Z'),
      actor: 'Direct Part Marking (DPM) Cell #04',
      location: 'RDSO Marking Facility, Bhilai',
      notes: 'Fiber laser etching applied. QR code verified with ISO/IEC 15415 Grade A.',
    },
    {
      id: 'LC-0001-INS',
      fittingId: 'RM-FIT-0001',
      event: LifecycleEventType.Installed,
      eventDate: new Date('2025-12-01T09:00:00Z'),
      actor: 'Northern Track Maintenance Wing',
      location: 'Delhi-Agra Main Corridor KM 142/4',
      notes: 'Installed on Sleeper PSC-SLP-4482 with 110 Nm torque.',
    },
    {
      id: 'LC-0001-AUD',
      fittingId: 'RM-FIT-0001',
      event: LifecycleEventType.Inspected,
      eventDate: new Date('2026-02-15T10:30:00Z'),
      actor: inspectorUser.fullName,
      location: 'Track Section KM 142/4',
      notes: 'Periodic inspection passed with 98.6% AI vision confidence.',
    },
  ];

  for (const lc of lifecycleEntries) {
    await prisma.lifecycleEvent.create({ data: lc });
  }

  console.log(`✅ Seeded ${lifecycleEntries.length} Immutable Append-Only Lifecycle Events.`);

  // 8. Seed Media Metadata
  await prisma.mediaMetadata.create({
    data: {
      id: 'MED-2026-001',
      fittingId: 'RM-FIT-0001',
      inspectionId: insp1.id,
      mediaType: MediaType.IMAGE,
      fileName: 'RM-FIT-0001_laser_qr_macro.jpg',
      url: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=600&q=80',
      mimeType: 'image/jpeg',
      fileSize: 184520,
      uploadedBy: inspectorUser.fullName,
      hashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    },
  });

  console.log('✅ Seeded Media Metadata.');

  // 9. Seed Audit Logs
  await prisma.auditLog.create({
    data: {
      action: 'SYSTEM_INITIALIZATION',
      username: 'SYSTEM',
      fittingId: 'RM-FIT-0001',
      details: 'PostgreSQL database seeded with Smart India Hackathon master datasets.',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('🎉 RailMark AI PostgreSQL seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
