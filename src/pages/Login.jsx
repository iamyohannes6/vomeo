import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BOT_USERNAME } from '../config/telegram';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
      return;
    }

    if (!BOT_USERNAME) return;

    // Define callback function in global scope
    window.onTelegramAuth = function(telegramUser) {
      if (telegramUser) {
        login(telegramUser);
        navigate('/');
      }
    };

    // Load Telegram widget script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    // Add script to container
    const container = document.getElementById('telegram-login');
    if (container) {
      container.innerHTML = '';
      container.appendChild(script);
    }

    return () => {
      // Cleanup
      if (container) {
        container.innerHTML = '';
      }
      delete window.onTelegramAuth;
    };
  }, [user, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full space-y-8 p-8 bg-base-100 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-400">
            Sign in with your Telegram account to continue
          </p>
        </div>

        <div id="telegram-login" className="flex justify-center">
          {/* Telegram login button will be inserted here */}
        </div>

        {!BOT_USERNAME && (
          <p className="text-center text-red-500">
            Error: Bot username not configured
          </p>
        )}

        <p className="text-center text-sm text-gray-500">
          By signing in, you agree to our{' '}
          <a href="/terms" className="text-primary hover:text-primary/80">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary hover:text-primary/80">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login; 