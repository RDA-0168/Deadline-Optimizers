import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
export declare class ZoneController {
    static getAllZones(req: Request, res: Response): Promise<void>;
    static getZoneByCode(req: Request, res: Response): Promise<void>;
    static createZone(req: AuthRequest, res: Response): Promise<void>;
}
export declare class AIAssessmentController {
    static getForFitting(req: Request, res: Response): Promise<void>;
    static createAssessment(req: AuthRequest, res: Response): Promise<void>;
}
export declare class MediaController {
    static getForFitting(req: Request, res: Response): Promise<void>;
    static recordMedia(req: AuthRequest, res: Response): Promise<void>;
}
