"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMaintenanceSchema = void 0;
const zod_1 = require("zod");
exports.createMaintenanceSchema = zod_1.z.object({
    params: zod_1.z.object({
        fittingId: zod_1.z.string().min(1, 'Fitting ID is required'),
    }),
    body: zod_1.z.object({
        maintenanceDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Maintenance date must be YYYY-MM-DD format'),
        maintenanceType: zod_1.z.string().min(2, 'Maintenance type is required'),
        technician: zod_1.z.string().optional(),
        description: zod_1.z.string().min(2, 'Description is required'),
        status: zod_1.z.enum(['Completed', 'In Progress', 'Scheduled', 'Deferred'], {
            errorMap: () => ({ message: 'Status must be Completed, In Progress, Scheduled, or Deferred' }),
        }),
        nextMaintenance: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Next maintenance date must be YYYY-MM-DD format'),
    }),
});
//# sourceMappingURL=maintenance.schema.js.map