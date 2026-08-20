import React from 'react';

export const HeroSpotlight = () => (
  <div
    style={{
      position: 'relative',
      zIndex: 2,
      maxWidth: '780px',
      margin: '0 auto',
      padding: 'clamp(2.25rem, 5.5vw, 4.25rem) 1.25rem clamp(1.15rem, 3vw, 2rem)',
      textAlign: 'center',
    }}
  >
    {/* Main headline */}
    <h1
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.85rem, 5.2vw, 3.8rem)',
        fontWeight: '400',
        fontStyle: 'italic',
        letterSpacing: '-0.5px',
        lineHeight: '1.15',
        color: '#FFFFFF',
        marginBottom: '0.85rem',
        textShadow: '0 4px 20px rgba(0,0,0,0.8)',
      }}
    >
      What do you feel like watching?
    </h1>

    {/* Subtitle */}
    <p
      style={{
        color: '#d4d4cc',
        fontSize: 'clamp(0.86rem, 2.2vw, 1.02rem)',
        lineHeight: '1.6',
        maxWidth: '520px',
        margin: '0 auto',
        fontWeight: '400',
        textShadow: '0 2px 10px rgba(0,0,0,0.8)',
      }}
    >
      Describe the mood. We'll find the movie.
    </p>
  </div>
);
