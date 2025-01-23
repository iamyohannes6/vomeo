import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChannels } from '../contexts/ChannelsContext';
import { verifyChannel } from '../utils/telegramApi';

const Submit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submitChannel } = useChannels();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    category: 'Technology',
    description: ''
  });

  const categories = [
    'Technology',
    'News',
    'Entertainment',
    'Education',
    'Business',
    'Sports',
    'Art & Design',
    'Science',
    'Gaming',
    'Music',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user makes changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      // Clean up username (remove @ if present)
      const cleanUsername = formData.username.replace('@', '').trim();
      if (!cleanUsername) {
        throw new Error('Please enter a channel username');
      }

      // Verify channel exists
      const exists = await verifyChannel(cleanUsername);
      if (!exists) {
        throw new Error('Channel not found. Please check the username and try again');
      }

      // Submit channel
      await submitChannel({
        ...formData,
        username: cleanUsername,
        submittedBy: {
          id: user?.id,
          username: user?.username,
          firstName: user?.first_name,
          lastName: user?.last_name
        }
      });

      setSuccess(true);
      setFormData({ username: '', category: 'Technology', description: '' });
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds

    } catch (err) {
      setError(err.message || 'Failed to submit channel. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-base-100 rounded-xl shadow-lg p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Submit a Channel</h2>
            <p className="mt-2 text-gray-400">
              Share your favorite Telegram channel with the community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Channel Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  @
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-8 pr-3 py-2 bg-base-200 border border-base-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-gray-100"
                  placeholder="channel_username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-gray-100"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="block w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-gray-100"
                placeholder="Tell us what this channel is about..."
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-900/50 border border-green-500 rounded-lg">
                <p className="text-sm text-green-500">
                  Channel submitted successfully! Redirecting...
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Channel'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Only submit channels that you own or have permission to share.
            Submissions are reviewed by moderators before being listed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Submit; 