import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BOT_USERNAME } from '../config/telegram';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const scriptRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (user) {
      navigate('/');
      return;
    }

    if (!BOT_USERNAME) {
      console.error('Bot username not configured');
      return;
    }

    // Only set up auth callback once
    window.onTelegramAuth = (user) => {
      if (user) {
        login(user);
        navigate('/');
      }
    };

    // Only create and append script if it doesn't exist
    if (!scriptRef.current && containerRef.current) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', BOT_USERNAME);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '8');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');

      scriptRef.current = script;
      containerRef.current.appendChild(script);
    }

    // Cleanup function
    return () => {
      if (scriptRef.current && containerRef.current) {
        containerRef.current.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      delete window.onTelegramAuth;
    };
  }, [user, login, navigate]); // Add dependencies

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="max-w-md w-full space-y-8 p-8 bg-base-100 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-400">
            Sign in with your Telegram account to continue
          </p>
        </div>

        <div ref={containerRef} className="flex justify-center" />

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