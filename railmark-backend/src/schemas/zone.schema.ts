// =============================================================================
// RailMark AI — Railway Zone & AI Assessment & Media Schemas
// =============================================================================

import { z } from 'zod';

export const createZoneSchema = z.object({
  body: z.object({
    code: z.string().min(2, 'Zone code required (e.g. NR, CR)'),
    name: z.string().min(3, 'Zone name required'),
    headquarters: z.string().min(2, 'Headquarters location required'),
    divisions: z.array(z.string()).optional().default([]),
    active: z.boolean().optional().default(true),
  }),
});

export const createAIAssessmentSchema = z.object({
  body: z.object({
    fittingId: z.string().min(1, 'Fitting ID required'),
    inspectionId: z.string().optional(),
    confidence: z.number().min(0).max(100).default(95.0),
    conditionAssessment: z.string().default('Good'),
    qrQuality: z.number().min(0).max(100).default(92.0),
    defectDetected: z.boolean().default(false),
    defectType: z.string().optional(),
    recommendation: z.string().optional(),
    imageUrl: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }),
});

export const createMediaMetadataSchema = z.object({
  body: z.object({
    fittingId: z.string().optional(),
    inspectionId: z.string().optional(),
    mediaType: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'SCAN_BLOB']).default('IMAGE'),
    fileName: z.string().min(1, 'File name required'),
    url: z.string().min(1, 'Media URL required'),
    mimeType: z.string().default('image/jpeg'),
    fileSize: z.number().optional(),
    uploadedBy: z.string().optional().default('Inspector'),
    hashSha256: z.string().optional(),
  }),
});
