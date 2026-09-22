// =============================================================================
// RailMark AI — Fitting Service (PostgreSQL & Unique QR Code Handling)
// =============================================================================
import { prisma } from '../db/prisma.js';
import { LifecycleService } from './lifecycle.service.js';
import { SeedService } from './seed.service.js';
export const MASTER_12_FITTINGS_FALLBACK = [
    {
        fittingId: 'RM-FIT-0001',
        id: 'RM-FIT-0001',
        qrCodeValue: 'RM-FIT-0001',
        qrId: 'RM-FIT-0001',
        fittingType: 'Elastic Rail Clip (ERC MK-III)',
        manufacturer: 'Bhilai Steel Plant / RDSO Approved',
        batchNumber: 'BATCH-2026-001',
        manufacturingDate: '2026-01-15',
        installationDate: '2026-02-20',
        location: 'Mumbai Central — Pune Section',
        railLine: 'Mumbai Central — Pune High Speed Corridor',
        trackSection: 'Section KM 45+200 - Up Main Line',
        sleeperNumber: 'PSC-SLP-4401',
        railwayZone: 'Central Railway',
        railwayZoneName: 'Central Railway',
        division: 'Mumbai Division',
        section: 'MCT-PUNE',
        kmMark: 'KM 45+200',
        trackType: 'Main Line — BG',
        status: 'Active',
        lastInspection: '2026-07-10',
        lastInspectionDate: '2026-07-10',
        nextInspection: '2026-10-10',
        nextInspectionDate: '2026-10-10',
        maintenanceStatus: 'Completed',
        description: 'Pandrol e-clip type elastic fastening used in high-speed BG track.',
        material: 'Spring Steel',
        materialGrade: 'Spring Steel 55Si7',
        weight: '0.85 kg',
        standardSpec: 'IRS:T-31-2021',
        gpsLatitude: 18.9872,
        gpsLongitude: 73.1234,
        torqueSpecNm: 110,
        qrVerificationStatus: 'Verified',
    },
    {
        fittingId: 'RM-FIT-0002',
        id: 'RM-FIT-0002',
        qrCodeValue: 'RM-FIT-0002',
        qrId: 'RM-FIT-0002',
        fittingType: 'GFN-66 Insulating Liner',
        manufacturer: 'Polymers India Ltd',
        batchNumber: 'BATCH-2026-002',
        manufacturingDate: '2026-01-20',
        installationDate: '2026-03-05',
        location: 'Delhi — Agra Section',
        railLine: 'Delhi — Agra Main Corridor',
        trackSection: 'Section KM 162+500 - DLI-AGC',
        sleeperNumber: 'PSC-SLP-4482',
        railwayZone: 'North Central Railway',
        railwayZoneName: 'North Central Railway',
        division: 'Agra Division',
        section: 'DLI-AGC',
        kmMark: 'KM 162+500',
        trackType: 'Main Line — BG',
        status: 'Inspection Due',
        lastInspection: '2026-04-15',
        lastInspectionDate: '2026-04-15',
        nextInspection: '2026-08-15',
        nextInspectionDate: '2026-08-15',
        maintenanceStatus: 'Scheduled',
        description: 'Rubber/HDPE liner used beneath rail seats on PSC sleepers.',
        material: 'High Density Polyethylene',
        materialGrade: 'GFN 66 (Glass Reinforced Polyamide)',
        weight: '0.32 kg',
        standardSpec: 'RDSO Spec 2018',
        gpsLatitude: 27.1767,
        gpsLongitude: 78.0081,
        torqueSpecNm: 0,
        qrVerificationStatus: 'Verified',
    },
    {
        fittingId: 'RM-FIT-0003',
        id: 'RM-FIT-0003',
        qrCodeValue: 'RM-FIT-0003',
        qrId: 'RM-FIT-0003',
        fittingType: 'GFN Shoulder',
        manufacturer: 'Demo Manufacturer A',
        batchNumber: 'BATCH-2026-003',
        manufacturingDate: '2026-02-01',
        installationDate: '2026-03-15',
        location: 'Chennai — Bangalore Section',
        railLine: 'Southern Suburban Route',
        trackSection: 'Section KM 90+100 - MAS-SBC',
        sleeperNumber: 'PSC-SLP-1290',
        railwayZone: 'Southern Railway',
        railwayZoneName: 'Southern Railway',
        division: 'Chennai Division',
        section: 'MAS-SBC',
        kmMark: 'KM 90+100',
        trackType: 'Main Line — BG',
        status: 'Maintenance Required',
        lastInspection: '2026-06-20',
        lastInspectionDate: '2026-06-20',
        nextInspection: '2026-09-20',
        nextInspectionDate: '2026-09-20',
        maintenanceStatus: 'Overdue',
        description: 'Glass Filled Nylon shoulder insulator for PSC sleepers.',
        material: 'GFN (30% Glass Filled Nylon)',
        materialGrade: 'GFN (30% Glass Filled Nylon)',
        weight: '0.24 kg',
        standardSpec: 'RDSO/T-4703',
        gpsLatitude: 13.0827,
        gpsLongitude: 80.2707,
        torqueSpecNm: 85,
        qrVerificationStatus: 'Degraded',
    },
    {
        fittingId: 'RM-FIT-0004',
        id: 'RM-FIT-0004',
        qrCodeValue: 'RM-FIT-0004',
        qrId: 'RM-FIT-0004',
        fittingType: 'Rail Anchor',
        manufacturer: 'Demo Manufacturer C',
        batchNumber: 'BATCH-2026-004',
        manufacturingDate: '2026-01-28',
        installationDate: '2026-02-25',
        location: 'Kolkata — Howrah Section',
        railLine: 'Eastern Express Feeder Line',
        trackSection: 'Section KM 22+750 - HWH-BDC',
        sleeperNumber: 'PSC-SLP-3105',
        railwayZone: 'Eastern Railway',
        railwayZoneName: 'Eastern Railway',
        division: 'Howrah Division',
        section: 'HWH-BDC',
        kmMark: 'KM 22+750',
        trackType: 'Suburban — BG',
        status: 'Active',
        lastInspection: '2026-07-05',
        lastInspectionDate: '2026-07-05',
        nextInspection: '2026-10-05',
        nextInspectionDate: '2026-10-05',
        maintenanceStatus: 'Completed',
        description: 'Spring steel anchor to prevent rail creep on timber sleepers.',
        material: 'Carbon Steel',
        materialGrade: 'High Carbon Spring Steel',
        weight: '1.20 kg',
        standardSpec: 'IRS:T-12-2021',
        gpsLatitude: 22.5726,
        gpsLongitude: 88.3639,
        torqueSpecNm: 95,
        qrVerificationStatus: 'Verified',
    },
    {
        fittingId: 'RM-FIT-0005',
        id: 'RM-FIT-0005',
        qrCodeValue: 'RM-FIT-0005',
        qrId: 'RM-FIT-0005',
        fittingType: 'Fish Plate (60kg UIC Rail Joint)',
        manufacturer: 'Demo Manufacturer B',
        batchNumber: 'BATCH-2026-005',
        manufacturingDate: '2026-02-10',
        installationDate: '2026-03-20',
        location: 'Ahmedabad — Vadodara Section',
        railLine: 'Western Freight Route',
        trackSection: 'Section KM 73+400 - ADI-BRC',
        sleeperNumber: 'PSC-SLP-5520',
        railwayZone: 'Western Railway',
        railwayZoneName: 'Western Railway',
        division: 'Vadodara Division',
        section: 'ADI-BRC',
        kmMark: 'KM 73+400',
        trackType: 'Main Line — BG',
        status: 'Active',
        lastInspection: '2026-07-18',
        lastInspectionDate: '2026-07-18',
        nextInspection: '2026-10-18',
        nextInspectionDate: '2026-10-18',
        maintenanceStatus: 'Completed',
        description: '6-hole fish plate for standard rail joints.',
        material: 'Mild Steel',
        materialGrade: 'Medium Manganese Steel',
        weight: '12.5 kg (pair)',
        standardSpec: 'IRS:T-1-2018',
        gpsLatitude: 22.3072,
        gpsLongitude: 73.1812,
        torqueSpecNm: 250,
        qrVerificationStatus: 'Verified',
    },
    {
        fittingId: 'RM-FIT-0006',
        id: 'RM-FIT-0006',
        qrCodeValue: 'RM-FIT-0006',
        qrId: 'RM-FIT-0006',
        fittingType: 'Elastic Rail Clip (ERC MK-V)',
        manufacturer: 'Demo Manufacturer D',
        batchNumber: 'BATCH-2026-006',
        manufacturingDate: '2026-02-15',
        installationDate: '2026-04-01',
        location: 'Hyderabad — Secunderabad Section',
        railLine: 'South Central Route',
        trackSection: 'Section KM 8+300 - HYB-SC',
        sleeperNumber: 'PSC-SLP-4402',
        railwayZone: 'South Central Railway',
        railwayZoneName: 'South Central Railway',
        division: 'Secunderabad Division',
        section: 'HYB-SC',
        kmMark: 'KM 8+300',
        trackType: 'Suburban — BG',
        status: 'Inspection Due',
        lastInspection: '2026-05-22',
        lastInspectionDate: '2026-05-22',
        nextInspection: '2026-08-22',
        nextInspectionDate: '2026-08-22',
        maintenanceStatus: 'Scheduled',
        description: 'Pandrol PR clip for MG converted BG track section.',
        material: 'Spring Steel',
        materialGrade: 'Spring Steel 60Si7',
        weight: '0.75 kg',
        standardSpec: 'IRS:T-40 2000',
        gpsLatitude: 17.385,
        gpsLongitude: 78.4867,
        torqueSpecNm: 120,
        qrVerificationStatus: 'Verified',
    },
    {
        fittingId: 'RM-FIT-0007',
        id: 'RM-FIT-0007',
        qrCodeValue: 'RM-FIT-0007',
        qrId: 'RM-FIT-0007',
        fittingType: 'PSC Sleeper Bolt / Track Spike',
        manufacturer: 'Demo Manufacturer C',
        batchNumber: 'BATCH-2026-007',
        manufacturingDate: '2026-03-01',
        installationDate: '2026-04-10',
        location: 'Jaipur — Ajmer Section',
        railLine: 'North Western Desert Section',
        trackSection: 'Section KM 130+600 - JP-AII',
        sleeperNumber: 'PSC-SLP-9104',
        railwayZone: 'North Western Railway',
        railwayZoneName: 'North Western Railway',
        division: 'Ajmer Division',
        section: 'JP-AII',
        kmMark: 'KM 130+600',
        trackType: 'Main Line — BG',
        status: 'Active',
        lastInspection: '2026-08-01',
        lastInspectionDate: '2026-08-01',
        nextInspection: '2026-11-01',
        nextInspectionDate: '2026-11-01',
        maintenanceStatus: 'Completed',
        description: 'High tensile T-bolt for PSC sleeper rail fastening.',
        material: 'High Tensile Steel',
        materialGrade: 'Class 8.8 High Strength Alloy',
        weight: '0.48 kg',
        standardSpec: 'RDSO/T-4704',
        gpsLatitude: 26.9124,
        gpsLongitude: 75.7873,
        torqueSpecNm: 180,
        qrVerificationStatus: 'Verified',
    },
    {
        fittingId: 'RM-FIT-0008',
        id: 'RM-FIT-0008',
        qrCodeValue: 'RM-FIT-0008',
        qrId: 'RM-FIT-0008',
        fittingType: 'Tie Bar',
        manufacturer: 'Demo Manufacturer A',
        batchNumber: 'BATCH-2026-008',
        manufacturingDate: '2026-03-10',
        installationDate: '2026-04-20',
        location: 'Patna — Gaya Section',
        railLine: 'East Central Line',
        trackSection: 'Section KM 95+800 - PNBE-GAYA',
        sleeperNumber: 'PSC-SLP-1310',
        railwayZone: 'East Central Railway',
        railwayZoneName: 'East Central Railway',
        division: 'Danapur Division',
        section: 'PNBE-GAYA',
        kmMark: 'KM 95+800',
        trackType: 'Main Line — BG',
        status: 'Active',
        lastInspection: '2026-07-25',
        lastInspectionDate: '2026-07-25',
        nextInspection: '2026-10-25',
        nextInspectionDate: '2026-10-25',
        maintenanceStatus: 'Completed',
        description: 'Tie bar connecting two rails at turnout crossing.',
        material: 'Carbon Steel',
        materialGrade: 'Carbon Steel IS:2062',
        weight: '8.4 kg',
        standardSpec: 'IRS:T-30-2019',
        gpsLatitude: 25.5941,
        gpsLongitude: 85.1376,
        torqueSpecNm: 105,
        qrVerificationStatus: 'Verified',
    },
    {
        fittingId: 'RM-FIT-0009',
        id: 'RM-FIT-0009',
        qrCodeValue: 'RM-FIT-0009',
        qrId: 'RM-FIT-0009',
        fittingType: 'Guard Rail / Check Rail',
        manufacturer: 'Demo Manufacturer E',
        batchNumber: 'BATCH-2026-009',
        manufacturingDate: '2026-03-15',
        installationDate: '2026-05-05',
        location: 'Bhopal — Itarsi Section',
        railLine: 'West Central Route',
        trackSection: 'Section KM 58+200 - BPL-ET',
        sleeperNumber: 'PSC-SLP-5380',
        railwayZone: 'West Central Railway',
        railwayZoneName: 'West Central Railway',
        division: 'Bhopal Division',
        section: 'BPL-ET',
        kmMark: 'KM 58+200',
        trackType: 'Main Line — BG',
        status: 'Inspection Due',
        lastInspection: '2026-06-10',
        lastInspectionDate: '2026-06-10',
        nextInspection: '2026-09-10',
        nextInspectionDate: '2026-09-10',
        maintenanceStatus: 'Pending',
        description: 'Check rail/guard rail at level crossing.',
        material: '52 kg/m Rail Steel',
        materialGrade: '52 kg/m Rail Steel IRS:T-10',
        weight: '18.5 kg',
        standardSpec: 'IRS:T-10',
        gpsLatitude: 23.2599,
        gpsLongitude: 77.4126,
        torqueSpecNm: 220,
        qrVerificationStatus: 'Verified',
    },
    {
        fittingId: 'RM-FIT-0010',
        id: 'RM-FIT-0010',
        qrCodeValue: 'RM-FIT-0010',
        qrId: 'RM-FIT-0010',
        fittingType: 'Spike (Dog Spike)',
        manufacturer: 'Demo Manufacturer B',
        batchNumber: 'BATCH-2026-010',
        manufacturingDate: '2026-03-20',
        installationDate: '2026-05-15',
        location: 'Nagpur — Wardha Section',
        railLine: 'Central Route',
        trackSection: 'Section KM 72+100 - NGP-WR',
        sleeperNumber: 'PSC-SLP-3140',
        railwayZone: 'Central Railway',
        railwayZoneName: 'Central Railway',
        division: 'Nagpur Division',
        section: 'NGP-WR',
        kmMark: 'KM 72+100',
        trackType: 'Branch Line — BG',
        status: 'Active',
        lastInspection: '2026-08-10',
        lastInspectionDate: '2026-08-10',
        nextInspection: '2026-11-10',
        nextInspectionDate: '2026-11-10',
        maintenanceStatus: 'Completed',
        description: 'Dog spike for fixing rails to wooden/composite sleepers.',
        material: 'Mild Steel',
        materialGrade: 'High Carbon Spring Steel IRS:T-7',
        weight: '0.50 kg',
        standardSpec: 'IRS:T-7',
        gpsLatitude: 21.1458,
        gpsLongitude: 79.0882,
        torqueSpecNm: 130,
        qrVerificationStatus: 'Verified',
    },
    {
        fittingId: 'RM-FIT-0011',
        id: 'RM-FIT-0011',
        qrCodeValue: 'RM-FIT-0011',
        qrId: 'RM-FIT-0011',
        fittingType: 'Rail Pad (EVA 6mm High Damping)',
        manufacturer: 'Demo Manufacturer D',
        batchNumber: 'BATCH-2026-011',
        manufacturingDate: '2026-04-01',
        installationDate: '2026-05-20',
        location: 'Lucknow — Varanasi Section',
        railLine: 'North Eastern Corridor',
        trackSection: 'Section KM 287+500 - LKO-BSB',
        sleeperNumber: 'PSC-SLP-8910',
        railwayZone: 'North Eastern Railway',
        railwayZoneName: 'North Eastern Railway',
        division: 'Lucknow Division',
        section: 'LKO-BSB',
        kmMark: 'KM 287+500',
        trackType: 'Main Line — BG',
        status: 'Active',
        lastInspection: '2026-08-05',
        lastInspectionDate: '2026-08-05',
        nextInspection: '2026-11-05',
        nextInspectionDate: '2026-11-05',
        maintenanceStatus: 'Completed',
        description: 'EVA rail pad for vibration damping under rail base.',
        material: 'Ethylene Vinyl Acetate',
        materialGrade: 'Ethylene Vinyl Acetate RDSO Spec 2020',
        weight: '0.18 kg',
        standardSpec: 'RDSO Spec 2020',
        gpsLatitude: 26.8467,
        gpsLongitude: 80.9462,
        torqueSpecNm: 0,
        qrVerificationStatus: 'Verified',
    },
    {
        fittingId: 'RM-FIT-0012',
        id: 'RM-FIT-0012',
        qrCodeValue: 'RM-FIT-0012',
        qrId: 'RM-FIT-0012',
        fittingType: 'Bearing Plate (MS Base Plate)',
        manufacturer: 'Demo Manufacturer C',
        batchNumber: 'BATCH-2026-012',
        manufacturingDate: '2026-04-10',
        installationDate: '2026-06-01',
        location: 'Guwahati — Dibrugarh Section',
        railLine: 'Northeast Frontier Line',
        trackSection: 'Section KM 450+300 - GHY-DBRT',
        sleeperNumber: 'PSC-SLP-5521',
        railwayZone: 'Northeast Frontier Railway',
        railwayZoneName: 'Northeast Frontier Railway',
        division: 'Tinsukia Division',
        section: 'GHY-DBRT',
        kmMark: 'KM 450+300',
        trackType: 'Main Line — BG',
        status: 'Maintenance Required',
        lastInspection: '2026-07-15',
        lastInspectionDate: '2026-07-15',
        nextInspection: '2026-10-15',
        nextInspectionDate: '2026-10-15',
        maintenanceStatus: 'Overdue',
        description: 'MS bearing plate distributing rail load to sleeper.',
        material: 'Mild Steel',
        materialGrade: 'Mild Steel IRS:T-3',
        weight: '2.30 kg',
        standardSpec: 'IRS:T-3',
        gpsLatitude: 26.1445,
        gpsLongitude: 91.7362,
        torqueSpecNm: 280,
        qrVerificationStatus: 'Degraded',
    },
];
function filterFallbackFittings(options) {
    let list = [...MASTER_12_FITTINGS_FALLBACK];
    if (options.status && options.status !== 'All') {
        const s = options.status.replace(/\s+/g, '').toLowerCase();
        list = list.filter((f) => f.status.replace(/\s+/g, '').toLowerCase() === s);
    }
    if (options.zone && options.zone !== 'All') {
        const z = options.zone.toLowerCase();
        list = list.filter((f) => f.railwayZoneName.toLowerCase().includes(z) || f.railwayZone.toLowerCase().includes(z));
    }
    if (options.type && options.type !== 'All') {
        const t = options.type.toLowerCase();
        list = list.filter((f) => f.fittingType.toLowerCase().includes(t));
    }
    const offset = options.offset || 0;
    const limit = options.limit || 100;
    return list.slice(offset, offset + limit);
}
export class FittingService {
    static async getAllFittings(options = {}) {
        const limit = options.limit || 100;
        const offset = options.offset || 0;
        try {
            const where = {};
            if (options.status && options.status !== 'All') {
                where.status = options.status.replace(/\s+/g, '');
            }
            if (options.zone && options.zone !== 'All') {
                where.railwayZoneName = { contains: options.zone, mode: 'insensitive' };
            }
            if (options.type && options.type !== 'All') {
                where.fittingType = { contains: options.type, mode: 'insensitive' };
            }
            const fittings = await prisma.fitting.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: { createdAt: 'desc' },
                include: {
                    railwayZone: true,
                    inspections: {
                        take: 3,
                        orderBy: { inspectionDate: 'desc' },
                        include: { aiAssessment: true },
                    },
                    maintenanceRecords: {
                        take: 3,
                        orderBy: { maintenanceDate: 'desc' },
                    },
                    lifecycleEvents: {
                        orderBy: { eventDate: 'desc' },
                    },
                },
            });
            if (fittings.length === 0 && !options.status && !options.zone && !options.type) {
                // Auto-seed in background if database was empty
                SeedService.seedDatabase(false).catch((e) => console.warn('Background seed error:', e));
                return filterFallbackFittings(options);
            }
            if (fittings.length === 0 && (options.status || options.zone || options.type)) {
                return filterFallbackFittings(options);
            }
            return fittings.map(this.formatFittingResponse);
        }
        catch {
            return filterFallbackFittings(options);
        }
    }
    static async getFittingById(id) {
        try {
            const fitting = await prisma.fitting.findFirst({
                where: {
                    OR: [
                        { id: id },
                        { qrCodeValue: id },
                    ],
                },
                include: {
                    railwayZone: true,
                    inspections: {
                        orderBy: { inspectionDate: 'desc' },
                        include: {
                            aiAssessment: true,
                            mediaMetadata: true,
                        },
                    },
                    maintenanceRecords: {
                        orderBy: { maintenanceDate: 'desc' },
                    },
                    lifecycleEvents: {
                        orderBy: { eventDate: 'desc' },
                    },
                    aiAssessments: {
                        orderBy: { createdAt: 'desc' },
                    },
                    mediaMetadata: {
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });
            if (!fitting) {
                const fallback = MASTER_12_FITTINGS_FALLBACK.find((f) => f.id === id || f.qrCodeValue === id || f.qrId === id);
                if (fallback) {
                    return {
                        basicInfo: fallback,
                        installationInfo: {
                            railLine: fallback.railLine,
                            trackSection: fallback.trackSection,
                            sleeperNumber: fallback.sleeperNumber,
                            installedBy: 'Northern Track Maintenance Wing',
                            installationDate: fallback.installationDate,
                            torqueSpecNm: fallback.torqueSpecNm,
                            gpsLatitude: fallback.gpsLatitude,
                            gpsLongitude: fallback.gpsLongitude,
                        },
                        qrInfo: {
                            qrCodeValue: fallback.qrCodeValue,
                            laserMarkDate: new Date().toISOString(),
                            markingMachineId: 'LM-RDSO-04',
                            qrVerificationStatus: fallback.qrVerificationStatus,
                        },
                        inspections: [],
                        maintenance: [],
                        lifecycle: [],
                        aiAssessments: [],
                        media: [],
                    };
                }
                return null;
            }
            return this.formatFittingComposite(fitting);
        }
        catch {
            const fallback = MASTER_12_FITTINGS_FALLBACK.find((f) => f.id === id || f.qrCodeValue === id || f.qrId === id);
            if (fallback) {
                return {
                    basicInfo: fallback,
                    installationInfo: {
                        railLine: fallback.railLine,
                        trackSection: fallback.trackSection,
                        sleeperNumber: fallback.sleeperNumber,
                        installedBy: 'Northern Track Maintenance Wing',
                        installationDate: fallback.installationDate,
                        torqueSpecNm: fallback.torqueSpecNm,
                        gpsLatitude: fallback.gpsLatitude,
                        gpsLongitude: fallback.gpsLongitude,
                    },
                    qrInfo: {
                        qrCodeValue: fallback.qrCodeValue,
                        laserMarkDate: new Date().toISOString(),
                        markingMachineId: 'LM-RDSO-04',
                        qrVerificationStatus: fallback.qrVerificationStatus,
                    },
                    inspections: [],
                    maintenance: [],
                    lifecycle: [],
                    aiAssessments: [],
                    media: [],
                };
            }
            return null;
        }
    }
    static async createFitting(data, actorName = 'System Admin') {
        const fittingId = data.fittingId || data.id || `RM-FIT-${String(Date.now()).slice(-4)}`;
        const qrCodeValue = data.qrCodeValue || data.qrId || fittingId;
        // Check unique QR code constraint
        const existingQr = await prisma.fitting.findFirst({
            where: {
                OR: [{ id: fittingId }, { qrCodeValue: qrCodeValue }],
            },
        });
        if (existingQr) {
            const err = new Error(`A fitting with QR Code / ID "${qrCodeValue}" already exists. QR IDs must be unique across the railway network.`);
            err.statusCode = 409;
            throw err;
        }
        const created = await prisma.fitting.create({
            data: {
                id: fittingId,
                qrCodeValue: qrCodeValue,
                fittingType: data.fittingType || 'Elastic Rail Clip (ERC MK-III)',
                manufacturer: data.manufacturer || 'Standard Track Systems',
                batchNumber: data.batchNumber || `BATCH-${new Date().getFullYear()}-001`,
                manufacturingDate: new Date(data.manufacturingDate || Date.now()),
                materialGrade: data.materialGrade || data.material || 'Spring Steel 55Si7',
                standardSpec: data.standardSpec || 'IRS:T-31-2021',
                status: data.status?.replace(/\s+/g, '') || 'Active',
                railLine: data.railLine || data.railwayZone || 'Northern High-Density Corridor',
                trackSection: data.trackSection || data.location || 'Section KM 142/4 - Up Main Line',
                sleeperNumber: data.sleeperNumber || 'PSC-SLP-01',
                railwayZoneName: data.railwayZoneName || data.railwayZone || 'Northern Railway',
                division: data.division || 'Delhi Division',
                kmMark: data.kmMark || 'KM 142/4',
                trackType: data.trackType || 'Broad Gauge (1676mm)',
                gpsLatitude: data.gpsLatitude || 28.6139,
                gpsLongitude: data.gpsLongitude || 77.2090,
                installedBy: data.installedBy || actorName,
                installationDate: new Date(data.installationDate || Date.now()),
                torqueSpecNm: data.torqueSpecNm || 110.0,
                laserMarkDate: data.laserMarkDate ? new Date(data.laserMarkDate) : new Date(),
                markingMachineId: data.markingMachineId || 'LM-RDSO-04',
                qrVerificationStatus: data.qrVerificationStatus || 'Verified',
                lastInspectionDate: data.lastInspectionDate ? new Date(data.lastInspectionDate) : new Date(),
                nextInspectionDate: data.nextInspectionDate ? new Date(data.nextInspectionDate) : undefined,
                maintenanceStatus: data.maintenanceStatus || 'Completed',
                material: data.material || data.materialGrade || 'Spring Steel',
                weight: data.weight || '0.92 kg',
                description: data.description || `${data.fittingType} with unique laser etched QR code.`,
            },
        });
        // Append-Only Lifecycle Event: Created & QR Verified
        await LifecycleService.appendEvent({
            fittingId: created.id,
            event: 'QRVerified',
            actor: actorName,
            location: created.trackSection,
            notes: `Direct Part Marking laser QR (${created.qrCodeValue}) registered in master database.`,
        });
        return this.formatFittingResponse(created);
    }
    static async updateFitting(id, data) {
        const updateData = {};
        if (data.status)
            updateData.status = data.status.replace(/\s+/g, '');
        if (data.fittingType)
            updateData.fittingType = data.fittingType;
        if (data.trackSection || data.location)
            updateData.trackSection = data.trackSection || data.location;
        if (data.materialGrade || data.material)
            updateData.materialGrade = data.materialGrade || data.material;
        if (data.standardSpec)
            updateData.standardSpec = data.standardSpec;
        if (data.torqueSpecNm !== undefined)
            updateData.torqueSpecNm = data.torqueSpecNm;
        if (data.qrVerificationStatus)
            updateData.qrVerificationStatus = data.qrVerificationStatus;
        if (data.maintenanceStatus)
            updateData.maintenanceStatus = data.maintenanceStatus;
        if (data.lastInspectionDate)
            updateData.lastInspectionDate = new Date(data.lastInspectionDate);
        if (data.nextInspectionDate)
            updateData.nextInspectionDate = new Date(data.nextInspectionDate);
        if (data.description)
            updateData.description = data.description;
        const updated = await prisma.fitting.update({
            where: { id },
            data: updateData,
        });
        return this.formatFittingResponse(updated);
    }
    static async deleteFitting(id) {
        return await prisma.fitting.delete({
            where: { id },
        });
    }
    static formatFittingResponse(f) {
        return {
            fittingId: f.id,
            id: f.id,
            qrCodeValue: f.qrCodeValue,
            qrId: f.qrCodeValue,
            fittingType: f.fittingType,
            manufacturer: f.manufacturer,
            batchNumber: f.batchNumber,
            manufacturingDate: f.manufacturingDate ? new Date(f.manufacturingDate).toISOString().split('T')[0] : '',
            materialGrade: f.materialGrade,
            standardSpec: f.standardSpec,
            status: f.status,
            railLine: f.railLine,
            trackSection: f.trackSection,
            location: f.trackSection,
            sleeperNumber: f.sleeperNumber,
            railwayZone: f.railwayZoneName || f.railwayZone?.name || 'Northern Railway',
            railwayZoneName: f.railwayZoneName || f.railwayZone?.name || 'Northern Railway',
            division: f.division,
            kmMark: f.kmMark,
            trackType: f.trackType,
            gpsLatitude: Number(f.gpsLatitude),
            gpsLongitude: Number(f.gpsLongitude),
            installedBy: f.installedBy,
            installationDate: f.installationDate ? new Date(f.installationDate).toISOString().split('T')[0] : '',
            torqueSpecNm: Number(f.torqueSpecNm),
            laserMarkDate: f.laserMarkDate,
            markingMachineId: f.markingMachineId,
            qrVerificationStatus: f.qrVerificationStatus,
            lastInspectionDate: f.lastInspectionDate ? new Date(f.lastInspectionDate).toISOString().split('T')[0] : '',
            nextInspectionDate: f.nextInspectionDate ? new Date(f.nextInspectionDate).toISOString().split('T')[0] : '',
            maintenanceStatus: f.maintenanceStatus,
            material: f.material || f.materialGrade,
            weight: f.weight,
            description: f.description,
            createdAt: f.createdAt,
            updatedAt: f.updatedAt,
        };
    }
    static formatFittingComposite(f) {
        const formatted = this.formatFittingResponse(f);
        return {
            basicInfo: formatted,
            installationInfo: {
                railLine: f.railLine,
                trackSection: f.trackSection,
                sleeperNumber: f.sleeperNumber,
                installedBy: f.installedBy,
                installationDate: formatted.installationDate,
                torqueSpecNm: formatted.torqueSpecNm,
                gpsLatitude: formatted.gpsLatitude,
                gpsLongitude: formatted.gpsLongitude,
            },
            qrInfo: {
                qrCodeValue: f.qrCodeValue,
                laserMarkDate: f.laserMarkDate,
                markingMachineId: f.markingMachineId,
                qrVerificationStatus: f.qrVerificationStatus,
            },
            inspections: f.inspections || [],
            maintenance: f.maintenanceRecords || [],
            lifecycle: f.lifecycleEvents || [],
            aiAssessments: f.aiAssessments || [],
            media: f.mediaMetadata || [],
        };
    }
}
//# sourceMappingURL=fitting.service.js.map