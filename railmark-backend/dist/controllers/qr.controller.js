"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRController = void 0;
const qr_service_js_1 = require("../services/qr.service.js");
class QRController {
    static async getQRInfo(req, res, next) {
        try {
            const fittingId = req.params.fittingId;
            const result = await qr_service_js_1.QRService.getQRInfo(fittingId);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async resolveQR(req, res, next) {
        try {
            const { qrValue } = req.body;
            const ipAddress = req.ip || req.socket.remoteAddress;
            const result = await qr_service_js_1.QRService.resolveQR(qrValue, req.user, ipAddress);
            if (!result.success) {
                res.status(404).json(result);
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.QRController = QRController;
//# sourceMappingURL=qr.controller.js.map