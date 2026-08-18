import React from 'react';
import { Star, Bookmark, Check, Info, Film, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EMOTION_COLORS = {
  Joy: '#F59E0B',
  Love: '#EC4899',
  Surprise: '#A855F7',
  Sadness: '#3B82F6',
  Fear: '#10B981',
  Anger: '#EF4444',
};

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
  const emotionColor = EMOTION_COLORS[movie.emotion_label] || 'var(--cinema-gold)';

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (isGuest) {
      onOpenAuth?.();
      return;
    }
    onToggleWatchlist?.(movie);
  };

  return (
    <div
      className="theatre-card"
      onClick={() => onOpenDetails(movie)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Poster Media Box */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '145%', /* 2:3 aspect ratio */
        backgroundColor: '#180E15',
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
              transition: 'transform 0.5s ease',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            textAlign: 'center',
            backgroundColor: '#1E111A',
            color: 'var(--text-muted)',
          }}>
            <Film size={40} color="var(--marquee-red)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{movie.title}</span>
          </div>
        )}

        {/* Rating Badge */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          padding: '3px 8px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.75rem',
          fontWeight: '700',
          color: 'var(--cinema-gold)',
        }}>
          <Star size={12} fill="var(--cinema-gold)" />
          <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '7.0'}</span>
        </div>

        {/* Match Percentage Badge */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'rgba(229, 9, 20, 0.85)',
          backdropFilter: 'blur(8px)',
          padding: '3px 8px',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: '700',
          color: '#FFFFFF',
          boxShadow: '0 2px 10px rgba(229, 9, 20, 0.5)',
        }}>
          {matchPercentage}% Match
        </div>

        {/* Emotion Label Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(6px)',
          border: `1px solid ${emotionColor}`,
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.7rem',
          fontWeight: '700',
          color: emotionColor,
        }}>
          ● {movie.emotion_label}
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{
        padding: '1.1rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        gap: '0.75rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <h3 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#FFFFFF',
              lineHeight: '1.3',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {movie.title}
            </h3>
            {releaseYear && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                {releaseYear}
              </span>
            )}
          </div>

          {/* Genres Pills */}
          {movie.genres && movie.genres.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '0.5rem' }}>
              {movie.genres.slice(0, 3).map((g, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.65rem',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis Excerpt */}
          <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {movie.overview || 'No synopsis available for this film.'}
          </p>
        </div>

        {/* Card Action Row */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}>
          <button
            onClick={handleWatchlistClick}
            style={{
              flex: 1,
              backgroundColor: isInWatchlist ? 'rgba(255, 215, 0, 0.15)' : 'rgba(229, 9, 20, 0.12)',
              border: isInWatchlist ? '1px solid var(--cinema-gold)' : '1px solid rgba(229, 9, 20, 0.3)',
              color: isInWatchlist ? 'var(--cinema-gold)' : '#FFFFFF',
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'all 0.2s',
            }}
          >
            {isInWatchlist ? (
              <>
                <Check size={14} />
                <span>{watchlistStatus === 'watched' ? 'Watched' : 'In Watchlist'}</span>
              </>
            ) : (
              <>
                <Bookmark size={14} />
                <span>+ Watchlist</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOpenDetails(movie)}
            className="btn-secondary"
            style={{
              padding: '0.45rem 0.6rem',
              fontSize: '0.75rem',
            }}
            title="View Details"
          >
            <Info size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
