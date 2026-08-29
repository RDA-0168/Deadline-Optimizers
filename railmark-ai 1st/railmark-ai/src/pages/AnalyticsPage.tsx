import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend,
  RadialBarChart, RadialBar,
} from 'recharts';
import { BarChart3, TrendingUp, MapPin, Wrench } from 'lucide-react';
import { getDashboardStats } from '../services/api';
import type { DashboardStats } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const COLORS = ['#0070e0', '#00b8e6', '#3860ac', '#5878b8', '#7890c4', '#9fb0d5', '#c5d0e6'];
const MAINT_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

const Tip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        {label && <p className="text-gray-400 mb-1">{label}</p>}
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-white font-semibold">{payload[0].name}</p>
        <p className="text-cyan-accent-400">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then((res) => {
      if (res.data) setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner text="Loading analytics..." />;
  if (!stats) return null;

  const radialData = [
    { name: 'QR Verify Rate', value: stats.qrVerificationRate, fill: '#00b8e6' },
    { name: 'Active', value: Math.round((stats.activeFittings / stats.totalFittings) * 100), fill: '#10b981' },
    { name: 'Maintenance OK', value: Math.round(((stats.totalFittings - stats.maintenanceDue) / stats.totalFittings) * 100), fill: '#0070e0' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 size={20} className="text-cyan-accent-400" />
            Analytics
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Railway track fitting statistics · <span className="demo-banner inline-flex py-0">⚠ DEMO DATA</span></p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Fittings', value: stats.totalFittings, color: 'text-white' },
          { label: 'QR Verify Rate', value: `${stats.qrVerificationRate}%`, color: 'text-cyan-accent-400' },
          { label: 'Active Fittings', value: stats.activeFittings, color: 'text-emerald-400' },
          { label: 'Maintenance Due', value: stats.maintenanceDue, color: 'text-amber-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center">
            <div className={`text-3xl font-black ${color}`}>{value}</div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="section-title"><TrendingUp size={16} className="text-cyan-accent-400" /> Monthly Inspection Trend</div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyInspections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3560" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} iconSize={10} />
                <Line type="monotone" dataKey="inspected" name="Inspected" stroke="#00b8e6" strokeWidth={2} dot={{ fill: '#00b8e6', r: 3 }} />
                <Line type="monotone" dataKey="due" name="Due" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-title"><MapPin size={16} className="text-cyan-accent-400" /> Fittings by Railway Zone</div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.fittingsByZone} layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3560" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="zone" type="category" width={135} tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="count" name="Fittings" fill="#0070e0" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card">
          <div className="section-title"><BarChart3 size={16} className="text-cyan-accent-400" /> By Type</div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.fittingsByType} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {stats.fittingsByType.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<PieTip />} />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#9ca3af' }} iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-title"><Wrench size={16} className="text-cyan-accent-400" /> Maintenance Status</div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.maintenanceStatus} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value">
                  {stats.maintenanceStatus.map((_, idx) => <Cell key={idx} fill={MAINT_COLORS[idx % MAINT_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<PieTip />} />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#9ca3af' }} iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="section-title"><TrendingUp size={16} className="text-cyan-accent-400" /> Key Rates</div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius={20} outerRadius={80} data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#1e3560' }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '10px', color: '#9ca3af' }} />
                <Tooltip content={<Tip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Inspection status chart */}
      <div className="card">
        <div className="section-title"><BarChart3 size={16} className="text-cyan-accent-400" /> Inspection vs Maintenance Status (Combined)</div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Inspected Good', value: stats.inspectionStatus[0]?.value ?? 0 },
                { name: 'Inspection Due', value: stats.inspectionStatus[1]?.value ?? 0 },
                { name: 'Overdue Insp.', value: stats.inspectionStatus[2]?.value ?? 0 },
                { name: 'Maint. Completed', value: stats.maintenanceStatus[0]?.value ?? 0 },
                { name: 'Maint. Scheduled', value: stats.maintenanceStatus[1]?.value ?? 0 },
                { name: 'Maint. Overdue', value: stats.maintenanceStatus[2]?.value ?? 0 },
              ]}
              barSize={24}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3560" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <Cell key={idx} fill={['#10b981', '#f59e0b', '#ef4444', '#10b981', '#f59e0b', '#ef4444'][idx]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
