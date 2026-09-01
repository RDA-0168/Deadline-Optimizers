"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_js_1 = __importDefault(require("./auth.routes.js"));
const fitting_routes_js_1 = __importDefault(require("./fitting.routes.js"));
const qr_routes_js_1 = __importDefault(require("./qr.routes.js"));
const search_routes_js_1 = __importDefault(require("./search.routes.js"));
const dashboard_routes_js_1 = __importDefault(require("./dashboard.routes.js"));
const audit_routes_js_1 = __importDefault(require("./audit.routes.js"));
const maintenance_controller_js_1 = require("../controllers/maintenance.controller.js");
const inspection_controller_js_1 = require("../controllers/inspection.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const apiRouter = (0, express_1.Router)();
// Root API Health & Meta
apiRouter.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'RailMark AI API Gateway is active',
        version: '1.0.0',
        disclaimer: 'DEMO / PROTOTYPE DATA - NOT OFFICIAL INDIAN RAILWAYS DATA',
        docs: '/api-docs',
        endpoints: {
            auth: '/api/auth',
            fittings: '/api/fittings',
            inspections: '/api/inspections',
            maintenance: '/api/maintenance',
            qr: '/api/qr',
            search: '/api/search?q=',
            dashboard: '/api/dashboard/stats',
            auditLogs: '/api/audit-logs',
        },
    });
});
apiRouter.use('/auth', auth_routes_js_1.default);
apiRouter.use('/fittings', fitting_routes_js_1.default);
apiRouter.get('/maintenance', maintenance_controller_js_1.MaintenanceController.getAllMaintenance);
apiRouter.post('/maintenance', auth_middleware_js_1.optionalAuthenticate, maintenance_controller_js_1.MaintenanceController.createMaintenance);
apiRouter.get('/inspections', inspection_controller_js_1.InspectionController.getAllInspections);
apiRouter.post('/inspections', auth_middleware_js_1.optionalAuthenticate, inspection_controller_js_1.InspectionController.createInspection);
apiRouter.use('/qr', qr_routes_js_1.default);
apiRouter.use('/search', search_routes_js_1.default);
apiRouter.use('/dashboard', dashboard_routes_js_1.default);
apiRouter.use('/audit-logs', audit_routes_js_1.default);
exports.default = apiRouter;
//# sourceMappingURL=index.js.map