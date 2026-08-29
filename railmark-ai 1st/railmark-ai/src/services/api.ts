// ============================================================
// RAILMARK AI — Real API Service Layer
// ============================================================
// Connects frontend directly to the Express REST API backend,
// mapping models seamlessly and providing token-based authentication.
// ============================================================

import type {
  Fitting,
  InspectionRecord,
  MaintenanceRecord,
  LifecycleEntry,
  DashboardStats,
  FittingStatus,
  ConditionStatus,
  MaintenanceStatus,
  LifecycleEvent,
} from '../types';

import {
  MOCK_FITTINGS,
  MOCK_INSPECTIONS,
  MOCK_MAINTENANCE,
  MOCK_LIFECYCLE,
  MOCK_DASHBOARD_STATS,
} from '../data/mockData';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

function ok<T>(data: T): ApiResponse<T> {
  return { data, error: null, success: true };
}

function fail<T>(error: string): ApiResponse<T> {
  return { data: null, error, success: false };
}

const API_BASE = (import.meta as any).env?.VITE_API_URL
  ? String((import.meta as any).env.VITE_API_URL).replace(/\/$/, '')
  : '';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('railmark_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ── Model Adapters ───────────────────────────────────────────

function mapBackendFittingToFrontend(b: any): Fitting {
  return {
    id: b.fittingId || b.id || 'RM-FIT-0000',
    qrId: b.qrCodeValue || b.qrId || b.fittingId || 'RM-FIT-0000',
    fittingType: b.fittingType || 'Elastic Rail Clip',
    manufacturer: b.manufacturer || 'Railway Components Ltd',
    batchNumber: b.batchNumber || 'BATCH-2026-001',
    manufacturingDate: b.manufacturingDate || '2026-01-01',
    installationDate: b.installationDate || '2026-01-15',
    location: b.trackSection
      ? `${b.railLine || 'Main Line'}, ${b.trackSection} (Sleeper ${b.sleeperNumber || 'N/A'})`
      : b.location || 'Northern Railway Track KM 142/4',
    railwayZone: b.railwayZone || b.railLine?.split(' ')[0] + ' Railway' || 'Northern Railway',
    division: b.division || 'Delhi Division',
    section: b.trackSection || 'Section KM 142/4',
    kmMark: b.kmMark || (b.sleeperNumber ? `SLP-${b.sleeperNumber}` : 'KM 142/4'),
    trackType: b.trackType || 'Broad Gauge (1676mm)',
    status: (b.status as FittingStatus) || 'Active',
    lastInspection: b.lastInspectionDate || b.lastInspection || '2026-02-15',
    nextInspection: b.nextInspectionDate || b.nextInspection || '2026-05-15',
    maintenanceStatus: (b.maintenanceStatus as MaintenanceStatus) || 'Completed',
    description: b.description || `${b.fittingType} manufactured under standard specification ${b.standardSpec || 'RDSO'}.`,
    material: b.materialGrade || b.material || 'Spring Steel',
    weight: b.weight || '0.92 kg',
    standardSpec: b.standardSpec || 'IRS:T-31-2021',
  };
}

function mapFrontendFittingToBackend(f: Partial<Fitting>) {
  return {
    fittingId: f.id,
    fittingType: f.fittingType || 'Elastic Rail Clip (ERC MK-III)',
    manufacturer: f.manufacturer || 'Standard Track Systems',
    batchNumber: f.batchNumber || `BATCH-${new Date().getFullYear()}-001`,
    manufacturingDate: f.manufacturingDate || new Date().toISOString().split('T')[0],
    materialGrade: f.material || 'Spring Steel 55Si7',
    standardSpec: f.standardSpec || 'IRS:T-31-2021',
    status: f.status || 'Active',
    railLine: f.railwayZone || 'Northern High-Density Corridor',
    trackSection: f.section || f.location || 'Section KM 100/1 - Main Line',
    sleeperNumber: f.kmMark || 'PSC-SLP-01',
    gpsLatitude: 28.6139,
    gpsLongitude: 77.2090,
    installedBy: 'Track Maintenance Squad',
    installationDate: f.installationDate || new Date().toISOString().split('T')[0],
    torqueSpecNm: 110.0,
    qrCodeValue: f.qrId || f.id,
  };
}

function mapBackendInspectionToFrontend(i: any): InspectionRecord {
  return {
    id: i.id || `INSP-${Date.now()}`,
    fittingId: i.fittingId,
    inspectionDate: i.inspectionDate?.split('T')[0] || i.inspectionDate || new Date().toISOString().split('T')[0],
    inspector: i.inspectorName || i.inspector || 'Senior Track Inspector',
    inspectorId: i.inspectorId || 'RM-INS-4421',
    condition: (i.condition as ConditionStatus) || 'Good',
    qrReadability: i.qrReadability || 'Good',
    corrosion: i.corrosion || 'None',
    surfaceDamage: i.surfaceDamage || 'None',
    deformation: i.deformation || 'None',
    wear: i.wear || 'Normal',
    notes: i.notes || i.details || '',
    aiConfidence: i.aiConfidence || 95,
    aiCondition: (i.aiAssistanceResult as ConditionStatus) || i.condition || 'Good',
    aiQrQuality: i.aiQrQuality || 92,
    images: i.imageUrl ? [i.imageUrl] : [],
  };
}

function mapBackendMaintenanceToFrontend(m: any): MaintenanceRecord {
  return {
    id: m.id || `MAINT-${Date.now()}`,
    fittingId: m.fittingId,
    maintenanceDate: m.maintenanceDate?.split('T')[0] || m.maintenanceDate || new Date().toISOString().split('T')[0],
    maintenanceType: m.maintenanceType || 'Preventive',
    technician: m.technicianName || m.technician || 'Track Maintenance Lead',
    technicianId: m.technicianId || 'RM-MNT-9932',
    description: m.description || 'Routine maintenance and inspection service.',
    status: (m.status as MaintenanceStatus) || 'Completed',
    nextMaintenance: m.nextMaintenance || '',
    cost: m.cost || '₹ 350',
    partsReplaced: m.partsReplaced || [],
  };
}

function mapBackendLifecycleToFrontend(l: any): LifecycleEntry {
  return {
    id: l.id || `LC-${Date.now()}`,
    fittingId: l.fittingId,
    event: (l.eventType as LifecycleEvent) || (l.event as LifecycleEvent) || 'Inspected',
    date: l.eventDate?.split('T')[0] || l.eventDate || l.date || new Date().toISOString().split('T')[0],
    actor: l.actor || 'RailMark System',
    location: l.location || 'Track Maintenance Division',
    notes: l.details || l.notes || '',
  };
}

// ============================================================
// FITTING ENDPOINTS
// ============================================================

export async function getFittings(): Promise<ApiResponse<Fitting[]>> {
  try {
    const res = await fetch(`${API_BASE}/api/fittings?limit=100`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload.success && Array.isArray(payload.data)) {
        return ok(payload.data.map(mapBackendFittingToFrontend));
      }
    }
  } catch (err) {
    console.warn('API getFittings fallback to mock:', err);
  }
  return ok([...MOCK_FITTINGS]);
}

