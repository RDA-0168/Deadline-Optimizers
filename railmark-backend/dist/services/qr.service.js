"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRService = void 0;
const index_js_1 = require("../db/index.js");
const error_middleware_js_1 = require("../middlewares/error.middleware.js");
const audit_service_js_1 = require("./audit.service.js");
const roles_js_1 = require("../constants/roles.js");
class QRService {
    static async getQRInfo(fittingId) {
        const fitting = await index_js_1.db.findFittingById(fittingId);
        if (!fitting) {
            throw new error_middleware_js_1.AppError(`Fitting with ID '${fittingId}' not found`, 404);
        }
        return {
            fittingId: fitting.fittingId,
            qrCodeValue: fitting.qrCodeValue,
            qrPayloadUrl: `https://railmark.ai/trace/${fitting.fittingId}`,
            laserMarkDate: fitting.laserMarkDate,
            markingMachineId: fitting.markingMachineId,
            qrVerificationStatus: fitting.qrVerificationStatus,
            laserMarkingSpecs: {
                laserType: 'MOPA Pulsed Fiber Laser 20W',
                markDepthMicrons: 45,
                dpi: 600,
                matrixStandard: 'ISO/IEC 16022 (Data Matrix ECC 200)',
                durabilityStandard: 'IP68 / EN 50125-3 Railway Class',
            },
        };
    }
    static async resolveQR(rawQrValue, user, ipAddress) {
        if (!rawQrValue || !rawQrValue.trim()) {
            return {
                success: false,
                message: 'Invalid QR code scanned: empty value',
            };
        }
        // Support both direct ID (e.g. "RM-FIT-0001") and URL payload (e.g. "https://railmark.ai/trace/RM-FIT-0001")
        let cleaned = rawQrValue.trim();
        if (cleaned.includes('/')) {
            const parts = cleaned.split('/');
            cleaned = parts[parts.length - 1];
        }
        const fitting = await index_js_1.db.findFittingByQR(cleaned);
        if (!fitting) {
            // Log failed scan attempt
            await audit_service_js_1.AuditService.logAction({
                user: user?.fullName || 'ANONYMOUS_SCANNER',
                role: user?.role || 'ANONYMOUS',
                action: roles_js_1.AuditAction.QR_SCANNED,
                ipAddress,
                details: `Failed QR scan attempt for value: '${rawQrValue}'`,
            });
            return {
                success: false,
                message: 'Fitting not found',
            };
        }
        // Log successful scan in audit
        await audit_service_js_1.AuditService.logAction({
            user: user?.fullName || 'ANONYMOUS_SCANNER',
            role: user?.role || 'ANONYMOUS',
            action: roles_js_1.AuditAction.QR_SCANNED,
            fittingId: fitting.fittingId,
            ipAddress,
            details: `Scanned QR code '${rawQrValue}' resolved to fitting ID '${fitting.fittingId}'`,
        });
        return {
            success: true,
            fittingId: fitting.fittingId,
            data: {
                fittingId: fitting.fittingId,
                qrValue: fitting.qrCodeValue,
                fittingType: fitting.fittingType,
                manufacturer: fitting.manufacturer,
                batchNumber: fitting.batchNumber,
                status: fitting.status,
                verificationStatus: fitting.qrVerificationStatus,
                laserMarkDate: fitting.laserMarkDate,
            },
        };
    }
}
exports.QRService = QRService;
//# sourceMappingURL=qr.service.js.map