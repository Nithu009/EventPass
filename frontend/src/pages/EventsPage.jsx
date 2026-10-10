import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import {
  Calendar, MapPin, Search, Ticket, Users,
  Zap, Music, Monitor, Gamepad2, Star, Mic2,
  SlidersHorizontal, ChevronRight, TrendingUp
} from 'lucide-react';
import { Loader } from '../components/common/Loader';

// ── Category config ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: 'ALL',     label: 'All Events',        icon: Star,      color: '#6366f1' },
  { value: 'MUSIC',   label: 'Music & Concerts',  icon: Music,     color: '#ec4899' },
  { value: 'TECH',    label: 'Tech & Conferences', icon: Monitor,   color: '#06b6d4' },
  { value: 'SPORTS',  label: 'Sports',            icon: Zap,       color: '#f59e0b' },
  { value: 'GAMING',  label: 'Gaming & Esports',  icon: Gamepad2,  color: '#10b981' },
  { value: 'THEATRE', label: 'Theatre & Arts',    icon: Mic2,      color: '#a78bfa' },
];

// ── Gradient fallbacks per category ──────────────────────────────────────────
const CAT_GRADIENT = {
  MUSIC:   'linear-gradient(135deg,#7c3aed 0%,#ec4899 100%)',
  TECH:    'linear-gradient(135deg,#0891b2 0%,#6366f1 100%)',
  SPORTS:  'linear-gradient(135deg,#d97706 0%,#ef4444 100%)',
  GAMING:  'linear-gradient(135deg,#059669 0%,#06b6d4 100%)',
  THEATRE: 'linear-gradient(135deg,#7c3aed 0%,#db2777 100%)',
  DEFAULT: 'linear-gradient(135deg,#4338ca 0%,#7c3aed 100%)',
};

const fmt = {
  price: (n) => n != null ? `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0 })}` : '—',
  date:  (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  },
  time:  (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  },
  daysUntil: (iso) => {
    if (!iso) return null;
    const diff = Math.ceil((new Date(iso) - Date.now()) / 86400000);
    if (diff < 0)  return null;
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `In ${diff} days`;
  }
};

