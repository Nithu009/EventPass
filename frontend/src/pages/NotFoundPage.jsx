import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="container" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '480px', padding: '3rem 2rem' }}>
        <HelpCircle size={56} color="#6366f1" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>404 - Page Not Found</h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
          The requested page could not be located. It might have been moved or removed.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};
