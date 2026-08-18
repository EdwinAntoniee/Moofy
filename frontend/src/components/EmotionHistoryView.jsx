import React, { useEffect, useState } from 'react';
import { ArrowRight, Trash2 } from 'lucide-react';
import { api } from '../services/api';

const EMOTION_COLORS = {
  Joy: 'var(--emo-joy)',
  Love: 'var(--emo-love)',
  Surprise: 'var(--emo-surprise)',
  Sadness: 'var(--emo-sadness)',
  Fear: 'var(--emo-fear)',
  Anger: 'var(--emo-anger)',
};

export const EmotionHistoryView = ({ onReplaySearch, onOpenDetails }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getHistory();
      setHistory(data.items || []);
    } catch (err) {
      console.error('Failed to load history', err);
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
      alert('Failed to delete entry');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all logged emotion searches?')) return;
    try {
      await api.clearHistory();
      setHistory([]);
    } catch (err) {
      alert('Failed to clear history');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '850px', margin: '4rem auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Loading timeline...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '2.5rem auto', padding: '0 1rem' }}>
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
            Moods History
          </h2>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="btn-editorial-secondary"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            <Trash2 size={13} />
            <span>Clear Timeline</span>
          </button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="editorial-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            No searches recorded yet.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Searches conducted while signed in are chronologically archived here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {history.map((item) => {
            const dateStr = new Date(item.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            const emoColor = EMOTION_COLORS[item.detected_emotion] || 'var(--accent-gold)';

            return (
              <div
                key={item.id}
                className="editorial-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {/* Meta Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{
                      border: '1px solid var(--border-subtle)',
                      color: emoColor,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      ● {item.detected_emotion}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {dateStr}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => onReplaySearch(item.prompt, item.alpha)}
                      className="btn-editorial-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      <span>Re-explore</span>
                      <ArrowRight size={12} />
                    </button>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      title="Delete entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Prompt Quote */}
                <div style={{
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  lineHeight: '1.5',
                  paddingLeft: '0.75rem',
                  borderLeft: `2px solid ${emoColor}`,
                }}>
                  "{item.prompt}"
                </div>

                {/* Mini Film Strips */}
                {item.recommendations && item.recommendations.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.5rem' }}>
                      Recommended Films ({item.recommendations.length})
                    </span>
                    <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
                      {item.recommendations.slice(0, 6).map((movie) => {
                        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null;
                        return (
                          <div
                            key={movie.movie_id}
                            onClick={() => onOpenDetails(movie)}
                            style={{ width: '85px', flexShrink: 0, cursor: 'pointer' }}
                          >
                            <div style={{
                              width: '85px',
                              height: '120px',
                              borderRadius: 'var(--radius-xs)',
                              backgroundColor: '#151518',
                              overflow: 'hidden',
                              marginBottom: '0.25rem',
                              border: '1px solid var(--border-subtle)',
                            }}>
                              {posterUrl && (
                                <img src={posterUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>
                            <div style={{
                              fontSize: '0.7rem',
                              color: 'var(--text-secondary)',
                              fontFamily: 'var(--font-serif)',
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
