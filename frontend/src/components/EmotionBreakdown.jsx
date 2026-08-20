import React from 'react';

const EMOTION_META = {
  Joy:      { color: '#dca365', label: 'Joyful' },
  Love:     { color: '#cf8484', label: 'Warm' },
  Surprise: { color: '#a89bc2', label: 'Intrigued' },
  Sadness:  { color: '#7890a8', label: 'Melancholic' },
  Fear:     { color: '#739682', label: 'Tense' },
  Anger:    { color: '#bf6363', label: 'Intense' },
};

export const EmotionBreakdown = ({ primaryEmotion, breakdown = [] }) => {
  if (!primaryEmotion && (!breakdown || breakdown.length === 0)) return null;

  // Sort breakdown by percentage descending
  const sortedBreakdown = [...(breakdown || [])].sort((a, b) => b.percentage - a.percentage);

  // Take top emotions: primary + secondary emotions with score >= 12% (up to 3 total)
  const topEmotions = sortedBreakdown.filter((item, idx) => {
    if (idx === 0) return true;
    return item.percentage >= 12 && idx < 3;
  });

  const displayItems = topEmotions.length > 0
    ? topEmotions
    : [{ emotion: primaryEmotion, percentage: null }];

  return (
    <div
      className="animate-fade-in"
      style={{
        maxWidth: '780px',
        margin: '1.5rem auto 0.5rem',
        padding: '0 clamp(0.75rem, 2vw, 1.5rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'clamp(0.45rem, 1.8vw, 0.75rem)',
          padding: '0.45rem clamp(0.85rem, 2.5vw, 1.25rem)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          backgroundColor: 'rgba(18, 18, 22, 0.95)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: '#a0a098',
            fontSize: 'clamp(0.68rem, 1.8vw, 0.76rem)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontWeight: '600',
          }}
        >
          Mood:
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          {displayItems.map((item, i) => {
            const meta = EMOTION_META[item.emotion] || {
              color: 'var(--accent-gold)',
              label: item.emotion,
            };
            const isPrimary = i === 0;

            return (
              <div
                key={item.emotion}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: isPrimary ? '0.24rem 0.65rem' : '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isPrimary
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${isPrimary ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.08)'}`,
                  fontSize: 'clamp(0.72rem, 2vw, 0.8rem)',
                }}
              >
                <span
                  style={{
                    width: isPrimary ? '7px' : '5px',
                    height: isPrimary ? '7px' : '5px',
                    borderRadius: '50%',
                    backgroundColor: meta.color,
                    boxShadow: `0 0 8px ${meta.color}`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    color: isPrimary ? '#ffffff' : '#d0d0c8',
                    fontWeight: isPrimary ? '600' : '500',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {meta.label}
                </span>
                {item.percentage !== null && item.percentage !== undefined && (
                  <span
                    style={{
                      fontSize: 'clamp(0.66rem, 1.8vw, 0.72rem)',
                      color: isPrimary ? 'var(--accent-gold)' : '#a0a098',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: '600',
                    }}
                  >
                    {Math.round(item.percentage)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
