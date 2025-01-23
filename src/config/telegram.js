// Bot Configuration
export const BOT_USERNAME = 'vomeo_bot';
export const SITE_DOMAIN = 'https://vomeo.netlify.app';

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
  redirectUrl: `${SITE_DOMAIN}/auth/callback`,
  origin: SITE_DOMAIN,
}); 