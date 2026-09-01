"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_js_1 = require("./config/env.js");
const swagger_js_1 = require("./config/swagger.js");
const index_js_1 = __importDefault(require("./routes/index.js"));
const error_middleware_js_1 = require("./middlewares/error.middleware.js");
const logger_middleware_js_1 = require("./middlewares/logger.middleware.js");
const rateLimiter_js_1 = require("./middlewares/rateLimiter.js");
function createApp() {
    const app = (0, express_1.default)();
    // Security Headers
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false, // Allows Swagger UI assets
        crossOriginEmbedderPolicy: false,
    }));
    // CORS Configuration
    app.use((0, cors_1.default)({
        origin: env_js_1.ENV.CORS_ORIGIN === '*' ? true : env_js_1.ENV.CORS_ORIGIN.split(','),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));
    // Body Parsing
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    // Logging
    if (env_js_1.ENV.NODE_ENV !== 'test') {
        app.use(logger_middleware_js_1.requestLogger);
    }
    // Rate Limiting
    app.use('/api', rateLimiter_js_1.apiRateLimiter);
    // Swagger Documentation
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_js_1.swaggerDocument, {
        customSiteTitle: 'RailMark AI — API Documentation',
        customCss: '.swagger-ui .topbar { display: none }',
    }));
    // Base Route
    app.get('/', (req, res) => {
        res.status(200).json({
            name: 'RailMark AI — Backend REST API',
            version: '1.0.0',
            description: 'AI-Assisted Laser QR Marking & Digital Traceability for Railway Track Fittings',
            disclaimer: 'DEMO / PROTOTYPE DATA - NOT OFFICIAL INDIAN RAILWAYS DATA',
            docsUrl: '/api-docs',
            apiBaseUrl: '/api',
            health: 'OK',
            timestamp: new Date().toISOString(),
        });
    });
    // Mount API Endpoints
    app.use('/api', index_js_1.default);
    // Error Handling
    app.use(error_middleware_js_1.notFoundHandler);
    app.use(error_middleware_js_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map