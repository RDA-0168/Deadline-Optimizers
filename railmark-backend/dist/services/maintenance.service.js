"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceService = void 0;
const index_js_1 = require("../db/index.js");
const error_middleware_js_1 = require("../middlewares/error.middleware.js");
const audit_service_js_1 = require("./audit.service.js");
const roles_js_1 = require("../constants/roles.js");
class MaintenanceService {
    static async getMaintenanceByFittingId(fittingId) {
        const fitting = await index_js_1.db.findFittingById(fittingId);
        if (!fitting) {
            throw new error_middleware_js_1.AppError(`Fitting with ID '${fittingId}' not found`, 404);
        }
        return index_js_1.db.getMaintenanceByFittingId(fittingId);
    }
    static async createMaintenance(fittingId, dto, user, ipAddress) {
        const fitting = await index_js_1.db.findFittingById(fittingId);
        if (!fitting) {
            throw new error_middleware_js_1.AppError(`Fitting with ID '${fittingId}' not found`, 404);
        }
        const now = new Date().toISOString();
        const maintenanceId = `MNT-${Date.now()}`;
        const technicianId = user?.userId || 'USR-ANONYMOUS';
        const technicianName = dto.technician || user?.fullName || 'Track Maintenance Technician';
        const record = {
            id: maintenanceId,
            fittingId,
            maintenanceDate: dto.maintenanceDate,
            maintenanceType: dto.maintenanceType,
            technicianId,
            technicianName,
            description: dto.description,
            status: dto.status,
            nextMaintenance: dto.nextMaintenance,
            createdAt: now,
        };
        const saved = await index_js_1.db.createMaintenance(record);
        // Auto-record lifecycle event: Maintained
        await index_js_1.db.createLifecycleEvent({
            id: `LC-${fittingId}-MNT-${Date.now()}`,
            fittingId,
            eventType: roles_js_1.LifecycleEventType.MAINTAINED,
            eventDate: dto.maintenanceDate + 'T10:00:00.000Z',
            actor: technicianName,
            location: `${fitting.railLine}, ${fitting.trackSection}`,
            details: `${dto.maintenanceType} - ${dto.description}`,
            metadata: {
                maintenanceId,
                status: dto.status,
                nextMaintenance: dto.nextMaintenance,
            },
            createdAt: now,
        });
        // Record audit log
        await audit_service_js_1.AuditService.logAction({
            user: technicianName,
            role: user?.role || 'MAINTENANCE',
            action: roles_js_1.AuditAction.MAINTENANCE_SUBMITTED,
            fittingId,
            ipAddress,
            details: `Maintenance recorded: ${dto.maintenanceType} (${dto.status}). Next scheduled: ${dto.nextMaintenance}`,
        });
        return saved;
    }
}
exports.MaintenanceService = MaintenanceService;
//# sourceMappingURL=maintenance.service.js.map