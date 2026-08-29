"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_js_1 = require("../db/index.js");
const env_js_1 = require("../config/env.js");
const error_middleware_js_1 = require("../middlewares/error.middleware.js");
const audit_service_js_1 = require("./audit.service.js");
const roles_js_1 = require("../constants/roles.js");
class AuthService {
    static async login(identifier, passwordPlain, ipAddress) {
        const user = await index_js_1.db.findUserByEmailOrUsername(identifier);
        if (!user) {
            throw new error_middleware_js_1.AppError('Invalid username/email or password', 401);
        }
        const isMatch = await bcryptjs_1.default.compare(passwordPlain, user.passwordHash);
        if (!isMatch) {
            throw new error_middleware_js_1.AppError('Invalid username/email or password', 401);
        }
        const payload = {
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            badgeNumber: user.badgeNumber,
        };
        const token = jsonwebtoken_1.default.sign(payload, env_js_1.ENV.JWT_SECRET, {
            expiresIn: env_js_1.ENV.JWT_EXPIRES_IN,
        });
        // Audit log
        await audit_service_js_1.AuditService.logAction({
            user: user.fullName,
            role: user.role,
            action: roles_js_1.AuditAction.LOGIN,
            ipAddress,
            details: `User ${user.username} successfully authenticated (${user.role})`,
        });
        const userProfile = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            badgeNumber: user.badgeNumber,
            createdAt: user.createdAt,
        };
        return {
            token,
            expiresIn: env_js_1.ENV.JWT_EXPIRES_IN,
            user: userProfile,
        };
    }
    static async register(data, creatorName = 'SYSTEM') {
        const existing = await index_js_1.db.findUserByEmailOrUsername(data.username);
        if (existing) {
            throw new error_middleware_js_1.AppError('Username or email already exists', 400);
        }
        const passwordHash = await bcryptjs_1.default.hash(data.passwordPlain, 10);
        const newUser = {
            id: `USR-${Date.now()}`,
            username: data.username,
            email: data.email,
            passwordHash,
            role: data.role,
            fullName: data.fullName,
            badgeNumber: data.badgeNumber,
            createdAt: new Date().toISOString(),
        };
        const saved = await index_js_1.db.createUser(newUser);
        return {
            id: saved.id,
            username: saved.username,
            email: saved.email,
            role: saved.role,
            fullName: saved.fullName,
            badgeNumber: saved.badgeNumber,
            createdAt: saved.createdAt,
        };
    }
    static async getProfile(userId) {
        const user = await index_js_1.db.findUserById(userId);
        if (!user) {
            throw new error_middleware_js_1.AppError('User not found', 404);
        }
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            badgeNumber: user.badgeNumber,
            createdAt: user.createdAt,
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map