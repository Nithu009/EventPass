import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Ticket as TicketIcon } from 'lucide-react';
import api from '../services/api';

export const PaymentStatusPage = () => {
  const [params] = useSearchParams();
  const isSuccess = params.get('status') === 'success';
  const bookingId = params.get('bookingId');
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (isSuccess && bookingId) {
      api.get(`/tickets/booking/${bookingId}`)
        .then((res) => setTickets(res.data || []))
        .catch(() => {});
    }
  }, [isSuccess, bookingId]);

  return (
    <div className="container" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 1.5rem' }}>
      <div className="card" style={{ maxWidth: '540px', width: '100%', padding: '3rem 2rem' }}>
        {isSuccess ? (
          <>
            <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.75rem', color: '#f8fafc' }}>
              Booking Confirmed!
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9375rem', marginBottom: '2rem' }}>
              Your payment has been reconciled and your seats are officially reserved.
            </p>

            {tickets.length > 0 && (
              <div style={{ marginBottom: '2rem', textAlign: 'left', backgroundColor: '#101726', padding: '1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Generated Digital Tickets ({tickets.length}):
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {tickets.map((t) => (
                    <Link
                      key={t.id}
                      to={`/tickets/${t.id}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.625rem 0.875rem',
                        backgroundColor: '#1e293b',
                        borderRadius: '6px',
                        color: '#f8fafc',
                        textDecoration: 'none',
                        fontSize: '0.875rem'
                      }}
                    >
                      <span>
                        <TicketIcon size={14} style={{ display: 'inline', marginRight: '6px' }} />
                        Ticket #{t.ticketNumber} (Seat {t.seatCode})
                      </span>
                      <span style={{ color: '#6366f1', fontWeight: 600 }}>View Pass →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/bookings" className="btn btn-primary">
                My Bookings <ArrowRight size={16} />
              </Link>
              <Link to="/events" className="btn btn-secondary">
                Browse Events
              </Link>
            </div>
          </>
        ) : (
          <>
            <XCircle size={64} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.75rem', color: '#f8fafc' }}>
              Payment Incomplete
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9375rem', marginBottom: '2rem' }}>
              Your transaction could not be processed or timed out. Any temporary locks will expire automatically.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/events" className="btn btn-secondary">
                Return to Events
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
