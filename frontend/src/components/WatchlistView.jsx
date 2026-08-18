import React, { useEffect, useState } from 'react';
import { Bookmark, Check, Trash2, Star, Eye, Calendar, Film, Popcorn } from 'lucide-react';
import { api } from '../services/api';

const EMOTION_COLORS = {
  Joy: '#F59E0B',
  Love: '#EC4899',
  Surprise: '#A855F7',
  Sadness: '#3B82F6',
  Fear: '#10B981',
  Anger: '#EF4444',
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

  const handleToggleStatus = async (item, e) => {
    e.stopPropagation();
    const newStatus = item.status === 'watched' ? 'plan_to_watch' : 'watched';
    try {
      await api.updateWatchlistStatus(item.movie_id, newStatus);
      setWatchlist((prev) =>
        prev.map((m) => (m.movie_id === item.movie_id ? { ...m, status: newStatus } : m))
      );
      onWatchlistUpdated?.();
    } catch (err) {
      alert('Failed to update status');
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
      <div style={{ maxWidth: '1000px', margin: '3rem auto', textAlign: 'center', padding: '2rem' }}>
        <Popcorn size={32} className="animate-popcorn" color="var(--cinema-gold)" style={{ margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading your cinema watchlist...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 215, 0, 0.15)',
            border: '1px solid var(--cinema-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Bookmark size={20} color="var(--cinema-gold)" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-cinema)', fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF' }}>
              PERSONAL WATCHLIST
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {watchlist.length} film{watchlist.length !== 1 ? 's' : ''} saved in your vault
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setStatusFilter('all')}
            style={{
              background: statusFilter === 'all' ? 'var(--marquee-red)' : 'transparent',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            All ({watchlist.length})
          </button>
          <button
            onClick={() => setStatusFilter('plan_to_watch')}
            style={{
              background: statusFilter === 'plan_to_watch' ? 'var(--marquee-red)' : 'transparent',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Plan to Watch ({planCount})
          </button>
          <button
            onClick={() => setStatusFilter('watched')}
            style={{
              background: statusFilter === 'watched' ? 'var(--marquee-red)' : 'transparent',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Watched ({watchedCount})
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="theatre-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Film size={48} color="var(--marquee-red)" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h3 style={{ fontFamily: 'var(--font-cinema)', fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
            No Movies in this View
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
            Browse through Discovery and click "+ Watchlist" on any film to bookmark it here.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}>
          {filtered.map((item) => {
            const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null;
            const releaseYear = item.release_date ? item.release_date.substring(0, 4) : '';
            const emoColor = EMOTION_COLORS[item.emotion_label] || 'var(--cinema-gold)';
            const isWatched = item.status === 'watched';

            return (
              <div
                key={item.id}
                className="theatre-card"
                onClick={() => onOpenDetails(item)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isWatched ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Poster Box */}
                <div style={{ position: 'relative', width: '100%', paddingTop: '145%', backgroundColor: '#180E15' }}>
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
                        filter: isWatched ? 'grayscale(25%)' : 'none',
                      }}
                    />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Film size={36} color="var(--marquee-red)" style={{ opacity: 0.4 }} />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: isWatched ? 'rgba(16, 185, 129, 0.85)' : 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    border: isWatched ? '1px solid #10B981' : '1px solid rgba(255, 215, 0, 0.3)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    {isWatched ? <Check size={13} /> : <Star size={13} fill="var(--cinema-gold)" color="var(--cinema-gold)" />}
                    <span>{isWatched ? 'Watched' : item.vote_average ? item.vote_average.toFixed(1) : '7.0'}</span>
                  </div>

                  {item.emotion_label && (
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: `1px solid ${emoColor}`,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      color: emoColor,
                    }}>
                      ● {item.emotion_label}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.3' }}>
                        {item.title}
                      </h3>
                      {releaseYear && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{releaseYear}</span>
                      )}
                    </div>

                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {item.overview || 'No overview available.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button
                      onClick={(e) => handleToggleStatus(item, e)}
                      style={{
                        flex: 1,
                        backgroundColor: isWatched ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 215, 0, 0.12)',
                        border: isWatched ? '1px solid #10B981' : '1px solid rgba(255, 215, 0, 0.4)',
                        color: isWatched ? '#10B981' : 'var(--cinema-gold)',
                        padding: '0.4rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      {isWatched ? <Check size={14} /> : <Eye size={14} />}
                      <span>{isWatched ? 'Mark Plan to Watch' : 'Mark Watched'}</span>
                    </button>

                    <button
                      onClick={(e) => handleRemove(item.movie_id, e)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(248, 113, 113, 0.2)',
                        color: '#F87171',
                        padding: '0.4rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Remove from watchlist"
                    >
                      <Trash2 size={14} />
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
