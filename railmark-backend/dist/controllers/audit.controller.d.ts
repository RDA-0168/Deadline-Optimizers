import { Request, Response, NextFunction } from 'express';
export declare class AuditController {
    static getLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
}
