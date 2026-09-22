-- =============================================================================
-- Migration: 0_init
-- RailMark AI — PostgreSQL Initial Migration
-- =============================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'INSPECTOR', 'MAINTENANCE', 'VIEWER');
CREATE TYPE "FittingStatus" AS ENUM ('Active', 'InspectionDue', 'MaintenanceRequired', 'Critical', 'Decommissioned', 'InTransit', 'UnderInspection');
CREATE TYPE "ConditionStatus" AS ENUM ('Good', 'NeedsAttention', 'MaintenanceRequired', 'Critical');
CREATE TYPE "QRReadability" AS ENUM ('Excellent', 'Good', 'Fair', 'Poor', 'Unreadable');
CREATE TYPE "QRVerificationStatus" AS ENUM ('Verified', 'Unverified', 'Degraded');
CREATE TYPE "MaintenanceType" AS ENUM ('Preventive', 'Corrective', 'Emergency', 'Routine');
CREATE TYPE "MaintenanceStatus" AS ENUM ('Completed', 'Scheduled', 'Overdue', 'Pending');
CREATE TYPE "LifecycleEventType" AS ENUM ('Manufactured', 'QualityChecked', 'Supplied', 'Installed', 'Inspected', 'Maintained', 'QRVerified', 'Decommissioned');
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'SCAN_BLOB');

-- 1. Railway Zones Table
CREATE TABLE "railway_zones" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(16) NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "headquarters" VARCHAR(128) NOT NULL,
    "divisions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "railway_zones_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "railway_zones_code_key" ON "railway_zones"("code");
CREATE UNIQUE INDEX "railway_zones_name_key" ON "railway_zones"("name");

-- 2. Users Table
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'INSPECTOR',
    "full_name" VARCHAR(128) NOT NULL,
    "badge_number" VARCHAR(64) NOT NULL,
    "zone_id" TEXT,
    "zone_name" VARCHAR(128) DEFAULT 'Central Railway',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");

