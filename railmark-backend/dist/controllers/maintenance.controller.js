// =============================================================================
// RailMark AI — Maintenance Controller
// =============================================================================
import { MaintenanceService } from '../services/maintenance.service.js';
import { AuditService } from '../services/dashboard.service.js';
export class MaintenanceController {
    static async getAllMaintenance(req, res) {
        try {
            const limit = parseInt(req.query.limit || '100', 10);
            const records = await MaintenanceService.getAllMaintenance(limit);
            res.status(200).json({
                success: true,
                data: records,
                count: records.length,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    static async getMaintenance(req, res) {
        try {
            const fittingId = String(req.params.fittingId);
            const records = await MaintenanceService.getMaintenanceByFittingId(fittingId);
            res.status(200).json({
                success: true,
                data: records,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    static async createMaintenance(req, res) {
        try {
            const fittingId = String(req.params.fittingId || req.body.fittingId);
            const technicianName = req.user?.fullName || req.user?.username || req.body.technician || 'Track Maintenance Lead';
            const maintenance = await MaintenanceService.createMaintenance({ ...req.body, fittingId }, technicianName);
            await AuditService.logAction({
                action: 'SUBMIT_MAINTENANCE',
                username: req.user?.username || 'technician',
                fittingId,
                details: `Logged maintenance ${maintenance.id}: ${maintenance.maintenanceType} - ${maintenance.description}`,
                ipAddress: req.ip,
            });
            res.status(201).json({
                success: true,
                message: 'Maintenance action recorded and appended to immutable lifecycle.',
                data: maintenance,
            });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
}
//# sourceMappingURL=maintenance.controller.js.map