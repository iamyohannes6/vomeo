import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TELEGRAM_LOGIN_PARAMS } from '../config/telegram';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
      return;
    }

    // Handle Telegram login callback
    window.TelegramLoginWidget = {
      dataOnauth: (user) => {
        login(user);
        navigate('/');
      }
    };

    // Load Telegram widget script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', TELEGRAM_LOGIN_PARAMS.botId);
    script.setAttribute('data-size', TELEGRAM_LOGIN_PARAMS.buttonSize);
    script.setAttribute('data-radius', TELEGRAM_LOGIN_PARAMS.cornerRadius);
    script.setAttribute('data-request-access', TELEGRAM_LOGIN_PARAMS.requestAccess);
    script.setAttribute('data-userpic', TELEGRAM_LOGIN_PARAMS.showUserPhoto);
    script.setAttribute('data-lang', TELEGRAM_LOGIN_PARAMS.lang);
    script.setAttribute('data-auth-url', TELEGRAM_LOGIN_PARAMS.origin);
    script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
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
      delete window.TelegramLoginWidget;
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