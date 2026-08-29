import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, Eye, Edit2, Clock, Plus, Filter, X, CheckCircle2, Loader2, Save } from 'lucide-react';
import { getFittings, createFitting, updateFitting } from '../services/api';
import type { Fitting, FittingStatus, MaintenanceStatus } from '../types';
import StatusBadge from '../components/UI/StatusBadge';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const STATUS_OPTIONS: FittingStatus[] = ['Active', 'Inspection Due', 'Maintenance Required', 'Critical' as any, 'Decommissioned'];
const MAINT_OPTIONS: MaintenanceStatus[] = ['Completed', 'Scheduled', 'Overdue', 'Pending'];
const ZONES = ['Central Railway', 'North Central Railway', 'Southern Railway', 'Eastern Railway', 'Western Railway', 'South Central Railway', 'North Western Railway', 'East Central Railway', 'West Central Railway', 'North Eastern Railway', 'Northeast Frontier Railway'];
const TYPES = ['Elastic Rail Clip (ERC MK-III)', 'Elastic Rail Clip (ERC MK-V)', 'GFN-66 Insulating Liner', 'Metal Liner (60kg)', 'Grooved Rubber Sole Plate (GRSP 6mm)', 'Rail Anchor', 'Fish Plate', 'PSC Sleeper Bolt', 'Tie Bar', 'Guard Rail'];

