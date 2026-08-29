import { Request, Response, NextFunction } from 'express';
export declare class MaintenanceController {
    static getMaintenance(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createMaintenance(req: Request, res: Response, next: NextFunction): Promise<void>;
}
