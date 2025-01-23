import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChannels } from '../contexts/ChannelsContext';
import { verifyChannel, getChannelInfo } from '../utils/telegramApi';
import { ShieldCheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { categories } from '../config/categories';

const MAX_DESCRIPTION_LENGTH = 300;

const Submit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submitChannel } = useChannels();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [channelPreview, setChannelPreview] = useState(null);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    category: 'tech',
    description: ''
  });

  // Fetch channel preview when username changes
  useEffect(() => {
    const fetchChannelPreview = async () => {
      if (!formData.username) {
        setChannelPreview(null);
        return;
      }

      try {
        const cleanUsername = formData.username.replace('@', '').trim();
        const info = await getChannelInfo(cleanUsername);
        if (info) {
          setChannelPreview(info);
          setError('');
        }
      } catch (err) {
        setChannelPreview(null);
      }
    };

    const debounceTimer = setTimeout(fetchChannelPreview, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const cleanUsername = formData.username.replace('@', '').trim();
      if (!cleanUsername) {
        throw new Error('Please enter a channel username');
      }

      // Verify channel exists
      const exists = await verifyChannel(cleanUsername);
      if (!exists) {
        throw new Error('Channel not found. Please check the username and try again');
      }

      // Submit channel with preview data
      await submitChannel({
        ...formData,
        username: cleanUsername,
        submittedBy: {
          id: user?.id,
          username: user?.username,
          firstName: user?.first_name,
          lastName: user?.last_name
        },
        photo_url: channelPreview?.photo_url,
        member_count: channelPreview?.member_count,
        title: channelPreview?.title
      });

      setSuccess(true);
      setFormData({ username: '', category: 'tech', description: '' });
      setTimeout(() => navigate('/'), 2000);

    } catch (err) {
      setError(err.message || 'Failed to submit channel. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-100 rounded-xl shadow-lg p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Submit a Channel</h2>
            <p className="mt-2 text-gray-400">
              Share your favorite Telegram channel with the community
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-gray-400 hover:text-white flex items-center gap-2 text-sm"
              onClick={() => setShowGuidelines(!showGuidelines)}
            >
              <InformationCircleIcon className="h-5 w-5" />
              Submission Guidelines
            </button>
          </div>

          {showGuidelines && (
            <div className="bg-base-200 rounded-lg p-4 text-sm text-gray-300 space-y-2">
              <h3 className="font-medium text-white">Before submitting:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure you have permission to submit the channel</li>
                <li>Channel must be public and accessible</li>
                <li>Content should be appropriate and follow our guidelines</li>
                <li>Description should be clear and accurate</li>
                <li>Choose the most relevant category</li>
              </ul>
            </div>
          )}

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

            {channelPreview && (
              <div className="bg-base-200 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  {channelPreview.photo_url ? (
                    <img 
                      src={channelPreview.photo_url} 
                      alt={channelPreview.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl text-primary">
                        {channelPreview.title?.[0] || '@'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-white">{channelPreview.title}</h3>
                    <p className="text-sm text-gray-400">@{channelPreview.username}</p>
                    <p className="text-sm text-gray-400">
                      {channelPreview.member_count?.toLocaleString()} members
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                {categories.filter(cat => cat.value !== 'all').map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                <span className="text-sm text-gray-400">
                  {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
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

            <p className="text-center text-xs text-gray-500">
              Only submit channels that you own or have permission to share.
              Submissions are reviewed by moderators before being listed.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Submit; 