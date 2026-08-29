"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FittingController = void 0;
const fitting_service_js_1 = require("../services/fitting.service.js");
class FittingController {
    static async getAllFittings(req, res, next) {
        try {
            const { status, fittingType, manufacturer, railLine, page, limit } = req.query;
            const result = await fitting_service_js_1.FittingService.getAllFittings({
                status: status,
                fittingType: fittingType,
                manufacturer: manufacturer,
                railLine: railLine,
                page: page ? parseInt(page, 10) : undefined,
                limit: limit ? parseInt(limit, 10) : undefined,
            });
            res.status(200).json({
                success: true,
                data: result.items,
                meta: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages,
                    timestamp: new Date().toISOString(),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getFittingById(req, res, next) {
        try {
            const fittingId = req.params.fittingId;
            const result = await fitting_service_js_1.FittingService.getFittingFullDetails(fittingId);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async createFitting(req, res, next) {
        try {
            const ipAddress = req.ip || req.socket.remoteAddress;
            const created = await fitting_service_js_1.FittingService.createFitting(req.body, req.user, ipAddress);
            res.status(201).json({
                success: true,
                message: 'Railway fitting record created successfully',
                data: created,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateFitting(req, res, next) {
        try {
            const fittingId = req.params.fittingId;
            const ipAddress = req.ip || req.socket.remoteAddress;
            const updated = await fitting_service_js_1.FittingService.updateFitting(fittingId, req.body, req.user, ipAddress);
            res.status(200).json({
                success: true,
                message: `Fitting ${fittingId} updated successfully`,
                data: updated,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteFitting(req, res, next) {
        try {
            const fittingId = req.params.fittingId;
            const ipAddress = req.ip || req.socket.remoteAddress;
            await fitting_service_js_1.FittingService.deleteFitting(fittingId, req.user, ipAddress);
            res.status(200).json({
                success: true,
                message: `Fitting ${fittingId} deleted successfully from prototype database`,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FittingController = FittingController;
//# sourceMappingURL=fitting.controller.js.map