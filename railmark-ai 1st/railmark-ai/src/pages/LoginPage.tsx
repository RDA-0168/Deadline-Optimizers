import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Eye, EyeOff, LogIn, AlertCircle, QrCode } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use the demo accounts listed below.');
    }
  };

  const fillDemo = (role: 'admin' | 'inspector') => {
    if (role === 'admin') {
      setEmail('admin@railmark.demo');
      setPassword('admin123');
    } else {
      setEmail('inspector@railmark.demo');
      setPassword('demo123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-navy-950 bg-grid flex flex-col items-center justify-center px-4 py-12">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rail-blue-600/8 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-rail-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <Zap size={20} className="text-white" />
        </div>
        <div>
          <div className="text-white font-black text-xl tracking-wide">RAILMARK AI</div>
          <div className="text-gray-500 text-xs">Track Traceability System</div>
        </div>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md">
        <div className="card-dark border border-navy-700 p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white mb-1">Sign In</h1>
            <p className="text-gray-400 text-sm">Access the RailMark AI prototype</p>
          </div>

          {/* Demo banner */}
          <div className="demo-banner w-full justify-center mb-6">
            ⚠ DEMO / PROTOTYPE — Use test credentials below
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter email"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-900/30 border border-red-700/50 rounded-lg px-3 py-2.5 text-sm text-red-300">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Quick fill */}
          <div className="mt-6 pt-5 border-t border-navy-700">
            <p className="text-xs text-gray-400 text-center mb-3 font-semibold uppercase tracking-widest">
              Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemo('admin')}
                className="btn-secondary text-xs py-2 justify-center"
              >
                Admin Demo
              </button>
              <button
                onClick={() => fillDemo('inspector')}
                className="btn-secondary text-xs py-2 justify-center"
              >
                Inspector Demo
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center space-y-1">
              <div><span className="text-gray-400">Admin:</span> admin@railmark.demo / admin123</div>
              <div><span className="text-gray-400">Inspector:</span> inspector@railmark.demo / demo123</div>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 inline-flex items-center gap-1 transition-colors">
            <QrCode size={12} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
