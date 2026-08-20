import React from 'react';
import { Bookmark, Check, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MovieCard = ({
  movie,
  onOpenDetails,
  onToggleWatchlist,
  isInWatchlist = false,
  watchlistStatus = null,
  onOpenAuth,
}) => {
  const { isGuest } = useAuth();

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : '';
  const matchPercentage = Math.round(movie.hybrid_score * 100);

  const isQueued = isInWatchlist && watchlistStatus === 'plan_to_watch';
  const isWatched = isInWatchlist && watchlistStatus === 'watched';

  const handleQueueClick = (e) => {
    e.stopPropagation();
    if (isGuest) {
      onOpenAuth?.();
      return;
    }
    onToggleWatchlist?.(movie, 'plan_to_watch');
  };

  const handleWatchedClick = (e) => {
    e.stopPropagation();
    if (isGuest) {
      onOpenAuth?.();
      return;
    }
    onToggleWatchlist?.(movie, 'watched');
  };

  return (
    <div
      className="editorial-card"
      onClick={() => onOpenDetails(movie)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Poster Media Box */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '148%', /* Classic theatrical aspect ratio */
        backgroundColor: '#151518',
        overflow: 'hidden',
      }}>
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.2, 0, 0, 1)',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.04)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            textAlign: 'center',
            backgroundColor: '#151518',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9rem',
          }}>
            {movie.title}
          </div>
        )}

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          gap: '4px',
        }}>
          {/* Rating */}
          <div 
            className="movie-card-badge"
            style={{
              backgroundColor: 'rgba(12, 12, 14, 0.84)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-subtle)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.68rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              flexShrink: 0,
            }}
          >
            <Star size={10} fill="var(--accent-gold)" color="var(--accent-gold)" />
            <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '7.0'}</span>
          </div>

          {/* Match % */}
          {matchPercentage > 0 && (
            <div 
              className="movie-card-badge"
              style={{
                backgroundColor: 'rgba(12, 12, 14, 0.84)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-subtle)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.68rem',
                fontWeight: '600',
                color: 'var(--accent-gold)',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {matchPercentage}% MATCH
            </div>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div 
        className="movie-card-body"
        style={{
          padding: '0.9rem 0.85rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          gap: '0.65rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.35rem', marginBottom: '0.3rem' }}>
            <h4 
              className="movie-card-title"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.96rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                wordBreak: 'break-word',
              }}
            >
              {movie.title}
            </h4>
            {releaseYear && (
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                {releaseYear}
              </span>
            )}
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '0.4rem' }}>
              {movie.genres.slice(0, 2).map((g, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.64rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {g}{i < Math.min(movie.genres.length, 2) - 1 ? ' · ' : ''}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis Excerpt */}
          <p 
            className="movie-card-synopsis"
            style={{
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.45',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {movie.overview || 'No synopsis available.'}
          </p>
        </div>

        {/* Action Row */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          paddingTop: '0.55rem',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          {/* Add to Queue Button */}
          <button
            onClick={handleQueueClick}
            className="movie-card-action-btn"
            style={{
              flex: 1,
              backgroundColor: isQueued ? 'rgba(200, 170, 118, 0.18)' : 'transparent',
              border: isQueued ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
              color: isQueued ? 'var(--accent-gold)' : 'var(--text-primary)',
              padding: '0.38rem 0.25rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.68rem',
              fontWeight: '500',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
              minWidth: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              transition: 'var(--transition-smooth)',
            }}
            title={isQueued ? 'Remove from Queue' : 'Add to Queue'}
          >
            <Bookmark size={10} fill={isQueued ? 'var(--accent-gold)' : 'none'} style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isQueued ? 'In Queue' : 'Queue'}</span>
          </button>

          {/* Mark Watched Button */}
          <button
            onClick={handleWatchedClick}
            className="movie-card-action-btn"
            style={{
              flex: 1,
              backgroundColor: isWatched ? 'rgba(120, 180, 140, 0.18)' : 'transparent',
              border: isWatched ? '1px solid #739682' : '1px solid var(--border-subtle)',
              color: isWatched ? '#a3d4b6' : 'var(--text-primary)',
              padding: '0.38rem 0.25rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.68rem',
              fontWeight: '500',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
              minWidth: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              transition: 'var(--transition-smooth)',
            }}
            title={isWatched ? 'Unmark Watched' : 'Mark as Watched'}
          >
            <Check size={10} strokeWidth={isWatched ? 3 : 2} style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isWatched ? 'Watched' : 'Watched'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
