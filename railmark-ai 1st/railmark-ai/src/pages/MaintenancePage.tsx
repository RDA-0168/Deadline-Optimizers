import { useEffect, useState } from 'react';
import { Wrench, Plus, CheckCircle2, Loader2, Calendar } from 'lucide-react';
import { getAllMaintenance, addMaintenance } from '../services/api';
import type { MaintenanceRecord } from '../types';
import StatusBadge from '../components/UI/StatusBadge';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const FITTING_IDS = ['RM-FIT-0001', 'RM-FIT-0002', 'RM-FIT-0003', 'RM-FIT-0004', 'RM-FIT-0005', 'RM-FIT-0006', 'RM-FIT-0007', 'RM-FIT-0008', 'RM-FIT-0009', 'RM-FIT-0010', 'RM-FIT-0011', 'RM-FIT-0012'];
const MAINT_TYPES = ['Preventive', 'Corrective', 'Emergency', 'Routine'];
const STATUSES = ['Completed', 'Scheduled', 'Overdue', 'Pending'];

interface FormState {
  fittingId: string;
  maintenanceDate: string;
  maintenanceType: 'Preventive' | 'Corrective' | 'Emergency' | 'Routine';
  technician: string;
  technicianId: string;
  description: string;
  status: 'Completed' | 'Scheduled' | 'Overdue' | 'Pending';
  nextMaintenance: string;
  cost: string;
}

export default function MaintenancePage() {
  const today = new Date().toISOString().split('T')[0];

  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormState>({
    fittingId: 'RM-FIT-0001',
    maintenanceDate: today,
    maintenanceType: 'Preventive',
    technician: '',
    technicianId: '',
    description: '',
    status: 'Scheduled',
    nextMaintenance: '',
    cost: '',
  });

  useEffect(() => {
    getAllMaintenance().then((res) => {
      if (res.data) setRecords(res.data);
      setLoading(false);
    });
  }, []);

  const set = (key: keyof FormState, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await addMaintenance({
      ...form,
      partsReplaced: [],
    });
    if (res.data) {
      const newRec = res.data;
      setRecords((p) => [newRec, ...p.filter((x) => x.id !== newRec.id)]);
    }
    setSubmitting(false);
    setSubmitted(true);
    setShowForm(false);
    setForm({
      fittingId: 'RM-FIT-0001',
      maintenanceDate: today,
      maintenanceType: 'Preventive',
      technician: '',
      technicianId: '',
      description: '',
      status: 'Scheduled',
      nextMaintenance: '',
      cost: '',
    });
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (loading) return <LoadingSpinner text="Loading maintenance records..." />;

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench size={20} className="text-cyan-accent-400" />
            Maintenance Records
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{records.length} records · <span className="demo-banner inline-flex py-0">⚠ DEMO DATA</span></p>
        </div>
        <button onClick={() => { setShowForm((s) => !s); setSubmitted(false); }} className="btn-primary text-xs self-start sm:self-auto">
          <Plus size={14} />
          {showForm ? 'Cancel' : 'Add Maintenance'}
        </button>
      </div>

      {submitted && (
        <div className="flex items-center gap-2 bg-emerald-900/25 border border-emerald-700/40 rounded-xl px-4 py-3 text-sm text-emerald-300">
          <CheckCircle2 size={16} className="text-emerald-400" />
          Maintenance record saved successfully (mock demo).
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="card border-navy-600 animate-slide-up">
          <div className="section-title text-sm"><Plus size={15} className="text-cyan-accent-400" /> New Maintenance Record</div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Fitting ID *</label>
                <select value={form.fittingId} onChange={(e) => set('fittingId', e.target.value)} className="select-field" required>
                  {FITTING_IDS.map((id) => <option key={id}>{id}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Maintenance Date *</label>
                <input type="date" value={form.maintenanceDate} onChange={(e) => set('maintenanceDate', e.target.value)} className="input-field" required />
              </div>
              <div>
                <label className="label">Type *</label>
                <select value={form.maintenanceType} onChange={(e) => set('maintenanceType', e.target.value as FormState['maintenanceType'])} className="select-field" required>
                  {MAINT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Technician Name *</label>
                <input type="text" value={form.technician} onChange={(e) => set('technician', e.target.value)} className="input-field" placeholder="Full name" required />
              </div>
              <div>
                <label className="label">Technician ID</label>
                <input type="text" value={form.technicianId} onChange={(e) => set('technicianId', e.target.value)} className="input-field" placeholder="TECH-00X" />
              </div>
              <div>
                <label className="label">Status *</label>
                <select value={form.status} onChange={(e) => set('status', e.target.value as FormState['status'])} className="select-field" required>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Next Maintenance Date</label>
                <input type="date" value={form.nextMaintenance} onChange={(e) => set('nextMaintenance', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label">Estimated Cost</label>
                <input type="text" value={form.cost} onChange={(e) => set('cost', e.target.value)} className="input-field" placeholder="₹0" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="label">Description *</label>
                <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className="input-field min-h-[70px] resize-y" placeholder="Describe maintenance work to be/already performed…" required />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="btn-primary px-8">
                {submitting ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                {submitting ? 'Saving…' : 'Save Record'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Records table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy-800/60">
              <tr>
                {['Record ID', 'Fitting ID', 'Date', 'Type', 'Technician', 'Description', 'Status', 'Next Maintenance'].map((h) => (
                  <th key={h} className="table-header whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-navy-800/30 transition-colors">
                  <td className="table-cell"><span className="font-mono text-xs text-gray-400">{r.id}</span></td>
                  <td className="table-cell"><span className="font-mono text-xs text-cyan-accent-400 font-semibold">{r.fittingId}</span></td>
                  <td className="table-cell whitespace-nowrap text-xs">{r.maintenanceDate}</td>
                  <td className="table-cell whitespace-nowrap text-xs">{r.maintenanceType}</td>
                  <td className="table-cell whitespace-nowrap text-xs">{r.technician}</td>
                  <td className="table-cell max-w-xs">
                    <span className="text-xs truncate block">{r.description}</span>
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="table-cell whitespace-nowrap text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar size={11} />
                      {r.nextMaintenance || '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
