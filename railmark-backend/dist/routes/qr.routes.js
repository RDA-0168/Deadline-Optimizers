"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qr_controller_js_1 = require("../controllers/qr.controller.js");
const validate_middleware_js_1 = require("../middlewares/validate.middleware.js");
const qr_schema_js_1 = require("../schemas/qr.schema.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
// POST /api/qr/resolve - Resolve scanned QR code to fitting ID
router.post('/resolve', auth_middleware_js_1.optionalAuthenticate, (0, validate_middleware_js_1.validate)(qr_schema_js_1.resolveQRSchema), qr_controller_js_1.QRController.resolveQR);
// GET /api/qr/:fittingId - Get QR-related info and laser specs
router.get('/:fittingId', auth_middleware_js_1.optionalAuthenticate, (0, validate_middleware_js_1.validate)(qr_schema_js_1.getQRByFittingIdSchema), qr_controller_js_1.QRController.getQRInfo);
exports.default = router;
//# sourceMappingURL=qr.routes.js.map