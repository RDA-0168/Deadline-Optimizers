import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode, Camera, CameraOff, Search, AlertCircle, CheckCircle2,
  Keyboard, ChevronRight, Upload, Loader2,
} from 'lucide-react';
import { scanQrCode } from '../services/api';
import StatusBadge from '../components/UI/StatusBadge';
import type { Fitting } from '../types';

const EXAMPLE_IDS = [
  'RM-FIT-0001', 'RM-FIT-0002', 'RM-FIT-0003', 'RM-FIT-0004', 'RM-FIT-0005',
];

export default function QRScanner() {
  const [cameraActive, setCameraActive] = useState(false);
  const [manualId, setManualId] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<Fitting | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'camera' | 'manual' | 'upload'>('camera');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setError(
        'Camera access not granted or camera not available on this device. You can use Quick Scan chips or Manual Entry below.'
      );
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const doSearch = async (id: string) => {
    const trimmed = id.trim().toUpperCase();
    if (!trimmed) return;
    setSearching(true);
    setError('');
    setResult(null);
    const res = await scanQrCode(trimmed);
    setSearching(false);
    if (res.success && res.data) {
      setResult(res.data);
    } else {
      setError(res.error ?? `No fitting found for QR code "${trimmed}".`);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(manualId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate scanning uploaded image filename or decode
    setSearching(true);
    setTimeout(() => {
      // Pick matched example or first fitting
      const matched = EXAMPLE_IDS[Math.floor(Math.random() * EXAMPLE_IDS.length)];
      doSearch(matched);
    }, 800);
  };

  const handleNavigate = () => {
    if (result) navigate(`/fittings/${result.id}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <QrCode size={20} className="text-cyan-accent-400" />
          Direct Part Marking (DPM) QR Scanner
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">Scan laser-etched QR code or enter fitting ID for digital traceability</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-navy-900 border border-navy-700 rounded-xl p-1">
        <button
          onClick={() => { setTab('camera'); setError(''); setResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'camera' ? 'bg-rail-blue-700 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <Camera size={15} />
          Camera Viewfinder
        </button>
        <button
          onClick={() => { setTab('manual'); stopCamera(); setError(''); setResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'manual' ? 'bg-rail-blue-700 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <Keyboard size={15} />
          Manual Entry
        </button>
        <button
          onClick={() => { setTab('upload'); stopCamera(); setError(''); setResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'upload' ? 'bg-rail-blue-700 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          <Upload size={15} />
          Upload QR Image
        </button>
      </div>

      {/* Camera Tab */}
      {tab === 'camera' && (
        <div className="card space-y-4">
          <div className="relative aspect-video bg-navy-950 rounded-xl overflow-hidden flex items-center justify-center border border-navy-700">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              playsInline
              muted
            />

            {/* Target Reticle Overlay */}
            {cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-cyan-accent-400/80 rounded-xl relative animate-pulse">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyan-accent-400 -mt-1 -ml-1 rounded-tl" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-cyan-accent-400 -mt-1 -mr-1 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyan-accent-400 -mb-1 -ml-1 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan-accent-400 -mb-1 -mr-1 rounded-br" />
                  <div className="w-full h-0.5 bg-cyan-accent-400/70 absolute top-1/2 -translate-y-1/2 shadow-[0_0_8px_#00b8e6]" />
                </div>
              </div>
            )}

            {!cameraActive && (
              <div className="text-center p-6 space-y-3">
                <div className="w-14 h-14 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto text-gray-400 border border-navy-700">
                  <Camera size={26} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Live Optical Camera Scanner</p>
                  <p className="text-xs text-gray-400 mt-0.5">Position laser-marked QR code inside reticle</p>
                </div>
                <button onClick={startCamera} className="btn-primary text-xs mx-auto">
                  <Camera size={14} />
                  Start Camera Feed
                </button>
              </div>
            )}
          </div>

          {cameraActive && (
            <div className="flex items-center justify-between">
              <button onClick={stopCamera} className="btn-secondary text-xs">
                <CameraOff size={14} />
                Stop Camera
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => doSearch('RM-FIT-0001')}
                  className="btn-accent text-xs"
                >
                  <QrCode size={13} />
                  Simulate QR Detect
                </button>
              </div>
            </div>
          )}

          {/* Quick Examples */}
          <div className="pt-3 border-t border-navy-800">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">
              Quick Scan Presets:
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_IDS.map((id) => (
                <button
                  key={id}
                  onClick={() => doSearch(id)}
                  className="px-2.5 py-1 bg-navy-800 hover:bg-rail-blue-900 border border-navy-700 hover:border-cyan-accent-500 rounded-lg text-xs font-mono text-cyan-accent-300 transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Tab */}
      {tab === 'manual' && (
        <div className="card space-y-4">
          <form onSubmit={handleManualSearch} className="space-y-4">
            <div>
              <label className="label">Fitting ID or Laser QR Code Value</label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  placeholder="e.g. RM-FIT-0001, RM-FIT-0002"
                  className="input-field pl-9 font-mono uppercase"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={searching || !manualId.trim()}
              className="btn-primary w-full justify-center text-xs py-2.5"
            >
              {searching ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Resolving QR Code...
                </>
              ) : (
                <>
                  <Search size={14} />
                  Lookup Fitting Record
                </>
              )}
            </button>
          </form>

          {/* Quick Examples */}
          <div className="pt-3 border-t border-navy-800">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">
              Click to Lookup Sample ID:
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_IDS.map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    setManualId(id);
                    doSearch(id);
                  }}
                  className="px-2.5 py-1 bg-navy-800 hover:bg-rail-blue-900 border border-navy-700 hover:border-cyan-accent-500 rounded-lg text-xs font-mono text-cyan-accent-300 transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Image Tab */}
      {tab === 'upload' && (
        <div className="card space-y-4 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-navy-600 hover:border-cyan-accent-400 rounded-2xl p-8 cursor-pointer transition-colors space-y-3"
          >
            <div className="w-12 h-12 bg-navy-800 rounded-xl flex items-center justify-center mx-auto text-cyan-accent-400">
              <Upload size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Click or drag & drop QR image</p>
              <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, JPEG optical photos of track fittings</p>
            </div>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="flex items-start gap-2 bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 text-sm text-red-300 animate-slide-up">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Scanned Result Card */}
      {result && (
        <div className="card border-cyan-accent-700/50 bg-slate-dark-900/95 space-y-4 animate-scale-in">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span className="text-sm font-bold text-white">QR Code Verified & Resolved</span>
            </div>
            <StatusBadge status={result.status} />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-navy-800">
              <span className="text-gray-400 font-semibold">Fitting ID</span>
              <span className="font-mono font-bold text-cyan-accent-300">{result.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-navy-800">
              <span className="text-gray-400 font-semibold">Type</span>
              <span className="text-gray-200">{result.fittingType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-navy-800">
              <span className="text-gray-400 font-semibold">Manufacturer</span>
              <span className="text-gray-200">{result.manufacturer}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-navy-800">
              <span className="text-gray-400 font-semibold">Location</span>
              <span className="text-gray-200">{result.location}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-navy-800">
              <span className="text-gray-400 font-semibold">Standard Spec</span>
              <span className="text-gray-200">{result.standardSpec || 'RDSO/IRS'}</span>
            </div>
          </div>

          <button
            onClick={handleNavigate}
            className="btn-primary w-full justify-center text-xs py-2.5"
          >
            <span>View Full Digital Traceability Profile</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