export default function AdminDashboard() {
  const [fittings, setFittings] = useState<Fitting[]>([]);
  const [filtered, setFiltered] = useState<Fitting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [editFitting, setEditFitting] = useState<Fitting | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  const [newFitting, setNewFitting] = useState({
    id: `RM-FIT-00${Math.floor(10 + Math.random() * 90)}`,
    fittingType: 'Elastic Rail Clip (ERC MK-III)',
    manufacturer: 'SteelTech Track Systems',
    batchNumber: 'BATCH-2026-009',
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
    description: 'High tensile track fitting.',
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
    if (!search.trim()) {
      setFiltered(fittings);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      fittings.filter(
        (f) =>
          f.id.toLowerCase().includes(q) ||
          f.fittingType.toLowerCase().includes(q) ||
          f.manufacturer.toLowerCase().includes(q) ||
          f.location.toLowerCase().includes(q) ||
          f.status.toLowerCase().includes(q)
      )
    );
  }, [search, fittings]);

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFitting) return;
    setSavingEdit(true);

    const res = await updateFitting(editFitting.id, {
      status: editFitting.status,
      fittingType: editFitting.fittingType,
      location: editFitting.location,
      material: editFitting.material,
      standardSpec: editFitting.standardSpec,
    });

    setSavingEdit(false);
    if (res.success && res.data) {
      setFittings((prev) =>
        prev.map((f) => (f.id === editFitting.id ? { ...f, ...editFitting } : f))
      );
      setSuccessBanner(`Fitting ${editFitting.id} updated successfully!`);
      setEditFitting(null);
      setTimeout(() => setSuccessBanner(''), 3000);
    }
  };

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
      setSuccessBanner(`Fitting ${res.data.id} registered and saved to database!`);
      setShowRegisterModal(false);
      setTimeout(() => setSuccessBanner(''), 3000);
      setNewFitting((p) => ({
        ...p,
        id: `RM-FIT-00${Math.floor(10 + Math.random() * 90)}`,
      }));
    }
  };

  if (loading) return <LoadingSpinner text="Loading admin dashboard..." />;

  const total = fittings.length;
  const active = fittings.filter((f) => f.status === 'Active').length;
  const due = fittings.filter((f) => f.status === 'Inspection Due').length;
  const maint = fittings.filter((f) => f.status === 'Maintenance Required' || (f.status as string) === 'Critical').length;

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck size={20} className="text-cyan-accent-400" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage master fitting records · <span className="demo-banner inline-flex py-0">LIVE DATABASE</span></p>
        </div>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="btn-primary text-xs self-start sm:self-auto"
        >
          <Plus size={14} />
          Register New Fitting
        </button>
      </div>

      {successBanner && (
        <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-700/50 rounded-xl px-4 py-3 text-sm text-emerald-300 animate-slide-up">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Summary tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Fittings', value: total, color: 'text-white' },
          { label: 'Active', value: active, color: 'text-emerald-400' },
          { label: 'Inspection Due', value: due, color: 'text-amber-400' },
          { label: 'Maintenance Req.', value: maint, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          <Filter size={13} />
          Search / Filter
        </div>
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
            placeholder="Search fitting ID, type, location, status…"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-navy-800 flex items-center justify-between">
          <span className="text-sm font-semibold text-white">
            All Fittings
            <span className="ml-2 text-xs text-gray-400">({filtered.length})</span>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy-800/60">
              <tr>
                {['Fitting ID', 'Type', 'Manufacturer', 'Location', 'Status', 'Last Inspection', 'Maintenance', 'Actions'].map((h) => (
                  <th key={h} className="table-header whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-navy-800/30 transition-colors">
                  <td className="table-cell">
                    <span className="font-mono text-xs text-cyan-accent-400 font-semibold">{f.id}</span>
                  </td>
                  <td className="table-cell whitespace-nowrap text-xs">{f.fittingType}</td>
                  <td className="table-cell whitespace-nowrap text-xs">{f.manufacturer}</td>
                  <td className="table-cell text-xs max-w-[180px]">
                    <span className="truncate block">{f.location}</span>
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={f.status} />
                  </td>
                  <td className="table-cell whitespace-nowrap text-xs">{f.lastInspection}</td>
                  <td className="table-cell">
                    <StatusBadge status={f.maintenanceStatus} />
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/fittings/${f.id}`}
                        className="inline-flex items-center gap-1 text-xs text-cyan-accent-400 hover:text-cyan-accent-300 font-medium"
                        title="View"
                      >
                        <Eye size={13} />
                        View
                      </Link>
                      <button
                        onClick={() => setEditFitting({ ...f })}
                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                        Edit
                      </button>
                      <Link
                        to={`/lifecycle/${f.id}`}
                        className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
                        title="History"
                      >
                        <Clock size={13} />
                        History
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500 text-sm">
                    No records match the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Fitting Modal */}
      {editFitting && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-dark-900 border border-navy-700 rounded-2xl max-w-lg w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit2 size={16} className="text-amber-400" />
                  Edit Fitting Record
                </h2>
                <span className="font-mono text-xs text-cyan-accent-400">{editFitting.id}</span>
              </div>
              <button
                onClick={() => setEditFitting(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="label">Fitting Status</label>
                <select
                  value={editFitting.status}
                  onChange={(e) => setEditFitting({ ...editFitting, status: e.target.value as FittingStatus })}
                  className="select-field"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Maintenance Status</label>
                <select
                  value={editFitting.maintenanceStatus}
                  onChange={(e) => setEditFitting({ ...editFitting, maintenanceStatus: e.target.value as MaintenanceStatus })}
                  className="select-field"
                >
                  {MAINT_OPTIONS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Track Location / Section</label>
                <input
                  type="text"
                  value={editFitting.location}
                  onChange={(e) => setEditFitting({ ...editFitting, location: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Standard Spec</label>
                <input
                  type="text"
                  value={editFitting.standardSpec || ''}
                  onChange={(e) => setEditFitting({ ...editFitting, standardSpec: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => setEditFitting(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="btn-primary text-xs"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
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
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Fitting ID (QR identifier)</label>
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
                    {TYPES.map((t) => (
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
                    {ZONES.map((z) => (
                      <option key={z}>{z}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Track Section</label>
                  <input
                    type="text"
                    value={newFitting.section}
                    onChange={(e) => setNewFitting({ ...newFitting, section: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
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
          </div>
        </div>
      )}
    </div>
  );
}
