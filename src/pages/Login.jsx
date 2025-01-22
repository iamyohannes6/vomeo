import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TELEGRAM_LOGIN_PARAMS } from '../config/telegram';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    } else {
      // Save intended path
      sessionStorage.setItem('intendedPath', from);
    }

    // Load Telegram Widget Script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', TELEGRAM_LOGIN_PARAMS.botId);
    script.setAttribute('data-size', TELEGRAM_LOGIN_PARAMS.buttonSize);
    script.setAttribute('data-radius', TELEGRAM_LOGIN_PARAMS.cornerRadius);
    script.setAttribute('data-request-access', TELEGRAM_LOGIN_PARAMS.requestAccess);
    script.setAttribute('data-userpic', TELEGRAM_LOGIN_PARAMS.showUserPhoto);
    script.setAttribute('data-lang', TELEGRAM_LOGIN_PARAMS.lang);
    script.setAttribute('data-auth-url', `${window.location.origin}/auth/callback`);
    script.async = true;

    const container = document.getElementById('telegram-login');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [user, navigate, from]);

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