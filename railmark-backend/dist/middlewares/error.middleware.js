// =============================================================================
// RailMark AI — Centralized Error Handling Middleware
// =============================================================================
export function errorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    if (process.env.NODE_ENV !== 'test') {
        console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        code: err.code || 'INTERNAL_ERROR',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
}
//# sourceMappingURL=error.middleware.js.map