import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
export declare class LifecycleController {
    static getLifecycle(req: AuthRequest, res: Response): Promise<void>;
    static appendLifecycle(req: AuthRequest, res: Response): Promise<void>;
    static prohibitMutation(req: Request, res: Response): void;
}
