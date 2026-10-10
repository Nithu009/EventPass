import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket, Calendar, MapPin, CheckCircle2, XCircle, ArrowLeft, Printer, Shield } from 'lucide-react';
import { Loader } from '../components/common/Loader';
import api from '../services/api';

export const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tickets/${id}`)
      .then((res) => setTicket(res.data))
      .catch((err) => {
        console.error('Failed to load ticket', err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullPage message="Rendering digital admission pass..." />;

  if (!ticket) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Ticket Not Found</h2>
        <p style={{ color: '#94a3b8', margin: '1rem 0 2rem' }}>
          This ticket ID could not be retrieved from the database.
        </p>
        <button onClick={() => navigate('/bookings')} className="btn btn-primary">
          Return to My Bookings
        </button>
      </div>
    );
  }

  const isAdmitted = ticket.used;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '640px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card" style={{ textAlign: 'center', padding: '3rem 2.5rem', position: 'relative' }}>
        
        {/* Admission Status Ribbon */}
        <div style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.375rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          backgroundColor: isAdmitted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          color: isAdmitted ? '#f87171' : '#34d399',
          border: `1px solid ${isAdmitted ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
        }}>
          {isAdmitted ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
          <span>{isAdmitted ? 'ADMITTED (USED)' : 'VALID PASS'}</span>
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          {ticket.eventTitle || 'Event Admission Pass'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '2rem' }}>
          {ticket.venueName ? `${ticket.venueName}, ${ticket.venueCity || ''}` : 'Official Admission Pass'}
        </p>

        {/* QR Code Presentation Box */}
        <div style={{
          background: '#ffffff',
          padding: '1.25rem',
          borderRadius: '1rem',
          display: 'inline-block',
          boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
          marginBottom: '2rem'
        }}>
          {ticket.qrCodeBase64 ? (
            <img
              src={ticket.qrCodeBase64}
              alt="Gate Validation QR"
              style={{ width: '220px', height: '220px', display: 'block' }}
            />
          ) : (
            <QRCodeSVG value={ticket.qrValidationToken || 'EVENTPASS'} size={220} />
          )}
        </div>

        <div style={{
          backgroundColor: '#101726',
          borderRadius: '8px',
          padding: '0.75rem',
          marginBottom: '2rem',
          fontFamily: 'monospace',
          fontSize: '0.8125rem',
          color: '#818cf8',
          letterSpacing: '0.05em'
        }}>
          Token: {ticket.qrValidationToken}
        </div>

        {/* Detailed Breakdown */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: '#94a3b8' }}>Ticket Number:</span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{ticket.ticketNumber}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: '#94a3b8' }}>Attendee:</span>
            <span style={{ fontWeight: 600, color: '#f8fafc' }}>{ticket.attendeeName || 'Registered Attendee'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: '#94a3b8' }}>Designated Seat:</span>
            <span style={{ fontWeight: 700, color: '#a78bfa' }}>
              {ticket.seatCategory} — Seat {ticket.seatCode}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: '#94a3b8' }}>Price Paid:</span>
            <span style={{ fontWeight: 700, color: '#10b981' }}>₹{(ticket.pricePaid || 0).toLocaleString()}</span>
          </div>

          {ticket.used && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#f87171' }}>
              <span>Scanned At:</span>
              <span>{new Date(ticket.usedAt).toLocaleString()}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: '2rem' }}
        >
          <Printer size={16} /> Print or Save Digital Pass
        </button>
      </div>
    </div>
  );
};
