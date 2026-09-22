export declare class ZoneService {
    static getAllZones(): Promise<({
        _count: {
            users: number;
            fittings: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        code: string;
        headquarters: string;
        divisions: string[];
        active: boolean;
        updatedAt: Date;
    })[] | {
        id: string;
        code: string;
        name: string;
        headquarters: string;
        divisions: string[];
        active: boolean;
    }[]>;
    static getZoneByCode(code: string): Promise<({
        fittings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            qrCodeValue: string;
            fittingType: string;
            manufacturer: string;
            batchNumber: string;
            manufacturingDate: Date;
            materialGrade: string;
            standardSpec: string;
            status: import(".prisma/client").$Enums.FittingStatus;
            railLine: string;
            trackSection: string;
            sleeperNumber: string;
            railwayZoneId: string | null;
            railwayZoneName: string;
            division: string;
            kmMark: string;
            trackType: string;
            gpsLatitude: import("@prisma/client/runtime/library").Decimal;
            gpsLongitude: import("@prisma/client/runtime/library").Decimal;
            installedBy: string;
            installationDate: Date;
            torqueSpecNm: import("@prisma/client/runtime/library").Decimal;
            laserMarkDate: Date;
            markingMachineId: string;
            qrVerificationStatus: import(".prisma/client").$Enums.QRVerificationStatus;
            lastInspectionDate: Date | null;
            nextInspectionDate: Date | null;
            maintenanceStatus: import(".prisma/client").$Enums.MaintenanceStatus;
            material: string | null;
            weight: string | null;
            description: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        code: string;
        headquarters: string;
        divisions: string[];
        active: boolean;
        updatedAt: Date;
    }) | null>;
    static createZone(data: {
        code: string;
        name: string;
        headquarters: string;
        divisions?: string[];
        active?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        code: string;
        headquarters: string;
        divisions: string[];
        active: boolean;
        updatedAt: Date;
    }>;
}
