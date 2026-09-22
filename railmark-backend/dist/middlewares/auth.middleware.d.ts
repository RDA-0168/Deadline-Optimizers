import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../constants/roles.js';
export interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
        email: string;
        role: UserRole;
        fullName: string;
        badgeNumber: string;
        zoneName?: string;
    };
}
export declare function authenticate(req: AuthRequest, res: Response, next: NextFunction): void;
export declare function optionalAuthenticate(req: AuthRequest, res: Response, next: NextFunction): void;
/**
 * Enforces Role-Based Access Control (RBAC).
 * Returns 403 Forbidden if the authenticated user's role is not in the allowed list.
 */
export declare function authorize(allowedRoles: UserRole[]): (req: AuthRequest, res: Response, next: NextFunction) => void;
/**
 * Enforces strict append-only immutability on lifecycle event records.
 * Blocks any attempt to update or delete lifecycle records.
 */
export declare function denyLifecycleModification(req: Request, res: Response, next: NextFunction): void;
