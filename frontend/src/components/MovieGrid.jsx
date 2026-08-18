import React, { useState, useEffect } from 'react';
import { MovieCard } from './MovieCard';
import { ChevronDown } from 'lucide-react';

export const MovieGrid = ({
  movies = [],
  onOpenDetails,
  onToggleWatchlist,
  watchlistMap = {},
  onOpenAuth,
}) => {
  const [filterEmotion, setFilterEmotion] = useState('ALL');
  const [sortBy, setSortBy] = useState('match'); // Default: 'match'
  const [visibleCount, setVisibleCount] = useState(4); // Default: 4 spotlighted films

  // Reset visible count to 4 whenever new search results arrive
  useEffect(() => {
    setVisibleCount(4);
  }, [movies]);

  if (!movies || movies.length === 0) {
    return null;
  }

  // Filter
  const filtered = filterEmotion === 'ALL'
    ? movies
    : movies.filter((m) => m.emotion_label === filterEmotion);

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return (b.vote_average || 0) - (a.vote_average || 0);
    if (sortBy === 'year') {
      const yearA = parseInt(a.release_date?.substring(0, 4) || '0');
      const yearB = parseInt(b.release_date?.substring(0, 4) || '0');
      return yearB - yearA;
    }
    return (b.hybrid_score || 0) - (a.hybrid_score || 0);
  });

  const displayedMovies = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 4, sorted.length));
  };

  const uniqueEmotions = ['ALL', ...new Set(movies.map((m) => m.emotion_label))];

  return (
    <div style={{ maxWidth: '1200px', margin: '2.5rem auto', padding: '0 1rem' }}>
      {/* Editorial Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        paddingBottom: '0.85rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.2rem, 3vw, 1.45rem)',
            fontWeight: '600',
            fontStyle: 'italic',
            color: 'var(--text-primary)',
          }}>
            Movie Matches
          </h2>
        </div>

        {/* Minimal Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Emotion Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>EMOTION:</span>
            <select
              value={filterEmotion}
              onChange={(e) => {
                setFilterEmotion(e.target.value);
                setVisibleCount(4);
              }}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.72rem',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              }}
            >
              {uniqueEmotions.map((emo) => (
                <option key={emo} value={emo} style={{ backgroundColor: '#111114', color: '#FFFFFF' }}>
                  {emo}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.72rem',
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              }}
            >
              <option value="match" style={{ backgroundColor: '#111114', color: '#FFFFFF' }}>Match</option>
              <option value="rating" style={{ backgroundColor: '#111114', color: '#FFFFFF' }}>Rating</option>
              <option value="year" style={{ backgroundColor: '#111114', color: '#FFFFFF' }}>Release Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Editorial Grid (Responsive 2-col on mobile, 4-col on desktop) */}
      <div className="editorial-grid">
        {displayedMovies.map((movie) => (
          <MovieCard
            key={movie.movie_id}
            movie={movie}
            onOpenDetails={onOpenDetails}
            onToggleWatchlist={onToggleWatchlist}
            isInWatchlist={!!watchlistMap[movie.movie_id]}
            watchlistStatus={watchlistMap[movie.movie_id]?.status}
            onOpenAuth={onOpenAuth}
          />
        ))}
      </div>

      {/* Minimal Load More Action */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            onClick={handleLoadMore}
            className="btn-editorial-secondary"
            style={{
              padding: '0.65rem 1.75rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.8rem',
            }}
          >
            <span>More Films</span>
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
