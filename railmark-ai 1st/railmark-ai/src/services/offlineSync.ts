// =============================================================================
// RailMark AI — Offline Scan Caching & Background Synchronization Service
// =============================================================================

export interface OfflineScanItem {
  id: string;
  qrValue: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  error?: string;
}

export interface OfflineInspectionItem {
  id: string;
  fittingId: string;
  inspectionData: any;
  timestamp: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  error?: string;
}

const STORAGE_KEYS = {
  SCANS_QUEUE: 'railmark_offline_scans_queue',
  INSPECTIONS_QUEUE: 'railmark_offline_inspections_queue',
  FITTINGS_CACHE: 'railmark_offline_fittings_cache',
  LAST_SYNC: 'railmark_last_sync_timestamp',
};

function readStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[OfflineSync] Failed to write to localStorage key "${key}":`, err);
  }
}

export class OfflineSyncService {
  /**
   * Queue a QR scan captured while offline in remote track sections.
   */
  static queueScan(qrValue: string, meta?: { latitude?: number; longitude?: number; notes?: string }): OfflineScanItem {
    const scans = readStorage<OfflineScanItem[]>(STORAGE_KEYS.SCANS_QUEUE, []);
    const newItem: OfflineScanItem = {
      id: `OFFLINE-SCAN-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      qrValue: qrValue.trim().toUpperCase(),
      timestamp: new Date().toISOString(),
      latitude: meta?.latitude,
      longitude: meta?.longitude,
      notes: meta?.notes,
      status: 'pending',
    };

    scans.push(newItem);
    writeStorage(STORAGE_KEYS.SCANS_QUEUE, scans);
    window.dispatchEvent(new CustomEvent('railmark_offline_queue_updated'));
    return newItem;
  }

  /**
   * Queue an inspection recorded while disconnected from the network.
   */
  static queueInspection(fittingId: string, inspectionData: any): OfflineInspectionItem {
    const inspections = readStorage<OfflineInspectionItem[]>(STORAGE_KEYS.INSPECTIONS_QUEUE, []);
    const newItem: OfflineInspectionItem = {
      id: `OFFLINE-INSP-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fittingId,
      inspectionData,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    inspections.push(newItem);
    writeStorage(STORAGE_KEYS.INSPECTIONS_QUEUE, inspections);
    window.dispatchEvent(new CustomEvent('railmark_offline_queue_updated'));
    return newItem;
  }

  /**
   * Cache master fitting profiles locally for instant offline optical lookups.
   */
  static cacheFittings(fittings: any[]): void {
    const cache = readStorage<Record<string, any>>(STORAGE_KEYS.FITTINGS_CACHE, {});
    for (const f of fittings) {
      if (f.id) cache[f.id] = f;
      if (f.qrId) cache[f.qrId] = f;
      if (f.qrCodeValue) cache[f.qrCodeValue] = f;
    }
    writeStorage(STORAGE_KEYS.FITTINGS_CACHE, cache);
  }

  static getCachedFitting(idOrQr: string): any | null {
    const cache = readStorage<Record<string, any>>(STORAGE_KEYS.FITTINGS_CACHE, {});
    const clean = idOrQr.trim().toUpperCase();
    return cache[clean] || cache[idOrQr] || null;
  }

  static getPendingCount(): number {
    const scans = readStorage<OfflineScanItem[]>(STORAGE_KEYS.SCANS_QUEUE, []).filter((s) => s.status === 'pending');
    const inspections = readStorage<OfflineInspectionItem[]>(STORAGE_KEYS.INSPECTIONS_QUEUE, []).filter((i) => i.status === 'pending');
    return scans.length + inspections.length;
  }

  static getPendingScans(): OfflineScanItem[] {
    return readStorage<OfflineScanItem[]>(STORAGE_KEYS.SCANS_QUEUE, []);
  }

  static getPendingInspections(): OfflineInspectionItem[] {
    return readStorage<OfflineInspectionItem[]>(STORAGE_KEYS.INSPECTIONS_QUEUE, []);
  }

  static getLastSyncTime(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  }

  /**
   * Synchronize all cached offline scans and inspections to PostgreSQL API backend.
   */
  static async syncAllPending(token?: string): Promise<{ scansSynced: number; inspectionsSynced: number; errors: string[] }> {
    const authToken = token || localStorage.getItem('railmark_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const scans = readStorage<OfflineScanItem[]>(STORAGE_KEYS.SCANS_QUEUE, []);
    const inspections = readStorage<OfflineInspectionItem[]>(STORAGE_KEYS.INSPECTIONS_QUEUE, []);

    let scansSynced = 0;
    let inspectionsSynced = 0;
    const errors: string[] = [];

    // 1. Sync scans
    const remainingScans: OfflineScanItem[] = [];
    for (const s of scans) {
      if (s.status === 'synced') continue;
      try {
        const res = await fetch('/api/qr/resolve', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            qrValue: s.qrValue,
            latitude: s.latitude,
            longitude: s.longitude,
            notes: s.notes ? `[Offline Synced] ${s.notes}` : '[Offline Synced Scan]',
          }),
        });
        if (res.ok) {
          scansSynced++;
        } else {
          remainingScans.push({ ...s, status: 'failed', error: `Server returned ${res.status}` });
        }
      } catch (err: any) {
        remainingScans.push({ ...s, status: 'failed', error: err.message });
        errors.push(`Scan sync failed for QR ${s.qrValue}: ${err.message}`);
      }
    }
    writeStorage(STORAGE_KEYS.SCANS_QUEUE, remainingScans);

    // 2. Sync inspections
    const remainingInspections: OfflineInspectionItem[] = [];
    for (const insp of inspections) {
      if (insp.status === 'synced') continue;
      try {
        const res = await fetch(`/api/fittings/${insp.fittingId}/inspections`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            ...insp.inspectionData,
            notes: insp.inspectionData.notes ? `[Offline Synced] ${insp.inspectionData.notes}` : '[Offline Synced Inspection]',
          }),
        });
        if (res.ok) {
          inspectionsSynced++;
        } else {
          remainingInspections.push({ ...insp, status: 'failed', error: `Server returned ${res.status}` });
        }
      } catch (err: any) {
        remainingInspections.push({ ...insp, status: 'failed', error: err.message });
        errors.push(`Inspection sync failed for ${insp.fittingId}: ${err.message}`);
      }
    }
    writeStorage(STORAGE_KEYS.INSPECTIONS_QUEUE, remainingInspections);

    if (scansSynced > 0 || inspectionsSynced > 0) {
      const now = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
    }

    window.dispatchEvent(new CustomEvent('railmark_offline_queue_updated'));
    return { scansSynced, inspectionsSynced, errors };
  }
}
