"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const audit_service_js_1 = require("../services/audit.service.js");
class AuditController {
    static async getLogs(req, res, next) {
        try {
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
            const result = await audit_service_js_1.AuditService.getLogs(limit, page);
            const totalPages = Math.ceil(result.total / limit) || 1;
            res.status(200).json({
                success: true,
                data: result.items,
                meta: {
                    total: result.total,
                    page,
                    limit,
                    totalPages,
                    timestamp: new Date().toISOString(),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuditController = AuditController;
//# sourceMappingURL=audit.controller.js.map