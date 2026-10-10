import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  CalendarDays, 
  MapPin, 
  TrendingUp, 
  CreditCard, 
  QrCode, 
  ArrowLeft,
  ShieldAlert,
  LogOut
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
        <ShieldAlert size={48} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
        <h2>Access Denied</h2>
        <p style={{ color: '#94a3b8', margin: '1rem 0 2rem' }}>
          You must be logged in as an Administrator to view this portal.
        </p>
        <Link to="/login" className="btn btn-primary">Go to Login</Link>
      </div>
    );
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/events', label: 'Events', icon: CalendarDays },
    { to: '/admin/venues', label: 'Venues & Seats', icon: MapPin },
    { to: '/admin/pricing', label: 'Pricing Rules', icon: TrendingUp },
    { to: '/admin/bookings', label: 'Bookings & Orders', icon: CreditCard },
    { to: '/admin/validate-ticket', label: 'Ticket Verification', icon: QrCode },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#070a12' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        borderRight: '1px solid #1e293b',
        backgroundColor: '#0c111e',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '0.375rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={16} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>Admin Hub</h2>
              <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600 }}>EventPass Control</span>
            </div>
          </div>
        </div>

        <nav style={{ padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive ? '#ffffff' : '#94a3b8',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 150ms'
                })}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#94a3b8', textDecoration: 'none', padding: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Live Site
          </Link>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <header style={{
          height: '4rem',
          borderBottom: '1px solid #1e293b',
          backgroundColor: '#0a0e1a',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Management Dashboard</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Admin Mode Active</span>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>{user?.fullName}</span>
          </div>
        </header>

        <main style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
