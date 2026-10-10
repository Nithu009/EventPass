import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage if available
    const savedToken = localStorage.getItem('eventpass_token');
    const savedUser = localStorage.getItem('eventpass_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user', err);
        localStorage.removeItem('eventpass_token');
        localStorage.removeItem('eventpass_user');
      }
    }

    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('eventpass_auth_expired', handleAuthExpired);
    setLoading(false);

    return () => {
      window.removeEventListener('eventpass_auth_expired', handleAuthExpired);
    };
  }, []);

  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('eventpass_token', jwtToken);
    localStorage.setItem('eventpass_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('eventpass_token');
    localStorage.removeItem('eventpass_user');
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
