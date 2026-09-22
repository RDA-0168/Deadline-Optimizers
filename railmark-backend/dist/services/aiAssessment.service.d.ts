export declare class AIAssessmentService {
    static getAssessmentsByFittingId(fittingId: string): Promise<{
        id: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        fittingId: string;
        imageUrl: string | null;
        inspectionId: string | null;
        confidence: import("@prisma/client/runtime/library").Decimal;
        conditionAssessment: import(".prisma/client").$Enums.ConditionStatus;
        qrQuality: import("@prisma/client/runtime/library").Decimal;
        defectDetected: boolean;
        defectType: string | null;
        recommendation: string | null;
    }[]>;
    static getAssessmentByInspectionId(inspectionId: string): Promise<{
        id: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        fittingId: string;
        imageUrl: string | null;
        inspectionId: string | null;
        confidence: import("@prisma/client/runtime/library").Decimal;
        conditionAssessment: import(".prisma/client").$Enums.ConditionStatus;
        qrQuality: import("@prisma/client/runtime/library").Decimal;
        defectDetected: boolean;
        defectType: string | null;
        recommendation: string | null;
    } | null>;
    static createAssessment(data: {
        fittingId: string;
        inspectionId?: string;
        confidence?: number;
        conditionAssessment?: any;
        qrQuality?: number;
        defectDetected?: boolean;
        defectType?: string;
        recommendation?: string;
        imageUrl?: string;
        metadata?: any;
    }): Promise<{
        id: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        fittingId: string;
        imageUrl: string | null;
        inspectionId: string | null;
        confidence: import("@prisma/client/runtime/library").Decimal;
        conditionAssessment: import(".prisma/client").$Enums.ConditionStatus;
        qrQuality: import("@prisma/client/runtime/library").Decimal;
        defectDetected: boolean;
        defectType: string | null;
        recommendation: string | null;
    }>;
}
