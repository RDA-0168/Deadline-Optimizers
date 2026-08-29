export interface MaintenanceRecord {
    id: string;
    fittingId: string;
    maintenanceDate: string;
    maintenanceType: string;
    technicianId: string;
    technicianName: string;
    description: string;
    status: 'Completed' | 'In Progress' | 'Scheduled' | 'Deferred';
    nextMaintenance: string;
    createdAt: string;
}
export interface CreateMaintenanceDto {
    maintenanceDate: string;
    maintenanceType: string;
    technician?: string;
    description: string;
    status: 'Completed' | 'In Progress' | 'Scheduled' | 'Deferred';
    nextMaintenance: string;
}
