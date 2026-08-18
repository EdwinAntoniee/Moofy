import React from 'react';

/* ─────────────────────────────────────────────────────────────
   56 unique cinematic movie scenes from TMDB representing
   a vast variety of films, moods, and genres.
───────────────────────────────────────────────────────────── */
const FILM_FRAMES = [
  {
    "id": "frame-0",
    "title": "Toy Story 5",
    "genre": "ANIMATION",
    "image": "https://image.tmdb.org/t/p/w780/8sSKdEmlmqF4kJUd28SqthXC4yZ.jpg"
  },
  {
    "id": "frame-1",
    "title": "Spider-Man: No Way Home",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/uyrOU4BDm2kbVxFsMiDFIHDhc4d.jpg"
  },
  {
    "id": "frame-2",
    "title": "The Last House",
    "genre": "HORROR",
    "image": "https://image.tmdb.org/t/p/w780/1RhfevWmWCVHtEqxWBEjPOC5KG1.jpg"
  },
  {
    "id": "frame-3",
    "title": "Disclosure Day",
    "genre": "SCIENCE FICTION",
    "image": "https://image.tmdb.org/t/p/w780/flxau5Iu7bChQHsESqvGZ3FQRaI.jpg"
  },
  {
    "id": "frame-4",
    "title": "Moana",
    "genre": "FAMILY",
    "image": "https://image.tmdb.org/t/p/w780/c6BPbkO5Npt1OdwttAxCFo06wtH.jpg"
  },
  {
    "id": "frame-5",
    "title": "Colony",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/84FEpVVbSKYvKXDZJDZXOKBxCEm.jpg"
  },
  {
    "id": "frame-6",
    "title": "Spider-Man: Homecoming",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/fn4n6uOYcB6Uh89nbNPoU2w80RV.jpg"
  },
  {
    "id": "frame-7",
    "title": "Scary Movie",
    "genre": "COMEDY",
    "image": "https://image.tmdb.org/t/p/w780/xWBiXclrRmTggQHMRsIn84YHavs.jpg"
  },
  {
    "id": "frame-8",
    "title": "Obsession",
    "genre": "HORROR",
    "image": "https://image.tmdb.org/t/p/w780/rZfmzpixLKLR3Hg2u0WgC7XLFl8.jpg"
  },
  {
    "id": "frame-9",
    "title": "Minions & Monsters",
    "genre": "ADVENTURE",
    "image": "https://image.tmdb.org/t/p/w780/kkcwhgSFd81QDlXo8ytrpHPQjhy.jpg"
  },
  {
    "id": "frame-10",
    "title": "The Death of Robin Hood",
    "genre": "ADVENTURE",
    "image": "https://image.tmdb.org/t/p/w780/lh3BDkmWJh998n4fQcHYcVi7dpm.jpg"
  },
  {
    "id": "frame-11",
    "title": "Spider-Man: Brand New Day",
    "genre": "SCIENCE FICTION",
    "image": "https://image.tmdb.org/t/p/w780/qeQJx07rK2xm8SD2sJxFKhE7gs0.jpg"
  },
  {
    "id": "frame-12",
    "title": "Supergirl",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/54KIfdTEzOliHDKx0OkzYGqAICx.jpg"
  },
  {
    "id": "frame-13",
    "title": "The End of Oak Street",
    "genre": "SCIENCE FICTION",
    "image": "https://image.tmdb.org/t/p/w780/b9q9VmbXDvJmTziRqkwdEmFdwhr.jpg"
  },
  {
    "id": "frame-14",
    "title": "The Odyssey",
    "genre": "ADVENTURE",
    "image": "https://image.tmdb.org/t/p/w780/r57L2UBLPKcHdZQYg8tagv9XqK2.jpg"
  },
  {
    "id": "frame-15",
    "title": "Evil Dead Burn",
    "genre": "HORROR",
    "image": "https://image.tmdb.org/t/p/w780/o0jkkpcN81QqSl8DMLScBCXyUH9.jpg"
  },
  {
    "id": "frame-16",
    "title": "The Invite",
    "genre": "COMEDY",
    "image": "https://image.tmdb.org/t/p/w780/bs32Ds4L8VADGjBVasSK1ASU7OW.jpg"
  },
  {
    "id": "frame-17",
    "title": "The Devil's Mouth",
    "genre": "HORROR",
    "image": "https://image.tmdb.org/t/p/w780/4wmvU2Px3C8v3qqyNpBmgJrWQEx.jpg"
  },
  {
    "id": "frame-18",
    "title": "Backrooms",
    "genre": "HORROR",
    "image": "https://image.tmdb.org/t/p/w780/dqmMWNWfLnExDRpMtIMqI97GQFR.jpg"
  },
  {
    "id": "frame-19",
    "title": "Project Hail Mary",
    "genre": "SCIENCE FICTION",
    "image": "https://image.tmdb.org/t/p/w780/8Tfys3mDZVp4tNoH2ktm06a0Tau.jpg"
  },
  {
    "id": "frame-20",
    "title": "Spider-Man",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/zQ8AxTPiCiS5nnwXpwTBPBHSaa5.jpg"
  },
  {
    "id": "frame-21",
    "title": "Spider-Man: Far From Home",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/vamhMTvh9m9zFHDoR0v1nRtf6T4.jpg"
  },
  {
    "id": "frame-22",
    "title": "Masters of the Universe",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/yQIdU11DYQQp0neGtGtGxbGfRer.jpg"
  },
  {
    "id": "frame-23",
    "title": "Jackass: Best and Last",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/dUbP1HNdI0aCq1zgRJw28PWSqmk.jpg"
  },
  {
    "id": "frame-24",
    "title": "Soulm8te",
    "genre": "HORROR",
    "image": "https://image.tmdb.org/t/p/w780/7t6f6VxA2ZXbbZSVctgt7bZG2DI.jpg"
  },
  {
    "id": "frame-25",
    "title": "The Devil Wears Prada 2",
    "genre": "COMEDY",
    "image": "https://image.tmdb.org/t/p/w780/Af907x5h9W1wVis8XrSd7ynTWuy.jpg"
  },
  {
    "id": "frame-26",
    "title": "Avatar Aang: The Last Airbender",
    "genre": "ANIMATION",
    "image": "https://image.tmdb.org/t/p/w780/ezbrL1dMymKQZw7mDEWa2ZTzN7d.jpg"
  },
  {
    "id": "frame-27",
    "title": "Hotel Desire",
    "genre": "DRAMA",
    "image": "https://image.tmdb.org/t/p/w780/wcUohmHc9oDZXarXDp905TYVui4.jpg"
  },
  {
    "id": "frame-28",
    "title": "Kraken",
    "genre": "HORROR",
    "image": "https://image.tmdb.org/t/p/w780/oV472EbPedkc5QzqolGc7sCgCnn.jpg"
  },
  {
    "id": "frame-29",
    "title": "Zootopia 2",
    "genre": "ANIMATION",
    "image": "https://image.tmdb.org/t/p/w780/lgotja3xMoJZbynwHfcQcJAEMWH.jpg"
  },
  {
    "id": "frame-30",
    "title": "Avatar: Fire and Ash",
    "genre": "SCIENCE FICTION",
    "image": "https://image.tmdb.org/t/p/w780/sdZSjtGUTSN8B3al5o0f2WoQfQQ.jpg"
  },
  {
    "id": "frame-31",
    "title": "Deep Water",
    "genre": "HORROR",
    "image": "https://image.tmdb.org/t/p/w780/szKv713FcUXx6hcfdY369vtkmzr.jpg"
  },
  {
    "id": "frame-32",
    "title": "Leviticus",
    "genre": "HORROR",
    "image": "https://image.tmdb.org/t/p/w780/7y8zWGEjs7tresw4Hzkkf4TdkcL.jpg"
  },
  {
    "id": "frame-33",
    "title": "The Avengers",
    "genre": "SCIENCE FICTION",
    "image": "https://image.tmdb.org/t/p/w780/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg"
  },
  {
    "id": "frame-34",
    "title": "Your Heart Will Be Broken",
    "genre": "ROMANCE",
    "image": "https://image.tmdb.org/t/p/w780/1x9e0qWonw634NhIsRdvnneeqvN.jpg"
  },
  {
    "id": "frame-35",
    "title": "The Debt Collector",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/dk68ykaNd3HdrDJyPJqEGsgvag7.jpg"
  },
  {
    "id": "frame-36",
    "title": "Demon Slayer: Kimetsu no Yaiba Infinity Castle",
    "genre": "ANIMATION",
    "image": "https://image.tmdb.org/t/p/w780/1RgPyOhN4DRs225BGTlHJqCudII.jpg"
  },
  {
    "id": "frame-37",
    "title": "The Shawshank Redemption",
    "genre": "DRAMA",
    "image": "https://image.tmdb.org/t/p/w780/zfbjgQE1uSd9wiPTX4VzsLi0rGG.jpg"
  },
  {
    "id": "frame-38",
    "title": "Desire",
    "genre": "MYSTERY",
    "image": "https://image.tmdb.org/t/p/w780/oBter8Y5p2ZFUwWgQ1T9pulGFTJ.jpg"
  },
  {
    "id": "frame-39",
    "title": "The Punisher: One Last Kill",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/qO55CD8tgVL1T4WKn6zYFFiD6lL.jpg"
  },
  {
    "id": "frame-40",
    "title": "Spider-Man 3",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/FfAU0PUs8AJkMU2VbkVNFtRXR4.jpg"
  },
  {
    "id": "frame-41",
    "title": "Michael",
    "genre": "MUSIC",
    "image": "https://image.tmdb.org/t/p/w780/ufSwlnECLoUbBjPrFqEQcWBzHwc.jpg"
  },
  {
    "id": "frame-42",
    "title": "Mortal Kombat II",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/4EAAwpylq313qrDqpCxulUrXBNF.jpg"
  },
  {
    "id": "frame-43",
    "title": "Interstellar",
    "genre": "ADVENTURE",
    "image": "https://image.tmdb.org/t/p/w780/5XNQBqnBwPA9yT0jZ0p3s8bbLh0.jpg"
  },
  {
    "id": "frame-44",
    "title": "The Amazing Spider-Man 2",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/k0hlAzTryCYX1O1LyC6P8tAa8s0.jpg"
  },
  {
    "id": "frame-45",
    "title": "Avengers: Infinity War",
    "genre": "ADVENTURE",
    "image": "https://image.tmdb.org/t/p/w780/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg"
  },
  {
    "id": "frame-46",
    "title": "The Mandalorian and Grogu",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/MJcERawyqGqJdPsOBc0C449hQ9.jpg"
  },
  {
    "id": "frame-47",
    "title": "The Shadow's Edge",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/4BtL2vvEufDXDP4u6xQjjQ1Y2aT.jpg"
  },
  {
    "id": "frame-48",
    "title": "The Super Mario Galaxy Movie",
    "genre": "FAMILY",
    "image": "https://image.tmdb.org/t/p/w780/kxQiIJ4gVcD3K6o14MJ72p5yRcE.jpg"
  },
  {
    "id": "frame-49",
    "title": "Spider-Man: Across the Spider-Verse",
    "genre": "ANIMATION",
    "image": "https://image.tmdb.org/t/p/w780/kVd3a9YeLGkoeR50jGEXM6EqseS.jpg"
  },
  {
    "id": "frame-50",
    "title": "Avengers: Endgame",
    "genre": "ADVENTURE",
    "image": "https://image.tmdb.org/t/p/w780/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg"
  },
  {
    "id": "frame-51",
    "title": "The Furious",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/9XwQphZxNJgGASfjL58mhIkJJpf.jpg"
  },
  {
    "id": "frame-52",
    "title": "Shelter",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/nHxWyy18SvAZ8jJeemtS8k1UNjM.jpg"
  },
  {
    "id": "frame-53",
    "title": "Hoppers",
    "genre": "ADVENTURE",
    "image": "https://image.tmdb.org/t/p/w780/3Jj0A10NVu2dWnoEL5t5oT79L1Y.jpg"
  },
  {
    "id": "frame-54",
    "title": "Spider-Man: Into the Spider-Verse",
    "genre": "ANIMATION",
    "image": "https://image.tmdb.org/t/p/w780/8mnXR9rey5uQ08rZAvzojKWbDQS.jpg"
  },
  {
    "id": "frame-55",
    "title": "The Amazing Spider-Man",
    "genre": "ACTION",
    "image": "https://image.tmdb.org/t/p/w780/HVcza6tJtWFrLriuh3Ano4Vt46.jpg"
  }
];

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
