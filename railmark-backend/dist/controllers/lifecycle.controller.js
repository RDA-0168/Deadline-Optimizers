"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleController = void 0;
const lifecycle_service_js_1 = require("../services/lifecycle.service.js");
class LifecycleController {
    static async getLifecycle(req, res, next) {
        try {
            const fittingId = req.params.fittingId;
            const events = await lifecycle_service_js_1.LifecycleService.getLifecycleByFittingId(fittingId);
            res.status(200).json({
                success: true,
                data: events,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.LifecycleController = LifecycleController;
//# sourceMappingURL=lifecycle.controller.js.map