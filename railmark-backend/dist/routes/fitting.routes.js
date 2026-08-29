"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fitting_controller_js_1 = require("../controllers/fitting.controller.js");
const inspection_controller_js_1 = require("../controllers/inspection.controller.js");
const maintenance_controller_js_1 = require("../controllers/maintenance.controller.js");
const lifecycle_controller_js_1 = require("../controllers/lifecycle.controller.js");
const validate_middleware_js_1 = require("../middlewares/validate.middleware.js");
const fitting_schema_js_1 = require("../schemas/fitting.schema.js");
const inspection_schema_js_1 = require("../schemas/inspection.schema.js");
const maintenance_schema_js_1 = require("../schemas/maintenance.schema.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const roles_js_1 = require("../constants/roles.js");
const router = (0, express_1.Router)();
// GET /api/fittings - List all fitting records
router.get('/', auth_middleware_js_1.optionalAuthenticate, fitting_controller_js_1.FittingController.getAllFittings);
// GET /api/fittings/:fittingId - Full composite record
router.get('/:fittingId', (0, validate_middleware_js_1.validate)(fitting_schema_js_1.getFittingByIdSchema), auth_middleware_js_1.optionalAuthenticate, fitting_controller_js_1.FittingController.getFittingById);
// POST /api/fittings - Create fitting record (Protected: ADMIN, INSPECTOR)
router.post('/', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)([roles_js_1.UserRoles.ADMIN, roles_js_1.UserRoles.INSPECTOR]), (0, validate_middleware_js_1.validate)(fitting_schema_js_1.createFittingSchema), fitting_controller_js_1.FittingController.createFitting);
// PUT /api/fittings/:fittingId - Update fitting (Protected: ADMIN)
router.put('/:fittingId', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)([roles_js_1.UserRoles.ADMIN]), (0, validate_middleware_js_1.validate)(fitting_schema_js_1.updateFittingSchema), fitting_controller_js_1.FittingController.updateFitting);
// DELETE /api/fittings/:fittingId - Delete fitting (Protected: ADMIN)
router.delete('/:fittingId', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)([roles_js_1.UserRoles.ADMIN]), (0, validate_middleware_js_1.validate)(fitting_schema_js_1.getFittingByIdSchema), fitting_controller_js_1.FittingController.deleteFitting);
// --- Inspection Sub-routes ---
// GET /api/fittings/:fittingId/inspections
router.get('/:fittingId/inspections', (0, validate_middleware_js_1.validate)(fitting_schema_js_1.getFittingByIdSchema), auth_middleware_js_1.optionalAuthenticate, inspection_controller_js_1.InspectionController.getInspections);
// POST /api/fittings/:fittingId/inspections (Protected: INSPECTOR, ADMIN)
router.post('/:fittingId/inspections', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)([roles_js_1.UserRoles.INSPECTOR, roles_js_1.UserRoles.ADMIN]), (0, validate_middleware_js_1.validate)(inspection_schema_js_1.createInspectionSchema), inspection_controller_js_1.InspectionController.createInspection);
// --- Maintenance Sub-routes ---
// GET /api/fittings/:fittingId/maintenance
router.get('/:fittingId/maintenance', (0, validate_middleware_js_1.validate)(fitting_schema_js_1.getFittingByIdSchema), auth_middleware_js_1.optionalAuthenticate, maintenance_controller_js_1.MaintenanceController.getMaintenance);
// POST /api/fittings/:fittingId/maintenance (Protected: MAINTENANCE, ADMIN)
router.post('/:fittingId/maintenance', auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)([roles_js_1.UserRoles.MAINTENANCE, roles_js_1.UserRoles.ADMIN]), (0, validate_middleware_js_1.validate)(maintenance_schema_js_1.createMaintenanceSchema), maintenance_controller_js_1.MaintenanceController.createMaintenance);
// --- Lifecycle Sub-routes ---
// GET /api/fittings/:fittingId/lifecycle
router.get('/:fittingId/lifecycle', (0, validate_middleware_js_1.validate)(fitting_schema_js_1.getFittingByIdSchema), auth_middleware_js_1.optionalAuthenticate, lifecycle_controller_js_1.LifecycleController.getLifecycle);
exports.default = router;
//# sourceMappingURL=fitting.routes.js.map