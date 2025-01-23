import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BOT_USERNAME } from '../config/telegram';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const scriptRef = useRef(null);

  useEffect(() => {
    if (user) {
      navigate('/');
      return;
    }

    if (!BOT_USERNAME) return;

    // Only set up the auth callback once
    if (!window.onTelegramAuth) {
      window.onTelegramAuth = function(user) {
        if (user) {
          login(user);
          navigate('/');
        }
      };
    }

    // Only create and append the script if it hasn't been added yet
    if (!scriptRef.current) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', BOT_USERNAME);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;

      // Store reference to script
      scriptRef.current = script;

      // Add script to container
      const container = document.getElementById('telegram-login');
      if (container && !container.hasChildNodes()) {
        container.appendChild(script);
      }
    }

    return () => {
      // Only clean up when component is unmounted
      if (scriptRef.current) {
        const container = document.getElementById('telegram-login');
        if (container) {
          container.innerHTML = '';
        }
        scriptRef.current = null;
        delete window.onTelegramAuth;
      }
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
          <div className="text-center text-red-500 p-4 bg-red-500/10 rounded-lg">
            Error: Bot username not configured
          </div>
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