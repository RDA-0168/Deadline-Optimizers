// =============================================================================
// RailMark AI — Maintenance Zod Validation Schemas
// =============================================================================
import { z } from 'zod';
export const createMaintenanceSchema = z.object({
    body: z.object({
        fittingId: z.string().min(1, 'Fitting ID is required'),
        maintenanceType: z.string().default('Preventive'),
        technician: z.string().optional().default('Track Maintenance Lead'),
        technicianId: z.string().optional().default('RM-MNT-9932'),
        description: z.string().min(3, 'Maintenance description is required'),
        status: z.string().default('Scheduled'),
        nextMaintenance: z.string().optional(),
        cost: z.string().optional(),
        partsReplaced: z.array(z.string()).optional().default([]),
        maintenanceDate: z.string().optional(),
    }),
});
//# sourceMappingURL=maintenance.schema.js.map