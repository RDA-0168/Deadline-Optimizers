"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectionService = void 0;
const index_js_1 = require("../db/index.js");
const error_middleware_js_1 = require("../middlewares/error.middleware.js");
const audit_service_js_1 = require("./audit.service.js");
const roles_js_1 = require("../constants/roles.js");
class InspectionService {
    static async getInspectionsByFittingId(fittingId) {
        const fitting = await index_js_1.db.findFittingById(fittingId);
        if (!fitting) {
            throw new error_middleware_js_1.AppError(`Fitting with ID '${fittingId}' not found`, 404);
        }
        return index_js_1.db.getInspectionsByFittingId(fittingId);
    }
    static async createInspection(fittingId, dto, user, ipAddress) {
        const fitting = await index_js_1.db.findFittingById(fittingId);
        if (!fitting) {
            throw new error_middleware_js_1.AppError(`Fitting with ID '${fittingId}' not found`, 404);
        }
        const now = new Date().toISOString();
        const inspectionId = `INS-${Date.now()}`;
        const inspectorId = user?.userId || 'USR-ANONYMOUS';
        const inspectorName = dto.inspector || user?.fullName || 'Track Field Inspector';
        const record = {
            id: inspectionId,
            fittingId,
            inspectionDate: dto.inspectionDate || now,
            inspectorId,
            inspectorName,
            condition: dto.condition,
            qrReadability: dto.qrReadability,
            corrosion: dto.corrosion,
            surfaceDamage: dto.surfaceDamage,
            deformation: dto.deformation,
            wear: dto.wear,
            notes: dto.notes || '',
            aiAssistanceResult: dto.aiAssistanceResult,
            aiConfidence: dto.aiConfidence,
            createdAt: now,
        };
        const saved = await index_js_1.db.createInspection(record);
        // Auto-record lifecycle event: Inspected
        await index_js_1.db.createLifecycleEvent({
            id: `LC-${fittingId}-INSP-${Date.now()}`,
            fittingId,
            eventType: roles_js_1.LifecycleEventType.INSPECTED,
            eventDate: record.inspectionDate,
            actor: inspectorName,
            location: `${fitting.railLine}, ${fitting.trackSection}`,
            details: `Field inspection recorded. Condition: ${dto.condition}. AI Advisory: ${dto.aiAssistanceResult}`,
            metadata: {
                inspectionId,
                aiConfidence: dto.aiConfidence,
                qrReadability: dto.qrReadability,
                corrosion: dto.corrosion,
            },
            createdAt: now,
        });
        // Record audit log
        await audit_service_js_1.AuditService.logAction({
            user: inspectorName,
            role: user?.role || 'INSPECTOR',
            action: roles_js_1.AuditAction.INSPECTION_SUBMITTED,
            fittingId,
            ipAddress,
            details: `Inspection submitted: Condition=${dto.condition}, AI Assistance=${dto.aiAssistanceResult.substring(0, 50)}...`,
        });
        return saved;
    }
}
exports.InspectionService = InspectionService;
//# sourceMappingURL=inspection.service.js.map