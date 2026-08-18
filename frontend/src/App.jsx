import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSpotlight } from './components/HeroSpotlight';
import { SearchBar } from './components/SearchBar';
import { EmotionBreakdown } from './components/EmotionBreakdown';
import { MovieGrid } from './components/MovieGrid';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { EmotionHistoryView } from './components/EmotionHistoryView';
import { WatchlistView } from './components/WatchlistView';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { Sparkles, LogIn } from 'lucide-react';
import { FilmStripBackground } from './components/FilmStripBackground';

export function App() {
  const { user, isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'history', 'watchlist'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // If user is guest and tries to access history or watchlist, keep them on search
  useEffect(() => {
    if (isGuest && activeTab !== 'search') {
      setActiveTab('search');
    }
  }, [isGuest, activeTab]);

  // Search state
  const [recommendData, setRecommendData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastPrompt, setLastPrompt] = useState('');

  // Watchlist cache map: { [movie_id]: WatchlistResponse }
  const [watchlistMap, setWatchlistMap] = useState({});

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Ref for smooth scroll to recommendations
  const resultsRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3200);
  };

  // Sync Watchlist when user logs in
  const syncWatchlist = async () => {
    if (!user) {
      setWatchlistMap({});
      return;
    }
    try {
      const data = await api.getWatchlist();
      const map = {};
      data.items?.forEach((item) => {
        map[item.movie_id] = item;
      });
      setWatchlistMap(map);
    } catch (err) {
      console.warn('Failed to sync watchlist map', err);
    }
  };

  useEffect(() => {
    syncWatchlist();
  }, [user]);

  // Smooth scroll to recommendations when new search results arrive
  useEffect(() => {
    if (recommendData && resultsRef.current) {
      const timer = setTimeout(() => {
        resultsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [recommendData]);

  // Handle Search Execution
  const handleSearch = async (prompt, alpha) => {
    setError('');
    setLoading(true);
    setLastPrompt(prompt);

    try {
      const data = await api.recommendMovies({ prompt, alpha, top_k: 24 });
      setRecommendData(data);
      if (activeTab !== 'search') setActiveTab('search');
    } catch (err) {
      setError(err.message || 'Failed to retrieve film screenings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Queue or Watched status on a Movie
  const handleToggleWatchlist = async (movie, desiredStatus = 'plan_to_watch') => {
    if (isGuest) {
      setAuthModalOpen(true);
      return;
    }

    const existing = watchlistMap[movie.movie_id];
    if (existing) {
      if (existing.status === desiredStatus) {
        // Toggle off / remove
        try {
          await api.removeFromWatchlist(movie.movie_id);
          setWatchlistMap((prev) => {
            const next = { ...prev };
            delete next[movie.movie_id];
            return next;
          });
          showToast(`Removed "${movie.title}" from watchlist.`);
        } catch (err) {
          showToast('Failed to update watchlist.');
        }
      } else {
        // Update status to desiredStatus
        try {
          const updated = await api.updateWatchlistStatus(movie.movie_id, desiredStatus);
          setWatchlistMap((prev) => ({
            ...prev,
            [movie.movie_id]: updated,
          }));
          showToast(`Marked "${movie.title}" as ${desiredStatus === 'watched' ? 'Watched' : 'In Queue'}.`);
        } catch (err) {
          showToast('Failed to update status.');
        }
      }
    } else {
      // Add new item with desired status
      try {
        const added = await api.addToWatchlist({ ...movie, status: desiredStatus });
        setWatchlistMap((prev) => ({
          ...prev,
          [movie.movie_id]: added,
        }));
        showToast(`Added "${movie.title}" to ${desiredStatus === 'watched' ? 'Watched' : 'Queue'}.`);
      } catch (err) {
        showToast('Failed to add to watchlist.');
      }
    }
  };

  const handleReplaySearch = (prompt, alpha) => {
    setActiveTab('search');
    handleSearch(prompt, alpha);
  };

  return (
    <div className="editorial-stage">
      {/* Editorial Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#161619',
          border: '1px solid var(--border-medium)',
          color: 'var(--text-primary)',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-xs)',
          boxShadow: '0 15px 40px rgba(0,0,0,0.7)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-mono)',
        }}>
          <Sparkles size={14} color="var(--accent-gold)" />
          <span>{toast}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Tab Routing */}
      <main style={{ minHeight: 'calc(100vh - 65px)', paddingBottom: '5rem' }}>
        {activeTab === 'search' && (
          <>
            {/* Scoped Hero & Search CTA Section with Film Strip Background */}
            <section className="hero-cta-section">
              <FilmStripBackground />
              <HeroSpotlight />
              <SearchBar
                onSearch={handleSearch}
                loading={loading}
                initialPrompt={lastPrompt}
              />
            </section>

            {error && (
              <div style={{
                maxWidth: '780px',
                margin: '1.5rem auto 0 auto',
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-xs)',
                color: '#FCA5A5',
                textAlign: 'center',
                fontSize: '0.85rem',
              }}>
                {error}
              </div>
            )}

            {recommendData && (
              <div ref={resultsRef} style={{ scrollMarginTop: '80px' }}>
                <EmotionBreakdown
                  primaryEmotion={recommendData.primary_emotion}
                  breakdown={recommendData.emotion_breakdown}
                />

                <MovieGrid
                  movies={recommendData.movies}
                  onOpenDetails={(movie) => setSelectedMovie(movie)}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlistMap={watchlistMap}
                  onOpenAuth={() => setAuthModalOpen(true)}
                />
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <EmotionHistoryView
            onReplaySearch={handleReplaySearch}
            onOpenDetails={(movie) => setSelectedMovie(movie)}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistView
            onOpenDetails={(movie) => setSelectedMovie(movie)}
            onWatchlistUpdated={syncWatchlist}
          />
        )}
      </main>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onToggleWatchlist={handleToggleWatchlist}
          isInWatchlist={!!watchlistMap[selectedMovie.movie_id]}
          watchlistStatus={watchlistMap[selectedMovie.movie_id]?.status}
          onOpenAuth={() => setAuthModalOpen(true)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(msg) => showToast(msg)}
      />
    </div>
  );
}
