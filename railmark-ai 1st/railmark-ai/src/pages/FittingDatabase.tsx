import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Search, Filter, ChevronRight, Plus, X, CheckCircle2, Loader2, Maximize2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getFittings, createFitting } from '../services/api';
import type { Fitting, FittingStatus } from '../types';
import StatusBadge from '../components/UI/StatusBadge';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import QRCodeModal from '../components/UI/QRCodeModal';

const ZONES = ['All Zones', 'Central Railway', 'North Central Railway', 'Southern Railway', 'Eastern Railway', 'Western Railway', 'South Central Railway', 'North Western Railway', 'East Central Railway', 'West Central Railway', 'North Eastern Railway', 'Northeast Frontier Railway'];
const TYPES = ['All Types', 'Elastic Rail Clip (ERC MK-III)', 'Elastic Rail Clip (ERC MK-V)', 'GFN-66 Insulating Liner', 'Metal Liner (60kg)', 'Grooved Rubber Sole Plate (GRSP 6mm)', 'Rail Anchor', 'Fish Plate', 'PSC Sleeper Bolt', 'Tie Bar', 'Guard Rail'];
const STATUSES: (FittingStatus | 'All')[] = ['All', 'Active', 'Inspection Due', 'Maintenance Required', 'Decommissioned'];

