import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Ticket, Calendar, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import { Loader } from '../components/common/Loader';
import { StatusBadge } from '../components/common/StatusBadge';

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my')
      .then((res) => setBookings(res.data || []))
      .catch((err) => {
        console.warn('Booking service note', err);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage message="Fetching your reservations and tickets..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#f8fafc' }}>
        My Bookings & Tickets
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>
        Access your confirmed event reservations, download digital admission passes, and inspect gate status.
      </p>

      {bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Ticket size={48} color="#6366f1" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>No Bookings Found</h3>
          <p style={{ color: '#94a3b8', margin: '0.5rem auto 1.5rem', maxWidth: '380px' }}>
            You haven't reserved any tickets yet. Explore upcoming events to book your seats.
          </p>
          <Link to="/events" className="btn btn-primary">Discover Events</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {bookings.map((b) => (
            <div key={b.id} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>
                    {b.eventTitle || 'Event Reservation'}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    Venue: {b.venueName || 'Main Arena'} • Ref: <strong style={{ color: '#818cf8' }}>{b.bookingReference}</strong>
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </div>

              {/* Seats list */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0' }}>
                {(b.items || []).map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      padding: '0.375rem 0.625rem',
                      borderRadius: '6px',
                      backgroundColor: '#101726',
                      border: '1px solid #1e293b',
                      color: '#e2e8f0'
                    }}
                  >
                    Seat {item.seatCode} ({item.seatCategory || item.category}) • ₹{(item.finalPrice || item.priceSnapshot || 0).toLocaleString()}
                  </span>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#10b981' }}>
                  Total Paid: ₹{(b.totalAmount || 0).toLocaleString()}
                </span>

                {b.status === 'CONFIRMED' && (
                  <Link
                    to={`/payment-status?status=success&bookingId=${b.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    <ExternalLink size={14} /> View Digital Tickets & QR
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
