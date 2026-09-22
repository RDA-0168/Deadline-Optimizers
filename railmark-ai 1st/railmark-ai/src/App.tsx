import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OfflineSyncProvider } from './context/OfflineSyncContext';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import QRScanner from './pages/QRScanner';
import FittingDatabase from './pages/FittingDatabase';
import FittingDetails from './pages/FittingDetails';
import InspectionPage from './pages/InspectionPage';
import MaintenancePage from './pages/MaintenancePage';
import LifecycleHistory from './pages/LifecycleHistory';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminDashboard from './pages/AdminDashboard';
import ReportsPage from './pages/ReportsPage';
import AIModePage from './pages/AIModePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected — wrapped in Layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="scanner" element={<QRScanner />} />
                <Route path="fittings" element={<FittingDatabase />} />
                <Route path="fittings/:id" element={<FittingDetails />} />
                <Route path="inspection" element={<InspectionPage />} />
                <Route path="maintenance" element={<MaintenancePage />} />
                <Route path="lifecycle/:id" element={<LifecycleHistory />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="ai-mode" element={<AIModePage />} />
                <Route path="edith" element={<AIModePage />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OfflineSyncProvider>
          <AppRoutes />
        </OfflineSyncProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

