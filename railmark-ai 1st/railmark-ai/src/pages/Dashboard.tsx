import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import {
  Database, ClipboardCheck, Wrench, Clock, QrCode, CheckCircle2,
  TrendingUp, MapPin, ArrowRight, AlertTriangle, Sparkles,
} from 'lucide-react';
import { getDashboardStats } from '../services/api';
import type { DashboardStats } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const COLORS = ['#0070e0', '#00b8e6', '#3860ac', '#5878b8', '#7890c4', '#9fb0d5', '#c5d0e6'];
const STATUS_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-white font-semibold">{payload[0].name}</p>
        <p className="text-cyan-accent-400">{payload[0].value} fittings</p>
      </div>
    );
  }
  return null;
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  sub?: string;
  color?: string;
  alert?: boolean;
  link?: string;
}

function StatCard({ icon: Icon, label, value, sub, color = 'text-cyan-accent-400', alert, link }: StatCardProps) {
  const card = (
    <div className={`stat-card hover:border-navy-600 transition-all duration-200 ${alert ? 'border-amber-700/50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${alert ? 'bg-amber-900/30' : 'bg-navy-800'}`}>
          <Icon size={18} className={alert ? 'text-amber-400' : color} />
        </div>
        {link && <ArrowRight size={14} className="text-gray-600" />}
      </div>
      <div className={`text-3xl font-black ${color} mt-2`}>{value}</div>
      <div className="text-sm font-semibold text-white">{label}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  );

  return link ? <Link to={link}>{card}</Link> : card;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then((res) => {
      if (res.data) setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (!stats) return null;

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Railway Track Fitting Traceability Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="demo-banner">⚠ DEMO / PROTOTYPE DATA</div>
          <Link to="/scanner" className="btn-accent text-xs">
            <QrCode size={14} />
            Scan QR
          </Link>
        </div>
      </div>

      {/* Alert if maintenance overdue */}
      {stats.maintenanceDue > 0 && (
        <div className="flex items-center gap-3 bg-amber-900/20 border border-amber-700/40 rounded-xl px-4 py-3">
          <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
          <span className="text-sm text-amber-300">
            <strong>{stats.maintenanceDue}</strong> fittings require maintenance attention.{' '}
            <Link to="/maintenance" className="underline text-amber-400 hover:text-amber-300">View Maintenance →</Link>
          </span>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Database} label="Total Fittings" value={stats.totalFittings} sub="Registered in system" link="/fittings" />
        <StatCard icon={CheckCircle2} label="Inspected" value={stats.inspectedThisMonth} sub="This month" color="text-emerald-400" link="/inspection" />
        <StatCard icon={Wrench} label="Maintenance Due" value={stats.maintenanceDue} sub="Require attention" alert link="/maintenance" />
        <StatCard icon={Clock} label="Pending Inspection" value={stats.pendingInspection} sub="Overdue or due soon" color="text-amber-400" link="/inspection" />
        <StatCard icon={QrCode} label="Recently Scanned" value={stats.recentlyScanned} sub="Last 30 days" color="text-blue-400" link="/scanner" />
        <StatCard icon={TrendingUp} label="QR Verify Rate" value={`${stats.qrVerificationRate}%`} sub="Successful reads" color="text-purple-400" />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Fittings by Type */}
        <div className="card">
          <div className="section-title">
            <Database size={18} className="text-cyan-accent-400" />
            Fittings by Type
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.fittingsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats.fittingsByType.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }}
                  iconSize={10}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Inspections */}
        <div className="card">
          <div className="section-title">
            <ClipboardCheck size={18} className="text-cyan-accent-400" />
            Monthly Inspections
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyInspections} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3560" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} iconSize={10} />
                <Bar dataKey="inspected" name="Inspected" fill="#0070e0" radius={[3, 3, 0, 0]} />
                <Bar dataKey="due" name="Due" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Inspection Status */}
        <div className="card">
          <div className="section-title">
            <ClipboardCheck size={18} className="text-cyan-accent-400" />
            Inspection Status
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.inspectionStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats.inspectionStatus.map((_, idx) => (
                    <Cell key={idx} fill={STATUS_COLORS[idx % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fittings by Zone */}
        <div className="card">
          <div className="section-title">
            <MapPin size={18} className="text-cyan-accent-400" />
            Fittings by Railway Zone
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.fittingsByZone} layout="vertical" barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3560" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="zone" type="category" width={120} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Fittings" fill="#00b8e6" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { to: '/scanner', label: 'Scan QR Code', icon: QrCode, color: 'text-cyan-accent-400' },
          { to: '/fittings', label: 'Browse Fittings', icon: Database, color: 'text-blue-400' },
          { to: '/inspection', label: 'Add Inspection', icon: ClipboardCheck, color: 'text-emerald-400' },
          { to: '/reports', label: 'Generate Report', icon: TrendingUp, color: 'text-purple-400' },
          { to: '/ai-mode', label: 'AI Mode', icon: Sparkles, color: 'text-cyan-accent-300' },
        ].map(({ to, label, icon: Icon, color }) => (
          <Link key={to} to={to} className="card hover:border-navy-600 transition-all duration-200 flex items-center gap-3 text-sm font-medium text-gray-300 hover:text-white">
            <Icon size={18} className={color} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
