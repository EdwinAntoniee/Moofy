import React from 'react';

export const HeroSpotlight = () => (
  <div
    style={{
      position: 'relative',
      zIndex: 2,
      maxWidth: '780px',
      margin: '0 auto',
      padding: '4.5rem 1.5rem 2rem',
      textAlign: 'center',
    }}
  >
    {/* Main headline */}
    <h1
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
        fontWeight: '400',
        fontStyle: 'italic',
        letterSpacing: '-0.5px',
        lineHeight: '1.15',
        color: '#FFFFFF',
        marginBottom: '1.25rem',
        textShadow: '0 4px 20px rgba(0,0,0,0.8)',
      }}
    >
      What do you feel like watching?
    </h1>

    {/* Subtitle */}
    <p
      style={{
        color: '#d4d4cc',
        fontSize: '1.05rem',
        lineHeight: '1.65',
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
