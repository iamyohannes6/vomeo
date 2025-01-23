import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getServerConfig } from '../config/telegram';
import { checkUserRole } from '../config/admins';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const verifyTelegramData = async () => {
      try {
        // Get all auth data from URL
        const authData = {
          id: searchParams.get('id'),
          first_name: searchParams.get('first_name'),
          username: searchParams.get('username'),
          photo_url: searchParams.get('photo_url'),
          auth_date: searchParams.get('auth_date'),
          hash: searchParams.get('hash'),
        };

        // Create data check string
        const checkString = Object.entries(authData)
          .filter(([key]) => key !== 'hash')
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, value]) => `${key}=${value}`)
          .join('\n');

        // Create secret key from bot token
        const secretKey = await crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode('WebAppData'),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        );

        // Generate hash
        const signatureBuffer = await crypto.subtle.sign(
          'HMAC',
          secretKey,
          new TextEncoder().encode(checkString)
        );
        const signatureArray = Array.from(new Uint8Array(signatureBuffer));
        const generatedHash = signatureArray
          .map(byte => byte.toString(16).padStart(2, '0'))
          .join('');

        // Verify hash matches
        if (generatedHash === authData.hash) {
          // Check user role
          const role = checkUserRole(authData.id);
          
          // Authentication successful
          login({
            id: authData.id,
            firstName: authData.first_name,
            username: authData.username,
            photoUrl: authData.photo_url,
            role: role,
          });
          
          // Redirect to the intended page or home
          const intendedPath = sessionStorage.getItem('intendedPath') || '/';
          sessionStorage.removeItem('intendedPath');
          navigate(intendedPath);
        } else {
          throw new Error('Invalid authentication data');
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        navigate('/auth/login');
      }
    };

    verifyTelegramData();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default AuthCallback; 