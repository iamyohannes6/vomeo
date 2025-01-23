// Bot Configuration
export const BOT_USERNAME = 'vomeo_bot';

// Admin Roles
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  MODERATOR: 'moderator',
  EDITOR: 'editor',
};

// Auth Routes
export const AUTH_ROUTES = {
  callback: '/auth/callback',
  login: '/auth/login',
  logout: '/auth/logout',
  admin: '/admin',
};

// Secure config that's only used server-side
export const getServerConfig = () => ({
  botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
  redirectUrl: 'https://vomeo.netlify.app/auth/callback',
  origin: 'https://vomeo.netlify.app',
}); 