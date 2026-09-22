// =============================================================================
// RailMark AI — Lifecycle Zod Validation Schemas (Strictly Append-Only)
// =============================================================================

import { z } from 'zod';

export const createLifecycleSchema = z.object({
  body: z.object({
    fittingId: z.string().min(1, 'Fitting ID is required'),
    event: z.string().min(2, 'Lifecycle event type is required'),
    eventType: z.string().optional(),
    actor: z.string().min(2, 'Actor is required'),
    location: z.string().min(2, 'Location is required'),
    notes: z.string().optional(),
    details: z.string().optional(),
    metadata: z.record(z.any()).optional(),
    eventDate: z.string().optional(),
  }),
});
