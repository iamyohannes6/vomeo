// Telegram Bot Configuration
export const BOT_USERNAME = 'vomeo_bot';

// Admin Configuration
export const ADMIN_IDS = [
  6107187079, // Admin's Telegram ID
];

// Auth Configuration
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  CALLBACK: '/auth/telegram/callback',
  ADMIN: '/admin',
  HOME: '/',
};

// Site Configuration
export const SITE_DOMAIN = 'https://vomeo.netlify.app';

// Admin Roles
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  MODERATOR: 'moderator',
  EDITOR: 'editor',
};

// Secure config that's only used server-side
export const getServerConfig = () => ({
  botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
  redirectUrl: `${SITE_DOMAIN}/auth/callback`,
  origin: SITE_DOMAIN,
}); 