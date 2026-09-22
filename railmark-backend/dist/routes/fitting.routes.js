// =============================================================================
// RailMark AI — Fitting Routes (RBAC & Append-Only Lifecycle Protected)
// =============================================================================
import { Router } from 'express';
import { FittingController } from '../controllers/fitting.controller.js';
import { InspectionController } from '../controllers/inspection.controller.js';
import { MaintenanceController } from '../controllers/maintenance.controller.js';
import { LifecycleController } from '../controllers/lifecycle.controller.js';
import { AIAssessmentController, MediaController } from '../controllers/zone.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createFittingSchema, updateFittingSchema, getFittingByIdSchema } from '../schemas/fitting.schema.js';
import { createInspectionSchema } from '../schemas/inspection.schema.js';
import { createMaintenanceSchema } from '../schemas/maintenance.schema.js';
import { createLifecycleSchema } from '../schemas/lifecycle.schema.js';
import { authenticate, optionalAuthenticate, authorize, denyLifecycleModification } from '../middlewares/auth.middleware.js';
import { UserRoles } from '../constants/roles.js';
const router = Router();
// --- 1. Fitting Master CRUD ---
// GET /api/fittings - List all fittings
router.get('/', optionalAuthenticate, FittingController.getAllFittings);
// GET /api/fittings/:fittingId - Get composite fitting details
router.get('/:fittingId', validate(getFittingByIdSchema), optionalAuthenticate, FittingController.getFittingById);
// POST /api/fittings - Create fitting (RBAC: ADMIN & INSPECTOR)
router.post('/', authenticate, authorize([UserRoles.ADMIN, UserRoles.INSPECTOR]), validate(createFittingSchema), FittingController.createFitting);
// PUT /api/fittings/:fittingId - Update fitting (RBAC: ADMIN only)
router.put('/:fittingId', authenticate, authorize([UserRoles.ADMIN]), validate(updateFittingSchema), FittingController.updateFitting);
// DELETE /api/fittings/:fittingId - Delete fitting (RBAC: ADMIN only)
router.delete('/:fittingId', authenticate, authorize([UserRoles.ADMIN]), validate(getFittingByIdSchema), FittingController.deleteFitting);
// --- 2. Inspection Sub-Routes ---
router.get('/:fittingId/inspections', validate(getFittingByIdSchema), optionalAuthenticate, InspectionController.getInspections);
router.post('/:fittingId/inspections', optionalAuthenticate, validate(createInspectionSchema), InspectionController.createInspection);
// --- 3. Maintenance Sub-Routes ---
router.get('/:fittingId/maintenance', validate(getFittingByIdSchema), optionalAuthenticate, MaintenanceController.getMaintenance);
router.post('/:fittingId/maintenance', optionalAuthenticate, validate(createMaintenanceSchema), MaintenanceController.createMaintenance);
// --- 4. Append-Only Lifecycle Sub-Routes ---
// GET /api/fittings/:fittingId/lifecycle
router.get('/:fittingId/lifecycle', validate(getFittingByIdSchema), optionalAuthenticate, LifecycleController.getLifecycle);
// POST /api/fittings/:fittingId/lifecycle - Append new immutable event
router.post('/:fittingId/lifecycle', optionalAuthenticate, validate(createLifecycleSchema), LifecycleController.appendLifecycle);
// Block any mutation/deletion of lifecycle records (Strict Immutability)
router.all('/:fittingId/lifecycle', denyLifecycleModification);
// --- 5. AI Vision & Media Sub-Routes ---
router.get('/:fittingId/ai-assessments', validate(getFittingByIdSchema), optionalAuthenticate, AIAssessmentController.getForFitting);
router.get('/:fittingId/media', validate(getFittingByIdSchema), optionalAuthenticate, MediaController.getForFitting);
export default router;
//# sourceMappingURL=fitting.routes.js.map