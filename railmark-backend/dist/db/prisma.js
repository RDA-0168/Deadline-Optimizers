// =============================================================================
// RailMark AI — Prisma Client Singleton
// =============================================================================
import { PrismaClient } from '@prisma/client';
export const prisma = global.__prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    global.__prisma = prisma;
}
export async function checkPrismaConnection() {
    try {
        await prisma.$queryRaw `SELECT 1`;
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=prisma.js.map