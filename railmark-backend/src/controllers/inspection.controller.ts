// =============================================================================
// RailMark AI — Inspection Controller
// =============================================================================

import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { InspectionService } from '../services/inspection.service.js';
import { AuditService } from '../services/dashboard.service.js';

export class InspectionController {
  static async getAllInspections(req: AuthRequest, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string || '100', 10);
      const inspections = await InspectionService.getAllInspections(limit);
      res.status(200).json({
        success: true,
        data: inspections,
        count: inspections.length,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getInspections(req: AuthRequest, res: Response): Promise<void> {
    try {
      const fittingId = String(req.params.fittingId);
      const inspections = await InspectionService.getInspectionsByFittingId(fittingId);
      res.status(200).json({
        success: true,
        data: inspections,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createInspection(req: AuthRequest, res: Response): Promise<void> {
    try {
      const fittingId = String(req.params.fittingId || req.body.fittingId);
      const inspectorName = req.user?.fullName || req.user?.username || req.body.inspector || 'Senior Track Inspector';

      const inspection = await InspectionService.createInspection(
        { ...req.body, fittingId },
        inspectorName
      );

      await AuditService.logAction({
        action: 'SUBMIT_INSPECTION',
        username: req.user?.username || 'inspector',
        fittingId,
        details: `Logged inspection ${inspection.id}: Condition ${inspection.condition}`,
        ipAddress: req.ip,
      });

      res.status(201).json({
        success: true,
        message: 'Inspection recorded and appended to immutable lifecycle.',
        data: inspection,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
