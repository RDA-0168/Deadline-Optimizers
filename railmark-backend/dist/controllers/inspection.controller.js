"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectionController = void 0;
const inspection_service_js_1 = require("../services/inspection.service.js");
class InspectionController {
    static async getInspections(req, res, next) {
        try {
            const fittingId = req.params.fittingId;
            const results = await inspection_service_js_1.InspectionService.getInspectionsByFittingId(fittingId);
            res.status(200).json({
                success: true,
                data: results,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async createInspection(req, res, next) {
        try {
            const fittingId = req.params.fittingId;
            const ipAddress = req.ip || req.socket.remoteAddress;
            const created = await inspection_service_js_1.InspectionService.createInspection(fittingId, req.body, req.user, ipAddress);
            res.status(201).json({
                success: true,
                message: 'Track inspection record submitted successfully',
                data: created,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InspectionController = InspectionController;
//# sourceMappingURL=inspection.controller.js.map