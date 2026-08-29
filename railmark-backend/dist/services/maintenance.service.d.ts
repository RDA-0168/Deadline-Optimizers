import { CreateMaintenanceDto, MaintenanceRecord } from '../types/maintenance.types.js';
import { JwtPayload } from '../types/auth.types.js';
export declare class MaintenanceService {
    static getMaintenanceByFittingId(fittingId: string): Promise<MaintenanceRecord[]>;
    static createMaintenance(fittingId: string, dto: CreateMaintenanceDto, user?: JwtPayload, ipAddress?: string): Promise<MaintenanceRecord>;
}
