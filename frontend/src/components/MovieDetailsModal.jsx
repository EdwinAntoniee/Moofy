import React from 'react';
import { X, Star, Calendar, Bookmark, Check, Film, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EMOTION_COLORS = {
  Joy: '#F59E0B',
  Love: '#EC4899',
  Surprise: '#A855F7',
  Sadness: '#3B82F6',
  Fear: '#10B981',
  Anger: '#EF4444',
};

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

  const emotionColor = EMOTION_COLORS[movie.emotion_label] || 'var(--cinema-gold)';

  const handleWatchlistClick = () => {
    if (isGuest) {
      onOpenAuth?.();
      return;
    }
    onToggleWatchlist?.(movie);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(16px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div 
        className="theatre-card"
        style={{
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#120A0F',
          border: '1px solid rgba(229, 9, 20, 0.4)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.95), 0 0 50px rgba(229,9,20,0.3)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#FFFFFF',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <X size={20} />
        </button>

        {/* Backdrop Banner Header */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          backgroundColor: '#1A0E17',
          overflow: 'hidden',
        }}>
          {backdropUrl ? (
            <img
              src={backdropUrl}
              alt={movie.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={60} color="var(--marquee-red)" style={{ opacity: 0.25 }} />
            </div>
          )}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #120A0F 0%, rgba(18, 10, 15, 0.6) 50%, transparent 100%)',
          }} />
        </div>

        {/* Modal Main Body */}
        <div style={{ padding: '0 2rem 2rem 2rem', marginTop: '-60px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Poster thumbnail */}
            {posterUrl && (
              <img
                src={posterUrl}
                alt={movie.title}
                style={{
                  width: '130px',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  flexShrink: 0,
                }}
              />
            )}

            {/* Title & Stats */}
            <div style={{ flex: 1, minWidth: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  border: `1px solid ${emotionColor}`,
                  color: emotionColor,
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                }}>
                  ● {movie.emotion_label}
                </span>

                {movie.hybrid_score > 0 && (
                  <span style={{
                    backgroundColor: 'rgba(229, 9, 20, 0.85)',
                    color: '#FFFFFF',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                  }}>
                    {Math.round(movie.hybrid_score * 100)}% Match
                  </span>
                )}
              </div>

              <h2 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.6rem',
                fontWeight: '800',
                color: '#FFFFFF',
                lineHeight: '1.2',
                marginBottom: '0.5rem',
              }}>
                {movie.title}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--cinema-gold)', fontWeight: '700' }}>
                  <Star size={16} fill="var(--cinema-gold)" />
                  <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '7.0'} / 10</span>
                </div>
                {movie.release_date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={15} />
                    <span>{movie.release_date}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '1.25rem 0' }}>
              {movie.genres.map((genre, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-primary)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis */}
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
              Synopsis
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {movie.overview || 'No synopsis available for this film.'}
            </p>
          </div>

          {/* Match Analytics Box */}
          {movie.hybrid_score > 0 && (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              margin: '1.25rem 0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Semantic Narrative Sim</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#60A5FA' }}>
                  {Math.round(movie.semantic_similarity * 100)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Emotion Resonance Score</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: emotionColor }}>
                  {Math.round(movie.emotion_resonance * 100)}%
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              onClick={handleWatchlistClick}
              className="btn-marquee"
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: isInWatchlist ? 'rgba(255, 215, 0, 0.2)' : undefined,
                borderColor: isInWatchlist ? 'var(--cinema-gold)' : undefined,
                color: isInWatchlist ? 'var(--cinema-gold)' : undefined,
              }}
            >
              {isInWatchlist ? (
                <>
                  <Check size={18} />
                  <span>{watchlistStatus === 'watched' ? 'Watched (In Watchlist)' : 'Saved in Watchlist'}</span>
                </>
              ) : (
                <>
                  <Bookmark size={18} />
                  <span>Save to Watchlist</span>
                </>
              )}
            </button>

            <a
              href={`https://www.themoviedb.org/movie/${movie.movie_id}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              <ExternalLink size={16} />
              <span>TMDB</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
