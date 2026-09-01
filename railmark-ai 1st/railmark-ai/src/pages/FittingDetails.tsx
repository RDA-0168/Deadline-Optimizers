import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, QrCode, MapPin, Wrench, ClipboardCheck,
  Package, Tag, Factory, Clock, ChevronRight,
  CheckCircle2, Truck, Hammer, Shield, AlertTriangle, Maximize2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getFittingById, getInspectionHistory, getMaintenanceHistory, getLifecycle } from '../services/api';
import type { Fitting, InspectionRecord, MaintenanceRecord, LifecycleEntry } from '../types';
import StatusBadge from '../components/UI/StatusBadge';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import QRCodeModal from '../components/UI/QRCodeModal';

const LIFECYCLE_ICONS: Record<string, React.ElementType> = {
  'Manufactured': Factory,
  'Quality Checked': Shield,
  'Supplied': Truck,
  'Installed': Hammer,
  'QR Verified': QrCode,
  'Inspected': ClipboardCheck,
  'Maintained': Wrench,
  'Decommissioned': AlertTriangle,
};

const LIFECYCLE_COLORS: Record<string, string> = {
  'Manufactured': 'border-blue-500 bg-blue-900/30 text-blue-400',
  'Quality Checked': 'border-purple-500 bg-purple-900/30 text-purple-400',
  'Supplied': 'border-amber-500 bg-amber-900/30 text-amber-400',
  'Installed': 'border-emerald-500 bg-emerald-900/30 text-emerald-400',
  'QR Verified': 'border-cyan-500 bg-cyan-900/30 text-cyan-400',
  'Inspected': 'border-blue-400 bg-blue-900/20 text-blue-300',
  'Maintained': 'border-green-500 bg-green-900/30 text-green-400',
  'Decommissioned': 'border-red-500 bg-red-900/30 text-red-400',
};

function InfoRow({ label, value, mono = false }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-2.5 border-b border-navy-800 last:border-0 gap-0.5 sm:gap-4">
      <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest sm:w-44 flex-shrink-0">{label}</span>
      <span className={`text-sm text-gray-200 ${mono ? 'font-mono text-cyan-accent-300' : ''}`}>{value || '—'}</span>
    </div>
  );
}

