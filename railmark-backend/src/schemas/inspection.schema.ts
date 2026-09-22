// =============================================================================
// RailMark AI — Inspection Zod Validation Schemas
// =============================================================================

import { z } from 'zod';

export const createInspectionSchema = z.object({
  body: z.object({
    fittingId: z.string().min(1, 'Fitting ID is required'),
    condition: z.string().default('Good'),
    qrReadability: z.string().default('Good'),
    corrosion: z.string().default('None'),
    surfaceDamage: z.string().default('None'),
    deformation: z.string().default('None'),
    wear: z.string().default('Normal'),
    notes: z.string().optional(),
    inspector: z.string().optional().default('Field Inspector'),
    inspectorId: z.string().optional().default('RM-INS-001'),
    inspectionDate: z.string().optional(),
    aiConfidence: z.number().optional().default(95.0),
    aiCondition: z.string().optional(),
    aiAssistanceResult: z.string().optional(),
    aiQrQuality: z.number().optional().default(92.0),
    defectDetected: z.boolean().optional(),
    defectType: z.string().optional(),
    recommendation: z.string().optional(),
    imageUrl: z.string().optional(),
  }),
});
