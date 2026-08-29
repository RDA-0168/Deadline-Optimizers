"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
function validate(schema) {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Attach parsed objects back to request
            req.body = parsed.body ?? req.body;
            req.query = parsed.query ?? req.query;
            req.params = parsed.params ?? req.params;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => {
                    const path = issue.path.join('.');
                    return `${path}: ${issue.message}`;
                });
                res.status(400).json({
                    success: false,
                    message: 'Input validation failed',
                    errors: errorMessages,
                });
                return;
            }
            res.status(400).json({
                success: false,
                message: 'Malformed request data',
            });
        }
    };
}
//# sourceMappingURL=validate.middleware.js.map