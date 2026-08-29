import { z } from 'zod';
export declare const searchSchema: z.ZodObject<{
    query: z.ZodObject<{
        q: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        page: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        page: string;
        limit: string;
        q: string;
    }, {
        page?: string | undefined;
        limit?: string | undefined;
        q?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: string;
        limit: string;
        q: string;
    };
}, {
    query: {
        page?: string | undefined;
        limit?: string | undefined;
        q?: string | undefined;
    };
}>;
