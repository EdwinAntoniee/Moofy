import React, { useState } from 'react';
import { Search, Sparkles, Sliders, Film } from 'lucide-react';

export const SearchBar = ({ onSearch, loading, initialPrompt = '', initialAlpha = 0.5 }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [alpha, setAlpha] = useState(initialAlpha);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    onSearch(prompt.trim(), alpha);
  };

  const getSliderLabel = (val) => {
    if (val <= 0.2) return '90% Emotion Vibe (Mood Focused)';
    if (val < 0.45) return '70% Emotion Vibe / 30% Plot';
    if (val <= 0.55) return '50% Plot / 50% Emotion (Balanced Discovery)';
    if (val < 0.8) return '70% Plot / 30% Emotion Vibe';
    return '90% Story & Narrative (Strict Plot Match)';
  };

  return (
    <div className="search-section" style={{ maxWidth: '850px', margin: '0 auto', padding: '0 1rem' }}>
      <form onSubmit={handleSubmit}>
        <div 
          className="theatre-card"
          style={{
            padding: '1.5rem',
            border: '1px solid rgba(229, 9, 20, 0.4)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 50px rgba(229, 9, 20, 0.15)',
            position: 'relative',
          }}
        >
          {/* Textarea Input */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your mood, feelings, day, or what you want to experience... (e.g. 'I had a stressful week and I need an uplifting, heartwarming comedy with great chemistry')"
              style={{
                width: '100%',
                backgroundColor: 'rgba(10, 6, 9, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-md)',
                color: '#FFFFFF',
                padding: '1rem',
                fontSize: '1rem',
                lineHeight: '1.5',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--marquee-red)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
            />
          </div>

          {/* Vibe vs Plot Tuning Slider */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cinema-gold)', fontSize: '0.85rem', fontWeight: '600' }}>
                <Sliders size={16} />
                <span>Hybrid Balance (Vibe vs Plot)</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#FFFFFF', backgroundColor: 'rgba(229, 9, 20, 0.25)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(229, 9, 20, 0.4)', fontWeight: '600' }}>
                {getSliderLabel(alpha)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Pure Mood
              </span>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  accentColor: 'var(--marquee-red)',
                  cursor: 'pointer',
                  height: '6px',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Strict Story
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ⚡ Safe & Verified Cinema Catalog • Quality Rating Filter Active
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="btn-marquee"
              style={{
                padding: '0.85rem 2rem',
                fontSize: '1rem',
                opacity: loading || !prompt.trim() ? 0.6 : 1,
                cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <Sparkles size={18} className="animate-spin" />
                  <span>Projecting Cinema...</span>
                </>
              ) : (
                <>
                  <Film size={18} />
                  <span>Discover Films</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
