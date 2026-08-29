// ============================================================
// RAILMARK AI — Type Definitions
// ============================================================

export type FittingStatus = 'Active' | 'Inspection Due' | 'Maintenance Required' | 'Decommissioned' | 'In Transit';
export type ConditionStatus = 'Good' | 'Needs Attention' | 'Maintenance Required' | 'Critical';
export type MaintenanceStatus = 'Completed' | 'Scheduled' | 'Overdue' | 'Pending';
export type LifecycleEvent = 'Manufactured' | 'Quality Checked' | 'Supplied' | 'Installed' | 'Inspected' | 'Maintained' | 'QR Verified' | 'Decommissioned';

export interface Fitting {
  id: string;              // e.g. RM-FIT-0001
  qrId: string;            // QR code value
  fittingType: string;
  manufacturer: string;
  batchNumber: string;
  manufacturingDate: string;
  installationDate: string;
  location: string;
  railwayZone: string;
  division: string;
  section: string;
  kmMark: string;
  trackType: string;
  status: FittingStatus;
  lastInspection: string;
  nextInspection: string;
  maintenanceStatus: MaintenanceStatus;
  description?: string;
  material?: string;
  weight?: string;
  standardSpec?: string;
}

export interface InspectionRecord {
  id: string;
  fittingId: string;
  inspectionDate: string;
  inspector: string;
  inspectorId: string;
  condition: ConditionStatus;
  qrReadability: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Unreadable';
  corrosion: 'None' | 'Mild' | 'Moderate' | 'Severe';
  surfaceDamage: 'None' | 'Minor' | 'Moderate' | 'Severe';
  deformation: 'None' | 'Minor' | 'Significant' | 'Critical';
  wear: 'Normal' | 'Moderate' | 'High' | 'Excessive';
  notes: string;
  aiConfidence?: number;
  aiCondition?: ConditionStatus;
  aiQrQuality?: number;
  images?: string[];
}

export interface MaintenanceRecord {
  id: string;
  fittingId: string;
  maintenanceDate: string;
  maintenanceType: 'Preventive' | 'Corrective' | 'Emergency' | 'Routine';
  technician: string;
  technicianId: string;
  description: string;
  status: MaintenanceStatus;
  nextMaintenance: string;
  cost?: string;
  partsReplaced?: string[];
}

export interface LifecycleEntry {
  id: string;
  fittingId: string;
  event: LifecycleEvent;
  date: string;
  actor: string;
  location: string;
  notes: string;
}

export interface DashboardStats {
  totalFittings: number;
  activeFittings: number;
  inspectedThisMonth: number;
  maintenanceDue: number;
  pendingInspection: number;
  recentlyScanned: number;
  qrVerificationRate: number;
  fittingsByType: { name: string; value: number }[];
  inspectionStatus: { name: string; value: number }[];
  maintenanceStatus: { name: string; value: number }[];
  fittingsByZone: { zone: string; count: number }[];
  monthlyInspections: { month: string; inspected: number; due: number }[];
}

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Inspector' | 'Technician' | 'Viewer';
  email: string;
  zone: string;
  badgeId: string;
}
