import React from 'react';
import { X, Star, Calendar, Bookmark, Check, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MovieDetailsModal = ({
  movie,
  onClose,
  onToggleWatchlist,
  isInWatchlist = false,
  watchlistStatus = null,
  onOpenAuth,
}) => {
  const { isGuest } = useAuth();
  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const isQueued = isInWatchlist && watchlistStatus === 'plan_to_watch';
  const isWatched = isInWatchlist && watchlistStatus === 'watched';

  const handleQueueClick = () => {
    if (isGuest) {
      onOpenAuth?.();
      return;
    }
    onToggleWatchlist?.(movie, 'plan_to_watch');
  };

  const handleWatchedClick = () => {
    if (isGuest) {
      onOpenAuth?.();
      return;
    }
    onToggleWatchlist?.(movie, 'watched');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 5, 7, 0.88)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(0.5rem, 2vw, 1rem)',
    }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: '#111114',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.85)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            backgroundColor: 'rgba(12, 12, 14, 0.85)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            width: '30px',
            height: '30px',
            borderRadius: 'var(--radius-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'var(--transition-smooth)',
          }}
          onMouseEnter={(e) => e.target.style.color = '#FFFFFF'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
        >
          <X size={15} />
        </button>

        {/* Backdrop Banner */}
        {backdropUrl && (
          <div style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(130px, 22vh, 190px)',
            backgroundColor: '#151518',
            overflow: 'hidden',
          }}>
            <img
              src={backdropUrl}
              alt={movie.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, #111114 0%, rgba(17, 17, 20, 0.4) 50%, transparent 100%)',
            }} />
          </div>
        )}

        {/* Content Container */}
        <div style={{ padding: 'clamp(0.85rem, 2.5vw, 1.5rem)' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.15rem' }}>
            {/* Poster */}
            {posterUrl && (
              <img
                src={posterUrl}
                alt={movie.title}
                style={{
                  width: 'clamp(80px, 18vw, 110px)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)',
                  flexShrink: 0,
                  alignSelf: 'flex-start',
                }}
              />
            )}

            {/* Header info */}
            <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {movie.hybrid_score > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{
                    color: 'var(--accent-gold)',
                    border: '1px solid var(--border-accent)',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.66rem',
                    fontWeight: '600',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {Math.round(movie.hybrid_score * 100)}% MATCH
                  </span>
                </div>
              )}

              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.15rem, 3.5vw, 1.6rem)',
                fontWeight: '600',
                color: 'var(--text-primary)',
                lineHeight: '1.2',
                marginBottom: '0.45rem',
              }}>
                {movie.title}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-primary)' }}>
                  <Star size={11} fill="var(--accent-gold)" color="var(--accent-gold)" />
                  <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '7.0'} / 10</span>
                </div>
                {movie.release_date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Calendar size={11} />
                    <span>{movie.release_date}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '1rem' }}>
              {movie.genres.map((genre, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.66rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis */}
          <div style={{ marginBottom: '1.15rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.35rem' }}>
              Synopsis
            </span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: '1.55' }}>
              {movie.overview || 'No synopsis recorded.'}
            </p>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '0.4rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
            <button
              onClick={handleQueueClick}
              className="btn-editorial-primary"
              style={{
                flex: 1,
                minWidth: '95px',
                justifyContent: 'center',
                backgroundColor: isQueued ? 'rgba(200, 170, 118, 0.2)' : undefined,
                color: isQueued ? 'var(--accent-gold)' : undefined,
                borderColor: isQueued ? 'var(--accent-gold)' : undefined,
                padding: '0.45rem 0.65rem',
                fontSize: '0.74rem',
              }}
            >
              <Bookmark size={13} fill={isQueued ? 'var(--accent-gold)' : 'none'} style={{ flexShrink: 0 }} />
              <span>{isQueued ? 'In Queue' : 'Queue'}</span>
            </button>

            <button
              onClick={handleWatchedClick}
              className="btn-editorial-secondary"
              style={{
                flex: 1,
                minWidth: '95px',
                justifyContent: 'center',
                backgroundColor: isWatched ? 'rgba(120, 180, 140, 0.18)' : undefined,
                color: isWatched ? '#a3d4b6' : undefined,
                borderColor: isWatched ? '#739682' : undefined,
                padding: '0.45rem 0.65rem',
                fontSize: '0.74rem',
              }}
            >
              <Check size={13} strokeWidth={isWatched ? 3 : 2} style={{ flexShrink: 0 }} />
              <span>{isWatched ? 'Watched' : 'Watched'}</span>
            </button>

            <a
              href={`https://www.themoviedb.org/movie/${movie.movie_id}`}
              target="_blank"
              rel="noreferrer"
              className="btn-editorial-secondary"
              style={{ textDecoration: 'none', padding: '0.45rem 0.75rem', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <ExternalLink size={12} style={{ flexShrink: 0 }} />
              <span>TMDB</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
