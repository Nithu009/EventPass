import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Shield, Clock, Info, Check, ArrowRight, RotateCcw, AlertTriangle, Sparkles } from 'lucide-react';
import { Loader } from '../components/common/Loader';

export const SeatSelectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeatCodes, setSelectedSeatCodes] = useState([]);
  const [lockData, setLockData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [locking, setLocking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const timerRef = useRef(null);

  const fetchSeats = () => {
    setLoading(true);
    api.get(`/events/${id}/seats`)
      .then((res) => {
        setLayout(res.data);
      })
      .catch((err) => {
        setErrorMsg(err?.message || 'Failed to load seating map');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSeats();
  }, [id]);

  // Countdown timer when lock is active
  useEffect(() => {
    if (lockData && lockData.expiresAt) {
      const expiry = new Date(lockData.expiresAt).getTime();
      
      const updateTimer = () => {
        const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          setLockData(null);
          setSelectedSeatCodes([]);
          setErrorMsg('Reservation lock expired. Please re-select seats.');
          fetchSeats();
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [lockData]);

  const handleSeatClick = (seat) => {
    if (seat.status === 'BOOKED' || (seat.status === 'LOCKED' && !seat.lockedByCurrentUser)) {
      return; // Cannot select booked or held seats
    }

    if (lockData) {
      // If already locked, release or prompt
      return;
    }

    setErrorMsg('');
    const code = seat.seatCode;
    if (selectedSeatCodes.includes(code)) {
      setSelectedSeatCodes(selectedSeatCodes.filter((c) => c !== code));
    } else {
      if (selectedSeatCodes.length >= 6) {
        setErrorMsg('Maximum 6 seats allowed per reservation.');
        return;
      }
      setSelectedSeatCodes([...selectedSeatCodes, code]);
    }
  };

  const handleLockSeats = async () => {
    if (selectedSeatCodes.length === 0) return;
    setLocking(true);
    setErrorMsg('');

    try {
      const res = await api.post(`/events/${id}/seats/lock`, {
        seatCodes: selectedSeatCodes,
      });
      setLockData(res.data);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to reserve seats. Some may have just been taken.');
      fetchSeats();
    } finally {
      setLocking(false);
    }
  };

  const handleReleaseSeats = async () => {
    if (!lockData?.lockToken) return;
    try {
      await api.post(`/seats/release?lockToken=${lockData.lockToken}`);
      setLockData(null);
      setSelectedSeatCodes([]);
      fetchSeats();
    } catch (err) {
      console.warn('Release error', err);
    }
  };

  // Group seats by rowLabel
  const groupedSeats = {};
  if (layout?.seats) {
    layout.seats.forEach((seat) => {
      const row = seat.rowLabel || 'A';
      if (!groupedSeats[row]) groupedSeats[row] = [];
      groupedSeats[row].push(seat);
    });
  }

  // Calculate selected total price
  const selectedSeatsDetails = (layout?.seats || []).filter((s) =>
    selectedSeatCodes.includes(s.seatCode)
  );
  const calculatedTotal = selectedSeatsDetails.reduce(
    (sum, s) => sum + (s.currentPrice || 0),
    0
  );

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading && !layout) return <Loader fullPage message="Loading real-time seating map..." />;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1280px' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc' }}>Select Your Seats</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            {layout?.eventTitle} • <span style={{ color: '#6366f1' }}>{layout?.venueName}</span>
          </p>
        </div>

        {lockData ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.625rem 1.25rem',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '9999px',
            color: '#f59e0b',
            fontWeight: 700,
            fontSize: '0.9375rem'
          }}>
            <Clock size={18} className="animate-spin" />
            <span>Seats Reserved for: {formatTimer(timeLeft)}</span>
          </div>
        ) : (
          <div className="badge badge-warning" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
            <Clock size={16} /> 8-Minute Temporary Lock Engine
          </div>
        )}
      </div>

      {errorMsg && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          padding: '0.875rem 1.25rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem'
        }}>
          <AlertTriangle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Interactive Map + Reservation Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        {/* Seating Stage and Interactive Grid */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem 2rem', overflowX: 'auto' }}>
          
          {/* Dynamic Tier Price Badges */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#f59e0b' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f59e0b' }}>
                VIP Tier (₹{layout?.pricingBreakdown?.vip || 2000})
              </span>
            </div>
            <div style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#8b5cf6' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#a78bfa' }}>
                Premium Tier (₹{layout?.pricingBreakdown?.premium || 1000})
              </span>
            </div>
            <div style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#06b6d4' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#22d3ee' }}>
                Standard Tier (₹{layout?.pricingBreakdown?.standard || 500})
              </span>
            </div>
          </div>

          {/* Curved Stage Representation */}
          <div style={{
            width: '80%',
            maxWidth: '520px',
            height: '34px',
            background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
            borderRadius: '4px 4px 18px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.25em',
            color: '#cbd5e1',
            marginBottom: '3rem',
            borderBottom: '3px solid #6366f1',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)'
          }}>
            STAGE / SCREEN
          </div>

          {/* Seat Grid Layout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem', width: 'fit-content' }}>
            {Object.keys(groupedSeats).sort().map((rowLabel) => (
              <div key={rowLabel} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Row Indicator */}
                <div style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  color: '#64748b',
                  marginRight: '0.25rem'
                }}>
                  {rowLabel}
                </div>

                {/* Seat Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {groupedSeats[rowLabel].map((seat) => {
                    const isSelected = selectedSeatCodes.includes(seat.seatCode);
                    const isBooked = seat.status === 'BOOKED';
                    const isLocked = seat.status === 'LOCKED' && !seat.lockedByCurrentUser;

                    // Color assignment based on category and status
                    let bg = '#1e293b';
                    let border = '1px solid #334155';
                    let text = '#94a3b8';
                    let cursor = 'pointer';

                    if (isBooked) {
                      bg = '#0f172a';
                      border = '1px solid #1e293b';
                      text = '#475569';
                      cursor = 'not-allowed';
                    } else if (isLocked) {
                      bg = 'rgba(245, 158, 11, 0.15)';
                      border = '1px solid #f59e0b';
                      text = '#f59e0b';
                      cursor = 'not-allowed';
                    } else if (isSelected) {
                      bg = '#6366f1';
                      border = '1px solid #818cf8';
                      text = '#ffffff';
                    } else {
                      // Tier coloring
                      if (seat.category === 'VIP') {
                        bg = 'rgba(245, 158, 11, 0.08)';
                        border = '1px solid rgba(245, 158, 11, 0.35)';
                        text = '#f59e0b';
                      } else if (seat.category === 'PREMIUM') {
                        bg = 'rgba(139, 92, 246, 0.08)';
                        border = '1px solid rgba(139, 92, 246, 0.35)';
                        text = '#a78bfa';
                      } else {
                        bg = '#1e293b';
                        border = '1px solid #334155';
                        text = '#94a3b8';
                      }
                    }

                    return (
                      <button
                        key={seat.seatCode}
                        type="button"
                        onClick={() => handleSeatClick(seat)}
                        disabled={isBooked || isLocked || (lockData && !isSelected)}
                        title={`${seat.seatCode} • ${seat.category} • ₹${seat.currentPrice} (${seat.status})`}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          backgroundColor: bg,
                          border: border,
                          color: text,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          cursor: cursor,
                          transition: 'all 0.15s ease-in-out',
                          boxShadow: isSelected ? '0 0 12px rgba(99, 102, 241, 0.6)' : 'none'
                        }}
                      >
                        {seat.seatNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Seat Map Legend */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.8125rem', color: '#94a3b8', borderTop: '1px solid #1e293b', paddingTop: '1.25rem', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#1e293b', border: '1px solid #334155' }} />
              <span>Available</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#6366f1' }} />
              <span style={{ color: '#fff', fontWeight: 600 }}>Selected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b' }} />
              <span>Locked (Held)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
              <span>Booked (Sold)</span>
            </div>
          </div>
        </div>

        {/* Reservation Sidebar */}
        <div className="card" style={{ height: 'fit-content', position: 'sticky', top: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.75rem', color: '#f8fafc' }}>
            Reservation Details
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
            Select up to 6 seats. Click "Lock Seats" to secure them for 8 minutes.
          </p>

          <div style={{ borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b', padding: '1rem 0', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: '#94a3b8' }}>Selected Count:</span>
              <span style={{ fontWeight: 700, color: '#f8fafc' }}>{selectedSeatCodes.length} / 6</span>
            </div>

            {selectedSeatsDetails.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', margin: '0.5rem 0' }}>
                {selectedSeatsDetails.map((s) => (
                  <span
                    key={s.seatCode}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#818cf8'
                    }}
                  >
                    {s.seatCode} (₹{s.currentPrice})
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: '#fff', paddingTop: '0.5rem' }}>
              <span>Estimated Subtotal:</span>
              <span style={{ color: '#10b981' }}>₹{calculatedTotal.toLocaleString()}</span>
            </div>
          </div>

          {!lockData ? (
            <button
              onClick={handleLockSeats}
              disabled={selectedSeatCodes.length === 0 || locking}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '0.75rem' }}
            >
              <Sparkles size={16} /> {locking ? 'Securing Lock...' : 'Lock Seats (8 Mins)'}
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => navigate(`/checkout?lockToken=${lockData.lockToken}&eventId=${id}`)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <button
                onClick={handleReleaseSeats}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                <RotateCcw size={14} /> Release Reservation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
