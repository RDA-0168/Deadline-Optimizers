export declare const UserRoles: {
    readonly ADMIN: "ADMIN";
    readonly INSPECTOR: "INSPECTOR";
    readonly MAINTENANCE: "MAINTENANCE";
};
export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];
export declare const FittingStatus: {
    readonly ACTIVE: "Active";
    readonly MAINTENANCE_REQUIRED: "Maintenance Required";
    readonly CRITICAL: "Critical";
    readonly PENDING_INSPECTION: "Pending Inspection";
    readonly REPLACED: "Replaced";
    readonly DECOMMISSIONED: "Decommissioned";
};
export type FittingStatusType = (typeof FittingStatus)[keyof typeof FittingStatus];
export declare const LifecycleEventType: {
    readonly MANUFACTURED: "Manufactured";
    readonly SUPPLIED: "Supplied";
    readonly INSTALLED: "Installed";
    readonly INSPECTED: "Inspected";
    readonly MAINTAINED: "Maintained";
    readonly REPLACED: "Replaced";
};
export type LifecycleEventTypeValue = (typeof LifecycleEventType)[keyof typeof LifecycleEventType];
export declare const AuditAction: {
    readonly LOGIN: "LOGIN";
    readonly CREATE_FITTING: "CREATE_FITTING";
    readonly UPDATE_FITTING: "UPDATE_FITTING";
    readonly DELETE_FITTING: "DELETE_FITTING";
    readonly INSPECTION_SUBMITTED: "INSPECTION_SUBMITTED";
    readonly MAINTENANCE_SUBMITTED: "MAINTENANCE_SUBMITTED";
    readonly QR_SCANNED: "QR_SCANNED";
};
export type AuditActionType = (typeof AuditAction)[keyof typeof AuditAction];
