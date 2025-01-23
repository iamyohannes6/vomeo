// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME?.replace('@', ''); // Remove @ if present
const STORAGE_CHANNEL = import.meta.env.VITE_TELEGRAM_STORAGE_CHANNEL;

// API Endpoints
const TELEGRAM_API_BASE = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN;
const TELEGRAM_FILE_API_BASE = 'https://api.telegram.org/file/bot' + TELEGRAM_BOT_TOKEN;

// Login Widget Configuration
const TELEGRAM_LOGIN_PARAMS = {
  botId: BOT_USERNAME,
  buttonSize: 'large', // large, medium, small
  cornerRadius: 8,
  requestAccess: 'write',
  showUserPhoto: true,
  lang: 'en',
  origin: 'https://vomeo.netlify.app'
};

// Admin Configuration
const ADMIN_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user'
};

export {
  TELEGRAM_BOT_TOKEN,
  BOT_USERNAME,
  STORAGE_CHANNEL,
  TELEGRAM_API_BASE,
  TELEGRAM_FILE_API_BASE,
  TELEGRAM_LOGIN_PARAMS,
  ADMIN_ROLES
};

// Admin configuration
export const ADMIN_IDS = [
  // Add your admin Telegram user IDs here
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
const SITE_DOMAIN = 'https://vomeo.netlify.app';

export {
  SITE_DOMAIN
};

// Secure config that's only used server-side
export const getServerConfig = () => ({
  botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
  redirectUrl: `${SITE_DOMAIN}/auth/callback`,
  origin: SITE_DOMAIN,
}); 