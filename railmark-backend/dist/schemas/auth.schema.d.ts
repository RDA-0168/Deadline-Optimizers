import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        password: string;
        username: string;
    }, {
        password: string;
        username: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        password: string;
        username: string;
    };
}, {
    body: {
        password: string;
        username: string;
    };
}>;
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        role: z.ZodEnum<["ADMIN", "INSPECTOR", "MAINTENANCE"]>;
        fullName: z.ZodString;
        badgeNumber: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        password: string;
        username: string;
        email: string;
        role: "ADMIN" | "INSPECTOR" | "MAINTENANCE";
        fullName: string;
        badgeNumber: string;
    }, {
        password: string;
        username: string;
        email: string;
        role: "ADMIN" | "INSPECTOR" | "MAINTENANCE";
        fullName: string;
        badgeNumber: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        password: string;
        username: string;
        email: string;
        role: "ADMIN" | "INSPECTOR" | "MAINTENANCE";
        fullName: string;
        badgeNumber: string;
    };
}, {
    body: {
        password: string;
        username: string;
        email: string;
        role: "ADMIN" | "INSPECTOR" | "MAINTENANCE";
        fullName: string;
        badgeNumber: string;
    };
}>;
