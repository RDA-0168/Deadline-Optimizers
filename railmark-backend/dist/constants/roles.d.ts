export declare const UserRoles: {
    readonly ADMIN: "ADMIN";
    readonly INSPECTOR: "INSPECTOR";
    readonly MAINTENANCE: "MAINTENANCE";
    readonly VIEWER: "VIEWER";
};
export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];
export declare const RolePermissions: {
    ADMIN: string[];
    INSPECTOR: string[];
    MAINTENANCE: string[];
    VIEWER: string[];
};
