// =============================================================================
// RailMark AI — Master API Router
// =============================================================================

import { Router } from 'express';
import fittingRouter from './fitting.routes.js';
import { authRouter, dashboardRouter, qrRouter, searchRouter, auditRouter } from './auth.routes.js';
import { zoneRouter, aiRouter, mediaRouter } from './zone.routes.js';
import { InspectionController } from '../controllers/inspection.controller.js';
import { MaintenanceController } from '../controllers/maintenance.controller.js';
import { optionalAuthenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createInspectionSchema } from '../schemas/inspection.schema.js';
import { createMaintenanceSchema } from '../schemas/maintenance.schema.js';
import { EdithController } from '../controllers/edith.controller.js';
import { SeedService } from '../services/seed.service.js';

const apiRouter = Router();

// API Health Check & Info
apiRouter.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'RailMark AI PostgreSQL-backed REST API Gateway is active',
    version: '2.0.0',
    deployment: 'Render Production Ready',
    disclaimer: 'Smart India Hackathon Prototype - Digital Traceability for Railway Track Fittings',
    endpoints: {
      auth: '/api/auth',
      fittings: '/api/fittings',
      inspections: '/api/inspections',
      maintenance: '/api/maintenance',
      zones: '/api/zones',
      aiAssessments: '/api/ai-assessments',
      media: '/api/media',
      qr: '/api/qr',
      dashboard: '/api/dashboard/stats',
      search: '/api/search?q=',
      auditLogs: '/api/audit-logs',
    },
  });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/fittings', fittingRouter);
apiRouter.use('/zones', zoneRouter);
apiRouter.use('/ai-assessments', aiRouter);
apiRouter.use('/media', mediaRouter);

apiRouter.get('/inspections', optionalAuthenticate, InspectionController.getAllInspections);
apiRouter.post('/inspections', optionalAuthenticate, validate(createInspectionSchema), InspectionController.createInspection);

apiRouter.get('/maintenance', optionalAuthenticate, MaintenanceController.getAllMaintenance);
apiRouter.post('/maintenance', optionalAuthenticate, validate(createMaintenanceSchema), MaintenanceController.createMaintenance);

apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/qr', qrRouter);
apiRouter.use('/search', searchRouter);
apiRouter.use('/audit-logs', auditRouter);

// Master Database Seed / Sync Endpoint
apiRouter.post('/seed', async (req, res) => {
  try {
    const force = req.query.force === 'true' || req.body?.force === true;
    const result = await SeedService.seedDatabase(force);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/seed', async (req, res) => {
  try {
    const result = await SeedService.seedDatabase(true);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// E.D.I.T.H AI Conversational Endpoints
apiRouter.post('/edith/chat', optionalAuthenticate, EdithController.chat);
apiRouter.post('/ai/chat', optionalAuthenticate, EdithController.chat);

export default apiRouter;
