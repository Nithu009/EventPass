import React from 'react';
import { Ticket, Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid #1e293b',
      backgroundColor: '#070a12',
      paddingTop: '3rem',
      paddingBottom: '2.5rem',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: '0.375rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Ticket size={14} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ffffff' }}>
                Event<span style={{ color: '#8b5cf6' }}>Pass</span>
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '320px' }}>
              Intelligent event ticketing platform featuring live interactive seating maps, dynamic demand-driven pricing, and instant QR verification.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                <li><a href="/events" style={{ color: 'inherit' }}>Browse Events</a></li>
                <li><a href="/bookings" style={{ color: 'inherit' }}>My Tickets</a></li>
                <li><a href="/admin" style={{ color: 'inherit' }}>Organizer Portal</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Shield size={14} color="#10b981" /> Concurrency-Safe Locks</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Shield size={14} color="#10b981" /> HMAC-SHA256 JWT</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Shield size={14} color="#10b981" /> Atomic QR Check-in</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #141c2e',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: '#64748b'
        }}>
          <p>© {new Date().getFullYear()} EventPass Platform. Production Full-Stack Architecture.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Spring Boot 3 • React 18 • MySQL 8
          </p>
        </div>
      </div>
    </footer>
  );
};
