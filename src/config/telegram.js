export const TELEGRAM_CONFIG = {
  botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
  botUsername: 'vomeo_bot',
  redirectUrl: 'https://vomeo.netlify.app/auth/callback',
  origin: 'https://vomeo.netlify.app',
};

// Telegram Widget Parameters
export const TELEGRAM_LOGIN_PARAMS = {
  botId: 'vomeo_bot',
  requestAccess: 'write',
  buttonSize: 'large',
  cornerRadius: 8,
  showUserPhoto: true,
  lang: 'en',
  origin: 'https://vomeo.netlify.app',
};

// Auth Routes
export const AUTH_ROUTES = {
  callback: '/auth/callback',
  login: '/auth/login',
  logout: '/auth/logout',
  admin: '/admin',
};

// Admin Roles
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  MODERATOR: 'moderator',
  EDITOR: 'editor',
}; 