// =============================================================================
// RailMark AI — Lifecycle Controller (Append-Only Enforcement)
// =============================================================================

import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { LifecycleService } from '../services/lifecycle.service.js';
import { AuditService } from '../services/dashboard.service.js';

export class LifecycleController {
  static async getLifecycle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const fittingId = String(req.params.fittingId);
      const lifecycle = await LifecycleService.getLifecycleByFittingId(fittingId);
      res.status(200).json({
        success: true,
        data: lifecycle,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async appendLifecycle(req: AuthRequest, res: Response): Promise<void> {
    try {
      const fittingId = String(req.params.fittingId || req.body.fittingId);
      const actor = req.user?.fullName || req.user?.username || req.body.actor || 'RailMark Inspector';

      const entry = await LifecycleService.appendEvent({
        ...req.body,
        fittingId,
        actor,
      });

      await AuditService.logAction({
        action: 'APPEND_LIFECYCLE',
        username: req.user?.username || 'system',
        fittingId,
        details: `Appended lifecycle event: ${entry.event} by ${actor}`,
        ipAddress: req.ip,
      });

      res.status(201).json({
        success: true,
        message: 'Lifecycle event successfully appended to immutable audit chain.',
        data: entry,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static prohibitMutation(req: Request, res: Response): void {
    res.status(405).json({
      success: false,
      error: 'Method Not Allowed: Lifecycle events are strictly append-only. Mutation or deletion is prohibited.',
    });
  }
}
