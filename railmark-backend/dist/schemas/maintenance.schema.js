"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMaintenanceSchema = void 0;
const zod_1 = require("zod");
exports.createMaintenanceSchema = zod_1.z.object({
    params: zod_1.z.object({
        fittingId: zod_1.z.string().optional(),
    }).optional(),
    body: zod_1.z.object({
        fittingId: zod_1.z.string().optional(),
        maintenanceDate: zod_1.z.string().optional(),
        maintenanceType: zod_1.z.string().min(1, 'Maintenance type is required'),
        technician: zod_1.z.string().optional(),
        technicianId: zod_1.z.string().optional(),
        description: zod_1.z.string().min(1, 'Description is required'),
        status: zod_1.z.string().default('Completed'),
        nextMaintenance: zod_1.z.string().optional(),
        cost: zod_1.z.string().optional(),
        partsReplaced: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
//# sourceMappingURL=maintenance.schema.js.map