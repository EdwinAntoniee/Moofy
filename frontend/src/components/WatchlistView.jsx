import React, { useEffect, useState } from 'react';
import { Bookmark, Check, Trash2, Star, Calendar } from 'lucide-react';
import { api } from '../services/api';

const EMOTION_COLORS = {
  Joy: 'var(--emo-joy)',
  Love: 'var(--emo-love)',
  Surprise: 'var(--emo-surprise)',
  Sadness: 'var(--emo-sadness)',
  Fear: 'var(--emo-fear)',
  Anger: 'var(--emo-anger)',
};

export const WatchlistView = ({ onOpenDetails, onWatchlistUpdated }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'plan_to_watch', 'watched'
  const [loading, setLoading] = useState(true);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const data = await api.getWatchlist();
      setWatchlist(data.items || []);
    } catch (err) {
      console.error('Failed to load watchlist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  // Handle clicking the "Queue" button on a watchlist item
  const handleQueueClick = async (item, e) => {
    e.stopPropagation();
    if (item.status === 'plan_to_watch') {
      try {
        await api.removeFromWatchlist(item.movie_id);
        setWatchlist((prev) => prev.filter((m) => m.movie_id !== item.movie_id));
        onWatchlistUpdated?.();
      } catch (err) {
        alert('Failed to unqueue film');
      }
    } else {
      try {
        await api.updateWatchlistStatus(item.movie_id, 'plan_to_watch');
        setWatchlist((prev) =>
          prev.map((m) => (m.movie_id === item.movie_id ? { ...m, status: 'plan_to_watch' } : m))
        );
        onWatchlistUpdated?.();
      } catch (err) {
        alert('Failed to update status');
      }
    }
  };

  // Handle clicking the "Watched" button on a watchlist item
  const handleWatchedClick = async (item, e) => {
    e.stopPropagation();
    if (item.status === 'watched') {
      try {
        await api.removeFromWatchlist(item.movie_id);
        setWatchlist((prev) => prev.filter((m) => m.movie_id !== item.movie_id));
        onWatchlistUpdated?.();
      } catch (err) {
        alert('Failed to unmark watched');
      }
    } else {
      try {
        await api.updateWatchlistStatus(item.movie_id, 'watched');
        setWatchlist((prev) =>
          prev.map((m) => (m.movie_id === item.movie_id ? { ...m, status: 'watched' } : m))
        );
        onWatchlistUpdated?.();
      } catch (err) {
        alert('Failed to mark as watched');
      }
    }
  };

  const handleRemove = async (movieId, e) => {
    e.stopPropagation();
    try {
      await api.removeFromWatchlist(movieId);
      setWatchlist((prev) => prev.filter((m) => m.movie_id !== movieId));
      onWatchlistUpdated?.();
    } catch (err) {
      alert('Failed to remove from watchlist');
    }
  };

  const filtered = statusFilter === 'all'
    ? watchlist
    : watchlist.filter((m) => m.status === statusFilter);

  const planCount = watchlist.filter((m) => m.status === 'plan_to_watch').length;
  const watchedCount = watchlist.filter((m) => m.status === 'watched').length;

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '4rem auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>Loading archive...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 clamp(0.75rem, 2.5vw, 1rem)' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.15rem, 3vw, 1.55rem)', fontWeight: '600', fontStyle: 'italic', color: 'var(--text-primary)' }}>
            Personal Watchlist
          </h2>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setStatusFilter('all')}
            style={{
              background: statusFilter === 'all' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: statusFilter === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: statusFilter === 'all' ? '1px solid var(--border-subtle)' : 'none',
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'clamp(0.66rem, 1.8vw, 0.72rem)',
              fontWeight: '500',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            All ({watchlist.length})
          </button>
          <button
            onClick={() => setStatusFilter('plan_to_watch')}
            style={{
              background: statusFilter === 'plan_to_watch' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: statusFilter === 'plan_to_watch' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: statusFilter === 'plan_to_watch' ? '1px solid var(--border-subtle)' : 'none',
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'clamp(0.66rem, 1.8vw, 0.72rem)',
              fontWeight: '500',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            Queue ({planCount})
          </button>
          <button
            onClick={() => setStatusFilter('watched')}
            style={{
              background: statusFilter === 'watched' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: statusFilter === 'watched' ? 'var(--text-primary)' : 'var(--text-muted)',
              border: statusFilter === 'watched' ? '1px solid var(--border-subtle)' : 'none',
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'clamp(0.66rem, 1.8vw, 0.72rem)',
              fontWeight: '500',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            Watched ({watchedCount})
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="editorial-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            No films saved in this view.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '380px', margin: '0 auto' }}>
            Explore films through Discovery and add them to your Queue or mark them as Watched.
          </p>
        </div>
      ) : (
        <div className="editorial-grid">
          {filtered.map((item) => {
            const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null;
            const releaseYear = item.release_date ? item.release_date.substring(0, 4) : '';
            const isQueued = item.status === 'plan_to_watch';
            const isWatched = item.status === 'watched';

            return (
              <div
                key={item.id}
                className="editorial-card"
                onClick={() => onOpenDetails(item)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {/* Poster Box */}
                <div style={{ position: 'relative', width: '100%', paddingTop: '148%', backgroundColor: '#151518' }}>
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={item.title}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: isWatched ? 'grayscale(35%)' : 'none',
                        opacity: isWatched ? 0.75 : 1,
                      }}
                    />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}>
                      {item.title}
                    </div>
                  )}

                  {/* Status Badge */}
                  <div 
                    className="movie-card-badge"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: 'rgba(12, 12, 14, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid var(--border-subtle)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.68rem',
                      fontWeight: '600',
                      color: isWatched ? 'var(--accent-gold)' : 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    {isWatched ? <Check size={10} /> : <Star size={10} fill="var(--accent-gold)" color="var(--accent-gold)" />}
                    <span>{isWatched ? 'WATCHED' : item.vote_average ? item.vote_average.toFixed(1) : '7.0'}</span>
                  </div>
                </div>

                {/* Content */}
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
                        {item.title}
                      </h4>
                      {releaseYear && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                          {releaseYear}
                        </span>
                      )}
                    </div>

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
                      {item.overview || 'No synopsis recorded.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.35rem', paddingTop: '0.55rem', borderTop: '1px solid var(--border-subtle)' }}>
                    {/* Queue Button */}
                    <button
                      onClick={(e) => handleQueueClick(item, e)}
                      className="movie-card-action-btn"
                      style={{
                        flex: 1,
                        backgroundColor: isQueued ? 'rgba(200, 170, 118, 0.18)' : 'transparent',
                        border: isQueued ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        color: isQueued ? 'var(--accent-gold)' : 'var(--text-primary)',
                        padding: '0.38rem 0.25rem',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.68rem',
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
                      title={isQueued ? 'Click to unqueue film' : 'Move to Queue'}
                    >
                      <Bookmark size={10} fill={isQueued ? 'var(--accent-gold)' : 'none'} style={{ flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isQueued ? 'In Queue' : 'Queue'}</span>
                    </button>

                    {/* Watched Button */}
                    <button
                      onClick={(e) => handleWatchedClick(item, e)}
                      className="movie-card-action-btn"
                      style={{
                        flex: 1,
                        backgroundColor: isWatched ? 'rgba(120, 180, 140, 0.18)' : 'transparent',
                        border: isWatched ? '1px solid #739682' : '1px solid var(--border-subtle)',
                        color: isWatched ? '#a3d4b6' : 'var(--text-primary)',
                        padding: '0.38rem 0.25rem',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.68rem',
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
                      title={isWatched ? 'Click to unmark watched' : 'Mark as Watched'}
                    >
                      <Check size={10} strokeWidth={isWatched ? 3 : 2} style={{ flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isWatched ? 'Watched' : 'Watched'}</span>
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => handleRemove(item.movie_id, e)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                        padding: '0.38rem 0.45rem',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                      title="Remove from watchlist"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
