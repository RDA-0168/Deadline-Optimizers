import { Request, Response, NextFunction } from 'express';
export declare class AuthController {
    static login(req: Request, res: Response, next: NextFunction): Promise<void>;
    static register(req: Request, res: Response, next: NextFunction): Promise<void>;
    static me(req: Request, res: Response, next: NextFunction): Promise<void>;
}
