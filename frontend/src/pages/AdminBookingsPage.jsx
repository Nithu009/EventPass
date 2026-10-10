import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CreditCard, Search, ArrowUpRight } from 'lucide-react';
import { Loader } from '../components/common/Loader';
import { StatusBadge } from '../components/common/StatusBadge';

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/admin/bookings')
      .then((res) => setBookings(res.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage message="Loading transaction audit trail..." />;

  const filtered = bookings.filter((b) =>
    (b.bookingReference || '').toLowerCase().includes(filter.toLowerCase()) ||
    (b.userEmail || '').toLowerCase().includes(filter.toLowerCase()) ||
    (b.eventTitle || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
          Bookings & Transaction Audit
        </h1>
        <p style={{ color: '#94a3b8' }}>
          Inspect all attendee transactions, seat allocations, and payment reconciliation statuses.
        </p>
      </div>

      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by reference, attendee email, or event title..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <CreditCard size={48} color="#06b6d4" style={{ margin: '0 auto 1rem' }} />
          <h3>No Bookings Recorded</h3>
          <p style={{ color: '#94a3b8', margin: '0.5rem auto 1.5rem' }}>
            Bookings will appear here in real time as attendees complete checkout.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead style={{ backgroundColor: '#101726', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Booking Ref</th>
                <th style={{ padding: '1rem' }}>Attendee</th>
                <th style={{ padding: '1rem' }}>Event</th>
                <th style={{ padding: '1rem' }}>Seats</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#818cf8' }}>
                    {b.bookingReference}
                  </td>
                  <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                    {b.userName || b.userEmail || 'Attendee'}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>
                    {b.eventTitle}
                  </td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>
                    {(b.items || []).map((i) => i.seatCode).join(', ') || '-'}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#10b981' }}>
                    ₹{(b.totalAmount || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
