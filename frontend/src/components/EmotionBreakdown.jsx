import React from 'react';
import { Sparkles, Heart, Zap, Smile, Frown, ShieldAlert, Flame } from 'lucide-react';

const EMOTION_META = {
  Joy: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', icon: '🎉', label: 'Joy & Elation' },
  Love: { color: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.4)', icon: '💖', label: 'Love & Warmth' },
  Surprise: { color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)', icon: '⚡', label: 'Surprise & Wonder' },
  Sadness: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)', icon: '🌧️', label: 'Melancholy & Reflection' },
  Fear: { color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)', icon: '👁️', label: 'Fear & Suspense' },
  Anger: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', icon: '🔥', label: 'Anger & Tension' },
};

export const EmotionBreakdown = ({ primaryEmotion, breakdown = [] }) => {
  const primaryMeta = EMOTION_META[primaryEmotion] || EMOTION_META.Joy;

  return (
    <div style={{ maxWidth: '850px', margin: '2rem auto 1.5rem auto', padding: '0 1rem' }}>
      <div 
        className="theatre-card"
        style={{
          padding: '1.25rem 1.5rem',
          border: `1px solid ${primaryMeta.border}`,
          backgroundColor: 'rgba(18, 10, 15, 0.85)',
          boxShadow: `0 10px 30px rgba(0,0,0,0.6), 0 0 30px ${primaryMeta.bg}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.8rem' }}>{primaryMeta.icon}</span>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                AI Detected Emotion
              </div>
              <div style={{
                fontFamily: 'var(--font-cinema)',
                fontSize: '1.3rem',
                fontWeight: '900',
                color: primaryMeta.color,
                letterSpacing: '1px',
              }}>
                {primaryEmotion.toUpperCase()} — {primaryMeta.label}
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
          }}>
            DistilBERT Multi-Emotion Model
          </div>
        </div>

        {/* Emotion Distribution Bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem' }}>
          {breakdown.map((item) => {
            const meta = EMOTION_META[item.emotion] || EMOTION_META.Joy;
            const isPrimary = item.emotion === primaryEmotion;

            return (
              <div
                key={item.emotion}
                style={{
                  backgroundColor: isPrimary ? meta.bg : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isPrimary ? meta.border : 'rgba(255, 255, 255, 0.06)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                  <span style={{ color: isPrimary ? '#FFFFFF' : 'var(--text-secondary)', fontWeight: isPrimary ? '700' : '500' }}>
                    {meta.icon} {item.emotion}
                  </span>
                  <span style={{ color: meta.color, fontWeight: '700' }}>
                    {item.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.max(item.percentage, 2)}%`,
                    height: '100%',
                    backgroundColor: meta.color,
                    borderRadius: '2px',
                    boxShadow: isPrimary ? `0 0 8px ${meta.color}` : 'none',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
