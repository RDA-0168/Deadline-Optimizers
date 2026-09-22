// =============================================================================
// RailMark AI — Fitting Controller
// =============================================================================
import { FittingService } from '../services/fitting.service.js';
import { AuditService } from '../services/dashboard.service.js';
export class FittingController {
    static async getAllFittings(req, res) {
        try {
            const status = req.query.status;
            const zone = req.query.zone;
            const type = req.query.type;
            const limit = parseInt(req.query.limit || '100', 10);
            const offset = parseInt(req.query.offset || '0', 10);
            const fittings = await FittingService.getAllFittings({ status, zone, type, limit, offset });
            res.status(200).json({
                success: true,
                data: fittings,
                count: fittings.length,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    static async getFittingById(req, res) {
        try {
            const fittingId = String(req.params.fittingId);
            const composite = await FittingService.getFittingById(fittingId);
            if (!composite) {
                res.status(404).json({
                    success: false,
                    error: `Fitting with ID/QR "${fittingId}" was not found.`,
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: composite,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    static async createFitting(req, res) {
        try {
            const actorName = req.user?.fullName || req.user?.username || 'Admin';
            const created = await FittingService.createFitting(req.body, actorName);
            await AuditService.logAction({
                action: 'CREATE_FITTING',
                username: req.user?.username || 'admin',
                fittingId: created.id,
                details: `Created fitting ${created.id} with QR code ${created.qrCodeValue}`,
                ipAddress: req.ip,
            });
            res.status(201).json({
                success: true,
                message: `Fitting ${created.id} registered with unique QR code.`,
                data: created,
            });
        }
        catch (err) {
            const status = err.statusCode || 400;
            res.status(status).json({ success: false, error: err.message });
        }
    }
    static async updateFitting(req, res) {
        try {
            const fittingId = String(req.params.fittingId);
            const updated = await FittingService.updateFitting(fittingId, req.body);
            await AuditService.logAction({
                action: 'UPDATE_FITTING',
                username: req.user?.username || 'admin',
                fittingId,
                details: `Updated attributes for fitting ${fittingId}`,
                ipAddress: req.ip,
            });
            res.status(200).json({
                success: true,
                message: `Fitting ${fittingId} updated successfully.`,
                data: updated,
            });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
    static async deleteFitting(req, res) {
        try {
            const fittingId = String(req.params.fittingId);
            await FittingService.deleteFitting(fittingId);
            await AuditService.logAction({
                action: 'DELETE_FITTING',
                username: req.user?.username || 'admin',
                fittingId,
                details: `Deleted fitting ${fittingId}`,
                ipAddress: req.ip,
            });
            res.status(200).json({
                success: true,
                message: `Fitting ${fittingId} permanently removed.`,
            });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
}
//# sourceMappingURL=fitting.controller.js.map