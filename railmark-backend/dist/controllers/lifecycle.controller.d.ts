import { Request, Response, NextFunction } from 'express';
export declare class LifecycleController {
    static getLifecycle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
