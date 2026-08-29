"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditAction = exports.LifecycleEventType = exports.FittingStatus = exports.UserRoles = void 0;
exports.UserRoles = {
    ADMIN: 'ADMIN',
    INSPECTOR: 'INSPECTOR',
    MAINTENANCE: 'MAINTENANCE',
};
exports.FittingStatus = {
    ACTIVE: 'Active',
    MAINTENANCE_REQUIRED: 'Maintenance Required',
    CRITICAL: 'Critical',
    PENDING_INSPECTION: 'Pending Inspection',
    REPLACED: 'Replaced',
    DECOMMISSIONED: 'Decommissioned',
};
exports.LifecycleEventType = {
    MANUFACTURED: 'Manufactured',
    SUPPLIED: 'Supplied',
    INSTALLED: 'Installed',
    INSPECTED: 'Inspected',
    MAINTAINED: 'Maintained',
    REPLACED: 'Replaced',
};
exports.AuditAction = {
    LOGIN: 'LOGIN',
    CREATE_FITTING: 'CREATE_FITTING',
    UPDATE_FITTING: 'UPDATE_FITTING',
    DELETE_FITTING: 'DELETE_FITTING',
    INSPECTION_SUBMITTED: 'INSPECTION_SUBMITTED',
    MAINTENANCE_SUBMITTED: 'MAINTENANCE_SUBMITTED',
    QR_SCANNED: 'QR_SCANNED',
};
//# sourceMappingURL=roles.js.map