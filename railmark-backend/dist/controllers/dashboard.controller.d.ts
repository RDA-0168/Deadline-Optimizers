import { Request, Response, NextFunction } from 'express';
export declare class DashboardController {
    static getStats(req: Request, res: Response, next: NextFunction): Promise<void>;
}