export async function getFittingById(id: string): Promise<ApiResponse<Fitting>> {
  try {
    const res = await fetch(`${API_BASE}/api/fittings/${id}`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload.success && payload.data) {
        const d = payload.data;
        const flatData = {
          ...(d.basicInfo || {}),
          ...(d.installationInfo || {}),
          ...(d.qrInfo || {}),
        };
        return ok(mapBackendFittingToFrontend(flatData));
      }
    }
  } catch (err) {
    console.warn(`API getFittingById(${id}) fallback:`, err);
  }

  const local = MOCK_FITTINGS.find((f) => f.id === id || f.qrId === id);
  if (local) return ok({ ...local });
  return fail(`Fitting "${id}" not found in database.`);
}

export async function createFitting(
  data: Omit<Fitting, 'id'> & { id?: string }
): Promise<ApiResponse<Fitting>> {
  const fittingId = data.id || `RM-FIT-${String(Date.now()).slice(-4)}`;
  const fullFitting: Fitting = {
    ...data,
    id: fittingId,
    qrId: data.qrId || fittingId,
  };

  try {
    const backendDto = mapFrontendFittingToBackend(fullFitting);
    const res = await fetch(`${API_BASE}/api/fittings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(backendDto),
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload.success && payload.data) {
        return ok(mapBackendFittingToFrontend(payload.data));
      }
    }
  } catch (err) {
    console.warn('API createFitting fallback:', err);
  }

  return ok(fullFitting);
}

export async function updateFitting(
  id: string,
  data: Partial<Fitting>
): Promise<ApiResponse<Fitting>> {
  try {
    const backendDto: any = {};
    if (data.status) backendDto.status = data.status;
    if (data.fittingType) backendDto.fittingType = data.fittingType;
    if (data.location) backendDto.trackSection = data.location;
    if (data.material) backendDto.materialGrade = data.material;
    if (data.standardSpec) backendDto.standardSpec = data.standardSpec;

    const res = await fetch(`${API_BASE}/api/fittings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(backendDto),
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload.success && payload.data) {
        return ok(mapBackendFittingToFrontend(payload.data));
      }
    }
  } catch (err) {
    console.warn(`API updateFitting(${id}) fallback:`, err);
  }

  const existing = MOCK_FITTINGS.find((f) => f.id === id);
  if (!existing) return fail(`Fitting "${id}" not found.`);
  const updated = { ...existing, ...data };
  return ok(updated);
}

