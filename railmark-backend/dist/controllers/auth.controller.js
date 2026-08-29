"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
class AuthController {
    static async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const ipAddress = req.ip || req.socket.remoteAddress;
            const result = await auth_service_js_1.AuthService.login(username, password, ipAddress);
            res.status(200).json({
                success: true,
                message: 'Authentication successful',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async register(req, res, next) {
        try {
            const { username, email, password, role, fullName, badgeNumber } = req.body;
            const creator = req.user ? req.user.username : 'SYSTEM';
            const user = await auth_service_js_1.AuthService.register({
                username,
                email,
                passwordPlain: password,
                role,
                fullName,
                badgeNumber,
            }, creator);
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async me(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }
            const profile = await auth_service_js_1.AuthService.getProfile(req.user.userId);
            res.status(200).json({
                success: true,
                data: profile,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map