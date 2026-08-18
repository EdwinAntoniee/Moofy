import React, { useState, useEffect } from 'react';
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
import { Sparkles, Film, Popcorn } from 'lucide-react';

export function App() {
  const { user, isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'history', 'watchlist'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Search state
  const [recommendData, setRecommendData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastPrompt, setLastPrompt] = useState('');

  // Watchlist cache map: { [movie_id]: WatchlistResponse }
  const [watchlistMap, setWatchlistMap] = useState({});

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
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
      setError(err.message || 'Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle Watchlist on a Movie
  const handleToggleWatchlist = async (movie) => {
    if (isGuest) {
      setAuthModalOpen(true);
      return;
    }

    const existing = watchlistMap[movie.movie_id];
    if (existing) {
      try {
        await api.removeFromWatchlist(movie.movie_id);
        setWatchlistMap((prev) => {
          const next = { ...prev };
          delete next[movie.movie_id];
          return next;
        });
        showToast(`Removed "${movie.title}" from Watchlist.`);
      } catch (err) {
        showToast('Failed to remove from watchlist.');
      }
    } else {
      try {
        const added = await api.addToWatchlist(movie);
        setWatchlistMap((prev) => ({
          ...prev,
          [movie.movie_id]: added,
        }));
        showToast(`Saved "${movie.title}" to Watchlist! 🍿`);
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
    <div className="theatre-stage">
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#1E1119',
          border: '1px solid var(--cinema-gold)',
          color: '#FFFFFF',
          padding: '0.85rem 1.4rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(255,215,0,0.2)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: '600',
          fontSize: '0.9rem',
          animation: 'popcorn-pop 0.3s ease-out',
        }}>
          <Sparkles size={18} color="var(--cinema-gold)" />
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
      <main style={{ minHeight: 'calc(100vh - 70px)', paddingBottom: '4rem' }}>
        {activeTab === 'search' && (
          <>
            <HeroSpotlight />
            
            <SearchBar
              onSearch={handleSearch}
              loading={loading}
              initialPrompt={lastPrompt}
            />

            {error && (
              <div style={{
                maxWidth: '850px',
                margin: '1.5rem auto 0 auto',
                padding: '1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#FCA5A5',
                textAlign: 'center',
                fontSize: '0.9rem',
              }}>
                {error}
              </div>
            )}

            {recommendData && (
              <>
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
              </>
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

      {/* Footer Film Border */}
      <footer style={{
        borderTop: '1px solid rgba(255, 215, 0, 0.15)',
        backgroundColor: 'rgba(7, 5, 8, 0.95)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Popcorn size={16} color="var(--cinema-gold)" />
          <span style={{ fontFamily: 'var(--font-cinema)', letterSpacing: '1px', color: '#FFFFFF', fontWeight: '700' }}>
            MOOFY THEATRE
          </span>
        </div>
        <p>Built with fine-tuned DistilBERT NLP + Sentence-BERT ChromaDB Vector Engine</p>
      </footer>
    </div>
  );
}
