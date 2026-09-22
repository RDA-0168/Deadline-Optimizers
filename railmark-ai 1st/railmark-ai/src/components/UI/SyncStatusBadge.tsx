// =============================================================================
// RailMark AI — Sync Status Badge Component
// =============================================================================

import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useOfflineSync } from '../../context/OfflineSyncContext';

export default function SyncStatusBadge() {
  const { isOnline, pendingCount, isSyncing, manualSync } = useOfflineSync();

  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        pendingCount > 0 ? (
          <button
            onClick={() => manualSync()}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer"
            title={`${pendingCount} offline scans/records queued. Click to sync now.`}
          >
            <RefreshCw size={12} className={isSyncing ? 'animate-spin text-amber-400' : 'text-amber-400'} />
            <span>{isSyncing ? 'Syncing...' : `${pendingCount} Queued · Sync Now`}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Wifi size={12} className="text-emerald-400" />
            <span>Online · Postgres Synced</span>
          </div>
        )
      ) : (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          <WifiOff size={12} className="text-rose-400" />
          <span>Offline Mode · {pendingCount} Cached</span>
        </div>
      )}
    </div>
  );
}
