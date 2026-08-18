import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(email, username, password);
      } else {
        await login(email, password);
      }
      onSuccess?.(isRegister ? 'Account created. Welcome to Moofy.' : 'Welcome back.');
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 5, 7, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.25rem',
          backgroundColor: '#111114',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          {isRegister ? (
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontWeight: '600',
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              marginBottom: '0.35rem',
            }}>
              Create Account
            </h3>
          ) : null}
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            {isRegister
              ? 'Persist your emotion history and curate personal watchlists.'
              : 'Customize your saved films and sentiment history'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#FCA5A5',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-xs)',
            marginBottom: '1.25rem',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
              EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="critic@cinema.com"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--border-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />
          </div>

          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                USERNAME
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Cinephile_99"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--border-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
              PASSWORD
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--border-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-editorial-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '0.5rem',
              padding: '0.75rem',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            <span>{submitting ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}</span>
          </button>
        </form>

        {/* Toggle */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isRegister ? (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to Moofy?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Create an Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
