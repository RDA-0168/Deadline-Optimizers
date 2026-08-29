"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const validate_middleware_js_1 = require("../middlewares/validate.middleware.js");
const auth_schema_js_1 = require("../schemas/auth.schema.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const roles_js_1 = require("../constants/roles.js");
const router = (0, express_1.Router)();
// POST /api/auth/login
router.post('/login', (0, validate_middleware_js_1.validate)(auth_schema_js_1.loginSchema), auth_controller_js_1.AuthController.login);
// POST /api/auth/register (Protected: Admin only)
router.post('/register', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)([roles_js_1.UserRoles.ADMIN]), (0, validate_middleware_js_1.validate)(auth_schema_js_1.registerSchema), auth_controller_js_1.AuthController.register);
// GET /api/auth/me
router.get('/me', auth_middleware_js_1.authenticate, auth_controller_js_1.AuthController.me);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map