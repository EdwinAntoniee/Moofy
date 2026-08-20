import React, { useState } from 'react';
import { ArrowRight, Sliders, Sparkles } from 'lucide-react';

export const SearchBar = ({ onSearch, loading, initialPrompt = '', initialAlpha = 0.5 }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [alpha, setAlpha] = useState(initialAlpha);
  const [isInteractingSlider, setIsInteractingSlider] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    onSearch(prompt.trim(), alpha);
  };

  const getSliderLabel = (val) => {
    if (val <= 0.2) return '90% Mood / 10% Plot';
    if (val < 0.45) return '70% Mood / 30% Plot';
    if (val <= 0.55) return '50% Mood / 50% Plot';
    if (val < 0.8) return '30% Mood / 70% Plot';
    return '10% Mood / 90% Plot';
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '760px',
        width: '100%',
        margin: '0 auto',
        padding: '0 clamp(0.75rem, 2.5vw, 1rem)',
      }}
    >
      <form onSubmit={handleSubmit}>
        <div
          className="editorial-card"
          style={{
            padding: 'clamp(0.9rem, 2.8vw, 1.75rem)',
            backgroundColor: 'rgba(16, 16, 20, 0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
          }}
        >
          {/* Main textarea */}
          <div style={{ marginBottom: '1rem' }}>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="I've had a rough week and want something comforting..."
              style={{
                width: '100%',
                backgroundColor: '#0a0a0d',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                padding: 'clamp(0.75rem, 2vw, 1rem) clamp(0.85rem, 2vw, 1.15rem)',
                fontSize: 'clamp(0.85rem, 2.2vw, 0.98rem)',
                lineHeight: '1.55',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'var(--transition-smooth)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)')}
            />
          </div>

          {/* Hybrid weighting slider */}
          <div
            style={{
              padding: '0.75rem 0.9rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.15rem',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.55rem',
                gap: '0.4rem',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: 'clamp(0.74rem, 2vw, 0.82rem)',
                  color: '#e0e0d8',
                  fontWeight: '600',
                }}
              >
                <Sliders size={12} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <span>Recommendation Focus</span>
              </div>

              {/* Slider information visible when user drags or interacts with the slider */}
              <span
                style={{
                  fontSize: 'clamp(0.68rem, 1.8vw, 0.74rem)',
                  color: 'var(--accent-gold)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.2px',
                  fontWeight: '600',
                  opacity: isInteractingSlider ? 1 : 0,
                  transform: isInteractingSlider ? 'translateY(0)' : 'translateY(2px)',
                  transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {getSliderLabel(alpha)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <span
                style={{
                  fontSize: '0.66rem',
                  color: '#a0a098',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.4px',
                  fontWeight: '600',
                  userSelect: 'none',
                  flexShrink: 0,
                }}
              >
                MOOD
              </span>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
                onMouseDown={() => setIsInteractingSlider(true)}
                onMouseUp={() => setIsInteractingSlider(false)}
                onTouchStart={() => setIsInteractingSlider(true)}
                onTouchEnd={() => setIsInteractingSlider(false)}
                onMouseEnter={() => setIsInteractingSlider(true)}
                onMouseLeave={() => setIsInteractingSlider(false)}
                style={{
                  flex: 1,
                  accentColor: 'var(--accent-gold)',
                  cursor: 'pointer',
                  height: '4px',
                  minWidth: 0,
                }}
              />
              <span
                style={{
                  fontSize: '0.66rem',
                  color: '#a0a098',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.4px',
                  fontWeight: '600',
                  userSelect: 'none',
                  flexShrink: 0,
                }}
              >
                PLOT
              </span>
            </div>
          </div>

          {/* Action row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="btn-editorial-primary"
              style={{
                padding: '0.55rem 1.15rem',
                fontSize: 'clamp(0.78rem, 2vw, 0.85rem)',
                opacity: loading || !prompt.trim() ? 0.48 : 1,
                cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <Sparkles size={13} className="animate-spin" />
                  <span>Reading your mood...</span>
                </>
              ) : (
                <>
                  <span>Find My Film</span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
