import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Loader } from '../components/common/Loader';
import { StatusBadge } from '../components/common/StatusBadge';

export const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/events')
      .then((res) => setEvents(res.data?.content || res.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage message="Loading organizer events..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Event Management</h1>
          <p style={{ color: '#94a3b8' }}>Create, update, publish, and configure events.</p>
        </div>
        <Link to="/admin/events/create" className="btn btn-primary">
          <Plus size={16} /> Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Calendar size={48} color="#6366f1" style={{ margin: '0 auto 1rem' }} />
          <h3>No Events Created Yet</h3>
          <p style={{ color: '#94a3b8', margin: '0.5rem auto 1.5rem', maxWidth: '360px' }}>
            Click "Create New Event" to set up your first event, venue, and seat layout.
          </p>
          <Link to="/admin/events/create" className="btn btn-primary">Create Event</Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead style={{ backgroundColor: '#101726', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Venue</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{e.title}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>{e.venueName || 'Main Arena'}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>
                    {e.eventDate || e.startTime ? new Date(e.eventDate || e.startTime).toLocaleDateString() : 'TBD'}
                  </td>
                  <td style={{ padding: '1rem' }}><StatusBadge status={e.status} /></td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <Link to={`/events/${e.id}`} className="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer">
                      View Event ↗
                    </Link>
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
