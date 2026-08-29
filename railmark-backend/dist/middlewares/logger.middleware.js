"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
function requestLogger(req, res, next) {
    const start = Date.now();
    const requestId = `req_${Math.random().toString(36).substring(2, 9)}`;
    res.setHeader('X-Request-Id', requestId);
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] [${requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    });
    next();
}
//# sourceMappingURL=logger.middleware.js.map