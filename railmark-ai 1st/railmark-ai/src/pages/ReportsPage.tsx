import { useState } from 'react';
import {
  FileText, Download, Filter, Calendar, CheckCircle2, Loader2,
  Database, ClipboardCheck, Wrench, AlertTriangle, Printer,
} from 'lucide-react';
import { generateReport } from '../services/api';
import type { Fitting, InspectionRecord, MaintenanceRecord } from '../types';
import StatusBadge from '../components/UI/StatusBadge';

const ZONES = ['All Zones', 'Central Railway', 'North Central Railway', 'Southern Railway', 'Eastern Railway', 'Western Railway', 'South Central Railway', 'North Western Railway', 'East Central Railway', 'West Central Railway', 'North Eastern Railway', 'Northeast Frontier Railway'];
const REPORT_TYPES = ['Full Report', 'Fittings Only', 'Inspections Only', 'Maintenance Only'];

interface ReportData {
  fittings: Fitting[];
  inspections: InspectionRecord[];
  maintenance: MaintenanceRecord[];
}

export default function ReportsPage() {
  const today = new Date().toISOString().split('T')[0];
  const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [fromDate, setFromDate] = useState(sixMonthsAgo);
  const [toDate, setToDate] = useState(today);
  const [zone, setZone] = useState('All Zones');
  const [reportType, setReportType] = useState('Full Report');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReportData | null>(null);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setData(null);
    const res = await generateReport({
      from: fromDate,
      to: toDate,
      zone: zone !== 'All Zones' ? zone : undefined,
    });
    if (res.data) setData(res.data);
    setLoading(false);
    setGenerated(true);
  };

  const handleDownloadCSV = () => {
    if (!data) return;

    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'Full Report' || reportType === 'Fittings Only') {
      csvContent += '--- FITTINGS ---\r\n';
      csvContent += 'Fitting ID,Type,Manufacturer,Location,Railway Zone,Status,Last Inspection,Maintenance Status\r\n';
      data.fittings.forEach((f) => {
        csvContent += `"${f.id}","${f.fittingType}","${f.manufacturer}","${f.location.replace(/"/g, '""')}","${f.railwayZone}","${f.status}","${f.lastInspection}","${f.maintenanceStatus}"\r\n`;
      });
      csvContent += '\r\n';
    }

    if (reportType === 'Full Report' || reportType === 'Inspections Only') {
      csvContent += '--- INSPECTIONS ---\r\n';
      csvContent += 'Inspection ID,Fitting ID,Date,Inspector,Condition,QR Readability,Corrosion,Surface Damage,Deformation,Wear,AI Condition,AI Confidence\r\n';
      data.inspections.forEach((i) => {
        csvContent += `"${i.id}","${i.fittingId}","${i.inspectionDate}","${i.inspector}","${i.condition}","${i.qrReadability}","${i.corrosion}","${i.surfaceDamage}","${i.deformation}","${i.wear}","${i.aiCondition || ''}","${i.aiConfidence || ''}"\r\n`;
      });
      csvContent += '\r\n';
    }

    if (reportType === 'Full Report' || reportType === 'Maintenance Only') {
      csvContent += '--- MAINTENANCE RECORDS ---\r\n';
      csvContent += 'Record ID,Fitting ID,Date,Type,Technician,Status,Next Maintenance,Description\r\n';
      data.maintenance.forEach((m) => {
        csvContent += `"${m.id}","${m.fittingId}","${m.maintenanceDate}","${m.maintenanceType}","${m.technician}","${m.status}","${m.nextMaintenance || ''}","${m.description.replace(/"/g, '""')}"\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `railmark_report_${reportType.toLowerCase().replace(/\s+/g, '_')}_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const activeFittings = data?.fittings.filter((f) => f.status === 'Active').length ?? 0;
  const dueFittings = data?.fittings.filter((f) => f.status === 'Inspection Due').length ?? 0;
  const maintReq = data?.fittings.filter((f) => f.status === 'Maintenance Required' || (f.status as string) === 'Critical').length ?? 0;

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fade-in print:p-0 print:bg-white print:text-black">
      {/* Header */}
      <div className="print:hidden">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText size={20} className="text-cyan-accent-400" />
          Traceability & Compliance Reports
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">Generate and export fitting condition reports · <span className="demo-banner inline-flex py-0">LIVE DATABASE</span></p>
      </div>

      {/* Report configuration */}
      <div className="card print:hidden">
        <div className="section-title text-sm"><Filter size={15} className="text-cyan-accent-400" /> Report Configuration</div>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label">From Date</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="input-field pl-9" />
              </div>
            </div>
            <div>
              <label className="label">To Date</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="input-field pl-9" />
              </div>
            </div>
            <div>
              <label className="label">Railway Zone</label>
              <select value={zone} onChange={(e) => setZone(e.target.value)} className="select-field">
                {ZONES.map((z) => <option key={z}>{z}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Report Type</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="select-field">
                {REPORT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={loading} className="btn-primary px-6 text-xs">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
              {loading ? 'Generating…' : 'Generate Report'}
            </button>
            {generated && data && (
              <>
                <button
                  type="button"
                  className="btn-accent text-xs"
                  onClick={handleDownloadCSV}
                >
                  <Download size={14} />
                  Download CSV
                </button>
                <button
                  type="button"
                  className="btn-secondary text-xs"
                  onClick={handlePrintPDF}
                >
                  <Printer size={14} />
                  Print / Export PDF
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Report output */}
      {loading && (
        <div className="card text-center py-12">
          <Loader2 size={36} className="text-cyan-accent-400 mx-auto mb-3 animate-spin" />
          <p className="text-gray-400 text-sm">Querying database and compiling reports…</p>
        </div>
      )}

      {generated && data && !loading && (
        <div className="space-y-5 animate-slide-up">
          {/* Report header */}
          <div className="card border-cyan-accent-700/40">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-emerald-400 font-semibold text-sm">Official Report Generated</span>
                </div>
                <h2 className="text-lg font-bold text-white">{reportType}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Period: {fromDate} to {toDate} · Zone: {zone}</p>
              </div>
              <div className="demo-banner">RAILMARK AI TRACEABILITY</div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Database, label: 'Total Fittings', value: data.fittings.length, color: 'text-white' },
                { icon: CheckCircle2, label: 'Active', value: activeFittings, color: 'text-emerald-400' },
                { icon: AlertTriangle, label: 'Inspection Due', value: dueFittings, color: 'text-amber-400' },
                { icon: Wrench, label: 'Maintenance Req.', value: maintReq, color: 'text-red-400' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-navy-800/50 rounded-xl p-4 text-center">
                  <Icon size={18} className={`${color} mx-auto mb-2`} />
                  <div className={`text-2xl font-black ${color}`}>{value}</div>
                  <div className="text-xs text-gray-400">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fittings table */}
          {(reportType === 'Full Report' || reportType === 'Fittings Only') && (
            <div className="card p-0 overflow-hidden">
              <div className="px-5 py-3 border-b border-navy-800 flex items-center gap-2">
                <Database size={15} className="text-cyan-accent-400" />
                <span className="text-sm font-semibold text-white">Fittings ({data.fittings.length})</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-navy-800/60">
                    <tr>
                      {['ID', 'Type', 'Location', 'Zone', 'Status', 'Last Inspection', 'Maintenance'].map((h) => (
                        <th key={h} className="table-header whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.fittings.map((f) => (
                      <tr key={f.id} className="hover:bg-navy-800/20 transition-colors">
                        <td className="table-cell"><span className="font-mono text-xs text-cyan-accent-400 font-semibold">{f.id}</span></td>
                        <td className="table-cell text-xs whitespace-nowrap">{f.fittingType}</td>
                        <td className="table-cell text-xs">{f.location}</td>
                        <td className="table-cell text-xs whitespace-nowrap">{f.railwayZone}</td>
                        <td className="table-cell"><StatusBadge status={f.status} /></td>
                        <td className="table-cell text-xs whitespace-nowrap">{f.lastInspection}</td>
                        <td className="table-cell"><StatusBadge status={f.maintenanceStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inspections table */}
          {(reportType === 'Full Report' || reportType === 'Inspections Only') && data.inspections.length > 0 && (
            <div className="card p-0 overflow-hidden">
              <div className="px-5 py-3 border-b border-navy-800 flex items-center gap-2">
                <ClipboardCheck size={15} className="text-cyan-accent-400" />
                <span className="text-sm font-semibold text-white">Inspections ({data.inspections.length})</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-navy-800/60">
                    <tr>
                      {['Fitting ID', 'Date', 'Inspector', 'Condition', 'QR Quality', 'Corrosion'].map((h) => (
                        <th key={h} className="table-header whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.inspections.map((i) => (
                      <tr key={i.id} className="hover:bg-navy-800/20 transition-colors">
                        <td className="table-cell"><span className="font-mono text-xs text-cyan-accent-400 font-semibold">{i.fittingId}</span></td>
                        <td className="table-cell text-xs whitespace-nowrap">{i.inspectionDate}</td>
                        <td className="table-cell text-xs whitespace-nowrap">{i.inspector}</td>
                        <td className="table-cell"><StatusBadge status={i.condition} /></td>
                        <td className="table-cell text-xs">{i.qrReadability}</td>
                        <td className="table-cell text-xs">{i.corrosion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Maintenance table */}
          {(reportType === 'Full Report' || reportType === 'Maintenance Only') && data.maintenance.length > 0 && (
            <div className="card p-0 overflow-hidden">
              <div className="px-5 py-3 border-b border-navy-800 flex items-center gap-2">
                <Wrench size={15} className="text-cyan-accent-400" />
                <span className="text-sm font-semibold text-white">Maintenance ({data.maintenance.length})</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-navy-800/60">
                    <tr>
                      {['Fitting ID', 'Date', 'Type', 'Technician', 'Status', 'Next Maintenance'].map((h) => (
                        <th key={h} className="table-header whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.maintenance.map((m) => (
                      <tr key={m.id} className="hover:bg-navy-800/20 transition-colors">
                        <td className="table-cell"><span className="font-mono text-xs text-cyan-accent-400 font-semibold">{m.fittingId}</span></td>
                        <td className="table-cell text-xs whitespace-nowrap">{m.maintenanceDate}</td>
                        <td className="table-cell text-xs whitespace-nowrap">{m.maintenanceType}</td>
                        <td className="table-cell text-xs whitespace-nowrap">{m.technician}</td>
                        <td className="table-cell"><StatusBadge status={m.status} /></td>
                        <td className="table-cell text-xs whitespace-nowrap">{m.nextMaintenance || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
