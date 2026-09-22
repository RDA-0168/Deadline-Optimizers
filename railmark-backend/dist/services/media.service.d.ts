export declare class MediaService {
    static getMediaByFittingId(fittingId: string): Promise<{
        id: string;
        createdAt: Date;
        fittingId: string | null;
        inspectionId: string | null;
        mediaType: import(".prisma/client").$Enums.MediaType;
        fileName: string;
        url: string;
        mimeType: string;
        fileSize: number | null;
        uploadedBy: string;
        hashSha256: string | null;
    }[]>;
    static getMediaByInspectionId(inspectionId: string): Promise<{
        id: string;
        createdAt: Date;
        fittingId: string | null;
        inspectionId: string | null;
        mediaType: import(".prisma/client").$Enums.MediaType;
        fileName: string;
        url: string;
        mimeType: string;
        fileSize: number | null;
        uploadedBy: string;
        hashSha256: string | null;
    }[]>;
    static recordMedia(data: {
        fittingId?: string;
        inspectionId?: string;
        mediaType?: any;
        fileName: string;
        url: string;
        mimeType?: string;
        fileSize?: number;
        uploadedBy?: string;
        hashSha256?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        fittingId: string | null;
        inspectionId: string | null;
        mediaType: import(".prisma/client").$Enums.MediaType;
        fileName: string;
        url: string;
        mimeType: string;
        fileSize: number | null;
        uploadedBy: string;
        hashSha256: string | null;
    }>;
}
