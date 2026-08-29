import { Request, Response, NextFunction } from 'express';
export declare class InspectionController {
    static getInspections(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createInspection(req: Request, res: Response, next: NextFunction): Promise<void>;
}
