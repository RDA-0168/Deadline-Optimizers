import { z } from 'zod';
export declare const createMaintenanceSchema: z.ZodObject<{
    params: z.ZodObject<{
        fittingId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        fittingId: string;
    }, {
        fittingId: string;
    }>;
    body: z.ZodObject<{
        maintenanceDate: z.ZodString;
        maintenanceType: z.ZodString;
        technician: z.ZodOptional<z.ZodString>;
        description: z.ZodString;
        status: z.ZodEnum<["Completed", "In Progress", "Scheduled", "Deferred"]>;
        nextMaintenance: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        maintenanceDate: string;
        maintenanceType: string;
        description: string;
        status: "Completed" | "In Progress" | "Scheduled" | "Deferred";
        nextMaintenance: string;
        technician?: string | undefined;
    }, {
        maintenanceDate: string;
        maintenanceType: string;
        description: string;
        status: "Completed" | "In Progress" | "Scheduled" | "Deferred";
        nextMaintenance: string;
        technician?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        maintenanceDate: string;
        maintenanceType: string;
        description: string;
        status: "Completed" | "In Progress" | "Scheduled" | "Deferred";
        nextMaintenance: string;
        technician?: string | undefined;
    };
    params: {
        fittingId: string;
    };
}, {
    body: {
        maintenanceDate: string;
        maintenanceType: string;
        description: string;
        status: "Completed" | "In Progress" | "Scheduled" | "Deferred";
        nextMaintenance: string;
        technician?: string | undefined;
    };
    params: {
        fittingId: string;
    };
}>;
