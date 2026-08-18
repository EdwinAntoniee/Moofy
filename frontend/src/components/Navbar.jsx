import React from 'react';
import { Film, User, History, Bookmark, LogIn, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { user, isGuest, logout } = useAuth();

  return (
    <header className="navbar-container" style={{
      borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
      backgroundColor: 'rgba(11, 7, 10, 0.95)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveTab('search')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          backgroundColor: '#E50914',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(229, 9, 20, 0.5)',
        }}>
          <Film size={22} color="#FFFFFF" />
        </div>
        <div>
          <span style={{
            fontFamily: 'var(--font-cinema)',
            fontSize: '1.4rem',
            fontWeight: '900',
            letterSpacing: '2px',
            color: '#FFFFFF',
          }}>
            MOOFY
          </span>
          <span style={{
            color: 'var(--cinema-gold)',
            fontSize: '0.7rem',
            fontWeight: '700',
            marginLeft: '0.35rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(255, 215, 0, 0.12)',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}>
            CINEMA
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          onClick={() => setActiveTab('search')}
          style={{
            background: activeTab === 'search' ? 'linear-gradient(135deg, rgba(229,9,20,0.25) 0%, rgba(139,0,0,0.3) 100%)' : 'transparent',
            border: activeTab === 'search' ? '1px solid var(--marquee-red)' : '1px solid transparent',
            color: activeTab === 'search' ? '#FFFFFF' : 'var(--text-secondary)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
          }}
        >
          <Sparkles size={16} color={activeTab === 'search' ? '#FFD700' : 'currentColor'} />
          <span>Discovery</span>
        </button>

        {user && (
          <>
            <button
              onClick={() => setActiveTab('history')}
              style={{
                background: activeTab === 'history' ? 'linear-gradient(135deg, rgba(229,9,20,0.25) 0%, rgba(139,0,0,0.3) 100%)' : 'transparent',
                border: activeTab === 'history' ? '1px solid var(--marquee-red)' : '1px solid transparent',
                color: activeTab === 'history' ? '#FFFFFF' : 'var(--text-secondary)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
              }}
            >
              <History size={16} color={activeTab === 'history' ? '#FFD700' : 'currentColor'} />
              <span>Emotion History</span>
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              style={{
                background: activeTab === 'watchlist' ? 'linear-gradient(135deg, rgba(229,9,20,0.25) 0%, rgba(139,0,0,0.3) 100%)' : 'transparent',
                border: activeTab === 'watchlist' ? '1px solid var(--marquee-red)' : '1px solid transparent',
                color: activeTab === 'watchlist' ? '#FFFFFF' : 'var(--text-secondary)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
              }}
            >
              <Bookmark size={16} color={activeTab === 'watchlist' ? '#FFD700' : 'currentColor'} />
              <span>Watchlist</span>
            </button>
          </>
        )}
      </nav>

      {/* User / Guest Account Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {isGuest ? (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              backgroundColor: 'rgba(255,255,255,0.04)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              Guest Pass
            </div>
            <button
              onClick={onOpenAuth}
              className="btn-marquee"
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <LogIn size={15} />
              <span>Sign In / Register</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(229, 9, 20, 0.12)',
              border: '1px solid rgba(229, 9, 20, 0.3)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: '600',
            }}>
              <User size={15} color="var(--cinema-gold)" />
              <span>{user?.username}</span>
            </div>
            <button
              onClick={logout}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
              title="Sign Out"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