export default function FittingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [fitting, setFitting] = useState<Fitting | null>(null);
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [lifecycle, setLifecycle] = useState<LifecycleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getFittingById(id),
      getInspectionHistory(id),
      getMaintenanceHistory(id),
      getLifecycle(id),
    ]).then(([fRes, iRes, mRes, lRes]) => {
      if (fRes.data) setFitting(fRes.data);
      else setError(fRes.error ?? 'Fitting not found.');
      if (iRes.data) setInspections(iRes.data);
      if (mRes.data) setMaintenance(mRes.data);
      if (lRes.data) setLifecycle(lRes.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading fitting details..." />;

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
        <p className="text-red-300 font-semibold">{error}</p>
        <Link to="/fittings" className="btn-secondary mt-4 inline-flex">
          <ArrowLeft size={14} /> Back to Database
        </Link>
      </div>
    );
  }

  if (!fitting) return null;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white mb-2 transition-colors">
            <ArrowLeft size={13} /> Back
          </button>
          <h1 className="text-xl font-bold text-white font-mono">{fitting.id}</h1>
          <p className="text-gray-400 text-sm mt-0.5">{fitting.fittingType} · {fitting.railwayZone}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={fitting.status} className="text-sm" />
          <Link to={`/lifecycle/${fitting.id}`} className="btn-secondary text-xs">
            <Clock size={13} />
            Full Timeline
          </Link>
          <Link to="/inspection" className="btn-accent text-xs">
            <ClipboardCheck size={13} />
            Add Inspection
          </Link>
        </div>
      </div>

      {/* QR visual */}
      <div className="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowQRModal(true)}
            className="group relative w-20 h-20 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg border border-navy-700 hover:border-cyan-accent-400 hover:shadow-[0_0_15px_rgba(0,184,230,0.4)] hover:scale-105 transition-all cursor-pointer flex-shrink-0"
            title="Click to view full QR details and export"
          >
            <QRCodeSVG
              value={fitting.qrId || fitting.id}
              size={64}
              level="H"
              includeMargin={false}
              className="w-full h-full block"
            />
            <div className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity text-cyan-accent-300">
              <Maximize2 size={16} />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow">
              <CheckCircle2 size={12} className="text-white" />
            </div>
          </button>
          <div className="min-w-0">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">Direct Part Marking (DPM) QR Code</div>
            <div className="font-mono text-lg font-bold text-cyan-accent-400">{fitting.qrId || fitting.id}</div>
            <div className="text-xs text-gray-400 mt-0.5">Laser marked · Optical 2D Data Matrix / QR · Permanent</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowQRModal(true)}
          className="btn-secondary text-xs flex items-center gap-2 self-stretch sm:self-auto justify-center"
        >
          <QrCode size={14} className="text-cyan-accent-400" />
          Expand & Save QR
        </button>
      </div>

      {/* Info sections */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className="card">
          <div className="section-title">
            <Package size={16} className="text-cyan-accent-400" />
            Basic Information
          </div>
          <InfoRow label="Fitting ID" value={fitting.id} mono />
          <InfoRow label="Fitting Type" value={fitting.fittingType} />
          <InfoRow label="Manufacturer" value={fitting.manufacturer} />
          <InfoRow label="Batch Number" value={fitting.batchNumber} mono />
          <InfoRow label="Manufacturing Date" value={fitting.manufacturingDate} />
          <InfoRow label="Material" value={fitting.material} />
          <InfoRow label="Weight" value={fitting.weight} />
          <InfoRow label="Standard Spec" value={fitting.standardSpec} />
        </div>

        {/* Installation Info */}
        <div className="card">
          <div className="section-title">
            <MapPin size={16} className="text-cyan-accent-400" />
            Installation Information
          </div>
          <InfoRow label="Installation Date" value={fitting.installationDate} />
          <InfoRow label="Location" value={fitting.location} />
          <InfoRow label="Railway Zone" value={fitting.railwayZone} />
          <InfoRow label="Division" value={fitting.division} />
          <InfoRow label="Section" value={fitting.section} />
          <InfoRow label="KM Mark" value={fitting.kmMark} mono />
          <InfoRow label="Track Type" value={fitting.trackType} />
          <InfoRow label="Description" value={fitting.description} />
        </div>

        {/* Inspection Info */}
        <div className="card">
          <div className="section-title">
            <ClipboardCheck size={16} className="text-cyan-accent-400" />
            Inspection Information
          </div>
          <InfoRow label="Current Status" value={fitting.status} />
          <InfoRow label="Last Inspection" value={fitting.lastInspection} />
          <InfoRow label="Next Inspection" value={fitting.nextInspection} />
          <div className="pt-3">
            {inspections.length > 0 ? (
              <div className="space-y-2">
                {inspections.slice(0, 2).map((insp) => (
                  <div key={insp.id} className="bg-navy-800/50 rounded-lg px-3 py-2.5 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-200">{insp.inspectionDate}</span>
                      <StatusBadge status={insp.condition} />
                    </div>
                    <div className="text-gray-400">Inspector: {insp.inspector}</div>
                    <div className="text-gray-400 mt-0.5 truncate">{insp.notes}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No inspection records.</p>
            )}
          </div>
        </div>

        {/* Maintenance Info */}
        <div className="card">
          <div className="section-title">
            <Wrench size={16} className="text-cyan-accent-400" />
            Maintenance Information
          </div>
          <InfoRow label="Maintenance Status" value={fitting.maintenanceStatus} />
          {maintenance.slice(0, 1).map((m) => (
            <div key={m.id}>
              <InfoRow label="Last Maintenance" value={m.maintenanceDate} />
              <InfoRow label="Type" value={m.maintenanceType} />
              <InfoRow label="Technician" value={m.technician} />
              <InfoRow label="Next Maintenance" value={m.nextMaintenance} />
              <InfoRow label="Description" value={m.description} />
            </div>
          ))}
          {maintenance.length === 0 && (
            <p className="text-xs text-gray-500 py-2">No maintenance records.</p>
          )}
        </div>
      </div>

      {/* Lifecycle Timeline */}
      <div className="card">
        <div className="section-title">
          <Clock size={16} className="text-cyan-accent-400" />
          Lifecycle History
          <Link to={`/lifecycle/${fitting.id}`} className="ml-auto text-xs text-cyan-accent-400 hover:text-cyan-accent-300 font-normal inline-flex items-center gap-1">
            View Full <ChevronRight size={12} />
          </Link>
        </div>

        {lifecycle.length === 0 ? (
          <p className="text-xs text-gray-500">No lifecycle entries.</p>
        ) : (
          <div className="relative pl-6">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-navy-700" />

            <div className="space-y-5">
              {lifecycle.map((entry) => {
                const Icon = LIFECYCLE_ICONS[entry.event] || Tag;
                const colorClass = LIFECYCLE_COLORS[entry.event] || 'border-gray-500 bg-gray-900/30 text-gray-400';
                return (
                  <div key={entry.id} className="relative flex gap-3">
                    {/* Dot */}
                    <div className={`absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center ${colorClass}`}>
                      <Icon size={10} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white">{entry.event}</span>
                        <span className="text-xs text-gray-400 font-mono">{entry.date}</span>
                      </div>
                      <p className="text-xs text-gray-400">{entry.actor} · {entry.location}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{entry.notes}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Link to="/inspection" className="btn-accent text-sm">
          <ClipboardCheck size={15} />
          Add Inspection Record
        </Link>
        <Link to="/maintenance" className="btn-secondary text-sm">
          <Wrench size={15} />
          Schedule Maintenance
        </Link>
        <Link to={`/lifecycle/${fitting.id}`} className="btn-secondary text-sm">
          <Clock size={15} />
          Full Lifecycle
        </Link>
      </div>

      {/* QR Code Details / Export Modal */}
      {showQRModal && (
        <QRCodeModal
          fitting={fitting}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
}
