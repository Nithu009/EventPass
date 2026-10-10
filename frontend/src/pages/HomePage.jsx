import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Server,
  Layers
} from 'lucide-react';

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [backendHealth, setBackendHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check real backend status
    api.get('/health')
      .then((res) => {
        setBackendHealth(res.data);
      })
      .catch((err) => {
        setBackendHealth({ status: 'OFFLINE', error: err.message || 'Backend unreachable' });
      })
      .finally(() => {
        setLoadingHealth(false);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const categories = [
    { name: 'All Events', icon: '🎪' },
    { name: 'Music & Concerts', icon: '🎸' },
    { name: 'Tech Conferences', icon: '💻' },
    { name: 'Sports & Gaming', icon: '🏆' },
    { name: 'Arts & Theatre', icon: '🎭' }
  ];

  return (
    <div>
      {/* Backend Status Bar */}
      <div style={{
        backgroundColor: '#0d1322',
        borderBottom: '1px solid #1e293b',
        padding: '0.5rem 1rem',
        fontSize: '0.8125rem'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server size={14} color="#6366f1" />
            <span style={{ color: '#94a3b8' }}>Backend Service:</span>
            {loadingHealth ? (
              <span style={{ color: '#f59e0b' }}>Probing Spring Boot API...</span>
            ) : backendHealth?.status === 'UP' ? (
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                Online ({backendHealth.database})
              </span>
            ) : (
              <span style={{ color: '#ef4444' }}>Backend offline: {backendHealth?.error}</span>
            )}
          </div>
          <div style={{ color: '#64748b' }}>
            Spring Boot 3.3.4 • MySQL 8 • Flyway Schema
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{
        paddingTop: '4.5rem',
        paddingBottom: '5rem',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.25), transparent)',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.875rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.8125rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={14} /> Intelligent Event Ticketing & Reservation Platform
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.15
          }}>
            Book Live Events with <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Interactive Seating</span> & Smart Pricing
          </h1>

          <p style={{
            color: '#94a3b8',
            fontSize: '1.125rem',
            maxWidth: '640px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '2.5rem',
            lineHeight: 1.6
          }}>
            Explore premium concerts, tech conferences, and live performances. Select your exact seats in real-time with zero race-condition locking.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} style={{
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            display: 'flex',
            backgroundColor: '#101726',
            border: '1px solid #1e293b',
            borderRadius: '0.75rem',
            padding: '0.5rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '1rem', flex: 1, gap: '0.75rem' }}>
              <Search size={20} color="#64748b" />
              <input
                type="text"
                placeholder="Search events by title, artist, or venue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.9375rem',
                  outline: 'none'
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Find Events
            </button>
          </form>

          {/* Quick Categories */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => navigate(cat.name === 'All Events' ? '/events' : `/events?category=${encodeURIComponent(cat.name)}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#131b2e',
                  border: '1px solid #1e293b',
                  borderRadius: '9999px',
                  color: '#cbd5e1',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  transition: 'all 150ms'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1e293b';
                  e.currentTarget.style.color = '#cbd5e1';
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#0b101c', borderTop: '1px solid #141c2e' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Engineered for Enterprise Ticketing
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9375rem' }}>
              Built with concurrency safety, dynamic demand pricing, and cryptographic QR verification.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="card">
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <ShieldCheck size={24} color="#6366f1" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Temporary Seat Locking</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Atomically locks selected seats for 8 minutes to prevent race conditions and double bookings during high-demand checkout.
              </p>
            </div>

            <div className="card">
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Zap size={24} color="#8b5cf6" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dynamic Pricing Engine</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Server-side pricing algorithm calculates real-time ticket prices based on seat tiers, venue occupancy, and days until event.
              </p>
            </div>

            <div className="card">
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Layers size={24} color="#06b6d4" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Atomic QR Ticket Validation</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Cryptographic ticket tokens rendered in high-density QR codes for single-scan verification and instant entry check-in.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
