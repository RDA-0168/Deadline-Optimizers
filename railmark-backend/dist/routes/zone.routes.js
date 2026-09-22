// =============================================================================
// RailMark AI — Zone, AI Assessment, and Media Routes
// =============================================================================
import { Router } from 'express';
import { ZoneController, AIAssessmentController, MediaController } from '../controllers/zone.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createZoneSchema, createAIAssessmentSchema, createMediaMetadataSchema } from '../schemas/zone.schema.js';
import { authenticate, optionalAuthenticate, authorize } from '../middlewares/auth.middleware.js';
import { UserRoles } from '../constants/roles.js';
export const zoneRouter = Router();
zoneRouter.get('/', ZoneController.getAllZones);
zoneRouter.get('/:code', ZoneController.getZoneByCode);
zoneRouter.post('/', authenticate, authorize([UserRoles.ADMIN]), validate(createZoneSchema), ZoneController.createZone);
export const aiRouter = Router();
aiRouter.get('/fitting/:fittingId', optionalAuthenticate, AIAssessmentController.getForFitting);
aiRouter.post('/', optionalAuthenticate, validate(createAIAssessmentSchema), AIAssessmentController.createAssessment);
export const mediaRouter = Router();
mediaRouter.get('/fitting/:fittingId', optionalAuthenticate, MediaController.getForFitting);
mediaRouter.post('/', optionalAuthenticate, validate(createMediaMetadataSchema), MediaController.recordMedia);
//# sourceMappingURL=zone.routes.js.map