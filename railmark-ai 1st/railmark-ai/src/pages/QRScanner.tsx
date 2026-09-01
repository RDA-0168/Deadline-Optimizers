import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode, Camera, CameraOff, Search, AlertCircle, CheckCircle2,
  Keyboard, ChevronRight, Upload, Loader2, Sparkles, RefreshCw,
  Info, ShieldAlert,
} from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { scanQrCode } from '../services/api';
import StatusBadge from '../components/UI/StatusBadge';
import type { Fitting } from '../types';

const EXAMPLE_IDS = [
  'RM-FIT-0001', 'RM-FIT-0002', 'RM-FIT-0003', 'RM-FIT-0004', 'RM-FIT-0005',
];

export default function QRScanner() {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [manualId, setManualId] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<Fitting | null>(null);
  const [scannedCodeValue, setScannedCodeValue] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'camera' | 'manual' | 'upload'>('camera');
  const [showSampleQRs, setShowSampleQRs] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const stopCamera = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.warn('Error while stopping QR scanner:', err);
      }
      scannerRef.current = null;
    }
    setCameraActive(false);
    setCameraLoading(false);
    isProcessingRef.current = false;
  }, []);

  const doSearch = useCallback(async (rawCode: string) => {
    const trimmed = rawCode.trim();
    if (!trimmed) return;

    setSearching(true);
    setError('');
    setResult(null);
    setScannedCodeValue(trimmed);

    const res = await scanQrCode(trimmed);
    setSearching(false);

    if (res.success && res.data) {
      setResult(res.data);
    } else {
      setError(
        res.error ?? `QR code decoded as "${trimmed}", but no matching rail fitting was found in the database.`
      );
    }
  }, []);

  const startCamera = async () => {
    setError('');
    setResult(null);
    setScannedCodeValue(null);
    setCameraLoading(true);

    // Stop existing scanner if any
    await stopCamera();

    try {
      const qrRegionId = 'qr-camera-reader';
      const html5QrCode = new Html5Qrcode(qrRegionId, {
        verbose: false,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
          Html5QrcodeSupportedFormats.CODE_128,
        ],
      });
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const edge = Math.min(viewfinderWidth, viewfinderHeight);
          const size = Math.floor(edge * 0.7);
          return { width: Math.max(size, 180), height: Math.max(size, 180) };
        },
        aspectRatio: 1.777778,
      };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        async (decodedText) => {
          // REAL QR CODE DETECTED!
          if (!decodedText || isProcessingRef.current) return;
          isProcessingRef.current = true;

          // Stop camera scanning
          try {
            if (html5QrCode.isScanning) {
              await html5QrCode.stop();
            }
            html5QrCode.clear();
          } catch (e) {
            console.warn('Error stopping scanner after detection:', e);
          }
          scannerRef.current = null;
          setCameraActive(false);

          // Process the scanned QR code
          await doSearch(decodedText);
          isProcessingRef.current = false;
        },
        () => {
          // Per-frame callback when no QR code in frame - completely silent
        }
      );

      setCameraActive(true);
      setCameraLoading(false);
    } catch (err: any) {
      console.error('Camera startup error:', err);
      setCameraActive(false);
      setCameraLoading(false);
      setError(
        'Unable to access camera. Please ensure camera permissions are granted in your browser, or use Upload QR Image / Manual Entry.'
      );
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setResult(null);
    setScannedCodeValue(null);
    setSearching(true);

    try {
      // Use Html5Qrcode to scan the genuine image file
      const fileScanner = new Html5Qrcode('qr-file-reader-target', {
        verbose: false,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
          Html5QrcodeSupportedFormats.CODE_128,
        ],
      });

      try {
        const decodedText = await fileScanner.scanFile(file, false);
        if (!decodedText || !decodedText.trim()) {
          throw new Error('No QR code detected');
        }
        await doSearch(decodedText);
      } catch (scanErr) {
        setError(
          'No valid QR code or Data Matrix detected in this image. Please upload a clear photo of an authentic RailMark Direct Part Mark (DPM).'
        );
      } finally {
        try {
          fileScanner.clear();
        } catch {
          // ignore
        }
      }
    } catch (err: any) {
      setError('Failed to process the uploaded image file. Please try another image.');
    } finally {
      setSearching(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(manualId);
  };

  const handleNavigate = () => {
    if (result) navigate(`/fittings/${result.id}`);
  };

  // Cleanup camera when switching tabs or unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleTabChange = async (newTab: 'camera' | 'manual' | 'upload') => {
    if (tab === 'camera' && cameraActive) {
      await stopCamera();
    }
    setTab(newTab);
    setError('');
    setResult(null);
    setScannedCodeValue(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5 animate-fade-in">
      {/* Hidden element for file scanning */}
      <div id="qr-file-reader-target" className="hidden" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <QrCode size={20} className="text-cyan-accent-400" />
            Direct Part Marking (DPM) QR Scanner
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Optical detection for laser-etched 2D Data Matrix and QR codes on railway fittings
          </p>
        </div>
        <button
          onClick={() => setShowSampleQRs(!showSampleQRs)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-cyan-accent-500 rounded-lg text-xs font-medium text-cyan-accent-300 transition-colors self-start sm:self-auto"
        >
          <Sparkles size={13} />
          {showSampleQRs ? 'Hide Test QRs' : 'Sample Test QRs'}
        </button>
      </div>

      {/* Sample QRs Helper Box */}
      {showSampleQRs && (
        <div className="card bg-navy-900/90 border border-cyan-accent-800/40 p-4 space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-accent-300 uppercase tracking-wider">
              <Info size={14} />
              Sample Direct Part Marking QR Codes (For Testing)
            </div>
            <span className="text-[11px] text-gray-400">Right click to copy or save</span>
          </div>
          <p className="text-xs text-gray-300">
            Scan these with your camera viewfinder or save them to test the image uploader. Real QR decoding is strictly enforced.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {EXAMPLE_IDS.slice(0, 4).map((id) => (
              <div key={id} className="bg-navy-950 p-2.5 rounded-lg border border-navy-700 text-center space-y-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`}
                  alt={`QR ${id}`}
                  className="w-24 h-24 mx-auto rounded bg-white p-1"
                />
                <div className="font-mono text-xs text-white font-semibold">{id}</div>
                <button
                  onClick={() => {
                    setTab('manual');
                    setManualId(id);
                    doSearch(id);
                  }}
                  className="text-[10px] text-cyan-accent-400 hover:underline block mx-auto"
                >
                  Quick Test →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex bg-navy-900 border border-navy-700 rounded-xl p-1">
        <button
          onClick={() => handleTabChange('camera')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'camera' ? 'bg-rail-blue-700 text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Camera size={15} />
          Camera Viewfinder
        </button>
        <button
          onClick={() => handleTabChange('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'manual' ? 'bg-rail-blue-700 text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Keyboard size={15} />
          Manual Entry
        </button>
        <button
          onClick={() => handleTabChange('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'upload' ? 'bg-rail-blue-700 text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Upload size={15} />
          Upload QR Image
        </button>
      </div>

      {/* Camera Tab */}
      {tab === 'camera' && (
        <div className="card space-y-4">
          <div className="relative aspect-video bg-navy-950 rounded-xl overflow-hidden flex items-center justify-center border border-navy-700">
            {/* HTML5 QR Code Container */}
            <div
              id="qr-camera-reader"
              className={`w-full h-full ${cameraActive ? 'block' : 'hidden'}`}
            />

            {/* Target Reticle Overlay while active */}
            {cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-cyan-accent-400/80 rounded-xl relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyan-accent-400 -mt-1 -ml-1 rounded-tl" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-cyan-accent-400 -mt-1 -mr-1 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyan-accent-400 -mb-1 -ml-1 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan-accent-400 -mb-1 -mr-1 rounded-br" />
                  <div className="w-full h-0.5 bg-cyan-accent-400/80 absolute top-1/2 -translate-y-1/2 shadow-[0_0_8px_#00b8e6] scan-line" />
                </div>
                <div className="absolute bottom-3 left-0 right-0 text-center">
                  <span className="px-3 py-1 bg-navy-950/80 backdrop-blur-sm border border-navy-700 rounded-full text-xs text-cyan-accent-300 font-medium">
                    Align QR code inside box to scan
                  </span>
                </div>
              </div>
            )}

            {/* Inactive or Loading State */}
            {!cameraActive && (
              <div className="text-center p-6 space-y-3">
                <div className="w-14 h-14 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto text-gray-400 border border-navy-700">
                  {cameraLoading ? (
                    <Loader2 size={26} className="animate-spin text-cyan-accent-400" />
                  ) : (
                    <Camera size={26} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Live Optical Camera Scanner</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Real-time detection for QR code & Direct Part Marking (DPM)
                  </p>
                </div>
                <button
                  onClick={startCamera}
                  disabled={cameraLoading}
                  className="btn-primary text-xs mx-auto"
                >
                  {cameraLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Initializing Camera...
                    </>
                  ) : (
                    <>
                      <Camera size={14} />
                      Start Camera Feed
                    </>
                  )}
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
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Optical Feed Active
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-navy-800 text-xs text-gray-400 flex items-center gap-2">
            <ShieldAlert size={14} className="text-cyan-accent-400 flex-shrink-0" />
            <span>
              Real-time decoder only fires when a verified QR code or Data Matrix is recognized in the frame.
            </span>
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
              Quick Test Presets (Registered Database IDs):
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
            onClick={() => !searching && fileInputRef.current?.click()}
            className="border-2 border-dashed border-navy-600 hover:border-cyan-accent-400 rounded-2xl p-8 cursor-pointer transition-colors space-y-3"
          >
            <div className="w-12 h-12 bg-navy-800 rounded-xl flex items-center justify-center mx-auto text-cyan-accent-400">
              {searching ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <Upload size={22} />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {searching ? 'Decoding Image & Verifying QR Pattern...' : 'Click or drag & drop QR image'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports PNG, JPG, JPEG, WEBP optical photos of track fittings
              </p>
            </div>
            <p className="text-[11px] text-gray-500">
              Strict pattern recognition — Non-QR images will be rejected
            </p>
          </div>
        </div>
      )}

      {/* Searching spinner if search is active */}
      {searching && (
        <div className="flex items-center justify-center gap-3 p-4 bg-navy-900 border border-navy-700 rounded-xl text-sm text-cyan-accent-300">
          <Loader2 size={18} className="animate-spin" />
          <span>Decoding QR data and fetching digital twin record...</span>
        </div>
      )}

      {/* Error display */}
      {error && !searching && (
        <div className="flex items-start gap-2.5 bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 text-sm text-red-300 animate-slide-up">
          <AlertCircle size={17} className="flex-shrink-0 mt-0.5 text-red-400" />
          <div className="space-y-1">
            <div className="font-semibold text-red-200">Scan Validation Notice</div>
            <div className="text-xs text-red-300/90 leading-relaxed">{error}</div>
          </div>
        </div>
      )}

      {/* Scanned Result Card */}
      {result && !searching && (
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
            {scannedCodeValue && scannedCodeValue !== result.id && (
              <div className="flex justify-between py-1 border-b border-navy-800">
                <span className="text-gray-400 font-semibold">Scanned Raw Value</span>
                <span className="font-mono text-gray-300 truncate max-w-[200px]">{scannedCodeValue}</span>
              </div>
            )}
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

          <div className="flex gap-2">
            <button
              onClick={() => {
                setResult(null);
                setScannedCodeValue(null);
                if (tab === 'camera') startCamera();
              }}
              className="btn-secondary flex-1 justify-center text-xs py-2.5"
            >
              <RefreshCw size={13} />
              Scan Another
            </button>
            <button
              onClick={handleNavigate}
              className="btn-primary flex-1 justify-center text-xs py-2.5"
            >
              <span>View Full Profile</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
