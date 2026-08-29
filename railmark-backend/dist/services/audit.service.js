"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const index_js_1 = require("../db/index.js");
class AuditService {
    static async logAction(dto) {
        const entry = {
            id: `AUD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            user: dto.user,
            role: dto.role,
            action: dto.action,
            fittingId: dto.fittingId,
            ipAddress: dto.ipAddress,
            details: dto.details,
            metadata: dto.metadata,
            timestamp: new Date().toISOString(),
        };
        return index_js_1.db.createAuditLog(entry);
    }
    static async getLogs(limit = 50, page = 1) {
        return index_js_1.db.getAuditLogs(limit, page);
    }
}
exports.AuditService = AuditService;
//# sourceMappingURL=audit.service.js.map