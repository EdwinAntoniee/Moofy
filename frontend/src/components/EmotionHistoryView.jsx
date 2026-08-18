import React, { useEffect, useState } from 'react';
import { History, Trash2, ArrowRight, Sparkles, Popcorn, Film } from 'lucide-react';
import { api } from '../services/api';

const EMOTION_COLORS = {
  Joy: '#F59E0B',
  Love: '#EC4899',
  Surprise: '#A855F7',
  Sadness: '#3B82F6',
  Fear: '#10B981',
  Anger: '#EF4444',
};

export const EmotionHistoryView = ({ onReplaySearch, onOpenDetails }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getHistory();
      setHistory(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load emotion history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await api.deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear your entire emotion history?')) return;
    try {
      await api.clearHistory();
      setHistory([]);
    } catch (err) {
      alert('Failed to clear history');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '3rem auto', textAlign: 'center', padding: '2rem' }}>
        <Sparkles size={32} className="animate-spin" color="var(--cinema-gold)" style={{ margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading your cinematic emotion timeline...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* View Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'rgba(229, 9, 20, 0.15)',
            border: '1px solid var(--marquee-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <History size={20} color="var(--marquee-red)" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-cinema)', fontSize: '1.4rem', fontWeight: '800', color: '#FFFFFF' }}>
              EMOTION TIMELINE
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              A journal of how you were feeling and the films recommended for you
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', color: '#F87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="theatre-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Popcorn size={48} color="var(--cinema-gold)" className="animate-popcorn" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontFamily: 'var(--font-cinema)', fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
            No Emotion Searches Recorded Yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
            Head over to Discovery, express what you're feeling, and your emotional journey will be chronicled here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {history.map((item) => {
            const dateStr = new Date(item.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            const emoColor = EMOTION_COLORS[item.detected_emotion] || 'var(--cinema-gold)';

            return (
              <div
                key={item.id}
                className="theatre-card"
                style={{
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {/* Entry Top Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      border: `1px solid ${emoColor}`,
                      color: emoColor,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                    }}>
                      ● {item.detected_emotion}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {dateStr}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => onReplaySearch(item.prompt, item.alpha)}
                      className="btn-marquee"
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
                    >
                      <span>Re-explore in Cinema</span>
                      <ArrowRight size={13} />
                    </button>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Delete this entry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Prompt Quote */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: `3px solid ${emoColor}`,
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                }}>
                  "{item.prompt}"
                </div>

                {/* Recommended Movies Mini Grid */}
                {item.recommendations && item.recommendations.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Recommended Films ({item.recommendations.length}):
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                      {item.recommendations.slice(0, 6).map((movie) => {
                        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null;
                        return (
                          <div
                            key={movie.movie_id}
                            onClick={() => onOpenDetails(movie)}
                            style={{
                              width: '90px',
                              flexShrink: 0,
                              cursor: 'pointer',
                              textAlign: 'center',
                            }}
                          >
                            <div style={{
                              width: '90px',
                              height: '130px',
                              borderRadius: '8px',
                              backgroundColor: '#1E111A',
                              overflow: 'hidden',
                              marginBottom: '0.35rem',
                              border: '1px solid rgba(255,255,255,0.1)',
                            }}>
                              {posterUrl ? (
                                <img src={posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Film size={20} color="var(--marquee-red)" />
                                </div>
                              )}
                            </div>
                            <div style={{
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              color: '#FFFFFF',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                              {movie.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
