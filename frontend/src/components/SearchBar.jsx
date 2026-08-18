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
    if (val <= 0.2) return 'Mood only (90% Mood)';
    if (val < 0.45) return 'Mood-leaning (70% Mood)';
    if (val <= 0.55) return 'Balanced (50% Mood / 50% Plot)';
    if (val < 0.8) return 'Plot-leaning (70% Plot)';
    return 'Plot only (90% Plot)';
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '760px',
        width: '100%',
        margin: '0 auto',
        padding: '0 1rem',
      }}
    >
      <form onSubmit={handleSubmit}>
        <div
          className="editorial-card"
          style={{
            padding: 'clamp(1.1rem, 3vw, 1.85rem)',
            backgroundColor: 'rgba(16, 16, 20, 0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
          }}
        >
          {/* Main textarea */}
          <div style={{ marginBottom: '1.15rem' }}>
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
                padding: 'clamp(0.85rem, 2vw, 1.05rem) clamp(0.9rem, 2vw, 1.2rem)',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                lineHeight: '1.6',
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
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.65rem',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.82rem',
                  color: '#e0e0d8',
                  fontWeight: '600',
                }}
              >
                <Sliders size={13} color="var(--accent-gold)" />
                <span style={{ whiteSpace: 'nowrap' }}>Recommendation Focus</span>
              </div>

              {/* Slider information visible when user drags or interacts with the slider */}
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--accent-gold)',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  letterSpacing: '0.3px',
                  fontWeight: '600',
                  opacity: isInteractingSlider ? 1 : 0,
                  transform: isInteractingSlider ? 'translateY(0)' : 'translateY(3px)',
                  transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {getSliderLabel(alpha)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  color: '#a0a098',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  letterSpacing: '0.5px',
                  fontWeight: '600',
                  userSelect: 'none',
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
                  fontSize: '0.7rem',
                  color: '#a0a098',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  letterSpacing: '0.5px',
                  fontWeight: '600',
                  userSelect: 'none',
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
                padding: '0.6rem 1.25rem',
                fontSize: '0.85rem',
                opacity: loading || !prompt.trim() ? 0.48 : 1,
                cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <Sparkles size={14} className="animate-spin" />
                  <span>Reading your mood...</span>
                </>
              ) : (
                <>
                  <span>Find My Film</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
