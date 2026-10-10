import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api, { backendBaseUrl } from '../services/api';

import { 
  Search, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Server,
  Layers,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { EventCard } from '../components/common/EventCard';
import { Loader } from '../components/common/Loader';

const CATEGORY_MAP = {
  'All Events': 'ALL',
  'Music & Concerts': 'MUSIC',
  'Tech Conferences': 'TECH',
  'Sports & Gaming': 'GAMING',
  'Arts & Theatre': 'THEATRE',
};

const CATEGORIES = [
  { name: 'All Events', code: 'ALL', icon: '🎪' },
  { name: 'Music & Concerts', code: 'MUSIC', icon: '🎸' },
  { name: 'Tech Conferences', code: 'TECH', icon: '💻' },
  { name: 'Sports & Gaming', code: 'GAMING', icon: '🏆' },
  { name: 'Arts & Theatre', code: 'THEATRE', icon: '🎭' }
];

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [backendHealth, setBackendHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Health probe — hits the root-level /healthz endpoint directly (not /api/healthz)
    // so the URL resolves to https://eventpass-8c66.onrender.com/healthz in production
    // and /api/healthz via the Vite proxy in local dev (backendBaseUrl is '' in dev).
    const healthUrl = backendBaseUrl
      ? `${backendBaseUrl}/healthz`
      : '/api/healthz'; // dev fallback via Vite proxy

    axios.get(healthUrl, { timeout: 10000 })
      .then(() => {
        setBackendHealth({ status: 'UP', database: 'MongoDB Atlas' });
      })
      .catch((err) => {
        setBackendHealth({ status: 'OFFLINE', error: err.message || 'Backend unreachable' });
      })
      .finally(() => {
        setLoadingHealth(false);
      });

    // Fetch all published events via the /api/events endpoint
    api.get('/events')
      .then((res) => {
        // api.js response interceptor unwraps response.data, so res is already the payload
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.content)
          ? res.content
          : [];
        setEvents(list);
      })
      .catch((err) => {
        console.warn('Failed to load events on homepage:', err);
        setEvents([]);
      })
      .finally(() => {
        setLoadingEvents(false);
      });
  }, []);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const section = document.getElementById('events-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (categoryCode) => {
    setSelectedCategory(categoryCode);
    const section = document.getElementById('events-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredEvents = useMemo(() => {
    let list = [...events];
    
    // Category filter
    if (selectedCategory !== 'ALL') {
      list = list.filter((e) => {
        if (selectedCategory === 'GAMING') {
          return e.category === 'GAMING' || e.category === 'SPORTS';
        }
        return e.category === selectedCategory;
      });
    }

    // Text search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((e) => 
        e.title?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.venueName?.toLowerCase().includes(q) ||
        e.venueCity?.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortBy === 'date') {
      list.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    } else if (sortBy === 'price') {
      list.sort((a, b) => Number(a.basePriceStandard || a.currentStandardPrice || 0) - Number(b.basePriceStandard || b.currentStandardPrice || 0));
    } else if (sortBy === 'popularity') {
      list.sort((a, b) => ((b.totalSeats || 0) - (b.availableSeats || 0)) - ((a.totalSeats || 0) - (a.availableSeats || 0)));
    }

    return list;
  }, [events, selectedCategory, searchTerm, sortBy]);

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
            Spring Boot 3.3.4 • MongoDB Atlas • Dynamic Seating Engine
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{
        paddingTop: '4.5rem',
        paddingBottom: '4rem',
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
          <form onSubmit={handleSearchSubmit} style={{
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
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Find Events
            </button>
          </form>

          {/* Quick Categories */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.code;
              return (
                <button
                  key={cat.code}
                  onClick={() => handleCategorySelect(cat.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: active ? 'rgba(99, 102, 241, 0.2)' : '#131b2e',
                    border: active ? '1px solid #6366f1' : '1px solid #1e293b',
                    borderRadius: '9999px',
                    color: active ? '#fff' : '#cbd5e1',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 150ms',
                    boxShadow: active ? '0 0 16px rgba(99, 102, 241, 0.35)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = '#6366f1';
                      e.currentTarget.style.color = '#fff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = '#1e293b';
                      e.currentTarget.style.color = '#cbd5e1';
                    }
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Live & Upcoming Events Section on Home Page ── */}
      <section id="events-section" style={{
        padding: '3.5rem 0 5rem',
        backgroundColor: '#070b14',
        borderTop: '1px solid #141c2e'
      }}>
        <div className="container">
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#818cf8',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.35rem'
              }}>
                <Sparkles size={14} /> Live On EventPass
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Featured & Live Events
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <SlidersHorizontal size={14} color="#64748b" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-control"
                  style={{ width: 'auto', minWidth: 160, fontSize: '0.8125rem', padding: '0.4rem 0.75rem' }}
                >
                  <option value="date">Sort: Soonest First</option>
                  <option value="price">Sort: Lowest Price</option>
                  <option value="popularity">Sort: Most Popular</option>
                </select>
              </div>

              <Link
                to="/events"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Active filter count / status bar */}
          {(selectedCategory !== 'ALL' || searchTerm.trim()) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 1rem',
              backgroundColor: '#101726',
              borderRadius: '0.5rem',
              border: '1px solid #1e293b',
              marginBottom: '1.75rem',
              fontSize: '0.875rem'
            }}>
              <span style={{ color: '#94a3b8' }}>
                Filtering by: {selectedCategory !== 'ALL' && <strong style={{ color: '#a5b4fc', marginRight: '0.5rem' }}>{selectedCategory}</strong>}
                {searchTerm && <span>matching "<strong>{searchTerm}</strong>"</span>}
                <span style={{ marginLeft: '0.75rem', color: '#64748b' }}>({filteredEvents.length} results found)</span>
              </span>
              <button
                onClick={() => { setSelectedCategory('ALL'); setSearchTerm(''); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#818cf8',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Events Grid / Loader / Empty State */}
          {loadingEvents ? (
            <Loader message="Loading live events..." />
          ) : filteredEvents.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Calendar size={48} color="#6366f1" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No Events Match Your Filters</h3>
              <p style={{ color: '#94a3b8', maxWidth: 420, margin: '0 auto 1.5rem' }}>
                {searchTerm || selectedCategory !== 'ALL'
                  ? 'No events found in this category or matching search term.'
                  : 'There are currently no published events in the system.'}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                {(searchTerm || selectedCategory !== 'ALL') && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => { setSelectedCategory('ALL'); setSearchTerm(''); }}
                  >
                    Clear Filters
                  </button>
                )}
                <Link to="/events" className="btn btn-primary">
                  Browse Event Directory
                </Link>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredEvents.map((evt) => (
                <EventCard key={evt.id} evt={evt} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#0b101c', borderTop: '1px solid #141c2e' }}>
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
