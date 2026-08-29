-- =============================================================================
-- RailMark AI — PostgreSQL Database Schema
-- AI-Assisted Laser QR Marking & Digital Traceability for Railway Track Fittings
-- =============================================================================
-- DISCLAIMER: Prototype database schema designed for Smart India Hackathon (SIH).
-- All data and identifiers are demonstration prototypes and not official Indian Railways data.
-- =============================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. USERS & ROLES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('ADMIN', 'INSPECTOR', 'MAINTENANCE', 'VIEWER')),
    full_name VARCHAR(128) NOT NULL,
    badge_number VARCHAR(64) NOT NULL,
    zone VARCHAR(128) DEFAULT 'Central Railway',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- -----------------------------------------------------------------------------
-- 2. FITTINGS (Master Track Fitting Registry)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fittings (
    fitting_id VARCHAR(64) PRIMARY KEY,
    fitting_type VARCHAR(128) NOT NULL,
    manufacturer VARCHAR(128) NOT NULL,
    batch_number VARCHAR(64) NOT NULL,
    manufacturing_date DATE NOT NULL,
    material_grade VARCHAR(128) NOT NULL,
    standard_spec VARCHAR(128) NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'Active' 
        CHECK (status IN ('Active', 'Inspection Due', 'Maintenance Required', 'Critical', 'Decommissioned', 'In Transit', 'Under Inspection')),
    
    -- Location & Track Details
    rail_line VARCHAR(128) NOT NULL,
    track_section VARCHAR(128) NOT NULL,
    sleeper_number VARCHAR(64) NOT NULL,
    railway_zone VARCHAR(128) DEFAULT 'Northern Railway',
    division VARCHAR(128) DEFAULT 'Delhi Division',
    km_mark VARCHAR(64) DEFAULT 'KM 142/4',
    track_type VARCHAR(64) DEFAULT 'Broad Gauge (1676mm)',
    gps_latitude DECIMAL(10, 7) NOT NULL,
    gps_longitude DECIMAL(10, 7) NOT NULL,
    
    -- Installation Details
    installed_by VARCHAR(128) NOT NULL,
    installation_date DATE NOT NULL,
    torque_spec_nm DECIMAL(6, 2) NOT NULL,
    
    -- QR Code & Laser Marking Details
    qr_code_value VARCHAR(255) NOT NULL UNIQUE,
    laser_mark_date TIMESTAMP WITH TIME ZONE NOT NULL,
    marking_machine_id VARCHAR(64) NOT NULL,
    qr_verification_status VARCHAR(32) NOT NULL DEFAULT 'Verified'
        CHECK (qr_verification_status IN ('Verified', 'Unverified', 'Degraded')),
    
    -- Inspection & Maintenance Schedules
    last_inspection_date DATE,
    next_inspection_date DATE,
    maintenance_status VARCHAR(64) DEFAULT 'Completed'
        CHECK (maintenance_status IN ('Completed', 'Scheduled', 'Overdue', 'Pending')),
    
    -- Extra Meta
    material VARCHAR(128),
    weight VARCHAR(64),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fittings_qr ON fittings(qr_code_value);
CREATE INDEX idx_fittings_status ON fittings(status);
CREATE INDEX idx_fittings_type ON fittings(fitting_type);
CREATE INDEX idx_fittings_zone ON fittings(railway_zone);
CREATE INDEX idx_fittings_line ON fittings(rail_line);

-- -----------------------------------------------------------------------------
-- 3. INSPECTIONS (Field Optical & Manual Inspections)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inspections (
    id VARCHAR(64) PRIMARY KEY,
    fitting_id VARCHAR(64) NOT NULL REFERENCES fittings(fitting_id) ON DELETE CASCADE,
    inspection_date TIMESTAMP WITH TIME ZONE NOT NULL,
    inspector VARCHAR(128) NOT NULL,
    inspector_id VARCHAR(64) NOT NULL,
    condition VARCHAR(64) NOT NULL CHECK (condition IN ('Good', 'Needs Attention', 'Maintenance Required', 'Critical')),
    qr_readability VARCHAR(32) NOT NULL CHECK (qr_readability IN ('Excellent', 'Good', 'Fair', 'Poor', 'Unreadable')),
    corrosion VARCHAR(32) NOT NULL CHECK (corrosion IN ('None', 'Mild', 'Moderate', 'Severe')),
    surface_damage VARCHAR(32) NOT NULL CHECK (surface_damage IN ('None', 'Minor', 'Moderate', 'Severe')),
    deformation VARCHAR(32) NOT NULL CHECK (deformation IN ('None', 'Minor', 'Significant', 'Critical')),
    wear VARCHAR(32) NOT NULL CHECK (wear IN ('Normal', 'Moderate', 'High', 'Excessive')),
    notes TEXT,
    
    -- AI Vision Assistance
    ai_confidence DECIMAL(5, 2),
    ai_condition VARCHAR(64),
    ai_qr_quality DECIMAL(5, 2),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inspections_fitting_id ON inspections(fitting_id);
CREATE INDEX idx_inspections_date ON inspections(inspection_date);
CREATE INDEX idx_inspections_condition ON inspections(condition);

-- -----------------------------------------------------------------------------
-- 4. MAINTENANCE RECORDS (Work Orders & Servicing)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS maintenance_records (
    id VARCHAR(64) PRIMARY KEY,
    fitting_id VARCHAR(64) NOT NULL REFERENCES fittings(fitting_id) ON DELETE CASCADE,
    maintenance_date TIMESTAMP WITH TIME ZONE NOT NULL,
    maintenance_type VARCHAR(64) NOT NULL CHECK (maintenance_type IN ('Preventive', 'Corrective', 'Emergency', 'Routine')),
    technician VARCHAR(128) NOT NULL,
    technician_id VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Completed', 'Scheduled', 'Overdue', 'Pending')),
    next_maintenance DATE,
    cost VARCHAR(64),
    parts_replaced TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_maintenance_fitting_id ON maintenance_records(fitting_id);
CREATE INDEX idx_maintenance_status ON maintenance_records(status);

-- -----------------------------------------------------------------------------
-- 5. LIFECYCLE EVENTS (Full Immutable Custody & Traceability)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lifecycle_events (
    id VARCHAR(64) PRIMARY KEY,
    fitting_id VARCHAR(64) NOT NULL REFERENCES fittings(fitting_id) ON DELETE CASCADE,
    event VARCHAR(64) NOT NULL CHECK (event IN ('Manufactured', 'Quality Checked', 'Supplied', 'Installed', 'Inspected', 'Maintained', 'QR Verified', 'Decommissioned')),
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    actor VARCHAR(128) NOT NULL,
    location VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lifecycle_fitting_id ON lifecycle_events(fitting_id);
CREATE INDEX idx_lifecycle_date ON lifecycle_events(event_date);

-- -----------------------------------------------------------------------------
-- 6. AUDIT LOGS (Security & Compliance Trail)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    action VARCHAR(64) NOT NULL,
    username VARCHAR(128) NOT NULL,
    fitting_id VARCHAR(64),
    details TEXT,
    ip_address VARCHAR(64),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_fitting ON audit_logs(fitting_id);
