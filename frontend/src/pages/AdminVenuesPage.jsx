import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MapPin, Plus, CheckCircle, Building } from 'lucide-react';
import { Loader } from '../components/common/Loader';

export const AdminVenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    totalRows: 8,
    totalColumns: 10,
    capacity: 80
  });

  const fetchVenues = () => {
    setLoading(true);
    api.get('/venues')
      .then((res) => setVenues(res.data || []))
      .catch(() => setVenues([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleCreateVenue = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const capacity = Number(formData.totalRows) * Number(formData.totalColumns);
      await api.post('/admin/venues', {
        ...formData,
        capacity,
        totalRows: Number(formData.totalRows),
        totalColumns: Number(formData.totalColumns)
      });
      setShowModal(false);
      setFormData({ name: '', city: '', address: '', totalRows: 8, totalColumns: 10, capacity: 80 });
      fetchVenues();
    } catch (err) {
      alert(err.message || 'Failed to create venue');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <Loader fullPage message="Loading physical venues & layouts..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>Venues & Seating Layouts</h1>
          <p style={{ color: '#94a3b8' }}>Manage venue topologies, seating grids, and tier allocations.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add New Venue
        </button>
      </div>

      {showModal && (
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid #6366f1' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Create Physical Venue Layout</h3>
          <form onSubmit={handleCreateVenue} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Venue Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Grand City Amphitheater"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Mumbai / Delhi / Bengaluru"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Full Address</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Sector 4, Cultural Hub"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Rows (A to Z)</label>
              <input
                type="number"
                min="1"
                max="26"
                required
                className="form-control"
                value={formData.totalRows}
                onChange={(e) => setFormData({ ...formData, totalRows: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Seats Per Row (Columns)</label>
              <input
                type="number"
                min="1"
                max="50"
                required
                className="form-control"
                value={formData.totalColumns}
                onChange={(e) => setFormData({ ...formData, totalColumns: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={creating} className="btn btn-primary">
                {creating ? 'Generating Layout...' : 'Save & Generate Grid'}
              </button>
            </div>
          </form>
        </div>
      )}

      {venues.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Building size={48} color="#6366f1" style={{ margin: '0 auto 1rem' }} />
          <h3>No Venues Configured</h3>
          <p style={{ color: '#94a3b8', margin: '0.5rem auto 1.5rem', maxWidth: '360px' }}>
            Click "Add New Venue" to define your first physical venue and seat grid.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {venues.map((v) => (
            <div key={v.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f8fafc' }}>{v.name}</h3>
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Active</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {v.city} • {v.address}
              </p>
              <div style={{ borderTop: '1px solid #1e293b', paddingTop: '0.75rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#cbd5e1' }}>
                <span>Grid: {v.totalRows} Rows × {v.totalColumns} Cols</span>
                <span style={{ fontWeight: 700, color: '#818cf8' }}>{v.capacity} Total Seats</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
