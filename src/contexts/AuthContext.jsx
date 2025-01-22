import { createContext, useContext, useState, useEffect } from 'react';
import { ADMIN_ROLES } from '../config/telegram';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const session = localStorage.getItem('telegram_auth');
        if (session) {
          setUser(JSON.parse(session));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('telegram_auth', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('telegram_auth');
  };

  const isAdmin = () => {
    return user?.role === ADMIN_ROLES.SUPER_ADMIN;
  };

  const isModerator = () => {
    return user?.role === ADMIN_ROLES.MODERATOR || isAdmin();
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isModerator,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 