"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceService = void 0;
const index_js_1 = require("../db/index.js");
const error_middleware_js_1 = require("../middlewares/error.middleware.js");
const audit_service_js_1 = require("./audit.service.js");
const roles_js_1 = require("../constants/roles.js");
class MaintenanceService {
    static async getMaintenanceByFittingId(fittingId) {
        return index_js_1.db.getMaintenanceByFittingId(fittingId);
    }
    static async createMaintenance(fittingId, dto, user, ipAddress) {
        let fitting = await index_js_1.db.findFittingById(fittingId);
        if (!fitting) {
            fitting = {
                fittingId,
                qrCodeValue: fittingId,
                fittingType: 'Elastic Rail Clip',
                railwayZone: 'Central Railway',
                trackSection: 'Main Line - KM 100/1',
                sleeperNumber: 'PSC-SLP-01',
                railLine: 'Central Corridor',
                installationDate: new Date().toISOString().split('T')[0],
                installedBy: 'Track Maintenance Squad',
                status: 'Active',
                maintenanceStatus: 'Maintained',
            };
            await index_js_1.db.createFitting(fitting);
        }
        const now = new Date().toISOString();
        const maintenanceId = `MNT-${Date.now()}`;
        const technicianId = user?.userId || dto.technicianId || 'USR-ANONYMOUS';
        const technicianName = dto.technician || user?.fullName || 'Track Maintenance Technician';
        const record = {
            id: maintenanceId,
            fittingId,
            maintenanceDate: dto.maintenanceDate || now.split('T')[0],
            maintenanceType: dto.maintenanceType || 'Routine',
            technicianId,
            technicianName,
            description: dto.description || 'Maintenance completed.',
            status: dto.status || 'Completed',
            nextMaintenance: dto.nextMaintenance || '',
            cost: dto.cost || '₹0',
            partsReplaced: dto.partsReplaced || [],
            createdAt: now,
        };
        const saved = await index_js_1.db.createMaintenance(record);
        // Auto-record lifecycle event: Maintained
        await index_js_1.db.createLifecycleEvent({
            id: `LC-${fittingId}-MNT-${Date.now()}`,
            fittingId,
            eventType: roles_js_1.LifecycleEventType.MAINTAINED,
            eventDate: (dto.maintenanceDate || now.split('T')[0]) + 'T10:00:00.000Z',
            actor: technicianName,
            location: `${fitting.railLine || 'Main Line'}, ${fitting.trackSection || 'Section KM 100/1'}`,
            details: `${record.maintenanceType} - ${record.description}`,
            metadata: {
                maintenanceId,
                status: record.status,
                nextMaintenance: record.nextMaintenance,
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
            details: `Maintenance recorded: ${record.maintenanceType} (${record.status}). Next scheduled: ${record.nextMaintenance}`,
        });
        return saved;
    }
}
exports.MaintenanceService = MaintenanceService;
//# sourceMappingURL=maintenance.service.js.map