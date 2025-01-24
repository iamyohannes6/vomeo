import { createContext, useContext, useState, useEffect } from 'react';
import { ADMIN_IDS } from '../config/telegram';

const AUTH_STORAGE_KEY = 'vomeo_auth';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Handle session expiry and cross-tab authentication
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === AUTH_STORAGE_KEY) {
        if (!e.newValue) {
          setUser(null);
        } else {
          const userData = JSON.parse(e.newValue);
          if (userData.expiresAt > Date.now()) {
            setUser(userData);
          } else {
            logout();
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check session validity periodically
  useEffect(() => {
    const checkSession = () => {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        const userData = JSON.parse(savedAuth);
        if (userData.expiresAt <= Date.now()) {
          logout();
        }
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Update last activity timestamp
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
      if (user) {
        const updatedUser = { ...user, lastActivity: Date.now() };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      }
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, [user]);

  // Initial auth check
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      const userData = JSON.parse(savedAuth);
      if (userData.expiresAt > Date.now()) {
        setUser(userData);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const isAdmin = ADMIN_IDS.includes(userData.id);
    const enhancedUser = {
      ...userData,
      id: userData.id,
      firstName: userData.first_name,
      lastName: userData.last_name || '',
      username: userData.username,
      photoUrl: userData.photo_url,
      role: isAdmin ? 'admin' : 'user',
      lastLogin: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION,
      lastActivity: Date.now()
    };
    
    setUser(enhancedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(enhancedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const refreshSession = () => {
    if (user) {
      const refreshedUser = {
        ...user,
        expiresAt: Date.now() + SESSION_DURATION,
        lastActivity: Date.now()
      };
      setUser(refreshedUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(refreshedUser));
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isModerator = () => user?.role === 'moderator' || isAdmin();
  const isAuthenticated = () => !!user && user.expiresAt > Date.now();
  const getSessionExpiry = () => user?.expiresAt || 0;

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isModerator,
    isAuthenticated,
    getSessionExpiry,
    refreshSession,
    lastActivity
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 