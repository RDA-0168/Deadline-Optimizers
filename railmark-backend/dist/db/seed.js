"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
async function seed() {
    console.log('🌱 Starting RailMark AI database seeding...');
    await index_js_1.db.init();
    index_js_1.db.seedInMemory();
    console.log('✅ Seed data successfully loaded:');
    const fittings = await index_js_1.db.getAllFittings();
    console.log(`   - ${fittings.length} Railway Track Fittings loaded.`);
    const inspections = await index_js_1.db.getAllInspections();
    console.log(`   - ${inspections.length} Field Inspection records with AI assistance loaded.`);
    const maintenance = await index_js_1.db.getAllMaintenance();
    console.log(`   - ${maintenance.length} Maintenance logs loaded.`);
    const { total } = await index_js_1.db.getAuditLogs(100, 1);
    console.log(`   - ${total} Audit log events loaded.`);
    console.log('DISCLAIMER: All seed data is DEMO / PROTOTYPE DATA - NOT OFFICIAL INDIAN RAILWAYS DATA.');
}
seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map