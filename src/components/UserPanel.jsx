import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  BookmarkIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const UserPanel = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-base-300/50 transition-colors"
      >
        <img
          src={user.photoUrl}
          alt={user.firstName}
          className="w-7 h-7 rounded-full ring-1 ring-base-300/50"
        />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-full mt-2 w-64 bg-base-200 border border-base-300/50 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-base-300/50">
                <div className="flex items-center gap-3">
                  <img
                    src={user.photoUrl}
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full ring-1 ring-base-300/50"
                  />
                  <div>
                    <div className="font-medium text-white">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-neutral-400">
                      @{user.username}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <MenuItem
                  to="/profile"
                  icon={<UserCircleIcon className="w-5 h-5" />}
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  to="/bookmarks"
                  icon={<BookmarkIcon className="w-5 h-5" />}
                  onClick={() => setIsOpen(false)}
                >
                  Saved Channels
                </MenuItem>
                <MenuItem
                  to="/settings"
                  icon={<Cog6ToothIcon className="w-5 h-5" />}
                  onClick={() => setIsOpen(false)}
                >
                  Settings
                </MenuItem>
                <MenuItem
                  as="button"
                  icon={<ArrowRightOnRectangleIcon className="w-5 h-5" />}
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left"
                >
                  Logout
                </MenuItem>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuItem = ({ as = Link, to, icon, children, onClick, className = '' }) => {
  const Component = as;
  const props = as === Link ? { to } : {};

  return (
    <Component
      {...props}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-base-300/50 rounded-lg transition-colors ${className}`}
    >
      {icon}
      {children}
    </Component>
  );
};

export default UserPanel; 