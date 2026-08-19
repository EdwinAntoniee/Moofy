import React from 'react';
import { User, History, Bookmark, LogIn, LogOut, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export const Navbar = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { user, isGuest, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setActiveTab('search'); // Redirect to discover page on sign out
  };

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(12, 12, 14, 0.9)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.8rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Brand Logo */}
      <div
        onClick={() => setActiveTab('search')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <img
          src={logoImg}
          alt="Moofy Logo"
          style={{
            height: '26px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 8px rgba(244, 244, 238, 0.12))',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.2rem, 3.2vw, 1.45rem)',
            fontWeight: '600',
            fontStyle: 'italic',
            letterSpacing: '0.6px',
            color: 'var(--text-primary)',
          }}
        >
          Moofy
        </span>
      </div>

      {/* Navigation links — rendered ONLY when signed in */}
      {!isGuest && user ? (
        <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <button
            onClick={() => setActiveTab('search')}
            className={`nav-link ${activeTab === 'search' ? 'active' : ''}`}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Compass size={14} />
            <span className="nav-text">Discover</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
          >
            <History size={14} />
            <span className="nav-text">History</span>
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className={`nav-link ${activeTab === 'watchlist' ? 'active' : ''}`}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Bookmark size={14} />
            <span className="nav-text">Watchlist</span>
          </button>
        </nav>
      ) : (
        /* Empty space when Guest so layout stays perfectly balanced */
        <div style={{ flex: 1 }} />
      )}

      {/* Account controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {isGuest ? (
          <>
            <div
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.5px',
                color: 'var(--text-muted)',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-gold)',
                  display: 'inline-block',
                }}
              />
              GUEST
            </div>
            <button
              onClick={onOpenAuth}
              className="btn-editorial-primary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '0.35rem 0.7rem',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.78rem',
                fontWeight: '500',
                maxWidth: '130px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <User size={12} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.username}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-editorial-secondary"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              title="Sign Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
