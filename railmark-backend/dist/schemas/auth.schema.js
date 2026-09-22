// =============================================================================
// RailMark AI — Auth, QR, Search Schemas
// =============================================================================
import { z } from 'zod';
export const loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, 'Username or Email is required'),
        password: z.string().min(1, 'Password is required'),
    }),
});
export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        fullName: z.string().min(2, 'Full name required'),
        role: z.enum(['ADMIN', 'INSPECTOR', 'MAINTENANCE', 'VIEWER']).default('INSPECTOR'),
        badgeNumber: z.string().min(2, 'Badge number required'),
        zoneId: z.string().optional(),
        zoneName: z.string().optional(),
    }),
});
export const resolveQrSchema = z.object({
    body: z.object({
        qrValue: z.string().min(1, 'QR code value is required'),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        notes: z.string().optional(),
    }),
});
export const searchSchema = z.object({
    query: z.object({
        q: z.string().optional().default(''),
        status: z.string().optional(),
        zone: z.string().optional(),
        type: z.string().optional(),
        limit: z.string().optional().default('50'),
        offset: z.string().optional().default('0'),
    }),
});
//# sourceMappingURL=auth.schema.js.map