export declare class DashboardService {
    static getStats(): Promise<{
        totalFittings: number;
        activeFittings: number;
        inspected: number;
        maintenanceDue: number;
        pendingInspection: number;
        recentScans: number;
        qrVerificationRate: number;
        conditionBreakdown: {
            good: number;
            fair: number;
            critical: number;
        };
        fittingsByType: {
            name: string;
            value: number;
        }[];
        fittingsByZone: {
            zone: string;
            count: number;
        }[];
    }>;
}
export declare class QRService {
    static resolve(qrValue: string, locationMeta?: {
        latitude?: number;
        longitude?: number;
        notes?: string;
    }): Promise<{
        fittingId: any;
        resolvedFrom: string;
        status: string;
        compositeProfile: {
            basicInfo: {
                fittingId: any;
                id: any;
                qrCodeValue: any;
                qrId: any;
                fittingType: any;
                manufacturer: any;
                batchNumber: any;
                manufacturingDate: string;
                materialGrade: any;
                standardSpec: any;
                status: any;
                railLine: any;
                trackSection: any;
                location: any;
                sleeperNumber: any;
                railwayZone: any;
                railwayZoneName: any;
                division: any;
                kmMark: any;
                trackType: any;
                gpsLatitude: number;
                gpsLongitude: number;
                installedBy: any;
                installationDate: string;
                torqueSpecNm: number;
                laserMarkDate: any;
                markingMachineId: any;
                qrVerificationStatus: any;
                lastInspectionDate: string;
                nextInspectionDate: string;
                maintenanceStatus: any;
                material: any;
                weight: any;
                description: any;
                createdAt: any;
                updatedAt: any;
            };
            installationInfo: {
                railLine: any;
                trackSection: any;
                sleeperNumber: any;
                installedBy: any;
                installationDate: string;
                torqueSpecNm: number;
                gpsLatitude: number;
                gpsLongitude: number;
            };
            qrInfo: {
                qrCodeValue: any;
                laserMarkDate: any;
                markingMachineId: any;
                qrVerificationStatus: any;
            };
            inspections: any;
            maintenance: any;
            lifecycle: any;
            aiAssessments: any;
            media: any;
        } | {
            basicInfo: {
                fittingId: string;
                id: string;
                qrCodeValue: string;
                qrId: string;
                fittingType: string;
                manufacturer: string;
                batchNumber: string;
                manufacturingDate: string;
                installationDate: string;
                location: string;
                railLine: string;
                trackSection: string;
                sleeperNumber: string;
                railwayZone: string;
                railwayZoneName: string;
                division: string;
                section: string;
                kmMark: string;
                trackType: string;
                status: string;
                lastInspection: string;
                lastInspectionDate: string;
                nextInspection: string;
                nextInspectionDate: string;
                maintenanceStatus: string;
                description: string;
                material: string;
                materialGrade: string;
                weight: string;
                standardSpec: string;
                gpsLatitude: number;
                gpsLongitude: number;
                torqueSpecNm: number;
                qrVerificationStatus: string;
            };
            installationInfo: {
                railLine: string;
                trackSection: string;
                sleeperNumber: string;
                installedBy: string;
                installationDate: string;
                torqueSpecNm: number;
                gpsLatitude: number;
                gpsLongitude: number;
            };
            qrInfo: {
                qrCodeValue: string;
                laserMarkDate: string;
                markingMachineId: string;
                qrVerificationStatus: string;
            };
            inspections: never[];
            maintenance: never[];
            lifecycle: never[];
            aiAssessments: never[];
            media: never[];
        };
        locationMeta: {
            latitude?: number;
            longitude?: number;
            notes?: string;
        } | undefined;
    }>;
}
export declare class SearchService {
    static search(query: string, options?: {
        status?: string;
        zone?: string;
        type?: string;
    }): Promise<{
        fittingId: string;
        id: string;
        qrCodeValue: string;
        qrId: string;
        fittingType: string;
        manufacturer: string;
        batchNumber: string;
        manufacturingDate: string;
        installationDate: string;
        location: string;
        railLine: string;
        trackSection: string;
        sleeperNumber: string;
        railwayZone: string;
        railwayZoneName: string;
        division: string;
        section: string;
        kmMark: string;
        trackType: string;
        status: string;
        lastInspection: string;
        lastInspectionDate: string;
        nextInspection: string;
        nextInspectionDate: string;
        maintenanceStatus: string;
        description: string;
        material: string;
        materialGrade: string;
        weight: string;
        standardSpec: string;
        gpsLatitude: number;
        gpsLongitude: number;
        torqueSpecNm: number;
        qrVerificationStatus: string;
    }[] | {
        fittingId: any;
        id: any;
        qrCodeValue: any;
        qrId: any;
        fittingType: any;
        manufacturer: any;
        batchNumber: any;
        manufacturingDate: string;
        materialGrade: any;
        standardSpec: any;
        status: any;
        railLine: any;
        trackSection: any;
        location: any;
        sleeperNumber: any;
        railwayZone: any;
        railwayZoneName: any;
        division: any;
        kmMark: any;
        trackType: any;
        gpsLatitude: number;
        gpsLongitude: number;
        installedBy: any;
        installationDate: string;
        torqueSpecNm: number;
        laserMarkDate: any;
        markingMachineId: any;
        qrVerificationStatus: any;
        lastInspectionDate: string;
        nextInspectionDate: string;
        maintenanceStatus: any;
        material: any;
        weight: any;
        description: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
}
export declare class AuditService {
    static logAction(data: {
        action: string;
        username: string;
        fittingId?: string;
        details?: string;
        ipAddress?: string;
    }): Promise<{
        id: string;
        fittingId: string | null;
        username: string;
        action: string;
        details: string | null;
        ipAddress: string | null;
        timestamp: Date;
    } | null>;
    static getLogs(limit?: number): Promise<{
        id: string;
        fittingId: string | null;
        username: string;
        action: string;
        details: string | null;
        ipAddress: string | null;
        timestamp: Date;
    }[]>;
}
