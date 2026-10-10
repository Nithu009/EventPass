import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { TrendingUp, Plus, Trash2, Zap, Clock, Tag } from 'lucide-react';
import { Loader } from '../components/common/Loader';

export const AdminPricingPage = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    triggerType: 'DEMAND_THRESHOLD',
    thresholdPercentage: 60,
    hoursBeforeEvent: 24,
    multiplier: 1.20,
    category: '',
  });

  const fetchRules = () => {
    setLoading(true);
    api.get('/admin/pricing-rules')
      .then((res) => setRules(res.data || []))
      .catch(() => setRules([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleCreateRule = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/admin/pricing-rules', {
        name: formData.name,
        triggerType: formData.triggerType,
        thresholdPercentage: formData.triggerType === 'DEMAND_THRESHOLD' ? Number(formData.thresholdPercentage) : null,
        hoursBeforeEvent: formData.triggerType === 'TIME_BEFORE_EVENT' ? Number(formData.hoursBeforeEvent) : null,
        multiplier: Number(formData.multiplier),
        category: formData.category || null,
        active: true
      });
      setShowModal(false);
      setFormData({ name: '', triggerType: 'DEMAND_THRESHOLD', thresholdPercentage: 60, hoursBeforeEvent: 24, multiplier: 1.20, category: '' });
      fetchRules();
    } catch (err) {
      alert(err.message || 'Failed to create rule');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRule = async (id) => {
    if (!confirm('Are you sure you want to deactivate this dynamic pricing rule?')) return;
    try {
      await api.delete(`/admin/pricing-rules/${id}`);
      fetchRules();
    } catch (err) {
      alert(err.message || 'Failed to delete rule');
    }
  };

  if (loading) return <Loader fullPage message="Loading dynamic pricing engine rules..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>Dynamic Pricing Rules</h1>
          <p style={{ color: '#94a3b8' }}>Configure demand surge thresholds, time proximity surges, and tier multipliers.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> New Pricing Rule
        </button>
      </div>

      {showModal && (
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid #8b5cf6' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Configure Dynamic Surge Rule</h3>
          <form onSubmit={handleCreateRule} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Rule Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. High Demand Surge > 70%"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Trigger Condition</label>
              <select
                className="form-control"
                value={formData.triggerType}
                onChange={(e) => setFormData({ ...formData, triggerType: e.target.value })}
              >
                <option value="DEMAND_THRESHOLD">Demand Occupancy Threshold (%)</option>
                <option value="TIME_BEFORE_EVENT">Time Proximity Before Event (Hours)</option>
                <option value="CATEGORY_MULTIPLIER">Seat Category Multiplier</option>
              </select>
            </div>

            {formData.triggerType === 'DEMAND_THRESHOLD' && (
              <div className="form-group">
                <label className="form-label">Occupancy Threshold (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  className="form-control"
                  value={formData.thresholdPercentage}
                  onChange={(e) => setFormData({ ...formData, thresholdPercentage: e.target.value })}
                />
              </div>
            )}

            {formData.triggerType === 'TIME_BEFORE_EVENT' && (
              <div className="form-group">
                <label className="form-label">Hours Remaining Until Event</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="form-control"
                  value={formData.hoursBeforeEvent}
                  onChange={(e) => setFormData({ ...formData, hoursBeforeEvent: e.target.value })}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Price Multiplier (e.g. 1.25 = +25%)</label>
              <input
                type="number"
                step="0.05"
                min="0.5"
                max="5.0"
                required
                className="form-control"
                value={formData.multiplier}
                onChange={(e) => setFormData({ ...formData, multiplier: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={creating} className="btn btn-primary">
                {creating ? 'Saving...' : 'Activate Pricing Rule'}
              </button>
            </div>
          </form>
        </div>
      )}

      {rules.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <TrendingUp size={48} color="#8b5cf6" style={{ margin: '0 auto 1rem' }} />
          <h3>No Pricing Rules Active</h3>
          <p style={{ color: '#94a3b8', margin: '0.5rem auto 1.5rem' }}>
            Base tier prices will apply without dynamic multipliers.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {rules.map((r) => (
            <div key={r.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f8fafc' }}>{r.name}</h3>
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Active</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                {r.triggerType === 'DEMAND_THRESHOLD' ? <Zap size={15} color="#f59e0b" /> : <Clock size={15} color="#06b6d4" />}
                <span>
                  {r.triggerType === 'DEMAND_THRESHOLD' && `Triggers when occupancy ≥ ${r.thresholdPercentage}%`}
                  {r.triggerType === 'TIME_BEFORE_EVENT' && `Triggers within ${r.hoursBeforeEvent} hours of start`}
                  {r.triggerType === 'CATEGORY_MULTIPLIER' && `Applies multiplier to category`}
                </span>
              </div>

              <div style={{ borderTop: '1px solid #1e293b', paddingTop: '0.75rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#8b5cf6' }}>
                  {r.multiplier}x Multiplier
                </span>
                <button onClick={() => handleDeleteRule(r.id)} className="btn btn-secondary btn-sm" title="Delete Rule">
                  <Trash2 size={14} color="#ef4444" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
