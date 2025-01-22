export const TELEGRAM_CONFIG = {
  botToken: '7993463093:AAGZ_oSPTRjjDwurV5Kceo4Xq6A3ZdpW4lI',
  botUsername: 'vomeo_bot', // Add your bot's username
  redirectUrl: 'https://vomeo.netlify.app/auth/callback',
  origin: 'https://vomeo.netlify.app',
};

// Telegram Widget Parameters
export const TELEGRAM_LOGIN_PARAMS = {
  botId: '7993463093',
  requestAccess: 'write',
  buttonSize: 'large',
  cornerRadius: 8,
  showUserPhoto: true,
  lang: 'en',
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