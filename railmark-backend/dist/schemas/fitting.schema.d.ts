import { z } from 'zod';
export declare const createFittingSchema: z.ZodObject<{
    body: z.ZodObject<{
        fittingId: z.ZodString;
        fittingType: z.ZodString;
        manufacturer: z.ZodString;
        batchNumber: z.ZodString;
        manufacturingDate: z.ZodString;
        materialGrade: z.ZodString;
        standardSpec: z.ZodString;
        status: z.ZodDefault<z.ZodOptional<z.ZodEnum<["Active", "Maintenance Required", "Critical", "Pending Inspection", "Replaced", "Decommissioned"]>>>;
        railLine: z.ZodString;
        trackSection: z.ZodString;
        sleeperNumber: z.ZodString;
        gpsLatitude: z.ZodNumber;
        gpsLongitude: z.ZodNumber;
        installedBy: z.ZodString;
        installationDate: z.ZodString;
        torqueSpecNm: z.ZodNumber;
        qrCodeValue: z.ZodOptional<z.ZodString>;
        markingMachineId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        fittingId: string;
        fittingType: string;
        manufacturer: string;
        batchNumber: string;
        manufacturingDate: string;
        materialGrade: string;
        standardSpec: string;
        railLine: string;
        trackSection: string;
        sleeperNumber: string;
        gpsLatitude: number;
        gpsLongitude: number;
        installedBy: string;
        installationDate: string;
        torqueSpecNm: number;
        status: "Active" | "Maintenance Required" | "Critical" | "Pending Inspection" | "Replaced" | "Decommissioned";
        qrCodeValue?: string | undefined;
        markingMachineId?: string | undefined;
    }, {
        fittingId: string;
        fittingType: string;
        manufacturer: string;
        batchNumber: string;
        manufacturingDate: string;
        materialGrade: string;
        standardSpec: string;
        railLine: string;
        trackSection: string;
        sleeperNumber: string;
        gpsLatitude: number;
        gpsLongitude: number;
        installedBy: string;
        installationDate: string;
        torqueSpecNm: number;
        status?: "Active" | "Maintenance Required" | "Critical" | "Pending Inspection" | "Replaced" | "Decommissioned" | undefined;
        qrCodeValue?: string | undefined;
        markingMachineId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        fittingId: string;
        fittingType: string;
        manufacturer: string;
        batchNumber: string;
        manufacturingDate: string;
        materialGrade: string;
        standardSpec: string;
        railLine: string;
        trackSection: string;
        sleeperNumber: string;
        gpsLatitude: number;
        gpsLongitude: number;
        installedBy: string;
        installationDate: string;
        torqueSpecNm: number;
        status: "Active" | "Maintenance Required" | "Critical" | "Pending Inspection" | "Replaced" | "Decommissioned";
        qrCodeValue?: string | undefined;
        markingMachineId?: string | undefined;
    };
}, {
    body: {
        fittingId: string;
        fittingType: string;
        manufacturer: string;
        batchNumber: string;
        manufacturingDate: string;
        materialGrade: string;
        standardSpec: string;
        railLine: string;
        trackSection: string;
        sleeperNumber: string;
        gpsLatitude: number;
        gpsLongitude: number;
        installedBy: string;
        installationDate: string;
        torqueSpecNm: number;
        status?: "Active" | "Maintenance Required" | "Critical" | "Pending Inspection" | "Replaced" | "Decommissioned" | undefined;
        qrCodeValue?: string | undefined;
        markingMachineId?: string | undefined;
    };
}>;
export declare const updateFittingSchema: z.ZodObject<{
    params: z.ZodObject<{
        fittingId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        fittingId: string;
    }, {
        fittingId: string;
    }>;
    body: z.ZodObject<{
        fittingType: z.ZodOptional<z.ZodString>;
        manufacturer: z.ZodOptional<z.ZodString>;
        batchNumber: z.ZodOptional<z.ZodString>;
        materialGrade: z.ZodOptional<z.ZodString>;
        standardSpec: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["Active", "Maintenance Required", "Critical", "Pending Inspection", "Replaced", "Decommissioned"]>>;
        railLine: z.ZodOptional<z.ZodString>;
        trackSection: z.ZodOptional<z.ZodString>;
        sleeperNumber: z.ZodOptional<z.ZodString>;
        gpsLatitude: z.ZodOptional<z.ZodNumber>;
        gpsLongitude: z.ZodOptional<z.ZodNumber>;
        torqueSpecNm: z.ZodOptional<z.ZodNumber>;
        qrVerificationStatus: z.ZodOptional<z.ZodEnum<["Verified", "Unverified", "Degraded"]>>;
    }, "strip", z.ZodTypeAny, {
        fittingType?: string | undefined;
        manufacturer?: string | undefined;
        batchNumber?: string | undefined;
        materialGrade?: string | undefined;
        standardSpec?: string | undefined;
        railLine?: string | undefined;
        trackSection?: string | undefined;
        sleeperNumber?: string | undefined;
        gpsLatitude?: number | undefined;
        gpsLongitude?: number | undefined;
        torqueSpecNm?: number | undefined;
        status?: "Active" | "Maintenance Required" | "Critical" | "Pending Inspection" | "Replaced" | "Decommissioned" | undefined;
        qrVerificationStatus?: "Verified" | "Unverified" | "Degraded" | undefined;
    }, {
        fittingType?: string | undefined;
        manufacturer?: string | undefined;
        batchNumber?: string | undefined;
        materialGrade?: string | undefined;
        standardSpec?: string | undefined;
        railLine?: string | undefined;
        trackSection?: string | undefined;
        sleeperNumber?: string | undefined;
        gpsLatitude?: number | undefined;
        gpsLongitude?: number | undefined;
        torqueSpecNm?: number | undefined;
        status?: "Active" | "Maintenance Required" | "Critical" | "Pending Inspection" | "Replaced" | "Decommissioned" | undefined;
        qrVerificationStatus?: "Verified" | "Unverified" | "Degraded" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        fittingType?: string | undefined;
        manufacturer?: string | undefined;
        batchNumber?: string | undefined;
        materialGrade?: string | undefined;
        standardSpec?: string | undefined;
        railLine?: string | undefined;
        trackSection?: string | undefined;
        sleeperNumber?: string | undefined;
        gpsLatitude?: number | undefined;
        gpsLongitude?: number | undefined;
        torqueSpecNm?: number | undefined;
        status?: "Active" | "Maintenance Required" | "Critical" | "Pending Inspection" | "Replaced" | "Decommissioned" | undefined;
        qrVerificationStatus?: "Verified" | "Unverified" | "Degraded" | undefined;
    };
    params: {
        fittingId: string;
    };
}, {
    body: {
        fittingType?: string | undefined;
        manufacturer?: string | undefined;
        batchNumber?: string | undefined;
        materialGrade?: string | undefined;
        standardSpec?: string | undefined;
        railLine?: string | undefined;
        trackSection?: string | undefined;
        sleeperNumber?: string | undefined;
        gpsLatitude?: number | undefined;
        gpsLongitude?: number | undefined;
        torqueSpecNm?: number | undefined;
        status?: "Active" | "Maintenance Required" | "Critical" | "Pending Inspection" | "Replaced" | "Decommissioned" | undefined;
        qrVerificationStatus?: "Verified" | "Unverified" | "Degraded" | undefined;
    };
    params: {
        fittingId: string;
    };
}>;
export declare const getFittingByIdSchema: z.ZodObject<{
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
