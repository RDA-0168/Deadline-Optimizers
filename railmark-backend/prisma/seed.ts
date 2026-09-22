// =============================================================================
// RailMark AI — Database Seed Script
// AI-Assisted Laser QR Marking & Digital Traceability for Railway Track Fittings
// =============================================================================

import { SeedService } from '../src/services/seed.service.js';
import { prisma } from '../src/db/prisma.js';

async function main() {
  await SeedService.seedDatabase(true);
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
