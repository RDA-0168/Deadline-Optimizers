"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FittingService = void 0;
const index_js_1 = require("../db/index.js");
const error_middleware_js_1 = require("../middlewares/error.middleware.js");
const audit_service_js_1 = require("./audit.service.js");
const roles_js_1 = require("../constants/roles.js");
class FittingService {
    static async getAllFittings(query) {
        let list = await index_js_1.db.getAllFittings();
        if (query?.status) {
            list = list.filter((f) => f.status.toLowerCase() === query.status.toLowerCase());
        }
        if (query?.fittingType) {
            list = list.filter((f) => f.fittingType.toLowerCase().includes(query.fittingType.toLowerCase()));
        }
        if (query?.manufacturer) {
            list = list.filter((f) => f.manufacturer.toLowerCase().includes(query.manufacturer.toLowerCase()));
        }
        if (query?.railLine) {
            list = list.filter((f) => f.railLine.toLowerCase().includes(query.railLine.toLowerCase()));
        }
        const total = list.length;
        const page = query?.page && query.page > 0 ? query.page : 1;
        const limit = query?.limit && query.limit > 0 ? query.limit : 50;
        const start = (page - 1) * limit;
        const items = list.slice(start, start + limit);
        const totalPages = Math.ceil(total / limit) || 1;
        return { items, total, page, limit, totalPages };
    }
    static async getFittingFullDetails(fittingId) {
        const fitting = await index_js_1.db.findFittingById(fittingId);
        if (!fitting) {
            throw new error_middleware_js_1.AppError(`Fitting with ID '${fittingId}' not found`, 404);
        }
        const [inspections, maintenance, lifecycle] = await Promise.all([
            index_js_1.db.getInspectionsByFittingId(fittingId),
            index_js_1.db.getMaintenanceByFittingId(fittingId),
            index_js_1.db.getLifecycleByFittingId(fittingId),
        ]);
        return {
            basicInfo: {
                fittingId: fitting.fittingId,
                fittingType: fitting.fittingType,
                manufacturer: fitting.manufacturer,
                batchNumber: fitting.batchNumber,
                manufacturingDate: fitting.manufacturingDate,
                materialGrade: fitting.materialGrade,
                standardSpec: fitting.standardSpec,
                status: fitting.status,
            },
            installationInfo: {
                railLine: fitting.railLine,
                trackSection: fitting.trackSection,
                sleeperNumber: fitting.sleeperNumber,
                gpsLatitude: fitting.gpsLatitude,
                gpsLongitude: fitting.gpsLongitude,
                installedBy: fitting.installedBy,
                installationDate: fitting.installationDate,
                torqueSpecNm: fitting.torqueSpecNm,
            },
            qrInfo: {
                qrCodeValue: fitting.qrCodeValue,
                laserMarkDate: fitting.laserMarkDate,
                markingMachineId: fitting.markingMachineId,
                qrVerificationStatus: fitting.qrVerificationStatus,
            },
            inspections,
            maintenance,
            lifecycle,
        };
    }
    static async createFitting(dto, user, ipAddress) {
        const existing = await index_js_1.db.findFittingById(dto.fittingId);
        if (existing) {
            throw new error_middleware_js_1.AppError(`Fitting with ID '${dto.fittingId}' already exists`, 400);
        }
        const now = new Date().toISOString();
        const qrValue = dto.qrCodeValue || dto.fittingId;
        const markingMachineId = dto.markingMachineId || 'LASER-ENG-DEFAULT';
        const fitting = {
            fittingId: dto.fittingId,
            fittingType: dto.fittingType,
            manufacturer: dto.manufacturer,
            batchNumber: dto.batchNumber,
            manufacturingDate: dto.manufacturingDate,
            materialGrade: dto.materialGrade,
            standardSpec: dto.standardSpec,
            status: dto.status || 'Active',
            railLine: dto.railLine,
            trackSection: dto.trackSection,
            sleeperNumber: dto.sleeperNumber,
            gpsLatitude: dto.gpsLatitude,
            gpsLongitude: dto.gpsLongitude,
            installedBy: dto.installedBy,
            installationDate: dto.installationDate,
            torqueSpecNm: dto.torqueSpecNm,
            qrCodeValue: qrValue,
            laserMarkDate: now,
            markingMachineId,
            qrVerificationStatus: 'Verified',
            createdAt: now,
            updatedAt: now,
        };
        const saved = await index_js_1.db.createFitting(fitting);
        // Automatically create initial lifecycle events
        await index_js_1.db.createLifecycleEvent({
            id: `LC-${dto.fittingId}-MFR`,
            fittingId: dto.fittingId,
            eventType: roles_js_1.LifecycleEventType.MANUFACTURED,
            eventDate: dto.manufacturingDate + 'T09:00:00.000Z',
            actor: dto.manufacturer,
            location: `Plant: ${dto.manufacturer}`,
            details: `Manufactured according to specification ${dto.standardSpec}, material grade ${dto.materialGrade}.`,
            metadata: { batchNumber: dto.batchNumber },
            createdAt: now,
        });
        await index_js_1.db.createLifecycleEvent({
            id: `LC-${dto.fittingId}-INST`,
            fittingId: dto.fittingId,
            eventType: roles_js_1.LifecycleEventType.INSTALLED,
            eventDate: dto.installationDate + 'T10:00:00.000Z',
            actor: dto.installedBy,
            location: `${dto.railLine}, ${dto.trackSection} (Sleeper ${dto.sleeperNumber})`,
            details: `Installed with torque rating ${dto.torqueSpecNm} Nm.`,
            metadata: { gpsLat: dto.gpsLatitude, gpsLng: dto.gpsLongitude },
            createdAt: now,
        });
        // Audit log
        await audit_service_js_1.AuditService.logAction({
            user: user?.fullName || 'ANONYMOUS',
            role: user?.role || 'ANONYMOUS',
            action: roles_js_1.AuditAction.CREATE_FITTING,
            fittingId: dto.fittingId,
            ipAddress,
            details: `Created new fitting ${dto.fittingId} (${dto.fittingType})`,
        });
        return saved;
    }
    static async updateFitting(fittingId, dto, user, ipAddress) {
        const existing = await index_js_1.db.findFittingById(fittingId);
        if (!existing) {
            throw new error_middleware_js_1.AppError(`Fitting with ID '${fittingId}' not found`, 404);
        }
        const updated = await index_js_1.db.updateFitting(fittingId, dto);
        if (!updated) {
            throw new error_middleware_js_1.AppError('Failed to update fitting record', 500);
        }
        await audit_service_js_1.AuditService.logAction({
            user: user?.fullName || 'ANONYMOUS',
            role: user?.role || 'ANONYMOUS',
            action: roles_js_1.AuditAction.UPDATE_FITTING,
            fittingId,
            ipAddress,
            details: `Updated fitting ${fittingId}: ${Object.keys(dto).join(', ')}`,
        });
        return updated;
    }
    static async deleteFitting(fittingId, user, ipAddress) {
        const existing = await index_js_1.db.findFittingById(fittingId);
        if (!existing) {
            throw new error_middleware_js_1.AppError(`Fitting with ID '${fittingId}' not found`, 404);
        }
        const deleted = await index_js_1.db.deleteFitting(fittingId);
        if (!deleted) {
            throw new error_middleware_js_1.AppError('Failed to delete fitting record', 500);
        }
        await audit_service_js_1.AuditService.logAction({
            user: user?.fullName || 'ADMIN',
            role: user?.role || 'ADMIN',
            action: roles_js_1.AuditAction.DELETE_FITTING,
            fittingId,
            ipAddress,
            details: `Deleted prototype fitting record ${fittingId}`,
        });
    }
}
exports.FittingService = FittingService;
//# sourceMappingURL=fitting.service.js.map