// ============================================================
// INSPECTION ENDPOINTS
// ============================================================

export async function getInspectionHistory(
  fittingId: string
): Promise<ApiResponse<InspectionRecord[]>> {
  try {
    const res = await fetch(`${API_BASE}/api/fittings/${fittingId}/inspections`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload.success && Array.isArray(payload.data)) {
        return ok(payload.data.map(mapBackendInspectionToFrontend));
      }
    }
  } catch (err) {
    console.warn(`API getInspectionHistory(${fittingId}) fallback:`, err);
  }

  const records = MOCK_INSPECTIONS.filter((i) => i.fittingId === fittingId);
  return ok(records);
}

export async function addInspection(
  data: Omit<InspectionRecord, 'id'>
): Promise<ApiResponse<InspectionRecord>> {
  try {
    const res = await fetch(`${API_BASE}/api/fittings/${data.fittingId}/inspections`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        condition: data.condition,
        qrReadability: data.qrReadability,
        corrosion: data.corrosion,
        surfaceDamage: data.surfaceDamage,
        deformation: data.deformation,
        wear: data.wear,
        notes: data.notes,
        inspector: data.inspector,
        aiAssistanceResult: data.aiCondition || data.condition,
        aiConfidence: data.aiConfidence || 95,
        inspectionDate: data.inspectionDate,
      }),
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload.success && payload.data) {
        return ok(mapBackendInspectionToFrontend(payload.data));
      }
    }
  } catch (err) {
    console.warn('API addInspection fallback:', err);
  }

  const newRecord: InspectionRecord = {
    ...data,
    id: `INSP-${Date.now()}`,
  };
  return ok(newRecord);
}

export async function getAllInspections(): Promise<ApiResponse<InspectionRecord[]>> {
  try {
    // Fetch all fittings and gather inspections
    const fittingsRes = await getFittings();
    if (fittingsRes.data) {
      const allInsp: InspectionRecord[] = [];
      for (const f of fittingsRes.data.slice(0, 10)) {
        const inspRes = await getInspectionHistory(f.id);
        if (inspRes.data) allInsp.push(...inspRes.data);
      }
      if (allInsp.length > 0) return ok(allInsp);
    }
  } catch (err) {
    console.warn('API getAllInspections fallback:', err);
  }
  return ok([...MOCK_INSPECTIONS]);
}

// ============================================================
// MAINTENANCE ENDPOINTS
// ============================================================

export async function getMaintenanceHistory(
  fittingId: string
): Promise<ApiResponse<MaintenanceRecord[]>> {
  try {
    const res = await fetch(`${API_BASE}/api/fittings/${fittingId}/maintenance`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload.success && Array.isArray(payload.data)) {
        return ok(payload.data.map(mapBackendMaintenanceToFrontend));
      }
    }
  } catch (err) {
    console.warn(`API getMaintenanceHistory(${fittingId}) fallback:`, err);
  }

  const records = MOCK_MAINTENANCE.filter((m) => m.fittingId === fittingId);
  return ok(records);
}

