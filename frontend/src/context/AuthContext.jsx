import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('svms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('svms_token') || null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && !user) {
      authAPI.getProfile()
        .then(res => {
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('svms_user', JSON.stringify(res.data.user));
          } else {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('svms_user', JSON.stringify(userData));
    localStorage.setItem('svms_token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('svms_user');
    localStorage.removeItem('svms_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === 'admin',
      isWorker: user?.role === 'worker',
      isCitizen: user?.role === 'citizen'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
