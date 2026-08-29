"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const index_js_1 = require("../db/index.js");
class DashboardService {
    static async getStats() {
        const fittings = await index_js_1.db.getAllFittings();
        const inspections = await index_js_1.db.getAllInspections();
        const maintenance = await index_js_1.db.getAllMaintenance();
        const { items: auditLogs } = await index_js_1.db.getAuditLogs(10, 1);
        const totalFittings = fittings.length;
        // Distinct fittings with at least one inspection
        const inspectedFittingIds = new Set(inspections.map((i) => i.fittingId));
        const inspected = inspectedFittingIds.size;
        // Maintenance Due (fittings marked as 'Maintenance Required' or with nextMaintenance in the past/next 30 days)
        const now = new Date();
        const maintenanceDue = fittings.filter((f) => f.status === 'Maintenance Required' || f.status === 'Critical').length;
        const pendingInspection = fittings.filter((f) => f.status === 'Pending Inspection' || !inspectedFittingIds.has(f.fittingId)).length;
        // Recent scans in audit logs
        const scanLogs = auditLogs.filter((a) => a.action === 'QR_SCANNED');
        const recentScans = scanLogs.length;
        // QR Verification status breakdown
        const qrVerificationStatus = {
            verified: fittings.filter((f) => f.qrVerificationStatus === 'Verified').length,
            unverified: fittings.filter((f) => f.qrVerificationStatus === 'Unverified').length,
            degraded: fittings.filter((f) => f.qrVerificationStatus === 'Degraded').length,
        };
        // Condition breakdown from latest inspections
        const conditionBreakdown = {
            good: 0,
            moderate: 0,
            fair: 0,
            critical: 0,
            severe: 0,
        };
        inspections.forEach((insp) => {
            const cond = insp.condition.toLowerCase();
            if (conditionBreakdown[cond] !== undefined) {
                conditionBreakdown[cond]++;
            }
        });
        const recentActivities = auditLogs.map((log) => ({
            id: log.id,
            action: log.action,
            user: log.user,
            fittingId: log.fittingId,
            timestamp: log.timestamp,
            details: log.details || '',
        }));
        return {
            totalFittings,
            inspected,
            maintenanceDue,
            pendingInspection,
            recentScans,
            qrVerificationStatus,
            conditionBreakdown,
            recentActivities,
        };
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map