import { useState } from 'react';
import {
  ClipboardCheck, Brain, CheckCircle2, AlertCircle, Loader2, Info,
} from 'lucide-react';
import { addInspection } from '../services/api';
import StatusBadge from '../components/UI/StatusBadge';
import type { ConditionStatus } from '../types';

const FITTING_IDS = ['RM-FIT-0001', 'RM-FIT-0002', 'RM-FIT-0003', 'RM-FIT-0004', 'RM-FIT-0005', 'RM-FIT-0006', 'RM-FIT-0007', 'RM-FIT-0008', 'RM-FIT-0009', 'RM-FIT-0010', 'RM-FIT-0011', 'RM-FIT-0012'];
const CONDITIONS: ConditionStatus[] = ['Good', 'Needs Attention', 'Maintenance Required', 'Critical'];
const QR_READ = ['Excellent', 'Good', 'Fair', 'Poor', 'Unreadable'];
const CORROSION = ['None', 'Mild', 'Moderate', 'Severe'];
const SURFACE = ['None', 'Minor', 'Moderate', 'Severe'];
const DEFORMATION = ['None', 'Minor', 'Significant', 'Critical'];
const WEAR = ['Normal', 'Moderate', 'High', 'Excessive'];

interface FormState {
  fittingId: string;
  inspectionDate: string;
  inspector: string;
  inspectorId: string;
  condition: ConditionStatus;
  qrReadability: string;
  corrosion: string;
  surfaceDamage: string;
  deformation: string;
  wear: string;
  notes: string;
}

function mockAiAnalyse(form: FormState) {
  const warnFactors = [
    form.corrosion !== 'None',
    form.surfaceDamage !== 'None',
    form.deformation !== 'None',
    form.wear !== 'Normal',
  ].filter(Boolean).length;

  const aiCondition: ConditionStatus =
    warnFactors >= 3 ? 'Critical' :
    warnFactors >= 2 ? 'Maintenance Required' :
    warnFactors >= 1 ? 'Needs Attention' : 'Good';

  const qrScore =
    form.qrReadability === 'Excellent' ? 98 :
    form.qrReadability === 'Good' ? 92 :
    form.qrReadability === 'Fair' ? 72 :
    form.qrReadability === 'Poor' ? 45 : 10;

  // Deterministic AI confidence based on severity factors (Max: 99%)
  const confidence =
    warnFactors === 0 ? 99 :
    warnFactors === 1 ? 92 :
    warnFactors === 2 ? 85 : 78;

  return { aiCondition, aiQrQuality: qrScore, aiConfidence: confidence };
}

