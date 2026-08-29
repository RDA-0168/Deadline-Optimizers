"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceController = void 0;
const maintenance_service_js_1 = require("../services/maintenance.service.js");
class MaintenanceController {
    static async getMaintenance(req, res, next) {
        try {
            const fittingId = req.params.fittingId;
            const results = await maintenance_service_js_1.MaintenanceService.getMaintenanceByFittingId(fittingId);
            res.status(200).json({
                success: true,
                data: results,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async createMaintenance(req, res, next) {
        try {
            const fittingId = req.params.fittingId;
            const ipAddress = req.ip || req.socket.remoteAddress;
            const created = await maintenance_service_js_1.MaintenanceService.createMaintenance(fittingId, req.body, req.user, ipAddress);
            res.status(201).json({
                success: true,
                message: 'Maintenance activity recorded successfully',
                data: created,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MaintenanceController = MaintenanceController;
//# sourceMappingURL=maintenance.controller.js.map