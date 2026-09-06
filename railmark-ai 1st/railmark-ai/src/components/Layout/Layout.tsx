import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, QrCode, Database, Search, ClipboardCheck,
  Wrench, BarChart3, ShieldCheck, FileText, Sparkles,
  LogOut, Menu, X, ChevronRight, Bell, User,
  Zap, AlertTriangle, CheckCircle2,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/scanner', icon: QrCode, label: 'QR Scanner' },
  { to: '/fittings', icon: Database, label: 'Fitting Database' },
  { to: '/inspection', icon: ClipboardCheck, label: 'Inspection' },
  { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin', icon: ShieldCheck, label: 'Admin Dashboard' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/ai-mode', icon: Sparkles, label: 'AI Mode' },
];

const NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'warning',
    title: 'Maintenance Required',
    msg: 'Fitting RM-FIT-0004 on Southern Coastal Line flagged for corrosion treatment.',
    time: '10m ago',
    link: '/fittings/RM-FIT-0004',
  },
  {
    id: 'n2',
    type: 'info',
    title: 'Inspection Due',
    msg: 'Fitting RM-FIT-0005 scheduled for quarterly ultrasonic check.',
    time: '1h ago',
    link: '/fittings/RM-FIT-0005',
  },
  {
    id: 'n3',
    type: 'success',
    title: 'Database Engine Active',
    msg: 'Unified REST API backend & persistent store connected successfully.',
    time: 'Just now',
    link: '/dashboard',
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-navy-950 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-dark-900 border-r border-navy-800 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-navy-800">
          <div className="w-9 h-9 bg-rail-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-rail-blue-900/30">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight tracking-wide">RAILMARK AI</div>
            <div className="text-gray-500 text-xs">Digital Traceability</div>
          </div>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Demo badge */}
        <div className="mx-4 mt-4">
          <div className="demo-banner w-full justify-center text-xs py-1">
            ⚡ LIVE UNIFIED PROTOTYPE
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 sidebar-scroll">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const isAi = to === '/ai-mode';
            const active = isActive(to);

            if (isAi) {
              return (
                <div key={to} className="pt-2">
                  <Link
                    to={to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                      active
                        ? 'ai-3d-glow-active text-white'
                        : 'ai-3d-glow text-cyan-accent-300 hover:text-white'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-cyan-accent-500/20 border border-cyan-accent-400/60 flex items-center justify-center flex-shrink-0 shadow-inner">
                      <Sparkles size={14} className="text-cyan-accent-300 animate-pulse" />
                    </div>
                    <span className="tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-300 drop-shadow-[0_2px_8px_rgba(0,230,255,0.7)] font-black">
                      {label}
                    </span>
                    <span className="ml-auto text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-rail-blue-500 text-navy-950 shadow-md shadow-cyan-500/40 tracking-wider animate-pulse">
                      3D AI
                    </span>
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={active ? 'nav-link-active' : 'nav-link'}
              >
                <Icon size={17} />
                <span>{label}</span>
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-4 py-4 border-t border-navy-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-rail-blue-700 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">
              {user?.name ? user.name[0] : <User size={14} />}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user?.name || 'Demo User'}</div>
              <div className="text-xs text-gray-400">{user?.role || 'Inspector'} · {user?.zone?.split(' ')[0] || 'Central'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary w-full justify-center text-xs py-2"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-slate-dark-900 border-b border-navy-800 px-4 py-3 flex items-center gap-3 flex-shrink-0 relative z-20">
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm text-gray-400 min-w-0">
            <Search size={14} className="flex-shrink-0" />
            <span className="font-mono text-xs text-cyan-accent-400 truncate">
              {location.pathname}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2 relative">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
                title="Notifications"
              >
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              </button>

              {/* Notification Popover Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-slate-dark-900 border border-navy-700 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-scale-in">
                  <div className="flex items-center justify-between border-b border-navy-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Bell size={15} className="text-cyan-accent-400" />
                      <span className="text-sm font-bold text-white">System Alerts</span>
                    </div>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {NOTIFICATIONS.map((n) => (
                      <Link
                        key={n.id}
                        to={n.link}
                        onClick={() => setNotificationsOpen(false)}
                        className="block p-2.5 rounded-xl bg-navy-800/60 hover:bg-navy-800 border border-navy-700/60 hover:border-navy-600 transition-all text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            {n.type === 'warning' && <AlertTriangle size={13} className="text-amber-400" />}
                            {n.type === 'success' && <CheckCircle2 size={13} className="text-emerald-400" />}
                            {n.type === 'info' && <Zap size={13} className="text-cyan-accent-400" />}
                            {n.title}
                          </span>
                          <span className="text-[10px] text-gray-500">{n.time}</span>
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed">{n.msg}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/scanner"
              className="btn-accent text-xs py-1.5 px-3 hidden sm:inline-flex"
            >
              <QrCode size={14} />
              Scan QR
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto scrollbar-thin"
          onClick={() => {
            if (notificationsOpen) setNotificationsOpen(false);
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
