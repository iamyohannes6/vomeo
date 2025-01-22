import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { PlusCircleIcon, Squares2X2Icon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
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
    <nav className="bg-base-200/50 backdrop-blur-lg border-b border-base-300/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xl md:text-2xl font-bold gradient-bg text-transparent bg-clip-text"
            >
              TeleDiscover
            </motion.div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-base-300/50 transition-colors"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/explore" icon={<Squares2X2Icon className="w-5 h-5" />}>
              Explore
            </NavLink>
            <NavLink to="/submit" icon={<PlusCircleIcon className="w-5 h-5" />}>
              Submit Channel
            </NavLink>
            <button 
              onClick={handleAuth}
              className={`btn ${user ? 'btn-outline' : 'btn-primary'}`}
            >
              {user ? (
                <div className="flex items-center space-x-2">
                  <img 
                    src={user.photoUrl} 
                    alt={user.firstName} 
                    className="w-6 h-6 rounded-full"
                  />
                  <span>Logout</span>
                </div>
              ) : (
                'Login with Telegram'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-base-300/50"
          >
            <div className="container mx-auto px-4 py-4 space-y-4 bg-base-200/80 backdrop-blur-lg">
              <div className="flex items-center px-2">
                <input
                  type="text"
                  placeholder="Search channels..."
                  className="w-full px-4 py-2 rounded-lg bg-base-300/50 border-base-300/50 focus:border-primary focus:ring-1 focus:ring-primary placeholder-neutral-500 text-neutral-200"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-neutral-500 -ml-10" />
              </div>
              <NavLink
                to="/explore"
                icon={<Squares2X2Icon className="w-5 h-5" />}
                mobile
              >
                Explore
              </NavLink>
              <NavLink
                to="/submit"
                icon={<PlusCircleIcon className="w-5 h-5" />}
                mobile
              >
                Submit Channel
              </NavLink>
              <button 
                onClick={handleAuth}
                className={`w-full ${user ? 'btn-outline' : 'btn-primary'}`}
              >
                {user ? (
                  <div className="flex items-center space-x-2">
                    <img 
                      src={user.photoUrl} 
                      alt={user.firstName} 
                      className="w-6 h-6 rounded-full"
                    />
                    <span>Logout</span>
                  </div>
                ) : (
                  'Login with Telegram'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ to, children, icon, mobile }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 text-neutral-400 hover:text-primary transition-colors ${
      mobile ? 'w-full px-2 py-2 hover:bg-base-300/50 rounded-lg' : ''
    }`}
  >
    {icon}
    <span>{children}</span>
  </Link>
);

export default Navbar; 