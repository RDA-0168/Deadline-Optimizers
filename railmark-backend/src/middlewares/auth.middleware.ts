// =============================================================================
// RailMark AI — Authentication & Role-Based Access Control (RBAC) Middleware
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
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

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Authentication token is missing. Please provide a valid Bearer token in the Authorization header.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;
    req.user = {
      id: decoded.id || decoded.userId || 'USR-001',
      username: decoded.username || 'user',
      email: decoded.email || '',
      role: (decoded.role || 'INSPECTOR').toUpperCase() as UserRole,
      fullName: decoded.fullName || decoded.name || 'RailMark User',
      badgeNumber: decoded.badgeNumber || 'RM-DEF-001',
      zoneName: decoded.zone || decoded.zoneName || 'Central Railway',
    };
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication token. Please re-authenticate.',
    });
  }
}

export function optionalAuthenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;
      req.user = {
        id: decoded.id || decoded.userId || 'USR-001',
        username: decoded.username || 'user',
        email: decoded.email || '',
        role: (decoded.role || 'INSPECTOR').toUpperCase() as UserRole,
        fullName: decoded.fullName || decoded.name || 'RailMark User',
        badgeNumber: decoded.badgeNumber || 'RM-DEF-001',
        zoneName: decoded.zone || decoded.zoneName || 'Central Railway',
      };
    } catch {
      // Ignore token failure in optional mode
    }
  }
  next();
}

/**
 * Enforces Role-Based Access Control (RBAC).
 * Returns 403 Forbidden if the authenticated user's role is not in the allowed list.
 */
export function authorize(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: User authentication required.',
      });
      return;
    }

    const normalizedRole = req.user.role?.toUpperCase() as UserRole;
    if (!allowedRoles.includes(normalizedRole)) {
      res.status(403).json({
        success: false,
        error: `Access Denied: Role '${req.user.role}' does not possess required privileges for this operation. Allowed roles: [${allowedRoles.join(', ')}]`,
      });
      return;
    }

    next();
  };
}

/**
 * Enforces strict append-only immutability on lifecycle event records.
 * Blocks any attempt to update or delete lifecycle records.
 */
export function denyLifecycleModification(req: Request, res: Response, next: NextFunction): void {
  const method = req.method.toUpperCase();
  if (['PUT', 'PATCH', 'DELETE'].includes(method)) {
    res.status(405).json({
      success: false,
      error: 'Method Not Allowed: Lifecycle events are strictly append-only and cannot be updated or deleted.',
    });
    return;
  }
  next();
}
