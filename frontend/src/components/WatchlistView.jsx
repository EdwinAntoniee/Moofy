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
      // Unqueue / Remove from watchlist
      try {
        await api.removeFromWatchlist(item.movie_id);
        setWatchlist((prev) => prev.filter((m) => m.movie_id !== item.movie_id));
        onWatchlistUpdated?.();
      } catch (err) {
        alert('Failed to unqueue film');
      }
    } else {
      // Move from watched -> plan_to_watch
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
      // Unmark watched / Remove from watchlist
      try {
        await api.removeFromWatchlist(item.movie_id);
        setWatchlist((prev) => prev.filter((m) => m.movie_id !== item.movie_id));
        onWatchlistUpdated?.();
      } catch (err) {
        alert('Failed to unmark watched');
      }
    } else {
      // Move from plan_to_watch -> watched
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
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Loading archive...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '2.5rem auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        paddingBottom: '0.85rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: '600', fontStyle: 'italic', color: 'var(--text-primary)' }}>
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
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.72rem',
              fontWeight: '500',
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
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
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.72rem',
              fontWeight: '500',
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
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
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.72rem',
              fontWeight: '500',
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              cursor: 'pointer',
            }}
          >
            Watched ({watchedCount})
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="editorial-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            No films saved in this view.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto' }}>
            Explore films through Discovery and add them to your Queue or mark them as Watched.
          </p>
        </div>
      ) : (
        <div className="editorial-grid">
          {filtered.map((item) => {
            const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null;
            const releaseYear = item.release_date ? item.release_date.substring(0, 4) : '';
            const emoColor = EMOTION_COLORS[item.emotion_label] || 'var(--accent-gold)';
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
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(12, 12, 14, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-subtle)',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    color: isWatched ? 'var(--accent-gold)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    {isWatched ? <Check size={11} /> : <Star size={11} fill="var(--accent-gold)" color="var(--accent-gold)" />}
                    <span>{isWatched ? 'WATCHED' : item.vote_average ? item.vote_average.toFixed(1) : '7.0'}</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.3' }}>
                        {item.title}
                      </h4>
                      {releaseYear && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{releaseYear}</span>
                      )}
                    </div>

                    <p style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {item.overview || 'No synopsis recorded.'}
                    </p>
                  </div>

                  {/* Actions - Separate Queue and Watched Buttons */}
                  <div style={{ display: 'flex', gap: '0.4rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)' }}>
                    {/* Queue Button */}
                    <button
                      onClick={(e) => handleQueueClick(item, e)}
                      style={{
                        flex: 1,
                        backgroundColor: isQueued ? 'rgba(200, 170, 118, 0.18)' : 'transparent',
                        border: isQueued ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        color: isQueued ? 'var(--accent-gold)' : 'var(--text-primary)',
                        padding: '0.35rem 0.35rem',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.7rem',
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
                      <Bookmark size={11} fill={isQueued ? 'var(--accent-gold)' : 'none'} style={{ flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap' }}>{isQueued ? 'In Queue' : 'Queue'}</span>
                    </button>

                    {/* Watched Button */}
                    <button
                      onClick={(e) => handleWatchedClick(item, e)}
                      style={{
                        flex: 1,
                        backgroundColor: isWatched ? 'rgba(120, 180, 140, 0.18)' : 'transparent',
                        border: isWatched ? '1px solid #739682' : '1px solid var(--border-subtle)',
                        color: isWatched ? '#a3d4b6' : 'var(--text-primary)',
                        padding: '0.35rem 0.35rem',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.7rem',
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
                      <Check size={11} strokeWidth={isWatched ? 3 : 2} style={{ flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap' }}>{isWatched ? 'Watched' : 'Watched'}</span>
                    </button>

                    {/* Remove from Vault Button */}
                    <button
                      onClick={(e) => handleRemove(item.movie_id, e)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                        padding: '0.35rem 0.55rem',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Remove from watchlist"
                    >
                      <Trash2 size={13} />
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
