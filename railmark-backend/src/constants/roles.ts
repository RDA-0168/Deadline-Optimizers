// =============================================================================
// RailMark AI — Role Constants & RBAC Definitions
// =============================================================================

export const UserRoles = {
  ADMIN: 'ADMIN',
  INSPECTOR: 'INSPECTOR',
  MAINTENANCE: 'MAINTENANCE',
  VIEWER: 'VIEWER',
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export const RolePermissions = {
  [UserRoles.ADMIN]: [
    'fittings:create',
    'fittings:read',
    'fittings:update',
    'fittings:delete',
    'inspections:create',
    'inspections:read',
    'maintenance:create',
    'maintenance:read',
    'maintenance:update',
    'users:manage',
    'zones:manage',
    'reports:export',
    'audit:read',
  ],
  [UserRoles.INSPECTOR]: [
    'fittings:create',
    'fittings:read',
    'inspections:create',
    'inspections:read',
    'maintenance:read',
    'reports:export',
  ],
  [UserRoles.MAINTENANCE]: [
    'fittings:read',
    'inspections:read',
    'maintenance:create',
    'maintenance:read',
    'maintenance:update',
  ],
  [UserRoles.VIEWER]: [
    'fittings:read',
    'inspections:read',
    'maintenance:read',
  ],
};
