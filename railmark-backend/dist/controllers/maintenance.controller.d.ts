import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
export declare class MaintenanceController {
    static getAllMaintenance(req: AuthRequest, res: Response): Promise<void>;
    static getMaintenance(req: AuthRequest, res: Response): Promise<void>;
    static createMaintenance(req: AuthRequest, res: Response): Promise<void>;
}
