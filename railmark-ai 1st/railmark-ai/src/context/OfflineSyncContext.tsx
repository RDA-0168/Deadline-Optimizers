// =============================================================================
// RailMark AI — Offline Synchronization Context & Provider
// =============================================================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { OfflineSyncService } from '../services/offlineSync';

interface OfflineSyncContextValue {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  lastSyncTime: string | null;
  manualSync: () => Promise<void>;
  queueScan: (qrValue: string, meta?: { latitude?: number; longitude?: number; notes?: string }) => void;
  queueInspection: (fittingId: string, inspectionData: any) => void;
}

const OfflineSyncContext = createContext<OfflineSyncContextValue | null>(null);

export function OfflineSyncProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [pendingCount, setPendingCount] = useState<number>(() => OfflineSyncService.getPendingCount());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => OfflineSyncService.getLastSyncTime());

  const updateCount = useCallback(() => {
    setPendingCount(OfflineSyncService.getPendingCount());
    setLastSyncTime(OfflineSyncService.getLastSyncTime());
  }, []);

  const runSync = useCallback(async () => {
    if (isSyncing || !navigator.onLine) return;
    const currentCount = OfflineSyncService.getPendingCount();
    if (currentCount === 0) return;

    setIsSyncing(true);
    try {
      await OfflineSyncService.syncAllPending();
    } catch (err) {
      console.warn('[OfflineSyncContext] Auto-sync encountered error:', err);
    } finally {
      setIsSyncing(false);
      updateCount();
    }
  }, [isSyncing, updateCount]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Automatically trigger sync when network returns
      runSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleQueueUpdate = () => {
      updateCount();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('railmark_offline_queue_updated', handleQueueUpdate);

    // Initial check
    if (navigator.onLine && pendingCount > 0) {
      runSync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('railmark_offline_queue_updated', handleQueueUpdate);
    };
  }, [runSync, updateCount, pendingCount]);

  const queueScan = useCallback((qrValue: string, meta?: any) => {
    OfflineSyncService.queueScan(qrValue, meta);
    updateCount();
  }, [updateCount]);

  const queueInspection = useCallback((fittingId: string, inspectionData: any) => {
    OfflineSyncService.queueInspection(fittingId, inspectionData);
    updateCount();
  }, [updateCount]);

  return (
    <OfflineSyncContext.Provider
      value={{
        isOnline,
        pendingCount,
        isSyncing,
        lastSyncTime,
        manualSync: runSync,
        queueScan,
        queueInspection,
      }}
    >
      {children}
    </OfflineSyncContext.Provider>
  );
}

export function useOfflineSync() {
  const ctx = useContext(OfflineSyncContext);
  if (!ctx) {
    throw new Error('useOfflineSync must be used within an OfflineSyncProvider');
  }
  return ctx;
}
