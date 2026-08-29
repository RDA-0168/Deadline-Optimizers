-- =============================================================================
-- RailMark AI — Demo Seed Dataset
-- AI-Assisted Laser QR Marking & Digital Traceability for Railway Track Fittings
-- =============================================================================
-- DISCLAIMER: All records below are simulated prototype demo data.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Demo Users
-- Passwords:
-- admin@railmark.demo -> admin123 (or Admin@123 for admin@railmark.ai)
-- inspector@railmark.demo -> demo123 (or Inspector@123 for inspector@railmark.ai)
-- maintenance@railmark.demo -> demo123 (or Maintenance@123 for maintenance@railmark.ai)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, username, email, password_hash, role, full_name, badge_number, zone) VALUES
('USR-001', 'admin', 'admin@railmark.demo', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/Y5p2h2H6j0a1xKzW6kXzK5E6v7G6', 'ADMIN', 'Rajesh Sharma (Admin)', 'RM-ADM-8801', 'Central Railway'),
('USR-002', 'inspector', 'inspector@railmark.demo', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/Y5p2h2H6j0a1xKzW6kXzK5E6v7G6', 'INSPECTOR', 'Ananya Verma (Senior Inspector)', 'RM-INS-4421', 'Northern Railway'),
('USR-003', 'maintenance', 'maintenance@railmark.demo', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/Y5p2h2H6j0a1xKzW6kXzK5E6v7G6', 'MAINTENANCE', 'Vikram Singh (Track Maintenance Lead)', 'RM-MNT-9932', 'Western Railway')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Demo Master Fittings
-- -----------------------------------------------------------------------------
INSERT INTO fittings (
    fitting_id, fitting_type, manufacturer, batch_number, manufacturing_date, material_grade, standard_spec,
    status, rail_line, track_section, sleeper_number, railway_zone, division, km_mark, track_type,
    gps_latitude, gps_longitude, installed_by, installation_date, torque_spec_nm,
    qr_code_value, laser_mark_date, marking_machine_id, qr_verification_status,
    last_inspection_date, next_inspection_date, maintenance_status, material, weight, description
) VALUES
('RM-FIT-0001', 'Elastic Rail Clip (ERC MK-III)', 'Demo Manufacturer A', 'BATCH-2026-001', '2026-01-10', 'Spring Steel 55Si7', 'IRS:T-31-2021',
 'Active', 'Northern High-Density Corridor', 'Section KM 142/4 - Up Main Line', 'PSC-SLP-4401', 'Northern Railway', 'Delhi Division', 'KM 142/4', 'Broad Gauge (1676mm)',
 28.613939, 77.209021, 'Track Maintenance Gang #4', '2026-01-25', 110.0,
 'RM-FIT-0001', '2026-01-12 10:15:00+00', 'LASER-ENG-MARK-04', 'Verified',
 '2026-02-15', '2026-05-15', 'Completed', 'Spring Steel', '0.92 kg', 'Standard elastic rail clip designed for 60kg rail on PSC sleepers.'),

('RM-FIT-0002', 'Elastic Rail Clip (ERC MK-V)', 'SteelTech Track Systems', 'BATCH-2026-002', '2026-01-14', 'Spring Steel 60Si7', 'RDSO/T-3701',
 'Active', 'Western Freight Route', 'Section KM 88/2 - Down Loop', 'PSC-SLP-8820', 'Western Railway', 'Mumbai Division', 'KM 88/2', 'Dedicated Freight Corridor',
 19.076090, 72.877426, 'Special Track Installation Team B', '2026-02-01', 120.0,
 'RM-FIT-0002', '2026-01-15 11:00:00+00', 'LASER-ENG-MARK-02', 'Verified',
 '2026-02-20', '2026-05-20', 'Completed', 'Heavy Spring Steel', '1.05 kg', 'Heavy axle load fastening clip for high-density freight.'),

('RM-FIT-0003', 'GFN-66 Insulating Liner', 'RailPolymer Industries', 'BATCH-2026-003', '2026-01-18', 'Glass Filled Nylon 66 (33% GF)', 'IRS:T-44-2020',
 'Active', 'Central Express Corridor', 'Section KM 310/1 - Up Fast Line', 'PSC-SLP-1044', 'Central Railway', 'Nagpur Division', 'KM 310/1', 'Broad Gauge (1676mm)',
 21.145800, 79.088200, 'Central Division Track Squad', '2026-02-05', 85.0,
 'RM-FIT-0003', '2026-01-19 09:30:00+00', 'LASER-ENG-MARK-01', 'Verified',
 '2026-02-22', '2026-05-22', 'Completed', 'GFN-66 Polymer', '0.18 kg', 'Electrical track circuit insulation liner.'),

('RM-FIT-0004', 'Metal Liner (60kg)', 'Apex Railway Fasteners', 'BATCH-2026-004', '2026-01-20', 'Structural Steel E250', 'IRS:T-46-2022',
 'Maintenance Required', 'Southern Coastal Line', 'Section KM 52/8 - Platform Loop #2', 'PSC-SLP-2210', 'Southern Railway', 'Chennai Division', 'KM 52/8', 'Broad Gauge (1676mm)',
 13.082680, 80.270721, 'Southern Track Services Ltd.', '2026-02-10', 95.0,
 'RM-FIT-0004', '2026-01-21 14:00:00+00', 'LASER-ENG-MARK-03', 'Verified',
 '2026-02-24', '2026-03-10', 'Scheduled', 'E250 Structural Steel', '0.45 kg', 'High tensile metal liner for load distribution.'),

('RM-FIT-0005', 'Grooved Rubber Sole Plate (GRSP 6mm)', 'ElastoRail Rubber Works', 'BATCH-2026-005', '2026-01-22', 'Natural Rubber Composite', 'IRS:T-47-2021',
 'Inspection Due', 'Eastern Trunk Route', 'Section KM 205/3 - Down Main Line', 'PSC-SLP-5532', 'Eastern Railway', 'Howrah Division', 'KM 205/3', 'Broad Gauge (1676mm)',
 22.572645, 88.363892, 'Eastern Engineering Division', '2026-02-12', 0.0,
 'RM-FIT-0005', '2026-01-23 16:45:00+00', 'LASER-ENG-MARK-05', 'Verified',
 '2026-01-23', '2026-02-28', 'Completed', 'Composite Elastomer', '0.35 kg', 'High resilience vibration damping sole plate.');

-- -----------------------------------------------------------------------------
-- Demo Inspections
-- -----------------------------------------------------------------------------
INSERT INTO inspections (id, fitting_id, inspection_date, inspector, inspector_id, condition, qr_readability, corrosion, surface_damage, deformation, wear, notes, ai_confidence, ai_condition, ai_qr_quality) VALUES
('INSP-001', 'RM-FIT-0001', '2026-02-15 08:30:00+00', 'Ananya Verma', 'RM-INS-4421', 'Good', 'Excellent', 'None', 'None', 'None', 'Normal', 'Clip seated perfectly in sleeper insert. Toe load test within RDSO limits.', 98.5, 'Good', 98.0),
('INSP-002', 'RM-FIT-0002', '2026-02-20 09:15:00+00', 'Ananya Verma', 'RM-INS-4421', 'Good', 'Excellent', 'None', 'None', 'None', 'Normal', 'Routine initial post-installation track inspection. QR laser contrast 96%.', 97.0, 'Good', 96.0),
('INSP-003', 'RM-FIT-0004', '2026-02-24 11:00:00+00', 'Ananya Verma', 'RM-INS-4421', 'Maintenance Required', 'Fair', 'Moderate', 'Minor', 'None', 'Moderate', 'Corrosion accelerated due to coastal humidity. Recommended anti-corrosion spray & realignment.', 91.0, 'Maintenance Required', 75.0);

-- -----------------------------------------------------------------------------
-- Demo Maintenance Records
-- -----------------------------------------------------------------------------
INSERT INTO maintenance_records (id, fitting_id, maintenance_date, maintenance_type, technician, technician_id, description, status, next_maintenance, cost) VALUES
('MAINT-001', 'RM-FIT-0004', '2026-02-26 14:00:00+00', 'Corrective', 'Vikram Singh', 'RM-MNT-9932', 'Cleaned rust with wire brush, applied RDSO approved zinc chromate primer, re-torqued clip to 105 Nm.', 'Completed', '2026-05-26', '₹ 450');

-- -----------------------------------------------------------------------------
-- Demo Lifecycle Events
-- -----------------------------------------------------------------------------
INSERT INTO lifecycle_events (id, fitting_id, event, event_date, actor, location, notes) VALUES
('LC-001-1', 'RM-FIT-0001', 'Manufactured', '2026-01-10 08:00:00+00', 'Demo Manufacturer A', 'Plant #2, Ghaziabad', 'Batch BATCH-2026-001 produced under RDSO quality supervision.'),
('LC-001-2', 'RM-FIT-0001', 'Quality Checked', '2026-01-11 10:30:00+00', 'QC Inspector K. Das', 'Testing Bay 4', 'Toe load test passed (1020 kgf). Hardness test passed (44 HRC).'),
('LC-001-3', 'RM-FIT-0001', 'QR Verified', '2026-01-12 10:15:00+00', 'Laser Operator #3', 'Marking Station 4', 'Direct Part Marking (DPM) fiber laser engraving 50W completed. ISO/IEC 15415 Grade A.'),
('LC-001-4', 'RM-FIT-0001', 'Supplied', '2026-01-18 12:00:00+00', 'Logistics Hub North', 'Northern Railway Depot, Delhi', 'Dispatched in lot of 5,000 units via container wagon.'),
('LC-001-5', 'RM-FIT-0001', 'Installed', '2026-01-25 14:00:00+00', 'Track Gang #4', 'Section KM 142/4 Up Main Line', 'Installed on PSC sleeper #4401 with 110 Nm torque.');

-- -----------------------------------------------------------------------------
-- Demo Audit Logs
-- -----------------------------------------------------------------------------
INSERT INTO audit_logs (id, action, username, fitting_id, details, ip_address, timestamp) VALUES
('AUD-001', 'SYSTEM_INIT', 'system', NULL, 'RailMark AI digital traceability platform initialized.', '127.0.0.1', '2026-01-10 00:00:00+00'),
('AUD-002', 'USER_LOGIN', 'admin', NULL, 'Admin user logged into RailMark control center.', '192.168.1.100', '2026-02-28 08:00:00+00');
