// =============================================================================
// RailMark AI — Authentication & Role-Based Access Control (RBAC) Middleware
// =============================================================================
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
export function authenticate(req, res, next) {
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
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        req.user = {
            id: decoded.id || decoded.userId || 'USR-001',
            username: decoded.username || 'user',
            email: decoded.email || '',
            role: (decoded.role || 'INSPECTOR').toUpperCase(),
            fullName: decoded.fullName || decoded.name || 'RailMark User',
            badgeNumber: decoded.badgeNumber || 'RM-DEF-001',
            zoneName: decoded.zone || decoded.zoneName || 'Central Railway',
        };
        next();
    }
    catch (err) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired authentication token. Please re-authenticate.',
        });
    }
}
export function optionalAuthenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, ENV.JWT_SECRET);
            req.user = {
                id: decoded.id || decoded.userId || 'USR-001',
                username: decoded.username || 'user',
                email: decoded.email || '',
                role: (decoded.role || 'INSPECTOR').toUpperCase(),
                fullName: decoded.fullName || decoded.name || 'RailMark User',
                badgeNumber: decoded.badgeNumber || 'RM-DEF-001',
                zoneName: decoded.zone || decoded.zoneName || 'Central Railway',
            };
        }
        catch {
            // Ignore token failure in optional mode
        }
    }
    next();
}
/**
 * Enforces Role-Based Access Control (RBAC).
 * Returns 403 Forbidden if the authenticated user's role is not in the allowed list.
 */
export function authorize(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized: User authentication required.',
            });
            return;
        }
        const normalizedRole = req.user.role?.toUpperCase();
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
export function denyLifecycleModification(req, res, next) {
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
//# sourceMappingURL=auth.middleware.js.map