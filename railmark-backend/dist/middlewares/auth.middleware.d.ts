import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../types/auth.types.js';
import { UserRole } from '../constants/roles.js';
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare function authenticate(req: Request, res: Response, next: NextFunction): void;
export declare function optionalAuthenticate(req: Request, res: Response, next: NextFunction): void;
export declare function authorize(allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void;
