import { z } from 'zod';
export declare const createZoneSchema: z.ZodObject<{
    body: z.ZodObject<{
        code: z.ZodString;
        name: z.ZodString;
        headquarters: z.ZodString;
        divisions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        code: string;
        headquarters: string;
        divisions: string[];
        active: boolean;
    }, {
        name: string;
        code: string;
        headquarters: string;
        divisions?: string[] | undefined;
        active?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        code: string;
        headquarters: string;
        divisions: string[];
        active: boolean;
    };
}, {
    body: {
        name: string;
        code: string;
        headquarters: string;
        divisions?: string[] | undefined;
        active?: boolean | undefined;
    };
}>;
export declare const createAIAssessmentSchema: z.ZodObject<{
    body: z.ZodObject<{
        fittingId: z.ZodString;
        inspectionId: z.ZodOptional<z.ZodString>;
        confidence: z.ZodDefault<z.ZodNumber>;
        conditionAssessment: z.ZodDefault<z.ZodString>;
        qrQuality: z.ZodDefault<z.ZodNumber>;
        defectDetected: z.ZodDefault<z.ZodBoolean>;
        defectType: z.ZodOptional<z.ZodString>;
        recommendation: z.ZodOptional<z.ZodString>;
        imageUrl: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        fittingId: string;
        confidence: number;
        conditionAssessment: string;
        qrQuality: number;
        defectDetected: boolean;
        metadata?: Record<string, any> | undefined;
        inspectionId?: string | undefined;
        defectType?: string | undefined;
        recommendation?: string | undefined;
        imageUrl?: string | undefined;
    }, {
        fittingId: string;
        metadata?: Record<string, any> | undefined;
        inspectionId?: string | undefined;
        confidence?: number | undefined;
        conditionAssessment?: string | undefined;
        qrQuality?: number | undefined;
        defectDetected?: boolean | undefined;
        defectType?: string | undefined;
        recommendation?: string | undefined;
        imageUrl?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        fittingId: string;
        confidence: number;
        conditionAssessment: string;
        qrQuality: number;
        defectDetected: boolean;
        metadata?: Record<string, any> | undefined;
        inspectionId?: string | undefined;
        defectType?: string | undefined;
        recommendation?: string | undefined;
        imageUrl?: string | undefined;
    };
}, {
    body: {
        fittingId: string;
        metadata?: Record<string, any> | undefined;
        inspectionId?: string | undefined;
        confidence?: number | undefined;
        conditionAssessment?: string | undefined;
        qrQuality?: number | undefined;
        defectDetected?: boolean | undefined;
        defectType?: string | undefined;
        recommendation?: string | undefined;
        imageUrl?: string | undefined;
    };
}>;
export declare const createMediaMetadataSchema: z.ZodObject<{
    body: z.ZodObject<{
        fittingId: z.ZodOptional<z.ZodString>;
        inspectionId: z.ZodOptional<z.ZodString>;
        mediaType: z.ZodDefault<z.ZodEnum<["IMAGE", "VIDEO", "DOCUMENT", "SCAN_BLOB"]>>;
        fileName: z.ZodString;
        url: z.ZodString;
        mimeType: z.ZodDefault<z.ZodString>;
        fileSize: z.ZodOptional<z.ZodNumber>;
        uploadedBy: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        hashSha256: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        mediaType: "IMAGE" | "VIDEO" | "DOCUMENT" | "SCAN_BLOB";
        fileName: string;
        url: string;
        mimeType: string;
        uploadedBy: string;
        fittingId?: string | undefined;
        inspectionId?: string | undefined;
        fileSize?: number | undefined;
        hashSha256?: string | undefined;
    }, {
        fileName: string;
        url: string;
        fittingId?: string | undefined;
        inspectionId?: string | undefined;
        mediaType?: "IMAGE" | "VIDEO" | "DOCUMENT" | "SCAN_BLOB" | undefined;
        mimeType?: string | undefined;
        fileSize?: number | undefined;
        uploadedBy?: string | undefined;
        hashSha256?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        mediaType: "IMAGE" | "VIDEO" | "DOCUMENT" | "SCAN_BLOB";
        fileName: string;
        url: string;
        mimeType: string;
        uploadedBy: string;
        fittingId?: string | undefined;
        inspectionId?: string | undefined;
        fileSize?: number | undefined;
        hashSha256?: string | undefined;
    };
}, {
    body: {
        fileName: string;
        url: string;
        fittingId?: string | undefined;
        inspectionId?: string | undefined;
        mediaType?: "IMAGE" | "VIDEO" | "DOCUMENT" | "SCAN_BLOB" | undefined;
        mimeType?: string | undefined;
        fileSize?: number | undefined;
        uploadedBy?: string | undefined;
        hashSha256?: string | undefined;
    };
}>;
