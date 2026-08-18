import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('moofy_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('moofy_token');
      if (storedToken) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (e) {
          console.warn('Stored token invalid or expired', e);
          localStorage.removeItem('moofy_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('moofy_token', data.access_token);
    setToken(data.access_token);
    setUser({ username: data.username, email: data.email });
    return data;
  };

  const register = async (email, username, password) => {
    const data = await api.register({ email, username, password });
    localStorage.setItem('moofy_token', data.access_token);
    setToken(data.access_token);
    setUser({ username: data.username, email: data.email });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('moofy_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isGuest: !user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
