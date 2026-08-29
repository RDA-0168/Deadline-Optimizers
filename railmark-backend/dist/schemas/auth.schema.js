"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const roles_js_1 = require("../constants/roles.js");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(1, 'Username or email is required'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(3, 'Username must be at least 3 characters'),
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
        role: zod_1.z.enum([roles_js_1.UserRoles.ADMIN, roles_js_1.UserRoles.INSPECTOR, roles_js_1.UserRoles.MAINTENANCE], {
            errorMap: () => ({ message: 'Role must be ADMIN, INSPECTOR, or MAINTENANCE' }),
        }),
        fullName: zod_1.z.string().min(2, 'Full name is required'),
        badgeNumber: zod_1.z.string().min(2, 'Badge number is required'),
    }),
});
//# sourceMappingURL=auth.schema.js.map