import json

frames = json.load(open('data/backdrops_56.json', encoding='utf-8'))
frames_json = json.dumps(frames, indent=2)

template = """import React from 'react';

/* ─────────────────────────────────────────────────────────────
   56 unique cinematic movie scenes from TMDB representing
   a vast variety of films, moods, and genres.
───────────────────────────────────────────────────────────── */
const FILM_FRAMES = __FRAMES_PLACEHOLDER__;

const FRAMES_PER_ROW = 56;

const buildStrip = (offset = 0) => {
  const single = Array.from({ length: FRAMES_PER_ROW }, (_, i) =>
    FILM_FRAMES[(i + offset) % FILM_FRAMES.length]
  );
  return [...single, ...single]; // duplicate -> seamless infinite scroll loop
};

const STRIP_1 = buildStrip(0);
const STRIP_2 = buildStrip(28);

/* ─────────────────────────────────────────────────────────────
   Continuous 35mm Film Tape Component
   Renders an authentic film reel tape with vertical separator bars
   and top/bottom sprocket perforation tracks.
─────────────────────────────────────────────────────────────── */
const FilmTapeRow = ({ frames, animationName, duration, opacity = 1 }) => (
  <div
    style={{
      position: 'relative',
      height: '160px',
      backgroundColor: '#020204',
      boxShadow: '0 10px 40px rgba(0,0,0,0.85)',
      borderTop: '2px solid #1c1c24',
      borderBottom: '2px solid #1c1c24',
      overflow: 'hidden',
      opacity: opacity,
    }}
  >
    {/* Continuous Top Sprocket Perforations Track */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '15px',
        backgroundColor: '#020204',
        zIndex: 5,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
      }}
    >
      {Array.from({ length: 120 }).map((_, i) => (
        <div
          key={`sp-top-${i}`}
          style={{
            width: '10px',
            height: '6px',
            borderRadius: '2px',
            backgroundColor: '#15151a',
            border: '1px solid #282832',
            flexShrink: 0,
          }}
        />
      ))}
    </div>

    {/* Moving Frames Strip */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        animation: `${animationName} ${duration} linear infinite`,
        willChange: 'transform',
        height: '100%',
        paddingTop: '15px',
        paddingBottom: '15px',
      }}
    >
      {frames.map((frame, idx) => (
        <div
          key={`frame-${idx}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {/* Vertical Black Inter-Frame Separator Bar */}
          <div
            style={{
              width: '16px',
              height: '130px',
              backgroundColor: '#020204',
              borderLeft: '1px solid #181820',
              borderRight: '1px solid #181820',
              flexShrink: 0,
            }}
          />

          {/* Film Frame Content with Real Movie Scene Backdrop */}
          <div
            style={{
              width: '210px',
              height: '130px',
              position: 'relative',
              flexShrink: 0,
              backgroundColor: '#08080a',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 14px rgba(0,0,0,0.9)',
            }}
          >
            {/* Real TMDB Movie Scene Backdrop */}
            <img
              src={frame.image}
              alt={frame.title}
              loading="lazy"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'saturate(110%) contrast(105%) brightness(85%)',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

            {/* Cinematic Scanline Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
                pointerEvents: 'none',
              }}
            />

            {/* Inner Depth Vignette */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Genre Watermark */}
            <div
              style={{
                position: 'absolute',
                bottom: '6px',
                right: '8px',
                fontSize: '0.45rem',
                color: 'rgba(255,255,255,0.45)',
                fontFamily: 'monospace',
                letterSpacing: '2.5px',
                fontWeight: '700',
                textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                pointerEvents: 'none',
              }}
            >
              {frame.genre}
            </div>

            {/* Title Watermark */}
            <div
              style={{
                position: 'absolute',
                top: '6px',
                left: '8px',
                fontSize: '0.42rem',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'sans-serif',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                maxWidth: '120px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                pointerEvents: 'none',
              }}
            >
              {frame.title}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Continuous Bottom Sprocket Perforations Track */}
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '15px',
        backgroundColor: '#020204',
        zIndex: 5,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
      }}
    >
      {Array.from({ length: 120 }).map((_, i) => (
        <div
          key={`sp-bot-${i}`}
          style={{
            width: '10px',
            height: '6px',
            borderRadius: '2px',
            backgroundColor: '#15151a',
            border: '1px solid #282832',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────
   Main export — scoped background for hero section
─────────────────────────────────────────────────────────────── */
export const FilmStripBackground = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      userSelect: 'none',
    }}
  >
    {/* ── Two rolling film reel tapes ── */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      <FilmTapeRow
        frames={STRIP_1}
        animationName="filmScroll"
        duration="210s"
        opacity={0.85}
      />
      <FilmTapeRow
        frames={STRIP_2}
        animationName="filmScrollReverse"
        duration="270s"
        opacity={0.6}
      />
    </div>

    {/* ── Layered Dark Cinematic Overlays for clean contrast and UI readability ── */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(12, 12, 14, 0.76)',
      }}
    />

    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(45, 20, 10, 0.22) 0%, transparent 75%)',
      }}
    />

    {/* Seamless bottom fade into solid #0c0c0e */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(to bottom, rgba(12,12,14,0.85) 0%, transparent 25%, transparent 70%, #0c0c0e 100%)',
      }}
    />
  </div>
);
"""

final_code = template.replace("__FRAMES_PLACEHOLDER__", frames_json)
with open('frontend/src/components/FilmStripBackground.jsx', 'w', encoding='utf-8') as f:
    f.write(final_code)

print('Generated FilmStripBackground.jsx with 56 distinct scenes.')
