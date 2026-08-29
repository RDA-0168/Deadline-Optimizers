import { z } from 'zod';
export declare const createInspectionSchema: z.ZodObject<{
    params: z.ZodObject<{
        fittingId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        fittingId: string;
    }, {
        fittingId: string;
    }>;
    body: z.ZodObject<{
        inspectionDate: z.ZodOptional<z.ZodString>;
        inspector: z.ZodOptional<z.ZodString>;
        condition: z.ZodEnum<["Good", "Moderate", "Fair", "Critical", "Severe"]>;
        qrReadability: z.ZodEnum<["High", "Medium", "Low", "Unreadable"]>;
        corrosion: z.ZodEnum<["None", "Light", "Moderate", "Severe"]>;
        surfaceDamage: z.ZodEnum<["None", "Minor Scratch", "Crack Detected", "Spalling"]>;
        deformation: z.ZodEnum<["None", "Slight Bend", "Severe Distortion"]>;
        wear: z.ZodEnum<["Minimal", "Normal", "Excessive"]>;
        notes: z.ZodDefault<z.ZodString>;
        aiAssistanceResult: z.ZodString;
        aiConfidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        condition: "Critical" | "Good" | "Moderate" | "Fair" | "Severe";
        qrReadability: "High" | "Medium" | "Low" | "Unreadable";
        corrosion: "Moderate" | "Severe" | "None" | "Light";
        surfaceDamage: "None" | "Minor Scratch" | "Crack Detected" | "Spalling";
        deformation: "None" | "Slight Bend" | "Severe Distortion";
        wear: "Minimal" | "Normal" | "Excessive";
        notes: string;
        aiAssistanceResult: string;
        aiConfidence: number;
        inspector?: string | undefined;
        inspectionDate?: string | undefined;
    }, {
        condition: "Critical" | "Good" | "Moderate" | "Fair" | "Severe";
        qrReadability: "High" | "Medium" | "Low" | "Unreadable";
        corrosion: "Moderate" | "Severe" | "None" | "Light";
        surfaceDamage: "None" | "Minor Scratch" | "Crack Detected" | "Spalling";
        deformation: "None" | "Slight Bend" | "Severe Distortion";
        wear: "Minimal" | "Normal" | "Excessive";
        aiAssistanceResult: string;
        aiConfidence: number;
        notes?: string | undefined;
        inspector?: string | undefined;
        inspectionDate?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        condition: "Critical" | "Good" | "Moderate" | "Fair" | "Severe";
        qrReadability: "High" | "Medium" | "Low" | "Unreadable";
        corrosion: "Moderate" | "Severe" | "None" | "Light";
        surfaceDamage: "None" | "Minor Scratch" | "Crack Detected" | "Spalling";
        deformation: "None" | "Slight Bend" | "Severe Distortion";
        wear: "Minimal" | "Normal" | "Excessive";
        notes: string;
        aiAssistanceResult: string;
        aiConfidence: number;
        inspector?: string | undefined;
        inspectionDate?: string | undefined;
    };
    params: {
        fittingId: string;
    };
}, {
    body: {
        condition: "Critical" | "Good" | "Moderate" | "Fair" | "Severe";
        qrReadability: "High" | "Medium" | "Low" | "Unreadable";
        corrosion: "Moderate" | "Severe" | "None" | "Light";
        surfaceDamage: "None" | "Minor Scratch" | "Crack Detected" | "Spalling";
        deformation: "None" | "Slight Bend" | "Severe Distortion";
        wear: "Minimal" | "Normal" | "Excessive";
        aiAssistanceResult: string;
        aiConfidence: number;
        notes?: string | undefined;
        inspector?: string | undefined;
        inspectionDate?: string | undefined;
    };
    params: {
        fittingId: string;
    };
}>;
