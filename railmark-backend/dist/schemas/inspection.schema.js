"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInspectionSchema = void 0;
const zod_1 = require("zod");
exports.createInspectionSchema = zod_1.z.object({
    params: zod_1.z.object({
        fittingId: zod_1.z.string().min(1, 'Fitting ID is required'),
    }),
    body: zod_1.z.object({
        inspectionDate: zod_1.z.string().optional(),
        inspector: zod_1.z.string().optional(),
        condition: zod_1.z.enum(['Good', 'Moderate', 'Fair', 'Critical', 'Severe'], {
            errorMap: () => ({ message: 'Condition must be Good, Moderate, Fair, Critical, or Severe' }),
        }),
        qrReadability: zod_1.z.enum(['High', 'Medium', 'Low', 'Unreadable'], {
            errorMap: () => ({ message: 'QR Readability must be High, Medium, Low, or Unreadable' }),
        }),
        corrosion: zod_1.z.enum(['None', 'Light', 'Moderate', 'Severe'], {
            errorMap: () => ({ message: 'Corrosion must be None, Light, Moderate, or Severe' }),
        }),
        surfaceDamage: zod_1.z.enum(['None', 'Minor Scratch', 'Crack Detected', 'Spalling'], {
            errorMap: () => ({ message: 'Surface damage must be None, Minor Scratch, Crack Detected, or Spalling' }),
        }),
        deformation: zod_1.z.enum(['None', 'Slight Bend', 'Severe Distortion'], {
            errorMap: () => ({ message: 'Deformation must be None, Slight Bend, or Severe Distortion' }),
        }),
        wear: zod_1.z.enum(['Minimal', 'Normal', 'Excessive'], {
            errorMap: () => ({ message: 'Wear must be Minimal, Normal, or Excessive' }),
        }),
        notes: zod_1.z.string().default(''),
        aiAssistanceResult: zod_1.z.string().min(1, 'AI assistance result is required'),
        aiConfidence: zod_1.z.number().min(0).max(1, 'AI confidence must be a number between 0 and 1'),
    }),
});
//# sourceMappingURL=inspection.schema.js.map