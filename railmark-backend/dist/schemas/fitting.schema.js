"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFittingByIdSchema = exports.updateFittingSchema = exports.createFittingSchema = void 0;
const zod_1 = require("zod");
const roles_js_1 = require("../constants/roles.js");
const statusEnum = zod_1.z.enum([
    roles_js_1.FittingStatus.ACTIVE,
    roles_js_1.FittingStatus.MAINTENANCE_REQUIRED,
    roles_js_1.FittingStatus.CRITICAL,
    roles_js_1.FittingStatus.PENDING_INSPECTION,
    roles_js_1.FittingStatus.REPLACED,
    roles_js_1.FittingStatus.DECOMMISSIONED,
]);
exports.createFittingSchema = zod_1.z.object({
    body: zod_1.z.object({
        fittingId: zod_1.z.string().min(3, 'Fitting ID is required (e.g. RM-FIT-0001)'),
        fittingType: zod_1.z.string().min(2, 'Fitting type is required (e.g. Elastic Rail Clip)'),
        manufacturer: zod_1.z.string().min(2, 'Manufacturer is required'),
        batchNumber: zod_1.z.string().min(2, 'Batch number is required'),
        manufacturingDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Manufacturing date must be YYYY-MM-DD format'),
        materialGrade: zod_1.z.string().min(2, 'Material grade is required'),
        standardSpec: zod_1.z.string().min(2, 'Standard specification is required'),
        status: statusEnum.optional().default(roles_js_1.FittingStatus.ACTIVE),
        railLine: zod_1.z.string().min(2, 'Rail line is required'),
        trackSection: zod_1.z.string().min(2, 'Track section is required'),
        sleeperNumber: zod_1.z.string().min(2, 'Sleeper number is required'),
        gpsLatitude: zod_1.z.number().min(-90).max(90, 'Invalid GPS latitude'),
        gpsLongitude: zod_1.z.number().min(-180).max(180, 'Invalid GPS longitude'),
        installedBy: zod_1.z.string().min(2, 'Installed by is required'),
        installationDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Installation date must be YYYY-MM-DD format'),
        torqueSpecNm: zod_1.z.number().positive('Torque spec must be a positive number'),
        qrCodeValue: zod_1.z.string().optional(),
        markingMachineId: zod_1.z.string().optional(),
    }),
});
exports.updateFittingSchema = zod_1.z.object({
    params: zod_1.z.object({
        fittingId: zod_1.z.string().min(1, 'Fitting ID is required'),
    }),
    body: zod_1.z.object({
        fittingType: zod_1.z.string().min(2).optional(),
        manufacturer: zod_1.z.string().min(2).optional(),
        batchNumber: zod_1.z.string().min(2).optional(),
        materialGrade: zod_1.z.string().min(2).optional(),
        standardSpec: zod_1.z.string().min(2).optional(),
        status: statusEnum.optional(),
        railLine: zod_1.z.string().min(2).optional(),
        trackSection: zod_1.z.string().min(2).optional(),
        sleeperNumber: zod_1.z.string().min(2).optional(),
        gpsLatitude: zod_1.z.number().min(-90).max(90).optional(),
        gpsLongitude: zod_1.z.number().min(-180).max(180).optional(),
        torqueSpecNm: zod_1.z.number().positive().optional(),
        qrVerificationStatus: zod_1.z.enum(['Verified', 'Unverified', 'Degraded']).optional(),
    }),
});
exports.getFittingByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        fittingId: zod_1.z.string().min(1, 'Fitting ID is required'),
    }),
});
//# sourceMappingURL=fitting.schema.js.map