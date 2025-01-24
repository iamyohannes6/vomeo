import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-base-100"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
        
        {/* User Settings Section */}
        <div className="bg-base-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">User Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Username</label>
              <p className="text-white">@{user?.username || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Display Name</label>
              <p className="text-white">{user?.firstName} {user?.lastName}</p>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-base-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>
          <p className="text-neutral-400">Preferences settings coming soon...</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings; 