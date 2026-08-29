"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_js_1 = require("../controllers/dashboard.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
// GET /api/dashboard/stats
router.get('/stats', auth_middleware_js_1.optionalAuthenticate, dashboard_controller_js_1.DashboardController.getStats);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map