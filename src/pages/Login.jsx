import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BOT_USERNAME } from '../config/telegram';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }

    // Save intended path before login
    sessionStorage.setItem('intendedPath', from);

    // Define the callback function exactly as Telegram provides
    window.onTelegramAuth = (user) => {
      console.log('Telegram auth data:', user);
      
      // Then handle our app's login
      login({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        photoUrl: user.photo_url,
        role: 'user',
      });
      
      // Navigate to intended path
      const intendedPath = sessionStorage.getItem('intendedPath') || '/';
      sessionStorage.removeItem('intendedPath');
      navigate(intendedPath);
    };

    // Add the script tag exactly as Telegram provides
    const container = document.getElementById('telegram-login');
    if (container) {
      container.innerHTML = `
        <script 
          async 
          src="https://telegram.org/js/telegram-widget.js?22" 
          data-telegram-login="${BOT_USERNAME}" 
          data-size="medium" 
          data-onauth="onTelegramAuth(user)" 
          data-request-access="write"
        ></script>
      `;
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
      delete window.onTelegramAuth;
    };
  }, [user, login, navigate, from]);

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-surface border border-base-300 rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 text-gray-100">Welcome Back</h1>
            <p className="text-gray-400">
              Sign in with your Telegram account to continue
            </p>
          </div>

          {/* Telegram Login Button Container */}
          <div 
            id="telegram-login" 
            className="flex justify-center"
          ></div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 