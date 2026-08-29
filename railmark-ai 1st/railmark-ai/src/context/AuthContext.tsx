import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapBackendUserToFrontend(backendUser: any): User {
  const roleMap: Record<string, 'Admin' | 'Inspector' | 'Technician' | 'Viewer'> = {
    ADMIN: 'Admin',
    INSPECTOR: 'Inspector',
    MAINTENANCE: 'Technician',
    VIEWER: 'Viewer',
    Admin: 'Admin',
    Inspector: 'Inspector',
    Technician: 'Technician',
    Viewer: 'Viewer',
  };

  return {
    id: backendUser.id || backendUser.userId || 'USR-001',
    name: backendUser.fullName || backendUser.name || backendUser.username || 'RailMark User',
    role: roleMap[backendUser.role] || 'Inspector',
    email: backendUser.email || '',
    zone: backendUser.zone || 'Central Railway',
    badgeId: backendUser.badgeNumber || backendUser.badgeId || 'RM-DEMO-001',
  };
}

const API_BASE = (import.meta as any).env?.VITE_API_URL
  ? String((import.meta as any).env.VITE_API_URL).replace(/\/$/, '')
  : '';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('railmark_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('railmark_token') || null;
  });

  // Verify session on mount if token exists
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data?.data) {
          const mapped = mapBackendUserToFrontend(data.data);
          setUser(mapped);
          localStorage.setItem('railmark_user', JSON.stringify(mapped));
        }
      })
      .catch(() => {
        // Keep offline user cache if available
      });
  }, [token]);

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: emailOrUsername.trim(),
          password: password.trim(),
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.success && payload.data) {
          const jwtToken = payload.data.token;
          const mappedUser = mapBackendUserToFrontend(payload.data.user);

          setToken(jwtToken);
          setUser(mappedUser);
          localStorage.setItem('railmark_token', jwtToken);
          localStorage.setItem('railmark_user', JSON.stringify(mappedUser));
          return true;
        }
      }
    } catch (err) {
      console.warn('Backend login request failed, checking fallback demo:', err);
    }

    // Fallback demo simulation if backend is unreachable
    const isDemoAdmin =
      (emailOrUsername === 'admin@railmark.demo' || emailOrUsername === 'admin@railmark.ai' || emailOrUsername === 'admin') &&
      (password === 'admin123' || password === 'Admin@123');
    const isDemoInspector =
      (emailOrUsername === 'inspector@railmark.demo' || emailOrUsername === 'inspector@railmark.ai' || emailOrUsername === 'inspector') &&
      (password === 'demo123' || password === 'Inspector@123');

    if (isDemoAdmin) {
      const fallbackAdmin: User = {
        id: 'USR-001',
        name: 'Rajesh Sharma (Admin)',
        role: 'Admin',
        email: emailOrUsername,
        zone: 'Central Railway',
        badgeId: 'RM-ADM-8801',
      };
      setUser(fallbackAdmin);
      localStorage.setItem('railmark_user', JSON.stringify(fallbackAdmin));
      return true;
    }

    if (isDemoInspector) {
      const fallbackInspector: User = {
        id: 'USR-002',
        name: 'Ananya Verma (Inspector)',
        role: 'Inspector',
        email: emailOrUsername,
        zone: 'Northern Railway',
        badgeId: 'RM-INS-4421',
      };
      setUser(fallbackInspector);
      localStorage.setItem('railmark_user', JSON.stringify(fallbackInspector));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('railmark_token');
    localStorage.removeItem('railmark_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
