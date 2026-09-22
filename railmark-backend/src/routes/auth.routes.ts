// =============================================================================
// RailMark AI — Auth, Dashboard, QR, Search, Audit Routes
// =============================================================================

import { Router } from 'express';
import { AuthController, DashboardController, QRController, SearchController, AuditController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema, resolveQrSchema, searchSchema } from '../schemas/auth.schema.js';
import { authenticate, optionalAuthenticate, authorize } from '../middlewares/auth.middleware.js';
import { UserRoles } from '../constants/roles.js';

export const authRouter = Router();
authRouter.post('/login', validate(loginSchema), AuthController.login);
authRouter.post('/register', validate(registerSchema), AuthController.register);
authRouter.get('/me', authenticate, AuthController.me);

export const dashboardRouter = Router();
dashboardRouter.get('/stats', DashboardController.getStats);

export const qrRouter = Router();
qrRouter.post('/resolve', validate(resolveQrSchema), optionalAuthenticate, QRController.resolve);

export const searchRouter = Router();
searchRouter.get('/', validate(searchSchema), optionalAuthenticate, SearchController.search);

export const auditRouter = Router();
auditRouter.get('/', authenticate, authorize([UserRoles.ADMIN]), AuditController.getLogs);
