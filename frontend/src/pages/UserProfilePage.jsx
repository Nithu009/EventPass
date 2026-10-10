import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Shield, Phone } from 'lucide-react';

export const UserProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '640px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Account Profile</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Manage your personal details and account credentials.</p>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 700
          }}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user?.fullName || 'User'}</h2>
            <span className="badge badge-info">{user?.role || 'USER'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail size={18} color="#94a3b8" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Email</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{user?.email || 'N/A'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Phone size={18} color="#94a3b8" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Phone</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{user?.phone || 'Not provided'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={18} color="#94a3b8" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Role Privileges</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{user?.role === 'ADMIN' ? 'Full Administrator Access' : 'Standard Event Booking'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
