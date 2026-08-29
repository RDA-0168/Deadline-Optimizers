"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleService = void 0;
const index_js_1 = require("../db/index.js");
const error_middleware_js_1 = require("../middlewares/error.middleware.js");
class LifecycleService {
    static async getLifecycleByFittingId(fittingId) {
        const fitting = await index_js_1.db.findFittingById(fittingId);
        if (!fitting) {
            throw new error_middleware_js_1.AppError(`Fitting with ID '${fittingId}' not found`, 404);
        }
        return index_js_1.db.getLifecycleByFittingId(fittingId);
    }
}
exports.LifecycleService = LifecycleService;
//# sourceMappingURL=lifecycle.service.js.map