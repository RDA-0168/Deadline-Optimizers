"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const pg_1 = require("pg");
const env_js_1 = require("../config/env.js");
const seed_data_js_1 = require("./seed-data.js");
class DatabaseEngine {
    isPostgres = false;
    pgPool = null;
    storePath = path_1.resolve(__dirname, '../../../database_1st ok/railmark_store.json');
    // In-Memory Transactional Storage
    users = new Map();
    fittings = new Map();
    inspections = new Map();
    maintenanceRecords = new Map();
    lifecycleEvents = new Map();
    auditLogs = [];
    constructor() {
        this.init();
    }
    async init() {
        if (env_js_1.ENV.DB_TYPE === 'postgres' && (env_js_1.ENV.DATABASE_URL || env_js_1.ENV.PG_HOST)) {
            try {
                this.pgPool = new pg_1.Pool(env_js_1.ENV.DATABASE_URL
                    ? { connectionString: env_js_1.ENV.DATABASE_URL }
                    : {
                        host: env_js_1.ENV.PG_HOST,
                        port: env_js_1.ENV.PG_PORT,
                        user: env_js_1.ENV.PG_USER,
                        password: env_js_1.ENV.PG_PASSWORD,
                        database: env_js_1.ENV.PG_DATABASE,
                    });
                // Test connection
                await this.pgPool.query('SELECT 1');
                this.isPostgres = true;
                console.log('✅ [Database] Connected successfully to PostgreSQL instance.');
                return;
            }
            catch (err) {
                console.warn(`⚠️ [Database] PostgreSQL connection failed (${err.message}). Falling back to high-performance persistent engine.`);
                this.isPostgres = false;
            }
        }
        // Load persistent store or seed
        this.loadFromStoreOrSeed();
        console.log('🚀 [Database] RailMark persistent engine initialized connected to database_1st ok.');
    }
    loadFromStoreOrSeed() {
        try {
            if (fs_1.existsSync(this.storePath)) {
                const raw = fs_1.readFileSync(this.storePath, 'utf-8');
                const parsed = JSON.parse(raw);
                if (parsed.users && parsed.fittings && parsed.fittings.length > 0) {
                    this.users.clear();
                    this.fittings.clear();
                    this.inspections.clear();
                    this.maintenanceRecords.clear();
                    this.lifecycleEvents.clear();
                    this.auditLogs = parsed.auditLogs || [];
                    parsed.users.forEach((u) => this.users.set(u.id, { ...u }));
                    parsed.fittings.forEach((f) => this.fittings.set(f.fittingId, { ...f }));
                    (parsed.inspections || []).forEach((i) => this.inspections.set(i.id, { ...i }));
                    (parsed.maintenanceRecords || []).forEach((m) => this.maintenanceRecords.set(m.id, { ...m }));
                    (parsed.lifecycleEvents || []).forEach((l) => this.lifecycleEvents.set(l.id, { ...l }));
                    console.log(`📁 [Database] Loaded ${this.fittings.size} fittings from persistent store: ${this.storePath}`);
                    return;
                }
            }
        }
        catch (err) {
            console.warn(`⚠️ [Database] Could not load persistent store (${err.message}), re-seeding initial data.`);
        }
        this.seedInMemory();
    }
    saveToStore() {
        try {
            const data = {
                version: '1.0.0',
                updatedAt: new Date().toISOString(),
                users: Array.from(this.users.values()),
                fittings: Array.from(this.fittings.values()),
                inspections: Array.from(this.inspections.values()),
                maintenanceRecords: Array.from(this.maintenanceRecords.values()),
                lifecycleEvents: Array.from(this.lifecycleEvents.values()),
                auditLogs: this.auditLogs,
            };
            const dir = path_1.dirname(this.storePath);
            if (!fs_1.existsSync(dir)) {
                fs_1.mkdirSync(dir, { recursive: true });
            }
            fs_1.writeFileSync(this.storePath, JSON.stringify(data, null, 2), 'utf-8');
        }
        catch (err) {
            console.error('❌ [Database] Failed to persist data to store:', err.message);
        }
    }
    seedInMemory() {
        this.users.clear();
        this.fittings.clear();
        this.inspections.clear();
        this.maintenanceRecords.clear();
        this.lifecycleEvents.clear();
        this.auditLogs = [];
        seed_data_js_1.initialUsers.forEach((u) => this.users.set(u.id, { ...u }));
        seed_data_js_1.initialFittings.forEach((f) => this.fittings.set(f.fittingId, { ...f }));
        seed_data_js_1.initialInspections.forEach((i) => this.inspections.set(i.id, { ...i }));
        seed_data_js_1.initialMaintenanceRecords.forEach((m) => this.maintenanceRecords.set(m.id, { ...m }));
        seed_data_js_1.initialLifecycleEvents.forEach((l) => this.lifecycleEvents.set(l.id, { ...l }));
        this.auditLogs = seed_data_js_1.initialAuditLogs.map((a) => ({ ...a }));
        this.saveToStore();
    }
    // --- Users Operations ---
    async findUserByEmailOrUsername(identifier) {
        const term = identifier.toLowerCase();
        for (const user of this.users.values()) {
            if (user.email.toLowerCase() === term || user.username.toLowerCase() === term) {
                return { ...user };
            }
        }
        return null;
    }
    async findUserById(id) {
        const user = this.users.get(id);
        return user ? { ...user } : null;
    }
    async createUser(user) {
        this.users.set(user.id, { ...user });
        this.saveToStore();
        return { ...user };
    }
    // --- Fittings Operations ---
    async getAllFittings() {
        return Array.from(this.fittings.values()).map((f) => ({ ...f }));
    }
    async findFittingById(fittingId) {
        const fitting = this.fittings.get(fittingId);
        return fitting ? { ...fitting } : null;
    }
    async findFittingByQR(qrValue) {
        const normalized = qrValue.trim().toUpperCase();
        for (const f of this.fittings.values()) {
            if (f.qrCodeValue.toUpperCase() === normalized || f.fittingId.toUpperCase() === normalized) {
                return { ...f };
            }
        }
        return null;
    }
    async createFitting(fitting) {
        this.fittings.set(fitting.fittingId, { ...fitting });
        this.saveToStore();
        return { ...fitting };
    }
    async updateFitting(fittingId, updates) {
        const existing = this.fittings.get(fittingId);
        if (!existing)
            return null;
        const updated = {
            ...existing,
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        this.fittings.set(fittingId, updated);
        this.saveToStore();
        return { ...updated };
    }
    async deleteFitting(fittingId) {
        if (!this.fittings.has(fittingId))
            return false;
        this.fittings.delete(fittingId);
        // Cascade delete related records
        for (const [id, insp] of this.inspections.entries()) {
            if (insp.fittingId === fittingId)
                this.inspections.delete(id);
        }
        for (const [id, mnt] of this.maintenanceRecords.entries()) {
            if (mnt.fittingId === fittingId)
                this.maintenanceRecords.delete(id);
        }
        for (const [id, lc] of this.lifecycleEvents.entries()) {
            if (lc.fittingId === fittingId)
                this.lifecycleEvents.delete(id);
        }
        this.saveToStore();
        return true;
    }
    // --- Inspections Operations ---
    async getInspectionsByFittingId(fittingId) {
        const results = [];
        for (const insp of this.inspections.values()) {
            if (insp.fittingId === fittingId) {
                results.push({ ...insp });
            }
        }
        return results.sort((a, b) => new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime());
    }
    async getAllInspections() {
        return Array.from(this.inspections.values()).map((i) => ({ ...i }));
    }
    async createInspection(inspection) {
        this.inspections.set(inspection.id, { ...inspection });
        this.saveToStore();
        return { ...inspection };
    }
    // --- Maintenance Operations ---
    async getMaintenanceByFittingId(fittingId) {
        const results = [];
        for (const mnt of this.maintenanceRecords.values()) {
            if (mnt.fittingId === fittingId) {
                results.push({ ...mnt });
            }
        }
        return results.sort((a, b) => new Date(b.maintenanceDate).getTime() - new Date(a.maintenanceDate).getTime());
    }
    async getAllMaintenance() {
        return Array.from(this.maintenanceRecords.values()).map((m) => ({ ...m }));
    }
    async createMaintenance(record) {
        this.maintenanceRecords.set(record.id, { ...record });
        this.saveToStore();
        return { ...record };
    }
    // --- Lifecycle Operations ---
    async getLifecycleByFittingId(fittingId) {
        const results = [];
        for (const lc of this.lifecycleEvents.values()) {
            if (lc.fittingId === fittingId) {
                results.push({ ...lc });
            }
        }
        return results.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    }
    async createLifecycleEvent(event) {
        this.lifecycleEvents.set(event.id, { ...event });
        this.saveToStore();
        return { ...event };
    }
    // --- Audit Logs Operations ---
    async getAuditLogs(limit = 50, page = 1) {
        const sorted = [...this.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const total = sorted.length;
        const start = (page - 1) * limit;
        const items = sorted.slice(start, start + limit);
        return { items, total };
    }
    async createAuditLog(entry) {
        this.auditLogs.unshift({ ...entry });
        this.saveToStore();
        return { ...entry };
    }
    // --- Search Operations ---
    async search(term) {
        const q = term.toLowerCase().trim();
        if (!q)
            return this.getAllFittings();
        return Array.from(this.fittings.values()).filter((f) => {
            return (f.fittingId.toLowerCase().includes(q) ||
                f.qrCodeValue.toLowerCase().includes(q) ||
                f.fittingType.toLowerCase().includes(q) ||
                f.manufacturer.toLowerCase().includes(q) ||
                f.batchNumber.toLowerCase().includes(q) ||
                f.railLine.toLowerCase().includes(q) ||
                f.trackSection.toLowerCase().includes(q) ||
                f.sleeperNumber.toLowerCase().includes(q) ||
                f.status.toLowerCase().includes(q) ||
                f.materialGrade.toLowerCase().includes(q));
        });
    }
}
exports.db = new DatabaseEngine();
//# sourceMappingURL=index.js.map