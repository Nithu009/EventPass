import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const AccessDeniedPage = () => {
  return (
    <div className="container" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '480px', padding: '3rem 2rem' }}>
        <ShieldAlert size={56} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>403 - Access Denied</h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
          You do not have the required permissions or role to view this protected resource.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};
