// =============================================================================
// RailMark AI — Fitting Zod Validation Schemas
// =============================================================================
import { z } from 'zod';
export const FittingStatusEnum = z.enum([
    'Active',
    'InspectionDue',
    'MaintenanceRequired',
    'Critical',
    'Decommissioned',
    'InTransit',
    'UnderInspection',
    'Inspection Due',
    'Maintenance Required',
    'In Transit',
    'Under Inspection',
]);
export const createFittingSchema = z.object({
    body: z.object({
        fittingId: z.string().optional(),
        id: z.string().optional(),
        qrCodeValue: z.string().min(1, 'QR code value is required'),
        qrId: z.string().optional(),
        fittingType: z.string().min(2, 'Fitting type must be at least 2 characters'),
        manufacturer: z.string().min(2, 'Manufacturer name required'),
        batchNumber: z.string().min(2, 'Batch number required'),
        manufacturingDate: z.string().min(4, 'Valid manufacturing date required'),
        materialGrade: z.string().optional().default('Spring Steel 55Si7'),
        material: z.string().optional(),
        standardSpec: z.string().optional().default('IRS:T-31-2021'),
        status: z.string().optional().default('Active'),
        railLine: z.string().optional().default('Northern High-Density Corridor'),
        trackSection: z.string().optional().default('Section KM 142/4 - Up Main Line'),
        location: z.string().optional(),
        sleeperNumber: z.string().optional().default('PSC-SLP-01'),
        railwayZone: z.string().optional().default('Northern Railway'),
        railwayZoneName: z.string().optional(),
        railwayZoneId: z.string().optional(),
        division: z.string().optional().default('Delhi Division'),
        kmMark: z.string().optional().default('KM 142/4'),
        trackType: z.string().optional().default('Broad Gauge (1676mm)'),
        gpsLatitude: z.number().optional().default(28.6139),
        gpsLongitude: z.number().optional().default(77.2090),
        installedBy: z.string().optional().default('Track Maintenance Squad'),
        installationDate: z.string().optional().default(new Date().toISOString().split('T')[0]),
        torqueSpecNm: z.number().optional().default(110.0),
        laserMarkDate: z.string().optional(),
        markingMachineId: z.string().optional().default('LM-RDSO-04'),
        qrVerificationStatus: z.string().optional().default('Verified'),
        lastInspectionDate: z.string().optional(),
        nextInspectionDate: z.string().optional(),
        maintenanceStatus: z.string().optional().default('Completed'),
        weight: z.string().optional(),
        description: z.string().optional(),
    }),
});
export const updateFittingSchema = z.object({
    params: z.object({
        fittingId: z.string().min(1, 'Fitting ID is required'),
    }),
    body: z.object({
        fittingType: z.string().optional(),
        status: z.string().optional(),
        railLine: z.string().optional(),
        trackSection: z.string().optional(),
        location: z.string().optional(),
        sleeperNumber: z.string().optional(),
        materialGrade: z.string().optional(),
        standardSpec: z.string().optional(),
        torqueSpecNm: z.number().optional(),
        qrVerificationStatus: z.string().optional(),
        maintenanceStatus: z.string().optional(),
        lastInspectionDate: z.string().optional(),
        nextInspectionDate: z.string().optional(),
        description: z.string().optional(),
    }),
});
export const getFittingByIdSchema = z.object({
    params: z.object({
        fittingId: z.string().min(1, 'Fitting ID is required'),
    }),
});
//# sourceMappingURL=fitting.schema.js.map