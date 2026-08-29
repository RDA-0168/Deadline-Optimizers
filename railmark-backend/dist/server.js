"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const env_js_1 = require("./config/env.js");
const index_js_1 = require("./db/index.js");
async function startServer() {
    try {
        // Initialize Database
        await index_js_1.db.init();
        const app = (0, app_js_1.createApp)();
        const server = app.listen(env_js_1.ENV.PORT, () => {
            console.log(`=======================================================`);
            console.log(`🚄  RailMark AI Backend REST API Server is RUNNING`);
            console.log(`=======================================================`);
            console.log(`📍 Port:             ${env_js_1.ENV.PORT}`);
            console.log(`🌍 Environment:      ${env_js_1.ENV.NODE_ENV}`);
            console.log(`📑 API Base:         http://localhost:${env_js_1.ENV.PORT}/api`);
            console.log(`📖 Swagger Docs:     http://localhost:${env_js_1.ENV.PORT}/api-docs`);
            console.log(`🛡️  Auth Endpoints:   http://localhost:${env_js_1.ENV.PORT}/api/auth/login`);
            console.log(`🔍 Search:           http://localhost:${env_js_1.ENV.PORT}/api/search?q=`);
            console.log(`📊 Dashboard Stats:  http://localhost:${env_js_1.ENV.PORT}/api/dashboard/stats`);
            console.log(`⚠️  Disclaimer:       DEMO / PROTOTYPE DATA ONLY`);
            console.log(`=======================================================`);
        });
        // Graceful Shutdown
        const shutdown = () => {
            console.log('\n🛑 Gracefully shutting down RailMark AI server...');
            server.close(() => {
                console.log('✅ HTTP server closed. Process terminated.');
                process.exit(0);
            });
        };
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
    catch (error) {
        console.error('❌ Failed to start RailMark AI backend server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map