import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import {
  X, Download, Copy, Check, QrCode, ExternalLink,
  ShieldCheck, Cpu,
} from 'lucide-react';
import type { Fitting } from '../../types';
import StatusBadge from './StatusBadge';

interface QRCodeModalProps {
  fitting: Fitting | null;
  onClose: () => void;
}

export default function QRCodeModal({ fitting, onClose }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [laserEffect, setLaserEffect] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  if (!fitting) return null;

  const qrPayload = fitting.qrId || fitting.id;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy QR code:', err);
    }
  };

  const handleDownloadPNG = () => {
    setDownloading(true);
    try {
      // Find the hidden QRCodeCanvas
      const sourceCanvas = document.getElementById(`qr-canvas-${fitting.id}`) as HTMLCanvasElement;
      if (!sourceCanvas) {
        setDownloading(false);
        return;
      }

      // Generate a high-res labeled specification placard for the fitting
      const exportCanvas = document.createElement('canvas');
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) {
        setDownloading(false);
        return;
      }

      const width = 600;
      const height = 750;
      exportCanvas.width = width;
      exportCanvas.height = height;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Header top bar (Navy blue)
      ctx.fillStyle = '#0a1628';
      ctx.fillRect(0, 0, width, 70);

      // Header top cyan stripe
      ctx.fillStyle = '#00e5ff';
      ctx.fillRect(0, 0, width, 4);

      // Header Text
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 20px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('INDIAN RAILWAYS · RAILMARK AI', width / 2, 42);

      // QR Code container border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(90, 100, 420, 420);

      // Draw QR Canvas centered
      ctx.drawImage(sourceCanvas, 110, 120, 380, 380);

      // Fitting ID Badge below QR
      ctx.fillStyle = '#0a1628';
      ctx.font = 'bold 26px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(fitting.id, width / 2, 560);

      // Subtitle / Type
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(fitting.fittingType, width / 2, 590);

      // Metadata divider
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 615);
      ctx.lineTo(width - 80, 615);
      ctx.stroke();

      // Technical Details Grid
      ctx.fillStyle = '#475569';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`• Zone: ${fitting.railwayZone}`, 80, 645);
      ctx.fillText(`• Section: ${fitting.section || fitting.location}`, 80, 670);
      ctx.fillText(`• Standard: ${fitting.standardSpec || 'IRS:T-31-2021'}`, 80, 695);

      ctx.textAlign = 'right';
      ctx.fillText(`Mfg: ${fitting.manufacturer}`, width - 80, 645);
      ctx.fillText(`Batch: ${fitting.batchNumber}`, width - 80, 670);
      ctx.fillText(`Date: ${fitting.manufacturingDate}`, width - 80, 695);

      // Footer note
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DIRECT PART MARKING (DPM) TRACEABILITY · LASER ETCHED VERIFICATION', width / 2, 730);

      // Trigger Download
      const dataUrl = exportCanvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `RailMark_QR_${fitting.id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('QR download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleTestInScanner = () => {
    onClose();
    navigate('/scanner');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      {/* Hidden QRCodeCanvas for generating high-res PNG export */}
      <div className="hidden" ref={canvasRef}>
        <QRCodeCanvas
          id={`qr-canvas-${fitting.id}`}
          value={qrPayload}
          size={500}
          level="H"
          includeMargin={true}
        />
      </div>

      <div className="bg-slate-dark-900 border border-cyan-accent-800/40 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scale-in relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-accent-500/10 border border-cyan-accent-500/30 flex items-center justify-center text-cyan-accent-400">
              <QrCode size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Laser QR Code Token
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-accent-900/60 text-cyan-accent-300 border border-cyan-accent-700/50 font-mono">
                  DPM 2D
                </span>
              </h2>
              <p className="text-xs text-gray-400">Fitting ID: <span className="font-mono text-cyan-accent-300 font-semibold">{fitting.id}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* QR Code Card Display */}
        <div className="flex flex-col items-center justify-center">
          <div
            className={`relative p-5 rounded-2xl transition-all duration-300 ${
              laserEffect
                ? 'bg-navy-950 border-2 border-cyan-accent-400 shadow-[0_0_25px_rgba(0,184,230,0.3)]'
                : 'bg-white border-4 border-navy-700 shadow-xl'
            }`}
          >
            <QRCodeSVG
              value={qrPayload}
              size={200}
              level="H"
              includeMargin={false}
              fgColor={laserEffect ? '#00e5ff' : '#0a1628'}
              bgColor={laserEffect ? '#070f1e' : '#ffffff'}
              className="rounded-lg transition-colors"
            />

            {/* Simulated Laser Etching Corners */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-accent-400 opacity-80" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-accent-400 opacity-80" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-accent-400 opacity-80" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-accent-400 opacity-80" />
          </div>

          {/* Laser Mode Toggle Switch */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => setLaserEffect(!laserEffect)}
              className="text-[11px] text-gray-400 hover:text-cyan-accent-300 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-800/80 border border-navy-700 hover:border-cyan-accent-600 transition-colors"
            >
              <Cpu size={12} className={laserEffect ? 'text-cyan-accent-400' : 'text-gray-400'} />
              {laserEffect ? 'Laser Etch Mode (Dark)' : 'Standard Print Mode (Light)'}
            </button>
          </div>
        </div>

        {/* Payload / ID Copy Bar */}
        <div className="bg-navy-950/80 border border-navy-800 rounded-xl p-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Encoded Payload</div>
            <div className="font-mono text-sm text-cyan-accent-300 font-bold truncate">{qrPayload}</div>
          </div>
          <button
            onClick={handleCopy}
            className={`btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 flex-shrink-0 transition-all ${
              copied ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30' : ''
            }`}
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={13} />
                Copy ID
              </>
            )}
          </button>
        </div>

        {/* Fitting Metadata Summary */}
        <div className="bg-navy-900/60 border border-navy-800 rounded-xl p-3.5 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Fitting Type:</span>
            <span className="font-medium text-gray-200 text-right">{fitting.fittingType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Railway Zone:</span>
            <span className="font-medium text-gray-200">{fitting.railwayZone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Location / Section:</span>
            <span className="font-medium text-gray-200 text-right truncate max-w-[200px]" title={fitting.section || fitting.location}>
              {fitting.section || fitting.location}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Manufacturer:</span>
            <span className="font-medium text-gray-200">{fitting.manufacturer}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-navy-800/80">
            <span className="text-gray-400">Status:</span>
            <StatusBadge status={fitting.status} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={handleDownloadPNG}
            disabled={downloading}
            className="btn-primary text-xs justify-center py-2 col-span-2 sm:col-span-1"
          >
            <Download size={14} />
            {downloading ? 'Exporting...' : 'Save PNG'}
          </button>
          <button
            onClick={handleTestInScanner}
            className="btn-secondary text-xs justify-center py-2 text-cyan-accent-300 hover:text-white hover:border-cyan-accent-500"
          >
            <ShieldCheck size={14} />
            Test Scanner
          </button>
          <button
            onClick={() => {
              onClose();
              navigate(`/fittings/${fitting.id}`);
            }}
            className="btn-secondary text-xs justify-center py-2"
          >
            <ExternalLink size={14} />
            Full Details
          </button>
        </div>
      </div>
    </div>
  );
}
