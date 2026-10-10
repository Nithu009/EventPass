import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import api from '../services/api';
import {
  Camera, CameraOff, QrCode, CheckCircle2, XCircle, AlertTriangle,
  RefreshCw, Search, Scan, User, Calendar, MapPin, Clock, Shield,
  ChevronDown, Wifi, WifiOff
} from 'lucide-react';

const SCANNER_ID = 'qr-reader-viewport';

// ── Status Card ──────────────────────────────────────────────────────────────
const ScanResult = ({ result, onScanAgain }) => {
  if (!result) return null;

  const status = result?.data?.scanStatus || (result.success ? 'VALID' : 'INVALID');
  const data   = result?.data || {};

  const cfg = {
    VALID:           { bg: 'rgba(16,185,129,0.08)', border: '#10b981', icon: CheckCircle2,    iconColor: '#10b981', badge: 'ENTRY APPROVED', badgeBg: '#10b981' },
    ALREADY_SCANNED: { bg: 'rgba(239,68,68,0.08)',  border: '#ef4444', icon: AlertTriangle,   iconColor: '#f59e0b', badge: 'ALREADY SCANNED', badgeBg: '#ef4444' },
    INVALID:         { bg: 'rgba(239,68,68,0.08)',  border: '#ef4444', icon: XCircle,         iconColor: '#ef4444', badge: 'ENTRY DENIED',    badgeBg: '#ef4444' },
  }[status] || { bg: 'rgba(239,68,68,0.08)', border: '#ef4444', icon: XCircle, iconColor: '#ef4444', badge: 'INVALID', badgeBg: '#ef4444' };

  const Icon = cfg.icon;

  return (
    <div style={{
      border: `1px solid ${cfg.border}`,
      borderLeft: `4px solid ${cfg.border}`,
      backgroundColor: cfg.bg,
      borderRadius: '1rem',
      padding: '1.75rem',
      marginTop: '1.5rem',
      animation: 'fadeInUp 0.4s ease'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: `${cfg.iconColor}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon size={28} color={cfg.iconColor} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            backgroundColor: cfg.badgeBg,
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            marginBottom: '0.35rem'
          }}>
            {cfg.badge}
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            {data.statusMessage || result.message || 'Scan complete'}
          </h3>
        </div>
      </div>

      {/* Details grid */}
      {(data.eventTitle || data.attendeeName || data.seatCode) && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem',
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderRadius: '0.75rem', padding: '1rem',
          marginBottom: '1rem'
        }}>
          {data.attendeeName && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <User size={15} color="#6366f1" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Attendee</div>
                <div style={{ fontSize: '0.875rem', color: '#f1f5f9', fontWeight: 600 }}>{data.attendeeName}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{data.attendeeEmail}</div>
              </div>
            </div>
          )}
          {data.eventTitle && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Calendar size={15} color="#8b5cf6" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Event</div>
                <div style={{ fontSize: '0.875rem', color: '#f1f5f9', fontWeight: 600 }}>{data.eventTitle}</div>
              </div>
            </div>
          )}
          {data.seatCode && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <MapPin size={15} color="#10b981" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Seat</div>
                <div style={{ fontSize: '0.875rem', color: '#f1f5f9', fontWeight: 600 }}>
                  {data.seatCode} — <span style={{ color: '#a78bfa' }}>{data.seatCategory}</span>
                </div>
              </div>
            </div>
          )}
          {data.ticketNumber && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <QrCode size={15} color="#f59e0b" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Ticket #</div>
                <div style={{ fontSize: '0.875rem', color: '#f1f5f9', fontFamily: 'monospace' }}>{data.ticketNumber}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Already-scanned warning block */}
      {status === 'ALREADY_SCANNED' && (
        <div style={{
          backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '0.625rem', padding: '0.875rem',
          display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
          marginBottom: '1rem'
        }}>
          <Shield size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.25rem' }}>
              Duplicate Scan Detected
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
              This ticket was already admitted
              {data.scannedBy ? ` by ${data.scannedBy}` : ''}
              {data.previousScanAt ? ` at ${new Date(data.previousScanAt).toLocaleString()}` : ''}.
              Do not allow entry.
            </div>
          </div>
        </div>
      )}

      {/* Validated at */}
      {data.validatedAt && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#64748b' }}>
          <Clock size={12} />
          Scanned at {new Date(data.validatedAt).toLocaleString()}
        </div>
      )}

      {/* Scan Again */}
      <button
        onClick={onScanAgain}
        className="btn btn-primary"
        style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
      >
        <RefreshCw size={16} /> Scan Next Ticket
      </button>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export const AdminValidateTicketPage = () => {
  const [cameras, setCameras]           = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [scanning, setScanning]         = useState(false);
  const [scanResult, setScanResult]     = useState(null);
  const [manualToken, setManualToken]   = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [camError, setCamError]         = useState('');
  const [tab, setTab]                   = useState('camera'); // 'camera' | 'manual'
  const [scanCount, setScanCount]       = useState(0);

  const html5QrRef  = useRef(null);
  const scanningRef = useRef(false); // prevent double-fire

  // ── Load cameras ────────────────────────────────────────────────────────
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length) {
          setCameras(devices);
          // Prefer rear camera
          const rear = devices.find(d =>
            /back|rear|environment/i.test(d.label)
          );
          setSelectedCamera(rear ? rear.id : devices[0].id);
        } else {
          setCamError('No cameras detected on this device.');
        }
      })
      .catch(err => {
        setCamError('Camera permission denied or no camera available. Please allow camera access and reload.');
        console.error(err);
      });
  }, []);

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  const stopCamera = useCallback(async () => {
    if (html5QrRef.current) {
      try {
        if (html5QrRef.current.isScanning) {
          await html5QrRef.current.stop();
        }
        html5QrRef.current.clear();
      } catch (_) {}
      html5QrRef.current = null;
    }
    setScanning(false);
    scanningRef.current = false;
  }, []);

  // ── Start camera ─────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    if (!selectedCamera) { setCamError('Please select a camera first.'); return; }
    setError('');
    setCamError('');
    setScanResult(null);
    scanningRef.current = false;

    const qr = new Html5Qrcode(SCANNER_ID, {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      verbose: false
    });
    html5QrRef.current = qr;

    try {
      await qr.start(
        selectedCamera,
        { fps: 12, qrbox: { width: 240, height: 240 }, aspectRatio: 1 },
        async (decodedText) => {
          if (scanningRef.current) return; // guard duplicate triggers
          scanningRef.current = true;
          await stopCamera();
          await submitToken(decodedText.trim());
        },
        () => {} // silent per-frame fail
      );
      setScanning(true);
    } catch (err) {
      setCamError(`Could not start camera: ${err?.message || err}. Try a different camera or use manual entry.`);
      html5QrRef.current = null;
    }
  }, [selectedCamera, stopCamera]);

  // ── Submit token to backend ──────────────────────────────────────────────
  const submitToken = useCallback(async (token) => {
    if (!token) return;
    setLoading(true);
    setScanResult(null);
    try {
      const res = await api.post('/admin/tickets/validate', { token });
      setScanResult({ success: res?.data?.valid, data: res?.data });
      setScanCount(c => c + 1);
    } catch (err) {
      const errData = err?.data || err;
      const alreadyScanned = errData?.scanStatus === 'ALREADY_SCANNED';
      setScanResult({
        success: false,
        data: errData,
        message: errData?.message || errData?.statusMessage || 'Verification failed'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Manual submit ────────────────────────────────────────────────────────
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    await submitToken(manualToken.trim());
  };

  const handleScanAgain = async () => {
    setScanResult(null);
    setManualToken('');
    if (tab === 'camera') await startCamera();
  };

  return (
    <div style={{ maxWidth: 720 }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '0.625rem',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Scan size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Gate Ticket Scanner</h1>
        </div>
        <p style={{ color: '#64748b', margin: 0 }}>
          Scan attendee QR codes for instant validation. Duplicate scans are automatically flagged.
        </p>
        {scanCount > 0 && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            marginTop: '0.75rem', padding: '0.3rem 0.75rem',
            backgroundColor: 'rgba(99,102,241,0.12)', borderRadius: '999px',
            fontSize: '0.8125rem', color: '#818cf8', fontWeight: 600
          }}>
            <CheckCircle2 size={13} /> {scanCount} ticket{scanCount > 1 ? 's' : ''} scanned this session
          </div>
        )}
      </div>

      {/* ── Tab Bar ── */}
      <div style={{
        display: 'flex', backgroundColor: '#0f1623',
        borderRadius: '0.75rem', padding: '0.3rem',
        marginBottom: '1.5rem', border: '1px solid #1e293b'
      }}>
        {[
          { id: 'camera', label: 'Camera Scan', icon: Camera },
          { id: 'manual', label: 'Manual Entry', icon: Search }
        ].map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setScanResult(null); if (t.id !== 'camera') stopCamera(); }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '0.5rem',
                border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                transition: 'all 150ms',
                backgroundColor: active ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: active ? '#818cf8' : '#64748b'
              }}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Camera Tab ── */}
      {tab === 'camera' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Camera selector */}
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #1e293b' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
              Select Camera
            </label>
            {cameras.length > 0 ? (
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedCamera}
                  onChange={e => { setSelectedCamera(e.target.value); if (scanning) stopCamera(); }}
                  className="form-control"
                  style={{ paddingRight: '2.5rem', appearance: 'none' }}
                  disabled={scanning}
                >
                  {cameras.map(cam => (
                    <option key={cam.id} value={cam.id}>{cam.label || `Camera ${cam.id.slice(0, 8)}`}</option>
                  ))}
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.875rem' }}>
                <WifiOff size={16} /> {camError || 'Detecting cameras…'}
              </div>
            )}
          </div>

          {/* Viewfinder */}
          <div style={{ position: 'relative', backgroundColor: '#060912', minHeight: 300 }}>
            {/* The html5-qrcode library renders into this div */}
            <div
              id={SCANNER_ID}
              style={{ width: '100%' }}
            />
            {!scanning && !scanResult && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '1rem',
                background: 'radial-gradient(circle at center, rgba(99,102,241,0.06) 0%, #060912 70%)'
              }}>
                <div style={{
                  width: 140, height: 140,
                  border: '2px dashed rgba(99,102,241,0.4)',
                  borderRadius: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <QrCode size={56} color="rgba(99,102,241,0.4)" />
                </div>
                <p style={{ color: '#475569', fontSize: '0.875rem', textAlign: 'center', maxWidth: 240 }}>
                  {camError ? camError : 'Press Start Scanning to activate the camera'}
                </p>
              </div>
            )}
            {loading && (
              <div style={{
                position: 'absolute', inset: 0, backgroundColor: 'rgba(6,9,18,0.85)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem'
              }}>
                <div className="spinner" style={{ width: 40, height: 40 }} />
                <p style={{ color: '#94a3b8' }}>Verifying ticket…</p>
              </div>
            )}
          </div>

          {/* Scanning indicator */}
          {scanning && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.75rem', backgroundColor: 'rgba(16,185,129,0.08)', borderTop: '1px solid rgba(16,185,129,0.2)'
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 1s infinite' }} />
              <span style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: 600 }}>Live — Point camera at QR code</span>
            </div>
          )}

          {/* Controls */}
          <div style={{ padding: '1.25rem', borderTop: '1px solid #1e293b', display: 'flex', gap: '0.75rem' }}>
            {!scanning ? (
              <button
                onClick={startCamera}
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                disabled={!!camError && cameras.length === 0}
              >
                <Camera size={16} /> Start Scanning
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <CameraOff size={16} /> Stop Camera
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Manual Entry Tab ── */}
      {tab === 'manual' && (
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <QrCode size={18} color="#6366f1" /> Enter Ticket Token Manually
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Paste the QR validation token or ticket number for offline / fallback verification.
          </p>
          <form onSubmit={handleManualSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">QR Token / Ticket Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. EP-TOKEN-DEMO-1 or TK-2026-XXXXX"
                value={manualToken}
                onChange={e => setManualToken(e.target.value)}
                required
                autoComplete="off"
                style={{ fontFamily: 'monospace', letterSpacing: '0.025em' }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading || !manualToken.trim()}
            >
              {loading ? <><div className="spinner-sm" /> Verifying…</> : <><Search size={16} /> Verify Ticket</>}
            </button>
          </form>
        </div>
      )}

      {/* ── Result Card ── */}
      {!loading && scanResult && (
        <ScanResult result={scanResult} onScanAgain={handleScanAgain} />
      )}

      {/* ── Info Box ── */}
      {!scanResult && (
        <div style={{
          marginTop: '1.5rem',
          backgroundColor: 'rgba(99,102,241,0.05)',
          border: '1px solid rgba(99,102,241,0.15)',
          borderRadius: '0.75rem',
          padding: '1rem 1.25rem',
          fontSize: '0.8125rem',
          color: '#64748b',
          lineHeight: 1.6
        }}>
          <div style={{ fontWeight: 700, color: '#818cf8', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={14} /> Scan Policy
          </div>
          Each ticket may only be admitted once. A second scan of the same ticket will display a red <strong style={{ color: '#ef4444' }}>ALREADY SCANNED</strong> warning including who scanned it and when.
          Camera access requires <strong>HTTPS</strong> in production or <strong>localhost</strong> in development.
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        #${SCANNER_ID} video { border-radius: 0 !important; }
        #${SCANNER_ID} > div { border: none !important; background: transparent !important; }
        .spinner {
          border: 3px solid rgba(99,102,241,0.2);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        .spinner-sm {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
