import { ADMIN_ROLES } from './telegram';

// List of admin users by their Telegram ID
export const ADMIN_USERS = {
  // Format: 'telegramId': { role: 'role_name' }
  // Add your Telegram ID and role here
};

// Helper function to check if a user is an admin
export const checkUserRole = (userId) => {
  return ADMIN_USERS[userId]?.role || 'user';
};

// Helper function to check specific role permissions
export const hasRole = (userId, role) => {
  const userRole = ADMIN_USERS[userId]?.role;
  
  switch(role) {
    case ADMIN_ROLES.SUPER_ADMIN:
      return userRole === ADMIN_ROLES.SUPER_ADMIN;
    
    case ADMIN_ROLES.MODERATOR:
      return userRole === ADMIN_ROLES.SUPER_ADMIN || 
             userRole === ADMIN_ROLES.MODERATOR;
    
    case ADMIN_ROLES.EDITOR:
      return userRole === ADMIN_ROLES.SUPER_ADMIN || 
             userRole === ADMIN_ROLES.MODERATOR || 
             userRole === ADMIN_ROLES.EDITOR;
    
    default:
      return false;
  }
}; 