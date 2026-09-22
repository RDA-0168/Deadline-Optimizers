// =============================================================================
// RailMark AI — Server Startup & Lifecycle Management
// =============================================================================
import app from './app.js';
import { ENV } from './config/env.js';
import { prisma, checkPrismaConnection } from './db/prisma.js';
import { SeedService } from './services/seed.service.js';
const PORT = ENV.PORT || 5000;
const server = app.listen(PORT, async () => {
    console.log('================================================================');
    console.log(`🚂 RailMark AI Backend API Gateway started on port ${PORT}`);
    console.log(`🌐 Environment: ${ENV.NODE_ENV}`);
    console.log(`📡 API Gateway: http://localhost:${PORT}/api`);
    console.log(`📄 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log('================================================================');
    const isConnected = await checkPrismaConnection();
    if (isConnected) {
        console.log('✅ Connected to PostgreSQL database via Prisma ORM.');
        // Auto-seed if database is currently empty
        try {
            await SeedService.seedDatabase(false);
        }
        catch (seedErr) {
            console.warn('⚠️ Auto-seed check failed:', seedErr);
        }
    }
    else {
        console.log('⚠️ PostgreSQL database not reachable via DATABASE_URL. Running in high-availability fallback mode.');
    }
});
// Graceful Shutdown
function gracefulShutdown(signal) {
    console.log(`\nReceived ${signal}. Gracefully shutting down RailMark AI backend...`);
    server.close(async () => {
        try {
            await prisma.$disconnect();
            console.log('🔌 Prisma client disconnected.');
        }
        catch {
            // Ignore
        }
        console.log('👋 RailMark API process terminated cleanly.');
        process.exit(0);
    });
}
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
//# sourceMappingURL=server.js.map