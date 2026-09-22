import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
export declare class FittingController {
    static getAllFittings(req: AuthRequest, res: Response): Promise<void>;
    static getFittingById(req: AuthRequest, res: Response): Promise<void>;
    static createFitting(req: AuthRequest, res: Response): Promise<void>;
    static updateFitting(req: AuthRequest, res: Response): Promise<void>;
    static deleteFitting(req: AuthRequest, res: Response): Promise<void>;
}
