import { z } from 'zod';
export declare const createLifecycleSchema: z.ZodObject<{
    body: z.ZodObject<{
        fittingId: z.ZodString;
        event: z.ZodString;
        eventType: z.ZodOptional<z.ZodString>;
        actor: z.ZodString;
        location: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
        details: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        eventDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        event: string;
        actor: string;
        location: string;
        fittingId: string;
        eventDate?: string | undefined;
        notes?: string | undefined;
        metadata?: Record<string, any> | undefined;
        details?: string | undefined;
        eventType?: string | undefined;
    }, {
        event: string;
        actor: string;
        location: string;
        fittingId: string;
        eventDate?: string | undefined;
        notes?: string | undefined;
        metadata?: Record<string, any> | undefined;
        details?: string | undefined;
        eventType?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        event: string;
        actor: string;
        location: string;
        fittingId: string;
        eventDate?: string | undefined;
        notes?: string | undefined;
        metadata?: Record<string, any> | undefined;
        details?: string | undefined;
        eventType?: string | undefined;
    };
}, {
    body: {
        event: string;
        actor: string;
        location: string;
        fittingId: string;
        eventDate?: string | undefined;
        notes?: string | undefined;
        metadata?: Record<string, any> | undefined;
        details?: string | undefined;
        eventType?: string | undefined;
    };
}>;