-- 3. Fittings Table
CREATE TABLE "fittings" (
    "id" VARCHAR(64) NOT NULL,
    "qr_code_value" VARCHAR(255) NOT NULL,
    "fitting_type" VARCHAR(128) NOT NULL,
    "manufacturer" VARCHAR(128) NOT NULL,
    "batch_number" VARCHAR(64) NOT NULL,
    "manufacturing_date" DATE NOT NULL,
    "material_grade" VARCHAR(128) NOT NULL,
    "standard_spec" VARCHAR(128) NOT NULL,
    "status" "FittingStatus" NOT NULL DEFAULT 'Active',
    "rail_line" VARCHAR(128) NOT NULL,
    "track_section" VARCHAR(128) NOT NULL,
    "sleeper_number" VARCHAR(64) NOT NULL,
    "railway_zone_id" TEXT,
    "railway_zone_name" VARCHAR(128) NOT NULL DEFAULT 'Northern Railway',
    "division" VARCHAR(128) NOT NULL DEFAULT 'Delhi Division',
    "km_mark" VARCHAR(64) NOT NULL DEFAULT 'KM 142/4',
    "track_type" VARCHAR(64) NOT NULL DEFAULT 'Broad Gauge (1676mm)',
    "gps_latitude" DECIMAL(10,7) NOT NULL,
    "gps_longitude" DECIMAL(10,7) NOT NULL,
    "installed_by" VARCHAR(128) NOT NULL,
    "installation_date" DATE NOT NULL,
    "torque_spec_nm" DECIMAL(6,2) NOT NULL,
    "laser_mark_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "marking_machine_id" VARCHAR(64) NOT NULL DEFAULT 'LM-RDSO-04',
    "qr_verification_status" "QRVerificationStatus" NOT NULL DEFAULT 'Verified',
    "last_inspection_date" DATE,
    "next_inspection_date" DATE,
    "maintenance_status" "MaintenanceStatus" NOT NULL DEFAULT 'Completed',
    "material" VARCHAR(128),
    "weight" VARCHAR(64),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fittings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "fittings_qr_code_value_key" ON "fittings"("qr_code_value");
CREATE INDEX "fittings_qr_code_value_idx" ON "fittings"("qr_code_value");
CREATE INDEX "fittings_status_idx" ON "fittings"("status");
CREATE INDEX "fittings_fitting_type_idx" ON "fittings"("fitting_type");
CREATE INDEX "fittings_railway_zone_name_idx" ON "fittings"("railway_zone_name");
CREATE INDEX "fittings_rail_line_idx" ON "fittings"("rail_line");

-- 4. Inspections Table
CREATE TABLE "inspections" (
    "id" VARCHAR(64) NOT NULL,
    "fitting_id" VARCHAR(64) NOT NULL,
    "inspection_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inspector" VARCHAR(128) NOT NULL,
    "inspector_id" VARCHAR(64) NOT NULL,
    "condition" "ConditionStatus" NOT NULL DEFAULT 'Good',
    "qr_readability" "QRReadability" NOT NULL DEFAULT 'Good',
    "corrosion" VARCHAR(32) NOT NULL DEFAULT 'None',
    "surface_damage" VARCHAR(32) NOT NULL DEFAULT 'None',
    "deformation" VARCHAR(32) NOT NULL DEFAULT 'None',
    "wear" VARCHAR(32) NOT NULL DEFAULT 'Normal',
    "notes" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inspections_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "inspections_fitting_id_idx" ON "inspections"("fitting_id");
CREATE INDEX "inspections_inspection_date_idx" ON "inspections"("inspection_date");
CREATE INDEX "inspections_condition_idx" ON "inspections"("condition");

-- 5. AI Assessments Table
CREATE TABLE "ai_assessments" (
    "id" VARCHAR(64) NOT NULL,
    "inspection_id" VARCHAR(64),
    "fitting_id" VARCHAR(64) NOT NULL,
    "confidence" DECIMAL(5,2) NOT NULL DEFAULT 95.0,
    "condition_assessment" "ConditionStatus" NOT NULL DEFAULT 'Good',
    "qr_quality" DECIMAL(5,2) NOT NULL DEFAULT 92.0,
    "defect_detected" BOOLEAN NOT NULL DEFAULT false,
    "defect_type" VARCHAR(128),
    "recommendation" TEXT,
    "image_url" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_assessments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ai_assessments_inspection_id_key" ON "ai_assessments"("inspection_id");
CREATE INDEX "ai_assessments_fitting_id_idx" ON "ai_assessments"("fitting_id");
CREATE INDEX "ai_assessments_inspection_id_idx" ON "ai_assessments"("inspection_id");

-- 6. Lifecycle Events Table (Strictly Append-Only)
CREATE TABLE "lifecycle_events" (
    "id" VARCHAR(64) NOT NULL,
    "fitting_id" VARCHAR(64) NOT NULL,
    "event" "LifecycleEventType" NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor" VARCHAR(128) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "notes" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lifecycle_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "lifecycle_events_fitting_id_idx" ON "lifecycle_events"("fitting_id");
CREATE INDEX "lifecycle_events_event_date_idx" ON "lifecycle_events"("event_date");

-- 7. Maintenance Records Table
CREATE TABLE "maintenance_records" (
    "id" VARCHAR(64) NOT NULL,
    "fitting_id" VARCHAR(64) NOT NULL,
    "maintenance_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maintenance_type" "MaintenanceType" NOT NULL DEFAULT 'Preventive',
    "technician" VARCHAR(128) NOT NULL,
    "technician_id" VARCHAR(64) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'Completed',
    "next_maintenance" DATE,
    "cost" VARCHAR(64),
    "parts_replaced" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_records_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "maintenance_records_fitting_id_idx" ON "maintenance_records"("fitting_id");
CREATE INDEX "maintenance_records_status_idx" ON "maintenance_records"("status");

-- 8. Media Metadata Table
CREATE TABLE "media_metadata" (
    "id" VARCHAR(64) NOT NULL,
    "fitting_id" VARCHAR(64),
    "inspection_id" VARCHAR(64),
    "media_type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "file_name" VARCHAR(255) NOT NULL,
    "url" TEXT NOT NULL,
    "mime_type" VARCHAR(64) NOT NULL DEFAULT 'image/jpeg',
    "file_size" INTEGER,
    "uploaded_by" VARCHAR(128) NOT NULL DEFAULT 'Inspector',
    "hash_sha256" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_metadata_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "media_metadata_fitting_id_idx" ON "media_metadata"("fitting_id");
CREATE INDEX "media_metadata_inspection_id_idx" ON "media_metadata"("inspection_id");

-- 9. Audit Logs Table
CREATE TABLE "audit_logs" (
    "id" VARCHAR(64) NOT NULL,
    "action" VARCHAR(64) NOT NULL,
    "username" VARCHAR(128) NOT NULL,
    "fitting_id" VARCHAR(64),
    "details" TEXT,
    "ip_address" VARCHAR(64),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");
CREATE INDEX "audit_logs_fitting_id_idx" ON "audit_logs"("fitting_id");

-- Foreign Key Constraints
ALTER TABLE "users" ADD CONSTRAINT "users_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "railway_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "fittings" ADD CONSTRAINT "fittings_railway_zone_id_fkey" FOREIGN KEY ("railway_zone_id") REFERENCES "railway_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_fitting_id_fkey" FOREIGN KEY ("fitting_id") REFERENCES "fittings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_assessments" ADD CONSTRAINT "ai_assessments_inspection_id_fkey" FOREIGN KEY ("inspection_id") REFERENCES "inspections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_assessments" ADD CONSTRAINT "ai_assessments_fitting_id_fkey" FOREIGN KEY ("fitting_id") REFERENCES "fittings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lifecycle_events" ADD CONSTRAINT "lifecycle_events_fitting_id_fkey" FOREIGN KEY ("fitting_id") REFERENCES "fittings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_fitting_id_fkey" FOREIGN KEY ("fitting_id") REFERENCES "fittings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "media_metadata" ADD CONSTRAINT "media_metadata_fitting_id_fkey" FOREIGN KEY ("fitting_id") REFERENCES "fittings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "media_metadata" ADD CONSTRAINT "media_metadata_inspection_id_fkey" FOREIGN KEY ("inspection_id") REFERENCES "inspections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
