import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
export declare class AuthController {
    static login(req: Request, res: Response): Promise<void>;
    static register(req: Request, res: Response): Promise<void>;
    static me(req: AuthRequest, res: Response): Promise<void>;
}
export declare class DashboardController {
    static getStats(req: Request, res: Response): Promise<void>;
}
export declare class QRController {
    static resolve(req: AuthRequest, res: Response): Promise<void>;
}
export declare class SearchController {
    static search(req: Request, res: Response): Promise<void>;
}
export declare class AuditController {
    static getLogs(req: AuthRequest, res: Response): Promise<void>;
}
