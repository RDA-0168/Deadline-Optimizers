import { z } from 'zod';
export declare const createMaintenanceSchema: z.ZodObject<{
    body: z.ZodObject<{
        fittingId: z.ZodString;
        maintenanceType: z.ZodDefault<z.ZodString>;
        technician: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        technicianId: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        description: z.ZodString;
        status: z.ZodDefault<z.ZodString>;
        nextMaintenance: z.ZodOptional<z.ZodString>;
        cost: z.ZodOptional<z.ZodString>;
        partsReplaced: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        maintenanceDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        fittingId: string;
        status: string;
        description: string;
        maintenanceType: string;
        technician: string;
        technicianId: string;
        partsReplaced: string[];
        maintenanceDate?: string | undefined;
        nextMaintenance?: string | undefined;
        cost?: string | undefined;
    }, {
        fittingId: string;
        description: string;
        status?: string | undefined;
        maintenanceDate?: string | undefined;
        maintenanceType?: string | undefined;
        technician?: string | undefined;
        technicianId?: string | undefined;
        nextMaintenance?: string | undefined;
        cost?: string | undefined;
        partsReplaced?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        fittingId: string;
        status: string;
        description: string;
        maintenanceType: string;
        technician: string;
        technicianId: string;
        partsReplaced: string[];
        maintenanceDate?: string | undefined;
        nextMaintenance?: string | undefined;
        cost?: string | undefined;
    };
}, {
    body: {
        fittingId: string;
        description: string;
        status?: string | undefined;
        maintenanceDate?: string | undefined;
        maintenanceType?: string | undefined;
        technician?: string | undefined;
        technicianId?: string | undefined;
        nextMaintenance?: string | undefined;
        cost?: string | undefined;
        partsReplaced?: string[] | undefined;
    };
}>;
