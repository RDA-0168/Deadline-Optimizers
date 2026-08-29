import { z } from 'zod';
export declare const resolveQRSchema: z.ZodObject<{
    body: z.ZodObject<{
        qrValue: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        qrValue: string;
    }, {
        qrValue: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        qrValue: string;
    };
}, {
    body: {
        qrValue: string;
    };
}>;
export declare const getQRByFittingIdSchema: z.ZodObject<{
    params: z.ZodObject<{
        fittingId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        fittingId: string;
    }, {
        fittingId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        fittingId: string;
    };
}, {
    params: {
        fittingId: string;
    };
}>;
