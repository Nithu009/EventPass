import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Save, ArrowLeft } from 'lucide-react';
import { Loader } from '../components/common/Loader';

export const AdminCreateEventPage = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [fetchingVenues, setFetchingVenues] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'MUSIC',
    eventDate: '',
    venueId: '',
    bannerUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80',
    baseStandardPrice: 500,
    basePremiumPrice: 1000,
    baseVipPrice: 2000
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/venues')
      .then((res) => {
        const vList = res.data || [];
        setVenues(vList);
        if (vList.length > 0) {
          setFormData((prev) => ({ ...prev, venueId: vList[0].id }));
        }
      })
      .catch(() => setVenues([]))
      .finally(() => setFetchingVenues(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.venueId) {
      alert('Please select or configure a venue first');
      return;
    }
    setLoading(true);
    try {
      await api.post('/admin/events', formData);
      navigate('/admin/events');
    } catch (err) {
      alert(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingVenues) return <Loader fullPage message="Loading venue layouts..." />;

  return (
    <div style={{ maxWidth: '780px' }}>
      <button onClick={() => navigate('/admin/events')} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Events
      </button>

      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#f8fafc' }}>
          Create New Event
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Configure schedule, venue layout association, and base seat tier pricing. The seat inventory will be generated automatically.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Electric Odyssey Live in Concert"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Event details, artists, and schedule..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="MUSIC">Music & Concerts</option>
                <option value="TECH">Tech Conferences</option>
                <option value="SPORTS">Sports</option>
                <option value="GAMING">Gaming & Esports</option>
                <option value="THEATRE">Theatre & Arts</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Venue Location & Layout</label>
              <select
                required
                className="form-control"
                value={formData.venueId}
                onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
              >
                {venues.length === 0 && <option value="">No venues configured</option>}
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.city} — {v.capacity} seats)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Event Date & Time</label>
              <input
                type="datetime-local"
                required
                className="form-control"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Banner Image URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://..."
                value={formData.bannerUrl}
                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem', color: '#cbd5e1' }}>
              Base Tier Pricing (Dynamic pricing engine scales from these values)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Standard Base (₹)</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="form-control"
                  value={formData.baseStandardPrice}
                  onChange={(e) => setFormData({ ...formData, baseStandardPrice: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Premium Base (₹)</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="form-control"
                  value={formData.basePremiumPrice}
                  onChange={(e) => setFormData({ ...formData, basePremiumPrice: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">VIP Base (₹)</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="form-control"
                  value={formData.baseVipPrice}
                  onChange={(e) => setFormData({ ...formData, baseVipPrice: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
            <Save size={16} /> {loading ? 'Generating Layout & Publishing...' : 'Save & Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
};
