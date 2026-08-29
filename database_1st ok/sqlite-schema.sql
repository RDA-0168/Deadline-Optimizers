-- =============================================================================
-- RailMark AI — SQLite Embedded Database Schema
-- AI-Assisted Laser QR Marking & Digital Traceability for Railway Track Fittings
-- =============================================================================

PRAGMA foreign_keys = ON;

-- -----------------------------------------------------------------------------
-- 1. USERS & ROLES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'INSPECTOR', 'MAINTENANCE', 'VIEWER')),
    full_name TEXT NOT NULL,
    badge_number TEXT NOT NULL,
    zone TEXT DEFAULT 'Central Railway',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. FITTINGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fittings (
    fitting_id TEXT PRIMARY KEY,
    fitting_type TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    batch_number TEXT NOT NULL,
    manufacturing_date TEXT NOT NULL,
    material_grade TEXT NOT NULL,
    standard_spec TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    rail_line TEXT NOT NULL,
    track_section TEXT NOT NULL,
    sleeper_number TEXT NOT NULL,
    railway_zone TEXT DEFAULT 'Northern Railway',
    division TEXT DEFAULT 'Delhi Division',
    km_mark TEXT DEFAULT 'KM 142/4',
    track_type TEXT DEFAULT 'Broad Gauge (1676mm)',
    gps_latitude REAL NOT NULL,
    gps_longitude REAL NOT NULL,
    installed_by TEXT NOT NULL,
    installation_date TEXT NOT NULL,
    torque_spec_nm REAL NOT NULL,
    qr_code_value TEXT NOT NULL UNIQUE,
    laser_mark_date TEXT NOT NULL,
    marking_machine_id TEXT NOT NULL,
    qr_verification_status TEXT NOT NULL DEFAULT 'Verified',
    last_inspection_date TEXT,
    next_inspection_date TEXT,
    maintenance_status TEXT DEFAULT 'Completed',
    material TEXT,
    weight TEXT,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fittings_qr ON fittings(qr_code_value);
CREATE INDEX IF NOT EXISTS idx_fittings_status ON fittings(status);
CREATE INDEX IF NOT EXISTS idx_fittings_type ON fittings(fitting_type);

-- -----------------------------------------------------------------------------
-- 3. INSPECTIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inspections (
    id TEXT PRIMARY KEY,
    fitting_id TEXT NOT NULL,
    inspection_date TEXT NOT NULL,
    inspector TEXT NOT NULL,
    inspector_id TEXT NOT NULL,
    condition TEXT NOT NULL,
    qr_readability TEXT NOT NULL,
    corrosion TEXT NOT NULL,
    surface_damage TEXT NOT NULL,
    deformation TEXT NOT NULL,
    wear TEXT NOT NULL,
    notes TEXT,
    ai_confidence REAL,
    ai_condition TEXT,
    ai_qr_quality REAL,
    image_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(fitting_id) REFERENCES fittings(fitting_id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 4. MAINTENANCE RECORDS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS maintenance_records (
    id TEXT PRIMARY KEY,
    fitting_id TEXT NOT NULL,
    maintenance_date TEXT NOT NULL,
    maintenance_type TEXT NOT NULL,
    technician TEXT NOT NULL,
    technician_id TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Scheduled',
    next_maintenance TEXT,
    cost TEXT,
    parts_replaced TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(fitting_id) REFERENCES fittings(fitting_id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 5. LIFECYCLE EVENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lifecycle_events (
    id TEXT PRIMARY KEY,
    fitting_id TEXT NOT NULL,
    event TEXT NOT NULL,
    event_date TEXT NOT NULL,
    actor TEXT NOT NULL,
    location TEXT NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(fitting_id) REFERENCES fittings(fitting_id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 6. AUDIT LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    username TEXT NOT NULL,
    fitting_id TEXT,
    details TEXT,
    ip_address TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);
