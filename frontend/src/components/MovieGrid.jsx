import React, { useState, useEffect } from 'react';
import { MovieCard } from './MovieCard';
import { Filter, SortAsc, Film, Star, Clapperboard, ChevronDown } from 'lucide-react';

export const MovieGrid = ({
  movies = [],
  onOpenDetails,
  onToggleWatchlist,
  watchlistMap = {},
  onOpenAuth,
}) => {
  const [filterEmotion, setFilterEmotion] = useState('ALL');
  const [sortBy, setSortBy] = useState('rating'); // Default: 'rating' (Highest Rating First)
  const [visibleCount, setVisibleCount] = useState(4); // Default to 4 movies for clean spotlight

  // Reset visible count to 4 whenever movies array changes (new search)
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
    <div style={{ maxWidth: '1200px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
      {/* Grid Header & Filters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-cinema)',
            fontSize: '1.4rem',
            fontWeight: '800',
            color: '#FFFFFF',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Film size={22} color="var(--marquee-red)" />
            <span>Featured Screenings (Showing {displayedMovies.length} of {sorted.length})</span>
          </h2>
        </div>

        {/* Filters & Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Emotion Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Filter:</span>
            <select
              value={filterEmotion}
              onChange={(e) => {
                setFilterEmotion(e.target.value);
                setVisibleCount(4);
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#FFFFFF',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {uniqueEmotions.map((emo) => (
                <option key={emo} value={emo} style={{ backgroundColor: '#120A0F', color: '#FFFFFF' }}>
                  {emo}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#FFFFFF',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="rating" style={{ backgroundColor: '#120A0F', color: '#FFFFFF' }}>★ TMDB Rating (Highest First)</option>
              <option value="match" style={{ backgroundColor: '#120A0F', color: '#FFFFFF' }}>⚡ Highest Match %</option>
              <option value="year" style={{ backgroundColor: '#120A0F', color: '#FFFFFF' }}>📅 Release Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movies Grid - 4 Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
      }}>
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

      {/* Load More Button */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            onClick={handleLoadMore}
            className="btn-marquee"
            style={{
              padding: '0.85rem 2rem',
              fontSize: '0.95rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(229, 9, 20, 0.15)',
              border: '1px solid var(--marquee-red)',
              color: '#FFFFFF',
              boxShadow: '0 0 30px rgba(229, 9, 20, 0.3)',
            }}
          >
            <Clapperboard size={18} color="var(--cinema-gold)" />
            <span>Roll More Films (+4 More Choices)</span>
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
