const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('moofy_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Recommendation
  async recommendMovies({ prompt, alpha = 0.5, top_k = 12, filter_emotion = null }) {
    const res = await fetch(`${API_BASE}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        prompt,
        alpha: parseFloat(alpha),
        top_k: parseInt(top_k),
        filter_emotion: filter_emotion || undefined,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch recommendations' }));
      throw new Error(err.detail || 'Failed to fetch recommendations');
    }
    return res.json();
  },

  // Auth
  async login({ email, password }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  },

  async register({ email, username, password }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Session expired');
    return res.json();
  },

  // Emotion History
  async getHistory() {
    const res = await fetch(`${API_BASE}/history`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load history');
    return res.json();
  },

  async deleteHistoryItem(historyId) {
    const res = await fetch(`${API_BASE}/history/${historyId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete history entry');
    return true;
  },

  async clearHistory() {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to clear history');
    return true;
  },

  // Watchlist
  async getWatchlist(status = null) {
    const url = status ? `${API_BASE}/watchlist?status=${status}` : `${API_BASE}/watchlist`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load watchlist');
    return res.json();
  },

  async addToWatchlist(movie) {
    const res = await fetch(`${API_BASE}/watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        movie_id: movie.movie_id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        overview: movie.overview,
        release_date: movie.release_date || '',
        vote_average: movie.vote_average || 7.0,
        genres: movie.genres || [],
        emotion_label: movie.emotion_label || null,
        status: movie.status || 'plan_to_watch',
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to add to watchlist' }));
      throw new Error(err.detail || 'Failed to add to watchlist');
    }
    return res.json();
  },

  async updateWatchlistStatus(movieId, status) {
    const res = await fetch(`${API_BASE}/watchlist/${movieId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update watchlist status');
    return res.json();
  },

  async removeFromWatchlist(movieId) {
    const res = await fetch(`${API_BASE}/watchlist/${movieId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove from watchlist');
    return true;
  },
};
