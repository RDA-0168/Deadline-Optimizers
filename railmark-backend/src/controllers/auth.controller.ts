// =============================================================================
// RailMark AI — Auth, Dashboard, QR, Search, Audit Controllers
// =============================================================================

import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { AuthService } from '../services/auth.service.js';
import { DashboardService, QRService, SearchService, AuditService } from '../services/dashboard.service.js';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);

      res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        data: result,
      });
    } catch (err: any) {
      const status = err.statusCode || 401;
      res.status(status).json({ success: false, error: err.message });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        data: result,
      });
    } catch (err: any) {
      const status = err.statusCode || 400;
      res.status(status).json({ success: false, error: err.message });
    }
  }

  static async me(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    res.status(200).json({
      success: true,
      data: req.user,
    });
  }
}

export class DashboardController {
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await DashboardService.getStats();
      res.status(200).json({ success: true, data: stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export class QRController {
  static async resolve(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { qrValue, latitude, longitude, notes } = req.body;
      const result = await QRService.resolve(qrValue, { latitude, longitude, notes });

      await AuditService.logAction({
        action: 'SCAN_QR',
        username: req.user?.username || 'anonymous_scanner',
        fittingId: result.fittingId,
        details: `Scanned and resolved QR: ${qrValue}`,
        ipAddress: req.ip,
      });

      res.status(200).json({
        success: true,
        message: 'QR code verified against master track fitting registry.',
        data: result,
      });
    } catch (err: any) {
      const status = err.statusCode || 404;
      res.status(status).json({ success: false, error: err.message });
    }
  }
}

export class SearchController {
  static async search(req: Request, res: Response): Promise<void> {
    try {
      const query = (req.query.q as string) || '';
      const status = req.query.status as string;
      const zone = req.query.zone as string;
      const type = req.query.type as string;

      const results = await SearchService.search(query, { status, zone, type });
      res.status(200).json({
        success: true,
        query,
        count: results.length,
        data: results,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export class AuditController {
  static async getLogs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string || '50', 10);
      const logs = await AuditService.getLogs(limit);
      res.status(200).json({ success: true, data: logs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