export default function FittingDatabase() {
  const [fittings, setFittings] = useState<Fitting[]>([]);
  const [filtered, setFiltered] = useState<Fitting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState('All Zones');
  const [type, setType] = useState('All Types');
  const [status, setStatus] = useState<FittingStatus | 'All'>('All');

  const [selectedQR, setSelectedQR] = useState<Fitting | null>(null);

  // Register Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const [newFitting, setNewFitting] = useState({
    id: `RM-FIT-00${Math.floor(10 + Math.random() * 90)}`,
    fittingType: 'Elastic Rail Clip (ERC MK-III)',
    manufacturer: 'Apex Fasteners India',
    batchNumber: 'BATCH-2026-008',
    manufacturingDate: new Date().toISOString().split('T')[0],
    installationDate: new Date().toISOString().split('T')[0],
    railwayZone: 'Northern Railway',
    division: 'Delhi Division',
    section: 'Section KM 142/4 - Up Main Line',
    kmMark: 'KM 142/4',
    trackType: 'Broad Gauge (1676mm)',
    status: 'Active' as FittingStatus,
    standardSpec: 'IRS:T-31-2021',
    material: 'Spring Steel 55Si7',
    weight: '0.92 kg',
    description: 'High-tensile spring steel elastic rail clip for PSC sleeper track fastening.',
  });

  const loadData = () => {
    getFittings().then((res) => {
      if (res.data) {
        setFittings(res.data);
        setFiltered(res.data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = fittings;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.id.toLowerCase().includes(q) ||
          f.fittingType.toLowerCase().includes(q) ||
          f.location.toLowerCase().includes(q) ||
          f.manufacturer.toLowerCase().includes(q) ||
          f.batchNumber.toLowerCase().includes(q)
      );
    }
    if (zone !== 'All Zones') result = result.filter((f) => f.railwayZone === zone);
    if (type !== 'All Types') result = result.filter((f) => f.fittingType === type);
    if (status !== 'All') result = result.filter((f) => f.status === status);
    setFiltered(result);
  }, [search, zone, type, status, fittings]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);

    const fullFitting: Fitting = {
      ...newFitting,
      qrId: newFitting.id,
      location: `${newFitting.railwayZone}, ${newFitting.section}`,
      lastInspection: newFitting.installationDate,
      nextInspection: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maintenanceStatus: 'Completed',
    };

    const res = await createFitting(fullFitting);
    setRegistering(false);

    if (res.success && res.data) {
      setFittings((prev) => [res.data!, ...prev]);
      setRegisterSuccess(true);
      setTimeout(() => {
        setRegisterSuccess(false);
        setShowRegisterModal(false);
        // generate new next ID for next modal opening
        setNewFitting((p) => ({
          ...p,
          id: `RM-FIT-00${Math.floor(10 + Math.random() * 90)}`,
        }));
      }, 1200);
    }
  };

  if (loading) return <LoadingSpinner text="Loading fittings database..." />;

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Database size={20} className="text-cyan-accent-400" />
            Fitting Database
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {filtered.length} of {fittings.length} records · <span className="demo-banner inline-flex py-0">LIVE DATABASE</span>
          </p>
        </div>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="btn-primary text-xs self-start sm:self-auto"
        >
          <Plus size={14} />
          Register Fitting
        </button>
      </div>

      {/* Filters */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
          <Filter size={13} />
          Filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
              placeholder="Search ID, type, location…"
            />
          </div>
          <select value={zone} onChange={(e) => setZone(e.target.value)} className="select-field">
            {ZONES.map((z) => <option key={z}>{z}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="select-field">
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="select-field">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy-800/60">
              <tr>
                {['Fitting ID', 'QR Code', 'Type', 'Manufacturer', 'Location', 'Zone', 'Status', 'Last Inspection', 'Maintenance', ''].map((h) => (
                  <th key={h} className="table-header whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-gray-500 text-sm">
                    No fittings match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-navy-800/30 transition-colors">
                    <td className="table-cell">
                      <Link
                        to={`/fittings/${f.id}`}
                        className="font-mono text-xs text-cyan-accent-400 hover:text-cyan-accent-300 font-semibold hover:underline"
                      >
                        {f.id}
                      </Link>
                    </td>
                    <td className="table-cell py-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedQR(f)}
                        className="group relative flex items-center justify-center w-11 h-11 bg-white p-1 rounded-lg shadow border border-navy-700 hover:border-cyan-accent-400 hover:shadow-[0_0_12px_rgba(0,184,230,0.4)] hover:scale-105 transition-all duration-200 cursor-pointer"
                        title={`Click to preview & export QR Code for ${f.id}`}
                      >
                        <QRCodeSVG
                          value={f.qrId || f.id}
                          size={36}
                          level="M"
                          includeMargin={false}
                          className="w-full h-full block"
                        />
                        <div className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity text-cyan-accent-300">
                          <Maximize2 size={13} />
                        </div>
                      </button>
                    </td>
                    <td className="table-cell whitespace-nowrap">{f.fittingType}</td>
                    <td className="table-cell whitespace-nowrap text-xs">{f.manufacturer}</td>
                    <td className="table-cell">
                      <span className="text-xs">{f.location}</span>
                    </td>
                    <td className="table-cell whitespace-nowrap text-xs">{f.railwayZone}</td>
                    <td className="table-cell">
                      <StatusBadge status={f.status} />
                    </td>
                    <td className="table-cell whitespace-nowrap text-xs">{f.lastInspection}</td>
                    <td className="table-cell">
                      <StatusBadge status={f.maintenanceStatus} />
                    </td>
                    <td className="table-cell">
                      <Link
                        to={`/fittings/${f.id}`}
                        className="inline-flex items-center gap-1 text-xs text-cyan-accent-400 hover:text-cyan-accent-300 font-medium"
                      >
                        View <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Fitting Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-dark-900 border border-navy-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-cyan-accent-400" />
                <h2 className="text-lg font-bold text-white">Register New Railway Track Fitting</h2>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {registerSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 size={48} className="text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-white">Fitting Registered & Persisted!</h3>
                <p className="text-sm text-gray-400">Record created with QR tracking and saved to database.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Fitting ID (Unique QR identifier)</label>
                    <input
                      type="text"
                      value={newFitting.id}
                      onChange={(e) => setNewFitting({ ...newFitting, id: e.target.value })}
                      className="input-field font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Fitting Type</label>
                    <select
                      value={newFitting.fittingType}
                      onChange={(e) => setNewFitting({ ...newFitting, fittingType: e.target.value })}
                      className="select-field"
                    >
                      {TYPES.filter((t) => t !== 'All Types').map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Manufacturer</label>
                    <input
                      type="text"
                      value={newFitting.manufacturer}
                      onChange={(e) => setNewFitting({ ...newFitting, manufacturer: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Batch Number</label>
                    <input
                      type="text"
                      value={newFitting.batchNumber}
                      onChange={(e) => setNewFitting({ ...newFitting, batchNumber: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Railway Zone</label>
                    <select
                      value={newFitting.railwayZone}
                      onChange={(e) => setNewFitting({ ...newFitting, railwayZone: e.target.value })}
                      className="select-field"
                    >
                      {ZONES.filter((z) => z !== 'All Zones').map((z) => (
                        <option key={z}>{z}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Track Section / Sleeper</label>
                    <input
                      type="text"
                      value={newFitting.section}
                      onChange={(e) => setNewFitting({ ...newFitting, section: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Standard Specification</label>
                    <input
                      type="text"
                      value={newFitting.standardSpec}
                      onChange={(e) => setNewFitting({ ...newFitting, standardSpec: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Material Grade</label>
                    <input
                      type="text"
                      value={newFitting.material}
                      onChange={(e) => setNewFitting({ ...newFitting, material: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Technical Description & Notes</label>
                  <textarea
                    value={newFitting.description}
                    onChange={(e) => setNewFitting({ ...newFitting, description: e.target.value })}
                    rows={2}
                    className="input-field"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-navy-800">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={registering}
                    className="btn-primary text-xs"
                  >
                    {registering ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Saving to Database...
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        Register & Save
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* QR Code Details / Export Modal */}
      {selectedQR && (
        <QRCodeModal
          fitting={selectedQR}
          onClose={() => setSelectedQR(null)}
        />
      )}
    </div>
  );
}
