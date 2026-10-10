import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import {
  Calendar, MapPin, Search, Ticket, Users,
  Zap, Music, Monitor, Gamepad2, Star, Mic2,
  SlidersHorizontal, ChevronRight, TrendingUp
} from 'lucide-react';
import { Loader } from '../components/common/Loader';

import { EventCard, CATEGORIES } from '../components/common/EventCard';


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
