import { Link } from 'react-router-dom';
import {
  QrCode, BarChart3, ChevronRight, Zap, Cpu, Database, Smartphone,
  Camera, Brain, Fingerprint, CheckCircle2, ArrowRight,
  Shield, Activity, Globe,
} from 'lucide-react';

const WORKFLOW = [
  { icon: Zap, label: 'Fitting', desc: 'Track component' },
  { icon: Camera, label: 'Camera', desc: 'AI imaging' },
  { icon: Brain, label: 'AI', desc: 'Recognition' },
  { icon: Fingerprint, label: 'Unique ID', desc: 'Assignment' },
  { icon: QrCode, label: 'QR', desc: 'Code generation' },
  { icon: Cpu, label: 'Laser Mark', desc: 'Permanent mark' },
  { icon: CheckCircle2, label: 'Verification', desc: 'Quality check' },
  { icon: Database, label: 'Database', desc: 'Record stored' },
  { icon: Smartphone, label: 'Mobile App', desc: 'Field access' },
];

const TECH_PILLARS = [
  { icon: Cpu, label: 'LASER', color: 'text-amber-400', bg: 'bg-amber-900/20', border: 'border-amber-800/40', desc: 'Permanent laser etching for durable QR marks on metal fittings' },
  { icon: QrCode, label: 'QR', color: 'text-cyan-accent-400', bg: 'bg-cyan-accent-900/20', border: 'border-cyan-accent-800/40', desc: 'Standardised QR codes for instant mobile/scanner identification' },
  { icon: Brain, label: 'AI', color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-800/40', desc: 'AI-assisted condition assessment and anomaly detection' },
  { icon: Database, label: 'DATABASE', color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-800/40', desc: 'Centralised digital lifecycle records for every fitting' },
];

const STATS = [
  { value: '12+', label: 'Fitting Types Supported' },
  { value: '97%', label: 'QR Read Accuracy' },
  { value: '16', label: 'Railway Zones Coverage' },
  { value: '24/7', label: 'Digital Record Access' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-white font-sans">
      {/* ── Header ── */}
      <header className="border-b border-navy-800 bg-slate-dark-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-rail-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm sm:text-base tracking-wide">RAILMARK AI</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="demo-banner hidden sm:inline-flex">⚠ DEMO</span>
            <Link to="/login" className="btn-primary text-xs sm:text-sm">
              Sign In <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-grid">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-rail-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center relative">
          <div className="inline-flex items-center gap-2 bg-navy-800/60 border border-navy-600 rounded-full px-4 py-1.5 text-xs text-cyan-accent-400 font-semibold mb-8">
            <Activity size={12} className="animate-pulse" />
            Smart India Hackathon 2026 · Prototype
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            RAILMARK<span className="text-gradient"> AI</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-4 leading-relaxed">
            AI-Assisted Laser QR Marking & Digital Traceability
            <br className="hidden sm:block" />
            for Railway Track Fittings
          </p>

          <p className="text-sm text-gray-400 max-w-2xl mx-auto mb-10">
            Connecting physical railway assets with digital lifecycle records through AI-assisted
            identification, durable laser marking and QR-based traceability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/scanner" className="btn-accent w-full sm:w-auto justify-center text-base px-8 py-3">
              <QrCode size={18} />
              SCAN QR
            </Link>
            <Link to="/dashboard" className="btn-secondary w-full sm:w-auto justify-center text-base px-8 py-3">
              <BarChart3 size={18} />
              VIEW DASHBOARD
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="mt-6">
            <Link to="/login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Sign in with demo credentials →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tech Pillars ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">Core Technology Stack</h2>
          <p className="text-gray-400 text-sm">Four integrated systems for complete asset traceability</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TECH_PILLARS.map(({ icon: Icon, label, color, bg, border, desc }) => (
            <div key={label} className={`card-dark ${bg} border ${border} text-center`}>
              <div className={`w-12 h-12 ${bg} border ${border} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <Icon size={22} className={color} />
              </div>
              <div className={`text-lg font-black ${color} mb-2 tracking-widest`}>{label}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Workflow ── */}
      <section className="bg-slate-dark-900/50 border-y border-navy-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">End-to-End Workflow</h2>
            <p className="text-gray-400 text-sm">From fitting production to field verification</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {WORKFLOW.map(({ icon: Icon, label, desc }, idx) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 bg-navy-800 border border-navy-600 rounded-xl flex items-center justify-center hover:border-cyan-accent-600 hover:bg-navy-700 transition-all duration-200">
                    <Icon size={18} className="text-cyan-accent-400" />
                  </div>
                  <span className="text-xs font-bold text-white text-center">{label}</span>
                  <span className="text-xs text-gray-500 text-center hidden sm:block">{desc}</span>
                </div>
                {idx < WORKFLOW.length - 1 && (
                  <ArrowRight size={14} className="text-navy-600 flex-shrink-0 mb-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="card text-center">
              <div className="text-3xl font-black text-gradient mb-1">{value}</div>
              <div className="text-xs text-gray-400 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-slate-dark-900/50 border-y border-navy-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Key Capabilities</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: QrCode, title: 'QR Scanner', desc: 'Instant field identification via mobile camera. Works offline with cached records.' },
              { icon: Activity, title: 'Lifecycle Tracking', desc: 'Complete audit trail from manufacturing to decommissioning.' },
              { icon: Brain, title: 'AI Condition Assessment', desc: 'Automated condition scoring from field images (requires human verification).' },
              { icon: Shield, title: 'Inspection Management', desc: 'Structured inspection workflows with configurable checklists.' },
              { icon: Globe, title: 'Zone-wise Analytics', desc: 'Dashboard charts for maintenance and inspection status by railway zone.' },
              { icon: FileIcon, title: 'Report Generation', desc: 'Export fitting condition reports for audit and compliance.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card hover:border-navy-600 transition-colors duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-rail-blue-900/50 border border-rail-blue-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-cyan-accent-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm mb-1">{title}</div>
                    <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Ready to explore the prototype?
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Use demo credentials to access the full frontend. No backend required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login" className="btn-primary w-full sm:w-auto justify-center px-10 py-3 text-base">
            Get Started <ArrowRight size={16} />
          </Link>
          <Link to="/scanner" className="btn-accent w-full sm:w-auto justify-center px-10 py-3 text-base">
            <QrCode size={16} />
            Try QR Scanner
          </Link>
        </div>
        <div className="mt-8 p-4 bg-amber-900/20 border border-amber-700/40 rounded-xl text-xs text-amber-300 max-w-lg mx-auto">
          ⚠ DISCLAIMER: This is a Smart India Hackathon prototype. All data is simulated for demonstration purposes.
          Not affiliated with or endorsed by Indian Railways or any government body.
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-navy-800 py-8 text-center text-xs text-gray-500">
        <p>RailMark AI · SIH 2026 Prototype · Frontend Demo Only</p>
        <p className="mt-1">Built with React · TypeScript · Tailwind CSS · Recharts</p>
      </footer>
    </div>
  );
}

// Inline icon to avoid import issues
function FileIcon({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
