import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        username: string;
        password: string;
    }, {
        username: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        username: string;
        password: string;
    };
}, {
    body: {
        username: string;
        password: string;
    };
}>;
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
        email: z.ZodString;
        password: z.ZodString;
        fullName: z.ZodString;
        role: z.ZodDefault<z.ZodEnum<["ADMIN", "INSPECTOR", "MAINTENANCE", "VIEWER"]>>;
        badgeNumber: z.ZodString;
        zoneId: z.ZodOptional<z.ZodString>;
        zoneName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        role: "ADMIN" | "INSPECTOR" | "MAINTENANCE" | "VIEWER";
        username: string;
        email: string;
        fullName: string;
        badgeNumber: string;
        password: string;
        zoneId?: string | undefined;
        zoneName?: string | undefined;
    }, {
        username: string;
        email: string;
        fullName: string;
        badgeNumber: string;
        password: string;
        role?: "ADMIN" | "INSPECTOR" | "MAINTENANCE" | "VIEWER" | undefined;
        zoneId?: string | undefined;
        zoneName?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        role: "ADMIN" | "INSPECTOR" | "MAINTENANCE" | "VIEWER";
        username: string;
        email: string;
        fullName: string;
        badgeNumber: string;
        password: string;
        zoneId?: string | undefined;
        zoneName?: string | undefined;
    };
}, {
    body: {
        username: string;
        email: string;
        fullName: string;
        badgeNumber: string;
        password: string;
        role?: "ADMIN" | "INSPECTOR" | "MAINTENANCE" | "VIEWER" | undefined;
        zoneId?: string | undefined;
        zoneName?: string | undefined;
    };
}>;
export declare const resolveQrSchema: z.ZodObject<{
    body: z.ZodObject<{
        qrValue: z.ZodString;
        latitude: z.ZodOptional<z.ZodNumber>;
        longitude: z.ZodOptional<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        qrValue: string;
        notes?: string | undefined;
        latitude?: number | undefined;
        longitude?: number | undefined;
    }, {
        qrValue: string;
        notes?: string | undefined;
        latitude?: number | undefined;
        longitude?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        qrValue: string;
        notes?: string | undefined;
        latitude?: number | undefined;
        longitude?: number | undefined;
    };
}, {
    body: {
        qrValue: string;
        notes?: string | undefined;
        latitude?: number | undefined;
        longitude?: number | undefined;
    };
}>;
export declare const searchSchema: z.ZodObject<{
    query: z.ZodObject<{
        q: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        status: z.ZodOptional<z.ZodString>;
        zone: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        offset: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        limit: string;
        offset: string;
        q: string;
        zone?: string | undefined;
        status?: string | undefined;
        type?: string | undefined;
    }, {
        zone?: string | undefined;
        status?: string | undefined;
        type?: string | undefined;
        limit?: string | undefined;
        offset?: string | undefined;
        q?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: string;
        offset: string;
        q: string;
        zone?: string | undefined;
        status?: string | undefined;
        type?: string | undefined;
    };
}, {
    query: {
        zone?: string | undefined;
        status?: string | undefined;
        type?: string | undefined;
        limit?: string | undefined;
        offset?: string | undefined;
        q?: string | undefined;
    };
}>;
