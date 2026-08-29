import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Factory, Shield, Truck, Hammer, QrCode, ClipboardCheck, Wrench, AlertTriangle, Tag } from 'lucide-react';
import { getLifecycle, getFittingById } from '../services/api';
import type { LifecycleEntry, Fitting } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import StatusBadge from '../components/UI/StatusBadge';

const ICONS: Record<string, React.ElementType> = {
  'Manufactured': Factory,
  'Quality Checked': Shield,
  'Supplied': Truck,
  'Installed': Hammer,
  'QR Verified': QrCode,
  'Inspected': ClipboardCheck,
  'Maintained': Wrench,
  'Decommissioned': AlertTriangle,
};

const COLORS: Record<string, { dot: string; line: string; icon: string; bg: string }> = {
  'Manufactured': { dot: 'bg-blue-500 border-blue-400', line: 'border-blue-800', icon: 'text-blue-400', bg: 'bg-blue-900/20' },
  'Quality Checked': { dot: 'bg-purple-500 border-purple-400', line: 'border-purple-800', icon: 'text-purple-400', bg: 'bg-purple-900/20' },
  'Supplied': { dot: 'bg-amber-500 border-amber-400', line: 'border-amber-800', icon: 'text-amber-400', bg: 'bg-amber-900/20' },
  'Installed': { dot: 'bg-emerald-500 border-emerald-400', line: 'border-emerald-800', icon: 'text-emerald-400', bg: 'bg-emerald-900/20' },
  'QR Verified': { dot: 'bg-cyan-500 border-cyan-400', line: 'border-cyan-800', icon: 'text-cyan-400', bg: 'bg-cyan-900/20' },
  'Inspected': { dot: 'bg-blue-400 border-blue-300', line: 'border-blue-800', icon: 'text-blue-300', bg: 'bg-blue-900/10' },
  'Maintained': { dot: 'bg-green-500 border-green-400', line: 'border-green-800', icon: 'text-green-400', bg: 'bg-green-900/20' },
  'Decommissioned': { dot: 'bg-red-500 border-red-400', line: 'border-red-800', icon: 'text-red-400', bg: 'bg-red-900/20' },
};

const DEFAULT_COLOR = { dot: 'bg-gray-500 border-gray-400', line: 'border-gray-800', icon: 'text-gray-400', bg: 'bg-gray-900/20' };

export default function LifecycleHistory() {
  const { id } = useParams<{ id: string }>();
  const [fitting, setFitting] = useState<Fitting | null>(null);
  const [entries, setEntries] = useState<LifecycleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getLifecycle(id), getFittingById(id)]).then(([lRes, fRes]) => {
      if (lRes.data) setEntries(lRes.data);
      if (fRes.data) setFitting(fRes.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading lifecycle history..." />;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <Link to={`/fittings/${id}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white mb-2 transition-colors">
          <ArrowLeft size={13} /> Back to Details
        </Link>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock size={20} className="text-cyan-accent-400" />
          Lifecycle History
        </h1>
        {fitting && (
          <p className="text-gray-400 text-sm mt-0.5">
            <span className="font-mono text-cyan-accent-400">{fitting.id}</span> · {fitting.fittingType}
          </p>
        )}
      </div>

      {/* Fitting summary */}
      {fitting && (
        <div className="card flex flex-wrap items-center gap-4">
          <div>
            <div className="text-xs text-gray-400">Type</div>
            <div className="text-sm font-semibold text-white">{fitting.fittingType}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Location</div>
            <div className="text-sm text-gray-200">{fitting.location}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Status</div>
            <StatusBadge status={fitting.status} />
          </div>
          <div>
            <div className="text-xs text-gray-400">Total Events</div>
            <div className="text-sm font-bold text-cyan-accent-400">{entries.length}</div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {entries.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <Clock size={32} className="mx-auto mb-3 opacity-30" />
          <p>No lifecycle events recorded for this fitting.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-navy-800" />

          <div className="space-y-4">
            {entries.map((entry, idx) => {
              const Icon = ICONS[entry.event] || Tag;
              const color = COLORS[entry.event] || DEFAULT_COLOR;
              const isLast = idx === entries.length - 1;

              return (
                <div key={entry.id} className="relative flex gap-5">
                  {/* Dot */}
                  <div className={`relative z-10 w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${color.dot} ${color.bg}`}>
                    <Icon size={18} className={color.icon} />
                  </div>

                  {/* Content */}
                  <div className={`flex-1 card mb-0 ${isLast ? 'border-cyan-accent-700/40' : ''}`}>
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <div>
                        <span className="font-semibold text-white text-sm">{entry.event}</span>
                        {isLast && (
                          <span className="ml-2 badge badge-info text-xs">Current</span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-gray-400 bg-navy-800 px-2 py-0.5 rounded">{entry.date}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-1 flex flex-wrap gap-x-4 gap-y-0.5">
                      <span><strong className="text-gray-300">Actor:</strong> {entry.actor}</span>
                      <span><strong className="text-gray-300">Location:</strong> {entry.location}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{entry.notes}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      {entries.length > 0 && (
        <div className="card">
          <div className="section-title text-sm">
            <Clock size={14} className="text-cyan-accent-400" />
            Timeline Summary
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
            <div>
              <div className="text-lg font-bold text-white">{entries.length}</div>
              <div className="text-gray-400">Total Events</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-400">{entries[0].date}</div>
              <div className="text-gray-400">First Event</div>
            </div>
            <div>
              <div className="text-lg font-bold text-cyan-accent-400">{entries[entries.length - 1].date}</div>
              <div className="text-gray-400">Latest Event</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">
                {entries.filter((e) => e.event === 'Inspected').length}
              </div>
              <div className="text-gray-400">Inspections</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
