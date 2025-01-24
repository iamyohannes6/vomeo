import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuth = () => {
    if (user) {
      logout();
      navigate('/');
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <nav className="bg-base-100/50 backdrop-blur-sm border-b border-base-300/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-lg font-semibold text-white">
              TeleDiscover
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/explore">Explore</NavLink>
            <NavLink to="/submit">Submit</NavLink>
            <button 
              onClick={handleAuth}
              className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
            >
              {user ? (
                <>
                  <img 
                    src={user.photoUrl} 
                    alt={user.firstName} 
                    className="w-6 h-6 rounded-full ring-1 ring-base-300/50"
                  />
                  <span>Logout</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-base-300/50 transition-colors"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <Bars3Icon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-base-300/10"
          >
            <div className="container mx-auto px-4 py-3 space-y-3 bg-base-100/80 backdrop-blur-sm">
              <NavLink to="/explore" mobile>Explore</NavLink>
              <NavLink to="/submit" mobile>Submit</NavLink>
              <button 
                onClick={handleAuth}
                className="w-full text-left px-2 py-1.5 text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
              >
                {user ? (
                  <>
                    <img 
                      src={user.photoUrl} 
                      alt={user.firstName} 
                      className="w-6 h-6 rounded-full ring-1 ring-base-300/50"
                    />
                    <span>Logout</span>
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ to, children, mobile }) => (
  <Link
    to={to}
    className={`text-sm text-neutral-400 hover:text-white transition-colors ${
      mobile ? 'block px-2 py-1.5' : ''
    }`}
  >
    {children}
  </Link>
);

export default Navbar; 