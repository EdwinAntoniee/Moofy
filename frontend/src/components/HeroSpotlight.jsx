import React from 'react';
import { Popcorn, Clapperboard, Sparkles } from 'lucide-react';

export const HeroSpotlight = () => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', padding: '3.5rem 1.5rem 2rem 1.5rem', textAlign: 'center' }}>
      {/* Overhead Spotlight */}
      <div className="spotlight-cone" />

      {/* Decorative Film Tape Top */}
      <div className="film-tape" style={{ marginBottom: '2.5rem' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
        {/* Playful Popcorn & Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          color: 'var(--cinema-gold)',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '1.25rem',
          boxShadow: '0 0 25px rgba(255, 215, 0, 0.15)',
        }}>
          <Popcorn size={18} className="animate-popcorn" color="var(--cinema-gold)" />
          <span>Multi-Emotion NLP & Vector Cinema Recommender</span>
        </div>

        {/* Marquee Title */}
        <h1 style={{
          fontFamily: 'var(--font-cinema)',
          fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
          fontWeight: '900',
          letterSpacing: '3px',
          lineHeight: '1.15',
          color: '#FFFFFF',
          marginBottom: '1rem',
          textShadow: '0 0 40px rgba(229, 9, 20, 0.6), 0 0 80px rgba(255, 215, 0, 0.2)',
        }}>
          HOW ARE YOU <span className="shimmer-text">FEELING</span> TONIGHT?
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          lineHeight: '1.6',
          maxWidth: '650px',
          margin: '0 auto 1.5rem auto',
          fontWeight: '400',
        }}>
          Describe your day, confession, or desired vibe in your own words.
          Our fine-tuned AI detects your emotional state and retrieves the most resonant films from our cinema vault.
        </p>
      </div>

      {/* Decorative Film Tape Bottom */}
      <div className="film-tape" style={{ marginTop: '2.5rem' }} />
    </div>
  );
};
