"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQRByFittingIdSchema = exports.resolveQRSchema = void 0;
const zod_1 = require("zod");
exports.resolveQRSchema = zod_1.z.object({
    body: zod_1.z.object({
        qrValue: zod_1.z.string().min(1, 'qrValue is required'),
    }),
});
exports.getQRByFittingIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        fittingId: zod_1.z.string().min(1, 'Fitting ID is required'),
    }),
});
//# sourceMappingURL=qr.schema.js.map