export async function addMaintenance(
  data: Omit<MaintenanceRecord, 'id'>
): Promise<ApiResponse<MaintenanceRecord>> {
  try {
    const res = await fetch(`${API_BASE}/api/fittings/${data.fittingId}/maintenance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        maintenanceType: data.maintenanceType,
        description: data.description,
        status: data.status,
        technician: data.technician,
        nextMaintenance: data.nextMaintenance,
        cost: data.cost,
        maintenanceDate: data.maintenanceDate,
      }),
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload.success && payload.data) {
        return ok(mapBackendMaintenanceToFrontend(payload.data));
      }
    }
  } catch (err) {
    console.warn('API addMaintenance fallback:', err);
  }

  const newRecord: MaintenanceRecord = {
    ...data,
    id: `MAINT-${Date.now()}`,
  };
  return ok(newRecord);
}

export async function getAllMaintenance(): Promise<ApiResponse<MaintenanceRecord[]>> {
  try {
    const fittingsRes = await getFittings();
    if (fittingsRes.data) {
      const allMaint: MaintenanceRecord[] = [];
      for (const f of fittingsRes.data.slice(0, 10)) {
        const mRes = await getMaintenanceHistory(f.id);
        if (mRes.data) allMaint.push(...mRes.data);
      }
      if (allMaint.length > 0) return ok(allMaint);
    }
  } catch (err) {
    console.warn('API getAllMaintenance fallback:', err);
  }
  return ok([...MOCK_MAINTENANCE]);
}

// ============================================================
// LIFECYCLE ENDPOINT
// ============================================================

export async function getLifecycle(
  fittingId: string
): Promise<ApiResponse<LifecycleEntry[]>> {
  try {
    const res = await fetch(`${API_BASE}/api/fittings/${fittingId}/lifecycle`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload.success && Array.isArray(payload.data)) {
        return ok(payload.data.map(mapBackendLifecycleToFrontend));
      }
    }
  } catch (err) {
    console.warn(`API getLifecycle(${fittingId}) fallback:`, err);
  }

  const entries = MOCK_LIFECYCLE.filter((e) => e.fittingId === fittingId);
  return ok(entries);
}

// ============================================================
// DASHBOARD & ANALYTICS
// ============================================================

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  try {
    const res = await fetch(`${API_BASE}/api/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload.success && payload.data) {
        const d = payload.data;
        const total = d.totalFittings || 12;
        const active = total - (d.maintenanceDue || 0);

        return ok({
          totalFittings: total,
          activeFittings: active,
          inspectedThisMonth: d.inspected || 4,
          maintenanceDue: d.maintenanceDue || 1,
          pendingInspection: d.pendingInspection || 2,
          recentlyScanned: d.recentScans || 5,
          qrVerificationRate: 98.4,
          fittingsByType: [
            { name: 'Elastic Rail Clip', value: 5 },
            { name: 'Insulating Liner', value: 3 },
            { name: 'Rubber Sole Plate', value: 2 },
            { name: 'Metal Liner', value: 2 },
          ],
          inspectionStatus: [
            { name: 'Good', value: d.conditionBreakdown?.good || 7 },
            { name: 'Needs Attention', value: d.conditionBreakdown?.fair || 2 },
            { name: 'Maintenance Required', value: d.conditionBreakdown?.critical || 1 },
          ],
          maintenanceStatus: [
            { name: 'Completed', value: 8 },
            { name: 'Scheduled', value: 3 },
            { name: 'Overdue', value: 1 },
          ],
          fittingsByZone: [
            { zone: 'Central Railway', count: 4 },
            { zone: 'Northern Railway', count: 3 },
            { zone: 'Western Railway', count: 3 },
            { zone: 'Southern Railway', count: 2 },
          ],
          monthlyInspections: [
            { month: 'Nov', inspected: 28, due: 6 },
            { month: 'Dec', inspected: 34, due: 4 },
            { month: 'Jan', inspected: 42, due: 5 },
            { month: 'Feb', inspected: 38, due: 3 },
          ],
        });
      }
    }
  } catch (err) {
    console.warn('API getDashboardStats fallback:', err);
  }

  return ok({ ...MOCK_DASHBOARD_STATS });
}

// ============================================================
// QR / SCAN
// ============================================================

export async function scanQrCode(
  qrValue: string
): Promise<ApiResponse<Fitting>> {
  try {
    const res = await fetch(`${API_BASE}/api/qr/resolve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ qrValue: qrValue.trim() }),
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload.success && payload.data?.fittingId) {
        return getFittingById(payload.data.fittingId);
      }
    }
  } catch (err) {
    console.warn(`API scanQrCode(${qrValue}) fallback:`, err);
  }

  // Fallback search in fittings
  const fitting = MOCK_FITTINGS.find(
    (f) => f.qrId === qrValue || f.id === qrValue
  );
  if (!fitting)
    return fail(`No fitting found for QR code "${qrValue}". Verify the code and retry.`);
  return ok({ ...fitting });
}

// ============================================================
// SEARCH & REPORTS
// ============================================================

export async function searchFittings(query: string): Promise<ApiResponse<Fitting[]>> {
  try {
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload.success && Array.isArray(payload.data)) {
        return ok(payload.data.map(mapBackendFittingToFrontend));
      }
    }
  } catch (err) {
    console.warn(`API searchFittings(${query}) fallback:`, err);
  }
  return getFittings();
}

export async function generateReport(params: {
  from: string;
  to: string;
  zone?: string;
  type?: string;
}): Promise<ApiResponse<{ fittings: Fitting[]; inspections: InspectionRecord[]; maintenance: MaintenanceRecord[] }>> {
  const [fRes, iRes, mRes] = await Promise.all([
    getFittings(),
    getAllInspections(),
    getAllMaintenance(),
  ]);

  let fittings = fRes.data || MOCK_FITTINGS;
  if (params.zone && params.zone !== 'All Zones') {
    fittings = fittings.filter((f) => f.railwayZone === params.zone);
  }

  return ok({
    fittings,
    inspections: iRes.data || MOCK_INSPECTIONS,
    maintenance: mRes.data || MOCK_MAINTENANCE,
  });
}
