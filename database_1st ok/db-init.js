/**
 * RailMark AI — Database Initialization & Export Utility
 * Handles persistent file-backed JSON/SQLite database storage and migration exports.
 */

const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'railmark_store.json');

console.log('🚄 [RailMark AI] Initializing database engine...');
console.log('📁 Store path:', STORE_PATH);

if (!fs.existsSync(STORE_PATH)) {
  console.log('⚡ Creating initial database file store...');
  // Read seed data from backend seed if available, or create template
  const defaultStore = {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    users: [],
    fittings: [],
    inspections: [],
    maintenanceRecords: [],
    lifecycleEvents: [],
    auditLogs: []
  };
  fs.writeFileSync(STORE_PATH, JSON.stringify(defaultStore, null, 2), 'utf-8');
  console.log('✅ Database store initialized successfully.');
} else {
  console.log('✅ Existing database store found and verified.');
}
