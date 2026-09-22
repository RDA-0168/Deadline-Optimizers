export declare class MaintenanceService {
    static getAllMaintenance(limit?: number): Promise<{
        id: any;
        fittingId: any;
        maintenanceDate: string;
        maintenanceType: any;
        technician: any;
        technicianName: any;
        technicianId: any;
        description: any;
        status: any;
        nextMaintenance: string;
        cost: any;
        partsReplaced: any;
        createdAt: any;
    }[]>;
    static getMaintenanceByFittingId(fittingId: string): Promise<{
        id: any;
        fittingId: any;
        maintenanceDate: string;
        maintenanceType: any;
        technician: any;
        technicianName: any;
        technicianId: any;
        description: any;
        status: any;
        nextMaintenance: string;
        cost: any;
        partsReplaced: any;
        createdAt: any;
    }[]>;
    static createMaintenance(data: any, technicianName?: string): Promise<{
        id: any;
        fittingId: any;
        maintenanceDate: string;
        maintenanceType: any;
        technician: any;
        technicianName: any;
        technicianId: any;
        description: any;
        status: any;
        nextMaintenance: string;
        cost: any;
        partsReplaced: any;
        createdAt: any;
    }>;
    private static formatMaintenanceResponse;
}