export default function InspectionPage() {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<FormState>({
    fittingId: 'RM-FIT-0001',
    inspectionDate: today,
    inspector: '',
    inspectorId: '',
    condition: 'Good',
    qrReadability: 'Good',
    corrosion: 'None',
    surfaceDamage: 'None',
    deformation: 'None',
    wear: 'Normal',
    notes: '',
  });

  const [aiResult, setAiResult] = useState<{ aiCondition: ConditionStatus; aiQrQuality: number; aiConfidence: number } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof FormState, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setAiResult(null);
    setSubmitted(false);
  };

  const runAI = async () => {
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setAiResult(mockAiAnalyse(form));
    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await addInspection({
      ...form,
      condition: form.condition as ConditionStatus,
      qrReadability: form.qrReadability as 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Unreadable',
      corrosion: form.corrosion as 'None' | 'Mild' | 'Moderate' | 'Severe',
      surfaceDamage: form.surfaceDamage as 'None' | 'Minor' | 'Moderate' | 'Severe',
      deformation: form.deformation as 'None' | 'Minor' | 'Significant' | 'Critical',
      wear: form.wear as 'Normal' | 'Moderate' | 'High' | 'Excessive',
      aiConfidence: aiResult?.aiConfidence,
      aiCondition: aiResult?.aiCondition,
      aiQrQuality: aiResult?.aiQrQuality,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ClipboardCheck size={20} className="text-cyan-accent-400" />
          Add Inspection Record
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">Record a field inspection with AI-assisted assessment</p>
      </div>

      {submitted ? (
        <div className="card border-emerald-700/50 text-center py-12 space-y-4">
          <CheckCircle2 size={48} className="text-emerald-400 mx-auto" />
          <div className="text-lg font-bold text-white">Inspection Recorded</div>
          <p className="text-gray-400 text-sm">Record for <span className="font-mono text-cyan-accent-400">{form.fittingId}</span> saved successfully (mock).</p>
          <button onClick={() => { setSubmitted(false); setAiResult(null); }} className="btn-secondary mx-auto">
            Add Another Inspection
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Main form */}
            <div className="lg:col-span-2 space-y-4">
              {/* Fitting & Meta */}
              <div className="card space-y-4">
                <div className="section-title text-sm"><ClipboardCheck size={15} className="text-cyan-accent-400" /> Inspection Details</div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Fitting ID *</label>
                    <select value={form.fittingId} onChange={(e) => set('fittingId', e.target.value)} className="select-field" required>
                      {FITTING_IDS.map((id) => <option key={id}>{id}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Inspection Date *</label>
                    <input type="date" value={form.inspectionDate} onChange={(e) => set('inspectionDate', e.target.value)} className="input-field" required />
                  </div>
                  <div>
                    <label className="label">Inspector Name *</label>
                    <input type="text" value={form.inspector} onChange={(e) => set('inspector', e.target.value)} className="input-field" placeholder="Full name" required />
                  </div>
                  <div>
                    <label className="label">Inspector ID *</label>
                    <input type="text" value={form.inspectorId} onChange={(e) => set('inspectorId', e.target.value)} className="input-field" placeholder="e.g. INS-001" required />
                  </div>
                </div>
              </div>

              {/* Assessment fields */}
              <div className="card space-y-4">
                <div className="section-title text-sm"><AlertCircle size={15} className="text-cyan-accent-400" /> Field Assessment</div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Overall Condition', key: 'condition' as keyof FormState, options: CONDITIONS },
                    { label: 'QR Readability', key: 'qrReadability' as keyof FormState, options: QR_READ },
                    { label: 'Corrosion', key: 'corrosion' as keyof FormState, options: CORROSION },
                    { label: 'Surface Damage', key: 'surfaceDamage' as keyof FormState, options: SURFACE },
                    { label: 'Deformation', key: 'deformation' as keyof FormState, options: DEFORMATION },
                    { label: 'Wear Level', key: 'wear' as keyof FormState, options: WEAR },
                  ].map(({ label, key, options }) => (
                    <div key={key}>
                      <label className="label">{label}</label>
                      <select value={form[key]} onChange={(e) => set(key, e.target.value)} className="select-field">
                        {options.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="label">Notes / Observations</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => set('notes', e.target.value)}
                    className="input-field min-h-[80px] resize-y"
                    placeholder="Describe any observations, concerns, or recommendations…"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center py-3">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  {submitting ? 'Saving…' : 'Submit Inspection'}
                </button>
                <button type="button" onClick={runAI} disabled={aiLoading} className="btn-accent px-4">
                  {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
                  {aiLoading ? 'Analysing…' : 'AI Analyse'}
                </button>
              </div>
            </div>

            {/* AI Panel */}
            <div className="space-y-4">
              <div className="card border-purple-800/40">
                <div className="flex items-center gap-2 mb-4">
                  <Brain size={16} className="text-purple-400" />
                  <span className="text-sm font-bold text-white">E.D.I.T.H AI</span>
                  <span className="badge badge-info text-xs ml-auto">Active</span>
                </div>

                {!aiResult && !aiLoading && (
                  <div className="text-center py-6">
                    <Brain size={32} className="text-purple-900 mx-auto mb-3" />
                    <p className="text-xs text-gray-500">Fill in assessment fields and click <strong className="text-purple-300">AI Analyse</strong> to get E.D.I.T.H AI condition scoring.</p>
                  </div>
                )}

                {aiLoading && (
                  <div className="text-center py-6">
                    <Loader2 size={32} className="text-purple-400 mx-auto mb-3 animate-spin" />
                    <p className="text-xs text-gray-400">E.D.I.T.H AI running analysis…</p>
                  </div>
                )}

                {aiResult && (
                  <div className="space-y-4">
                    {/* Confidence meter */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400">E.D.I.T.H Confidence</span>
                        <span className="font-bold text-purple-300">{Math.min(99, aiResult.aiConfidence)}%</span>
                      </div>
                      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-700 to-purple-400 rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(99, Math.max(0, aiResult.aiConfidence))}%` }}
                        />
                      </div>
                    </div>

                    {/* AI Condition */}
                    <div>
                      <div className="text-xs text-gray-400 mb-1">E.D.I.T.H Assessed Condition</div>
                      <StatusBadge status={aiResult.aiCondition} className="text-sm" />
                    </div>

                    {/* QR Quality */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400">QR Quality Score</span>
                        <span className="font-bold text-cyan-accent-300">{Math.min(99, aiResult.aiQrQuality)}%</span>
                      </div>
                      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-accent-700 to-cyan-accent-400 rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(99, Math.max(0, aiResult.aiQrQuality))}%` }}
                        />
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="flex items-start gap-2 bg-amber-900/20 border border-amber-700/30 rounded-lg px-3 py-2.5">
                      <Info size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-300 leading-relaxed">
                        E.D.I.T.H AI result — <strong>requires human verification</strong> before recording.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Current form summary */}
              <div className="card">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Form Summary</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fitting</span>
                    <span className="font-mono text-cyan-accent-400">{form.fittingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Condition</span>
                    <StatusBadge status={form.condition} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">QR Quality</span>
                    <span className="text-gray-300">{form.qrReadability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Corrosion</span>
                    <span className="text-gray-300">{form.corrosion}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
