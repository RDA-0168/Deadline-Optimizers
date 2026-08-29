import { Request, Response, NextFunction } from 'express';
export declare class FittingController {
    static getAllFittings(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFittingById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createFitting(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateFitting(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteFitting(req: Request, res: Response, next: NextFunction): Promise<void>;
}