// ── Event Poster Card ─────────────────────────────────────────────────────────
const EventCard = ({ evt }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]   = useState(false);

  const catCfg    = CATEGORIES.find(c => c.value === evt.category) || CATEGORIES[0];
  const CatIcon   = catCfg.icon;
  const gradient  = CAT_GRADIENT[evt.category] || CAT_GRADIENT.DEFAULT;
  const daysUntil = fmt.daysUntil(evt.startTime);
  const occupancy = evt.totalSeats > 0 ? Math.round(((evt.totalSeats - evt.availableSeats) / evt.totalSeats) * 100) : 0;
  const hot       = occupancy >= 60;
  const soldOut   = evt.availableSeats === 0;

  return (
    <div
      className="card card-hoverable"
      style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {/* ── Poster Banner ── */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', flexShrink: 0 }}>
        {/* Gradient placeholder */}
        <div style={{
          position: 'absolute', inset: 0,
          background: gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: (imgLoaded && !imgError) ? 0 : 1,
          transition: 'opacity 0.4s ease'
        }}>
          <CatIcon size={64} color="rgba(255,255,255,0.2)" />
        </div>

        {/* Actual banner image */}
        {evt.bannerUrl && !imgError && (
          <img
            src={evt.bannerUrl}
            alt={evt.title}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.4s ease'
            }}
          />
        )}

        {/* Dark overlay at bottom for text legibility */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%',
          background: 'linear-gradient(to top, rgba(6,9,18,0.95) 0%, transparent 100%)'
        }} />

        {/* Top badges */}
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            padding: '0.25rem 0.6rem', borderRadius: '999px',
            backgroundColor: catCfg.color, color: '#fff',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em'
          }}>
            <CatIcon size={10} /> {catCfg.label}
          </span>
          {hot && !soldOut && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
              padding: '0.25rem 0.6rem', borderRadius: '999px',
              backgroundColor: '#f59e0b', color: '#000',
              fontSize: '0.7rem', fontWeight: 800
            }}>
              <TrendingUp size={10} /> HOT
            </span>
          )}
          {soldOut && (
            <span style={{
              padding: '0.25rem 0.6rem', borderRadius: '999px',
              backgroundColor: '#ef4444', color: '#fff',
              fontSize: '0.7rem', fontWeight: 800
            }}>
              SOLD OUT
            </span>
          )}
        </div>

        {/* Days-until pill top right */}
        {daysUntil && (
          <div style={{
            position: 'absolute', top: '0.75rem', right: '0.75rem',
            padding: '0.25rem 0.625rem', borderRadius: '999px',
            backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#f8fafc', fontSize: '0.7rem', fontWeight: 700
          }}>
            {daysUntil}
          </div>
        )}

        {/* Bottom of banner: title */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.875rem 1rem 0.875rem' }}>
          <h3 style={{
            margin: 0, fontSize: '1.0625rem', fontWeight: 800,
            color: '#f8fafc', lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {evt.title}
          </h3>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {/* Date & Venue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
            <Calendar size={13} color="#6366f1" />
            <span>{fmt.date(evt.startTime)} · {fmt.time(evt.startTime)}</span>
          </div>
          {(evt.venueName || evt.venueCity) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
              <MapPin size={13} color="#8b5cf6" />
              <span style={{
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                {[evt.venueName, evt.venueCity].filter(Boolean).join(' · ')}
              </span>
            </div>
          )}
        </div>

        {/* Seat availability bar */}
        {evt.totalSeats > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Users size={11} /> {soldOut ? 'Sold out' : `${evt.availableSeats} seats left`}
              </span>
              <span>{occupancy}% booked</span>
            </div>
            <div style={{ height: 4, borderRadius: 999, backgroundColor: '#1e293b', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${occupancy}%`,
                borderRadius: 999,
                background: occupancy >= 80
                  ? 'linear-gradient(90deg,#ef4444,#f59e0b)'
                  : occupancy >= 50
                  ? 'linear-gradient(90deg,#f59e0b,#eab308)'
                  : 'linear-gradient(90deg,#10b981,#06b6d4)',
                transition: 'width 0.6s ease'
              }} />
            </div>
          </div>
        )}

        {/* Pricing row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '0.5rem', borderTop: '1px solid #1e293b', marginTop: 'auto'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.15rem' }}>
              From
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f8fafc' }}>
              {fmt.price(evt.basePriceStandard || evt.currentStandardPrice)}
            </div>
          </div>
          <Link
            to={soldOut ? '#' : `/events/${evt.id}`}
            className={soldOut ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', pointerEvents: soldOut ? 'none' : 'auto' }}
          >
            {soldOut ? 'Sold Out' : 'Book Tickets'}
            {!soldOut && <ChevronRight size={14} />}
          </Link>
        </div>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export const EventsPage = () => {
  const [searchParams] = useSearchParams();
  const [events,    setEvents]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filterCat, setFilterCat] = useState(searchParams.get('category') || 'ALL');
  const [searchQ,   setSearchQ]   = useState(searchParams.get('search') || '');
  const [sortBy,    setSortBy]    = useState('date'); // 'date' | 'price' | 'popularity'

  useEffect(() => {
    api.get('/events')
      .then(res => setEvents(res.data?.content || res.data || []))
      .catch(err => { console.warn('Events fetch error', err); setEvents([]); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...events];
    if (filterCat !== 'ALL') list = list.filter(e => e.category === filterCat);
    if (searchQ.trim())      list = list.filter(e => e.title?.toLowerCase().includes(searchQ.toLowerCase()) || e.description?.toLowerCase().includes(searchQ.toLowerCase()));
    if (sortBy === 'date')        list.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    if (sortBy === 'price')       list.sort((a, b) => Number(a.basePriceStandard) - Number(b.basePriceStandard));
    if (sortBy === 'popularity')  list.sort((a, b) => (b.totalSeats - b.availableSeats) - (a.totalSeats - a.availableSeats));
    return list;
  }, [events, filterCat, searchQ, sortBy]);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Upcoming Events</h1>
        <p style={{ color: '#94a3b8' }}>
          {loading ? 'Loading events…' : `${filtered.length} event${filtered.length !== 1 ? 's' : ''} available`}
        </p>
      </div>

      {/* ── Category Pills ── */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
        {CATEGORIES.map(cat => {
          const Icon   = cat.icon;
          const active = filterCat === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setFilterCat(cat.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.4rem 0.875rem', borderRadius: '999px', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem',
                transition: 'all 150ms',
                backgroundColor: active ? cat.color : 'rgba(255,255,255,0.05)',
                color: active ? '#fff' : '#94a3b8',
                boxShadow: active ? `0 0 16px ${cat.color}50` : 'none'
              }}
            >
              <Icon size={14} /> {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── Search & Sort bar ── */}
      <div className="card" style={{
        marginBottom: '2rem', display: 'flex', gap: '0.75rem',
        flexWrap: 'wrap', alignItems: 'center', padding: '0.875rem 1.25rem'
      }}>
        <div style={{
          flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: '#0b101c', padding: '0.5rem 0.875rem',
          borderRadius: '0.5rem', border: '1px solid #1e293b'
        }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search events…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.875rem' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={15} color="#64748b" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: 160, fontSize: '0.875rem' }}
          >
            <option value="date">Sort: Soonest First</option>
            <option value="price">Sort: Lowest Price</option>
            <option value="popularity">Sort: Most Popular</option>
          </select>
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <Loader message="Fetching published events..." />
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Calendar size={48} color="#6366f1" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Events Found</h3>
          <p style={{ color: '#94a3b8', maxWidth: 400, margin: '0 auto 1.5rem' }}>
            {searchQ || filterCat !== 'ALL'
              ? 'No events match your filters. Try a different category or search term.'
              : 'There are currently no published events. Organizers will publish new events soon!'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {(searchQ || filterCat !== 'ALL') && (
              <button className="btn btn-secondary" onClick={() => { setSearchQ(''); setFilterCat('ALL'); }}>
                Clear Filters
              </button>
            )}
            <Link to="/" className="btn btn-primary">Return Home</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(evt => <EventCard key={evt.id} evt={evt} />)}
        </div>
      )}
    </div>
  );
};
