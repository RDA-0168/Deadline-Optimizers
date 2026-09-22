import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
export declare class InspectionController {
    static getAllInspections(req: AuthRequest, res: Response): Promise<void>;
    static getInspections(req: AuthRequest, res: Response): Promise<void>;
    static createInspection(req: AuthRequest, res: Response): Promise<void>;
}
