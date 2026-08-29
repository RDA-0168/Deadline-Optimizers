"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_controller_js_1 = require("../controllers/audit.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const roles_js_1 = require("../constants/roles.js");
const router = (0, express_1.Router)();
// GET /api/audit-logs (Protected: ADMIN, INSPECTOR)
router.get('/', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)([roles_js_1.UserRoles.ADMIN, roles_js_1.UserRoles.INSPECTOR]), audit_controller_js_1.AuditController.getLogs);
exports.default = router;
//# sourceMappingURL=audit.routes.js.map