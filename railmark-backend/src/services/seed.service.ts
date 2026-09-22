// =============================================================================
// RailMark AI — Master Database Seeder Service
// AI-Assisted Laser QR Marking & Digital Traceability for Railway Track Fittings
// =============================================================================

import {
  PrismaClient,
  Role,
  FittingStatus,
  ConditionStatus,
  QRReadability,
  QRVerificationStatus,
  MaintenanceType,
  MaintenanceStatus,
  LifecycleEventType,
  MediaType,
} from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma.js';

export class SeedService {
  /**
   * Seed all 12 track fittings, zones, users, inspections, maintenance, and lifecycle logs.
   * @param force If true, clears existing tables before seeding. If false, seeds only if empty.
   */
  static async seedDatabase(force = false) {
    if (!force) {
      try {
        const fittingCount = await prisma.fitting.count();
        if (fittingCount >= 12) {
          console.log(`ℹ️ Database already contains ${fittingCount} fittings. Skipping auto-seed.`);
          return { success: true, count: fittingCount, message: 'Database already populated.' };
        }
      } catch (err) {
        console.warn('⚠️ Could not check fitting count before seed:', err);
      }
    }

    console.log('🌱 Starting RailMark AI Master Database Seeder (All 12 Fittings)...');

    try {
      if (force) {
        // Clear child tables first
        await prisma.mediaMetadata.deleteMany().catch(() => {});
        await prisma.aiAssessment.deleteMany().catch(() => {});
        await prisma.lifecycleEvent.deleteMany().catch(() => {});
        await prisma.maintenanceRecord.deleteMany().catch(() => {});
        await prisma.inspection.deleteMany().catch(() => {});
        await prisma.fitting.deleteMany().catch(() => {});
        await prisma.auditLog.deleteMany().catch(() => {});
        await prisma.user.deleteMany().catch(() => {});
        await prisma.railwayZone.deleteMany().catch(() => {});
        console.log('🧹 Cleaned existing tables for fresh seed.');
      }

      // 1. Seed 12 Railway Zones
      const zonesData = [
        { code: 'NR', name: 'Northern Railway', headquarters: 'Baroda House, New Delhi', divisions: ['Delhi', 'Ambala', 'Firozpur', 'Lucknow', 'Moradabad'] },
        { code: 'CR', name: 'Central Railway', headquarters: 'CSMT, Mumbai', divisions: ['Mumbai CST', 'Bhusawal', 'Nagpur', 'Pune', 'Solapur'] },
        { code: 'WR', name: 'Western Railway', headquarters: 'Churchgate, Mumbai', divisions: ['Mumbai Central', 'Vadodara', 'Ahmedabad', 'Ratlam', 'Rajkot', 'Bhavnagar'] },
        { code: 'SR', name: 'Southern Railway', headquarters: 'Chennai Central, Chennai', divisions: ['Chennai', 'Tiruchirappalli', 'Madurai', 'Palakkad', 'Salem', 'Thiruvananthapuram'] },
        { code: 'NCR', name: 'North Central Railway', headquarters: 'Subedarganj, Prayagraj', divisions: ['Prayagraj', 'Agra', 'Jhansi'] },
        { code: 'SCR', name: 'South Central Railway', headquarters: 'Rail Nilayam, Secunderabad', divisions: ['Secunderabad', 'Hyderabad', 'Vijayawada', 'Guntakal', 'Guntur', 'Nanded'] },
        { code: 'NWR', name: 'North Western Railway', headquarters: 'Jaipur', divisions: ['Jaipur', 'Ajmer', 'Bikaner', 'Jodhpur'] },
        { code: 'ER', name: 'Eastern Railway', headquarters: 'Fairlie Place, Kolkata', divisions: ['Howrah', 'Sealdah', 'Asansol', 'Malda'] },
        { code: 'ECR', name: 'East Central Railway', headquarters: 'Hajipur', divisions: ['Danapur', 'Dhanbad', 'Pt. Deen Dayal Upadhyaya', 'Samastipur', 'Sonpur'] },
        { code: 'WCR', name: 'West Central Railway', headquarters: 'Jabalpur', divisions: ['Jabalpur', 'Bhopal', 'Kota'] },
        { code: 'NER', name: 'North Eastern Railway', headquarters: 'Gorakhpur', divisions: ['Izzatnagar', 'Lucknow', 'Varanasi'] },
        { code: 'NFR', name: 'Northeast Frontier Railway', headquarters: 'Maligaon, Guwahati', divisions: ['Katihar', 'Alipurduar', 'Rangiya', 'Lumding', 'Tinsukia'] },
      ];

      const createdZones: Record<string, string> = {};
      for (const z of zonesData) {
        const zoneRecord = await prisma.railwayZone.upsert({
          where: { code: z.code },
          update: { name: z.name, headquarters: z.headquarters, divisions: z.divisions, active: true },
          create: { code: z.code, name: z.name, headquarters: z.headquarters, divisions: z.divisions, active: true },
        });
        createdZones[z.code] = zoneRecord.id;
      }
      console.log('✅ Seeded / Verified 12 Indian Railway Zones.');

      // 2. Seed Users
      const adminPassword = await bcrypt.hash('Admin@123', 10);
      const inspectorPassword = await bcrypt.hash('Inspector@123', 10);
      const techPassword = await bcrypt.hash('Tech@123', 10);
      const viewerPassword = await bcrypt.hash('Viewer@123', 10);

      const users = [
        {
          id: 'USR-ADM-001',
          username: 'admin',
          email: 'admin@railmark.ai',
          passwordHash: adminPassword,
          role: Role.ADMIN,
          fullName: 'Vikramaditya Sharma',
          badgeNumber: 'RM-HQ-ADM-01',
          zoneId: createdZones['NR'],
          zoneName: 'Northern Railway',
        },
        {
          id: 'USR-INS-002',
          username: 'inspector',
          email: 'inspector@railmark.ai',
          passwordHash: inspectorPassword,
          role: Role.INSPECTOR,
          fullName: 'Rajesh Kumar Verma',
          badgeNumber: 'RM-DEL-INS-4421',
          zoneId: createdZones['CR'],
          zoneName: 'Central Railway',
        },
        {
          id: 'USR-MNT-003',
          username: 'technician',
          email: 'tech@railmark.ai',
          passwordHash: techPassword,
          role: Role.MAINTENANCE,
          fullName: 'Sunil Mohan Joshi',
          badgeNumber: 'RM-MUM-MNT-9932',
          zoneId: createdZones['CR'],
          zoneName: 'Central Railway',
        },
        {
          id: 'USR-VIW-004',
          username: 'viewer',
          email: 'viewer@railmark.ai',
          passwordHash: viewerPassword,
          role: Role.VIEWER,
          fullName: 'Ananya Deshmukh',
          badgeNumber: 'RM-OBS-1002',
          zoneId: createdZones['WR'],
          zoneName: 'Western Railway',
        },
      ];

      for (const u of users) {
        await prisma.user.upsert({
          where: { username: u.username },
          update: {
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role,
            fullName: u.fullName,
            badgeNumber: u.badgeNumber,
            zoneId: u.zoneId,
            zoneName: u.zoneName,
          },
          create: u,
        });
      }
      console.log('✅ Seeded Demo Users (Admin, Inspector, Technician, Viewer).');

      // 3. Seed ALL 12 Master Fittings
      const masterFittings = [
        {
          id: 'RM-FIT-0001',
          qrCodeValue: 'RM-FIT-0001',
          fittingType: 'Elastic Rail Clip (ERC MK-III)',
          manufacturer: 'Bhilai Steel Plant / RDSO Approved',
          batchNumber: 'BATCH-2026-001',
          manufacturingDate: new Date('2026-01-15'),
          materialGrade: 'Spring Steel 55Si7',
          standardSpec: 'IRS:T-31-2021',
          status: FittingStatus.Active,
          railLine: 'Mumbai Central — Pune High Speed Corridor',
          trackSection: 'Section KM 45+200 - Up Main Line',
          sleeperNumber: 'PSC-SLP-4401',
          railwayZoneId: createdZones['CR'],
          railwayZoneName: 'Central Railway',
          division: 'Mumbai Division',
          kmMark: 'KM 45+200',
          trackType: 'Main Line — BG',
          gpsLatitude: 18.9872,
          gpsLongitude: 73.1234,
          installedBy: 'Northern Track Maintenance Wing',
          installationDate: new Date('2026-02-20'),
          torqueSpecNm: 110.0,
          laserMarkDate: new Date('2026-01-18'),
          markingMachineId: 'LM-RDSO-04',
          qrVerificationStatus: QRVerificationStatus.Verified,
          lastInspectionDate: new Date('2026-07-10'),
          nextInspectionDate: new Date('2026-10-10'),
          maintenanceStatus: MaintenanceStatus.Completed,
          material: 'Spring Steel',
          weight: '0.85 kg',
          description: 'Pandrol e-clip type elastic fastening used in high-speed BG track.',
        },
        {
          id: 'RM-FIT-0002',
          qrCodeValue: 'RM-FIT-0002',
          fittingType: 'GFN-66 Insulating Liner',
          manufacturer: 'Polymers India Ltd',
          batchNumber: 'BATCH-2026-002',
          manufacturingDate: new Date('2026-01-20'),
          materialGrade: 'GFN 66 (Glass Reinforced Polyamide)',
          standardSpec: 'RDSO Spec 2018',
          status: FittingStatus.InspectionDue,
          railLine: 'Delhi — Agra Section',
          trackSection: 'Section KM 162+500 - DLI-AGC',
          sleeperNumber: 'PSC-SLP-4482',
          railwayZoneId: createdZones['NCR'],
          railwayZoneName: 'North Central Railway',
          division: 'Agra Division',
          kmMark: 'KM 162+500',
          trackType: 'Main Line — BG',
          gpsLatitude: 27.1767,
          gpsLongitude: 78.0081,
          installedBy: 'Agra P-Way Maintenance Squad',
          installationDate: new Date('2026-03-05'),
          torqueSpecNm: 0.0,
          laserMarkDate: new Date('2026-01-25'),
          markingMachineId: 'LM-RDSO-02',
          qrVerificationStatus: QRVerificationStatus.Verified,
          lastInspectionDate: new Date('2026-04-15'),
          nextInspectionDate: new Date('2026-08-15'),
          maintenanceStatus: MaintenanceStatus.Scheduled,
          material: 'High Density Polyethylene',
          weight: '0.32 kg',
          description: 'Rubber/HDPE liner used beneath rail seats on PSC sleepers.',
        },
        {
          id: 'RM-FIT-0003',
          qrCodeValue: 'RM-FIT-0003',
          fittingType: 'GFN Shoulder',
          manufacturer: 'Demo Manufacturer A',
          batchNumber: 'BATCH-2026-003',
          manufacturingDate: new Date('2026-02-01'),
          materialGrade: 'GFN (30% Glass Filled Nylon)',
          standardSpec: 'RDSO/T-4703',
          status: FittingStatus.MaintenanceRequired,
          railLine: 'Chennai — Bangalore Section',
          trackSection: 'Section KM 90+100 - MAS-SBC',
          sleeperNumber: 'PSC-SLP-1290',
          railwayZoneId: createdZones['SR'],
          railwayZoneName: 'Southern Railway',
          division: 'Chennai Division',
          kmMark: 'KM 90+100',
          trackType: 'Main Line — BG',
          gpsLatitude: 13.0827,
          gpsLongitude: 80.2707,
          installedBy: 'Southern Track Maintenance Wing',
          installationDate: new Date('2026-03-15'),
          torqueSpecNm: 85.0,
          laserMarkDate: new Date('2026-02-05'),
          markingMachineId: 'LM-RDSO-06',
          qrVerificationStatus: QRVerificationStatus.Degraded,
          lastInspectionDate: new Date('2026-06-20'),
          nextInspectionDate: new Date('2026-09-20'),
          maintenanceStatus: MaintenanceStatus.Overdue,
          material: 'GFN (30% Glass Filled Nylon)',
          weight: '0.24 kg',
          description: 'Glass Filled Nylon shoulder insulator for PSC sleepers.',
        },
        {
          id: 'RM-FIT-0004',
          qrCodeValue: 'RM-FIT-0004',
          fittingType: 'Rail Anchor',
          manufacturer: 'Demo Manufacturer C',
          batchNumber: 'BATCH-2026-004',
          manufacturingDate: new Date('2026-01-28'),
          materialGrade: 'High Carbon Spring Steel',
          standardSpec: 'IRS:T-12-2021',
          status: FittingStatus.Active,
          railLine: 'Kolkata — Howrah Section',
          trackSection: 'Section KM 22+750 - HWH-BDC',
          sleeperNumber: 'PSC-SLP-3105',
          railwayZoneId: createdZones['ER'],
          railwayZoneName: 'Eastern Railway',
          division: 'Howrah Division',
          kmMark: 'KM 22+750',
          trackType: 'Suburban — BG',
          gpsLatitude: 22.5726,
          gpsLongitude: 88.3639,
          installedBy: 'Howrah P-Way Gang',
          installationDate: new Date('2026-02-25'),
          torqueSpecNm: 95.0,
          laserMarkDate: new Date('2026-02-02'),
          markingMachineId: 'LM-RDSO-03',
          qrVerificationStatus: QRVerificationStatus.Verified,
          lastInspectionDate: new Date('2026-07-05'),
          nextInspectionDate: new Date('2026-10-05'),
          maintenanceStatus: MaintenanceStatus.Completed,
          material: 'Carbon Steel',
          weight: '1.20 kg',
          description: 'Spring steel anchor to prevent rail creep on timber sleepers.',
        },
        {
          id: 'RM-FIT-0005',
          qrCodeValue: 'RM-FIT-0005',
          fittingType: 'Fish Plate (60kg UIC Rail Joint)',
          manufacturer: 'Demo Manufacturer B',
          batchNumber: 'BATCH-2026-005',
          manufacturingDate: new Date('2026-02-10'),
          materialGrade: 'Medium Manganese Steel',
          standardSpec: 'IRS:T-1-2018',
          status: FittingStatus.Active,
          railLine: 'Ahmedabad — Vadodara Section',
          trackSection: 'Section KM 73+400 - ADI-BRC',
          sleeperNumber: 'PSC-SLP-5520',
          railwayZoneId: createdZones['WR'],
          railwayZoneName: 'Western Railway',
          division: 'Vadodara Division',
          kmMark: 'KM 73+400',
          trackType: 'Main Line — BG',
          gpsLatitude: 22.3072,
          gpsLongitude: 73.1812,
          installedBy: 'Vadodara Fast Track Heavy Gang',
          installationDate: new Date('2026-03-20'),
          torqueSpecNm: 250.0,
          laserMarkDate: new Date('2026-02-12'),
          markingMachineId: 'LM-RDSO-04',
          qrVerificationStatus: QRVerificationStatus.Verified,
          lastInspectionDate: new Date('2026-07-18'),
          nextInspectionDate: new Date('2026-10-18'),
          maintenanceStatus: MaintenanceStatus.Completed,
          material: 'Mild Steel',
          weight: '12.5 kg (pair)',
          description: '6-hole fish plate for standard rail joints.',
        },
        {
          id: 'RM-FIT-0006',
          qrCodeValue: 'RM-FIT-0006',
          fittingType: 'Elastic Rail Clip (ERC MK-V)',
          manufacturer: 'Demo Manufacturer D',
          batchNumber: 'BATCH-2026-006',
          manufacturingDate: new Date('2026-02-15'),
          materialGrade: 'Spring Steel 60Si7',
          standardSpec: 'IRS:T-40 2000',
          status: FittingStatus.InspectionDue,
          railLine: 'Hyderabad — Secunderabad Section',
          trackSection: 'Section KM 8+300 - HYB-SC',
          sleeperNumber: 'PSC-SLP-4402',
          railwayZoneId: createdZones['SCR'],
          railwayZoneName: 'South Central Railway',
          division: 'Secunderabad Division',
          kmMark: 'KM 8+300',
          trackType: 'Suburban — BG',
          gpsLatitude: 17.385,
          gpsLongitude: 78.4867,
          installedBy: 'Secunderabad P-Way Division',
          installationDate: new Date('2026-04-01'),
          torqueSpecNm: 120.0,
          laserMarkDate: new Date('2026-02-20'),
          markingMachineId: 'LM-RDSO-01',
          qrVerificationStatus: QRVerificationStatus.Verified,
          lastInspectionDate: new Date('2026-05-22'),
          nextInspectionDate: new Date('2026-08-22'),
          maintenanceStatus: MaintenanceStatus.Scheduled,
          material: 'Spring Steel',
          weight: '0.75 kg',
          description: 'Pandrol PR clip for MG converted BG track section.',
        },
        {
          id: 'RM-FIT-0007',
          qrCodeValue: 'RM-FIT-0007',
          fittingType: 'PSC Sleeper Bolt / Track Spike',
          manufacturer: 'Demo Manufacturer C',
          batchNumber: 'BATCH-2026-007',
          manufacturingDate: new Date('2026-03-01'),
          materialGrade: 'Class 8.8 High Strength Alloy',
          standardSpec: 'RDSO/T-4704',
          status: FittingStatus.Active,
          railLine: 'Jaipur — Ajmer Section',
          trackSection: 'Section KM 130+600 - JP-AII',
          sleeperNumber: 'PSC-SLP-9104',
          railwayZoneId: createdZones['NWR'],
          railwayZoneName: 'North Western Railway',
          division: 'Ajmer Division',
          kmMark: 'KM 130+600',
          trackType: 'Main Line — BG',
          gpsLatitude: 26.9124,
          gpsLongitude: 75.7873,
          installedBy: 'Jaipur Division Gang #2',
          installationDate: new Date('2026-04-10'),
          torqueSpecNm: 180.0,
          laserMarkDate: new Date('2026-03-04'),
          markingMachineId: 'LM-RDSO-02',
          qrVerificationStatus: QRVerificationStatus.Verified,
          lastInspectionDate: new Date('2026-08-01'),
          nextInspectionDate: new Date('2026-11-01'),
          maintenanceStatus: MaintenanceStatus.Completed,
          material: 'High Tensile Steel',
          weight: '0.48 kg',
          description: 'High tensile T-bolt for PSC sleeper rail fastening.',
        },
        {
          id: 'RM-FIT-0008',
          qrCodeValue: 'RM-FIT-0008',
          fittingType: 'Tie Bar',
          manufacturer: 'Demo Manufacturer A',
          batchNumber: 'BATCH-2026-008',
          manufacturingDate: new Date('2026-03-10'),
          materialGrade: 'Carbon Steel IS:2062',
          standardSpec: 'IRS:T-30-2019',
          status: FittingStatus.Active,
          railLine: 'Patna — Gaya Section',
          trackSection: 'Section KM 95+800 - PNBE-GAYA',
          sleeperNumber: 'PSC-SLP-1310',
          railwayZoneId: createdZones['ECR'],
          railwayZoneName: 'East Central Railway',
          division: 'Danapur Division',
          kmMark: 'KM 95+800',
          trackType: 'Main Line — BG',
          gpsLatitude: 25.5941,
          gpsLongitude: 85.1376,
          installedBy: 'Danapur Track Crew',
          installationDate: new Date('2026-04-20'),
          torqueSpecNm: 105.0,
          laserMarkDate: new Date('2026-03-15'),
          markingMachineId: 'LM-RDSO-03',
          qrVerificationStatus: QRVerificationStatus.Verified,
          lastInspectionDate: new Date('2026-07-25'),
          nextInspectionDate: new Date('2026-10-25'),
          maintenanceStatus: MaintenanceStatus.Completed,
          material: 'Carbon Steel',
          weight: '8.4 kg',
          description: 'Tie bar connecting two rails at turnout crossing.',
        },
        {
          id: 'RM-FIT-0009',
          qrCodeValue: 'RM-FIT-0009',
          fittingType: 'Guard Rail / Check Rail',
          manufacturer: 'Demo Manufacturer E',
          batchNumber: 'BATCH-2026-009',
          manufacturingDate: new Date('2026-03-15'),
          materialGrade: '52 kg/m Rail Steel IRS:T-10',
          standardSpec: 'IRS:T-10',
          status: FittingStatus.InspectionDue,
          railLine: 'Bhopal — Itarsi Section',
          trackSection: 'Section KM 58+200 - BPL-ET',
          sleeperNumber: 'PSC-SLP-5380',
          railwayZoneId: createdZones['WCR'],
          railwayZoneName: 'West Central Railway',
          division: 'Bhopal Division',
          kmMark: 'KM 58+200',
          trackType: 'Main Line — BG',
          gpsLatitude: 23.2599,
          gpsLongitude: 77.4126,
          installedBy: 'Bhopal Heavy Repair Gang',
          installationDate: new Date('2026-05-05'),
          torqueSpecNm: 220.0,
          laserMarkDate: new Date('2026-03-20'),
          markingMachineId: 'LM-RDSO-04',
          qrVerificationStatus: QRVerificationStatus.Verified,
          lastInspectionDate: new Date('2026-06-10'),
          nextInspectionDate: new Date('2026-09-10'),
          maintenanceStatus: MaintenanceStatus.Pending,
          material: '52 kg/m Rail Steel',
          weight: '18.5 kg',
          description: 'Check rail/guard rail at level crossing.',
        },
        {
          id: 'RM-FIT-0010',
          qrCodeValue: 'RM-FIT-0010',
          fittingType: 'Spike (Dog Spike)',
          manufacturer: 'Demo Manufacturer B',
          batchNumber: 'BATCH-2026-010',
          manufacturingDate: new Date('2026-03-20'),
          materialGrade: 'High Carbon Spring Steel IRS:T-7',
          standardSpec: 'IRS:T-7',
          status: FittingStatus.Active,
          railLine: 'Nagpur — Wardha Section',
          trackSection: 'Section KM 72+100 - NGP-WR',
          sleeperNumber: 'PSC-SLP-3140',
          railwayZoneId: createdZones['CR'],
          railwayZoneName: 'Central Railway',
          division: 'Nagpur Division',
          kmMark: 'KM 72+100',
          trackType: 'Branch Line — BG',
          gpsLatitude: 21.1458,
          gpsLongitude: 79.0882,
          installedBy: 'Nagpur Division Gang',
          installationDate: new Date('2026-05-15'),
          torqueSpecNm: 130.0,
          laserMarkDate: new Date('2026-03-25'),
          markingMachineId: 'LM-RDSO-01',
          qrVerificationStatus: QRVerificationStatus.Verified,
          lastInspectionDate: new Date('2026-08-10'),
          nextInspectionDate: new Date('2026-11-10'),
          maintenanceStatus: MaintenanceStatus.Completed,
          material: 'Mild Steel',
          weight: '0.50 kg',
          description: 'Dog spike for fixing rails to wooden/composite sleepers.',
        },
        {
          id: 'RM-FIT-0011',
          qrCodeValue: 'RM-FIT-0011',
          fittingType: 'Rail Pad (EVA 6mm High Damping)',
          manufacturer: 'Demo Manufacturer D',
          batchNumber: 'BATCH-2026-011',
          manufacturingDate: new Date('2026-04-01'),
          materialGrade: 'Ethylene Vinyl Acetate RDSO Spec 2020',
          standardSpec: 'RDSO Spec 2020',
          status: FittingStatus.Active,
          railLine: 'Lucknow — Varanasi Section',
          trackSection: 'Section KM 287+500 - LKO-BSB',
          sleeperNumber: 'PSC-SLP-8910',
          railwayZoneId: createdZones['NER'],
          railwayZoneName: 'North Eastern Railway',
          division: 'Lucknow Division',
          kmMark: 'KM 287+500',
          trackType: 'Main Line — BG',
          gpsLatitude: 26.8467,
          gpsLongitude: 80.9462,
          installedBy: 'Lucknow Division Track Squad',
          installationDate: new Date('2026-05-20'),
          torqueSpecNm: 0.0,
          laserMarkDate: new Date('2026-04-05'),
          markingMachineId: 'LM-RDSO-02',
          qrVerificationStatus: QRVerificationStatus.Verified,
          lastInspectionDate: new Date('2026-08-05'),
          nextInspectionDate: new Date('2026-11-05'),
          maintenanceStatus: MaintenanceStatus.Completed,
          material: 'Ethylene Vinyl Acetate',
          weight: '0.18 kg',
          description: 'EVA rail pad for vibration damping under rail base.',
        },
        {
          id: 'RM-FIT-0012',
          qrCodeValue: 'RM-FIT-0012',
          fittingType: 'Bearing Plate (MS Base Plate)',
          manufacturer: 'Demo Manufacturer C',
          batchNumber: 'BATCH-2026-012',
          manufacturingDate: new Date('2026-04-10'),
          materialGrade: 'Mild Steel IRS:T-3',
          standardSpec: 'IRS:T-3',
          status: FittingStatus.MaintenanceRequired,
          railLine: 'Guwahati — Dibrugarh Section',
          trackSection: 'Section KM 450+300 - GHY-DBRT',
          sleeperNumber: 'PSC-SLP-5521',
          railwayZoneId: createdZones['NFR'],
          railwayZoneName: 'Northeast Frontier Railway',
          division: 'Tinsukia Division',
          kmMark: 'KM 450+300',
          trackType: 'Main Line — BG',
          gpsLatitude: 26.1445,
          gpsLongitude: 91.7362,
          installedBy: 'Tinsukia P-Way Maintenance Crew',
          installationDate: new Date('2026-06-01'),
          torqueSpecNm: 280.0,
          laserMarkDate: new Date('2026-04-15'),
          markingMachineId: 'LM-RDSO-04',
          qrVerificationStatus: QRVerificationStatus.Degraded,
          lastInspectionDate: new Date('2026-07-15'),
          nextInspectionDate: new Date('2026-10-15'),
          maintenanceStatus: MaintenanceStatus.Overdue,
          material: 'Mild Steel',
          weight: '2.30 kg',
          description: 'MS bearing plate distributing rail load to sleeper.',
        },
      ];

      for (const f of masterFittings) {
        await prisma.fitting.upsert({
          where: { id: f.id },
          update: f,
          create: f,
        });
      }
      console.log(`✅ Seeded all ${masterFittings.length} Master Track Fittings.`);

      // 4. Seed Inspections & AI Assessments
      const insp1 = await prisma.inspection.upsert({
        where: { id: 'INSP-2026-001' },
        update: {
          fittingId: 'RM-FIT-0001',
          inspectionDate: new Date('2026-07-10T10:30:00Z'),
          inspector: 'Rajesh Kumar Verma',
          inspectorId: 'RM-DEL-INS-4421',
          condition: ConditionStatus.Good,
          qrReadability: QRReadability.Excellent,
          corrosion: 'None',
          surfaceDamage: 'None',
          deformation: 'None',
          wear: 'Normal',
          notes: 'Direct optical scan verified. QR laser etching intact with zero contrast degradation.',
          imageUrl: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=600&q=80',
        },
        create: {
          id: 'INSP-2026-001',
          fittingId: 'RM-FIT-0001',
          inspectionDate: new Date('2026-07-10T10:30:00Z'),
          inspector: 'Rajesh Kumar Verma',
          inspectorId: 'RM-DEL-INS-4421',
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

      await prisma.aiAssessment.upsert({
        where: { id: 'AI-2026-001' },
        update: {
          inspectionId: insp1.id,
          fittingId: 'RM-FIT-0001',
          confidence: 98.6,
          conditionAssessment: ConditionStatus.Good,
          qrQuality: 96.2,
          defectDetected: false,
          recommendation: 'Fitting in optimal operational condition. Continue routine cycle.',
        },
        create: {
          id: 'AI-2026-001',
          inspectionId: insp1.id,
          fittingId: 'RM-FIT-0001',
          confidence: 98.6,
          conditionAssessment: ConditionStatus.Good,
          qrQuality: 96.2,
          defectDetected: false,
          recommendation: 'Fitting in optimal operational condition. Continue routine cycle.',
        },
      });

      const insp2 = await prisma.inspection.upsert({
        where: { id: 'INSP-2026-002' },
        update: {
          fittingId: 'RM-FIT-0003',
          inspectionDate: new Date('2026-06-20T14:15:00Z'),
          inspector: 'Rajesh Kumar Verma',
          inspectorId: 'RM-DEL-INS-4421',
          condition: ConditionStatus.MaintenanceRequired,
          qrReadability: QRReadability.Fair,
          corrosion: 'Moderate',
          surfaceDamage: 'Minor',
          deformation: 'Minor',
          wear: 'Moderate',
          notes: 'Surface oxidation and rust accumulation near laser marking border. Re-cleaning required.',
          imageUrl: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=600&q=80',
        },
        create: {
          id: 'INSP-2026-002',
          fittingId: 'RM-FIT-0003',
          inspectionDate: new Date('2026-06-20T14:15:00Z'),
          inspector: 'Rajesh Kumar Verma',
          inspectorId: 'RM-DEL-INS-4421',
          condition: ConditionStatus.MaintenanceRequired,
          qrReadability: QRReadability.Fair,
          corrosion: 'Moderate',
          surfaceDamage: 'Minor',
          deformation: 'Minor',
          wear: 'Moderate',
          notes: 'Surface oxidation and rust accumulation near laser marking border. Re-cleaning required.',
          imageUrl: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=600&q=80',
        },
      });

      await prisma.aiAssessment.upsert({
        where: { id: 'AI-2026-002' },
        update: {
          inspectionId: insp2.id,
          fittingId: 'RM-FIT-0003',
          confidence: 91.4,
          conditionAssessment: ConditionStatus.MaintenanceRequired,
          qrQuality: 74.5,
          defectDetected: true,
          defectType: 'Surface Rust & GFN Wear',
          recommendation: 'Execute anti-corrosion cleaning and re-verify optical QR contrast.',
        },
        create: {
          id: 'AI-2026-002',
          inspectionId: insp2.id,
          fittingId: 'RM-FIT-0003',
          confidence: 91.4,
          conditionAssessment: ConditionStatus.MaintenanceRequired,
          qrQuality: 74.5,
          defectDetected: true,
          defectType: 'Surface Rust & GFN Wear',
          recommendation: 'Execute anti-corrosion cleaning and re-verify optical QR contrast.',
        },
      });

      console.log('✅ Seeded Inspections & AI Assessments.');

      // 5. Seed Maintenance Records
      await prisma.maintenanceRecord.upsert({
        where: { id: 'MNT-2026-001' },
        update: {
          fittingId: 'RM-FIT-0001',
          maintenanceDate: new Date('2026-05-15T11:00:00Z'),
          maintenanceType: MaintenanceType.Routine,
          technician: 'Sunil Mohan Joshi',
          technicianId: 'RM-MUM-MNT-9932',
          description: 'Scheduled torque verification (110 Nm applied) and high-pressure debris purge.',
          status: MaintenanceStatus.Completed,
          nextMaintenance: new Date('2026-11-15'),
          cost: '₹ 250',
          partsReplaced: [],
        },
        create: {
          id: 'MNT-2026-001',
          fittingId: 'RM-FIT-0001',
          maintenanceDate: new Date('2026-05-15T11:00:00Z'),
          maintenanceType: MaintenanceType.Routine,
          technician: 'Sunil Mohan Joshi',
          technicianId: 'RM-MUM-MNT-9932',
          description: 'Scheduled torque verification (110 Nm applied) and high-pressure debris purge.',
          status: MaintenanceStatus.Completed,
          nextMaintenance: new Date('2026-11-15'),
          cost: '₹ 250',
          partsReplaced: [],
        },
      });

      await prisma.maintenanceRecord.upsert({
        where: { id: 'MNT-2026-002' },
        update: {
          fittingId: 'RM-FIT-0003',
          maintenanceDate: new Date('2026-07-10T09:30:00Z'),
          maintenanceType: MaintenanceType.Corrective,
          technician: 'Sunil Mohan Joshi',
          technicianId: 'RM-MUM-MNT-9932',
          description: 'Anti-corrosion solvent treatment and laser QR surface re-conditioning.',
          status: MaintenanceStatus.Overdue,
          nextMaintenance: new Date('2027-01-10'),
          cost: '₹ 450',
          partsReplaced: ['Liner Pad', 'Nylon Collar'],
        },
        create: {
          id: 'MNT-2026-002',
          fittingId: 'RM-FIT-0003',
          maintenanceDate: new Date('2026-07-10T09:30:00Z'),
          maintenanceType: MaintenanceType.Corrective,
          technician: 'Sunil Mohan Joshi',
          technicianId: 'RM-MUM-MNT-9932',
          description: 'Anti-corrosion solvent treatment and laser QR surface re-conditioning.',
          status: MaintenanceStatus.Overdue,
          nextMaintenance: new Date('2027-01-10'),
          cost: '₹ 450',
          partsReplaced: ['Liner Pad', 'Nylon Collar'],
        },
      });

      console.log('✅ Seeded Maintenance Records.');

      // 6. Seed Immutable Lifecycle Events
      const lifecycleEvents = [
        { id: 'LC-0001-MFG', fittingId: 'RM-FIT-0001', event: LifecycleEventType.Manufactured, eventDate: new Date('2026-01-15T08:00:00Z'), actor: 'Bhilai Steel Plant', location: 'Pune Plant', notes: 'Production batch BATCH-2026-001 completed. QR assigned.' },
        { id: 'LC-0001-QR', fittingId: 'RM-FIT-0001', event: LifecycleEventType.QRVerified, eventDate: new Date('2026-01-18T14:30:00Z'), actor: 'Direct Part Marking Cell #04', location: 'RDSO Bhilai Facility', notes: 'Fiber laser etching applied. QR verified ISO/IEC 15415 Grade A.' },
        { id: 'LC-0001-INS', fittingId: 'RM-FIT-0001', event: LifecycleEventType.Installed, eventDate: new Date('2026-02-20T09:00:00Z'), actor: 'Northern Track Maintenance Wing', location: 'KM 45+200, MCT-PUNE', notes: 'Installed on Sleeper PSC-SLP-4401 with 110 Nm torque.' },
        { id: 'LC-0001-AUD', fittingId: 'RM-FIT-0001', event: LifecycleEventType.Inspected, eventDate: new Date('2026-07-10T10:30:00Z'), actor: 'Rajesh Kumar Verma', location: 'KM 45+200', notes: 'Periodic inspection passed with 98.6% AI vision confidence.' },
      ];

      for (const lc of lifecycleEvents) {
        await prisma.lifecycleEvent.upsert({
          where: { id: lc.id },
          update: lc,
          create: lc,
        });
      }
      console.log(`✅ Seeded ${lifecycleEvents.length} Immutable Append-Only Lifecycle Events.`);

      // 7. Seed Audit Log
      await prisma.auditLog.create({
        data: {
          action: 'MASTER_DATABASE_SEED',
          username: 'SYSTEM',
          fittingId: 'RM-FIT-0001',
          details: 'All 12 Indian Railway track fittings and lifecycle entities initialized successfully.',
          ipAddress: '127.0.0.1',
        },
      }).catch(() => {});

      console.log('🎉 RailMark AI Database Seeded Successfully with all 12 Fittings!');
      return {
        success: true,
        count: masterFittings.length,
        message: `Successfully seeded ${masterFittings.length} fittings and master railway data.`,
      };
    } catch (err: any) {
      console.error('❌ Error during SeedService.seedDatabase:', err);
      throw err;
    }
  }
}
