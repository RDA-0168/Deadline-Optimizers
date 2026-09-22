// =============================================================================
// RailMark AI — Request Validation Middleware (Zod)
// =============================================================================
import { ZodError } from 'zod';
export function validate(schema) {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    error: 'Request validation failed',
                    details: err.errors.map((e) => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                });
                return;
            }
            next(err);
        }
    };
}
//# sourceMappingURL=validate.middleware.js.map