import { Request, Response, NextFunction } from 'express';
export declare class QRController {
    static getQRInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
    static resolveQR(req: Request, res: Response, next: NextFunction): Promise<void>;
}
