// Telegram Configuration
export const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
export const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME || 'VomeoBot';
export const STORAGE_CHANNEL = import.meta.env.VITE_TELEGRAM_STORAGE_CHANNEL;

// Admin configuration
export const ADMIN_IDS = [
  // Add your admin Telegram user IDs here
  1234567890, // Example admin ID
];

// Telegram API endpoints
export const TELEGRAM_API_BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
export const TELEGRAM_FILE_API_BASE = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}`;

// Auth configuration
export const TELEGRAM_LOGIN_PARAMS = {
  botId: TELEGRAM_BOT_TOKEN?.split(':')[0],
  requestAccess: 'write',
  buttonSize: 'large',
  showUserPhoto: true,
  lang: 'en'
};

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