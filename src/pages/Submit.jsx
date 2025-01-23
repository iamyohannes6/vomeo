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
          email: user?.email
        },
        ...(channelPreview && {
          title: channelPreview.title,
          photo_url: channelPreview.photo_url,
          member_count: channelPreview.member_count
        })
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit channel');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Submit Your Channel</h1>
          <p className="text-gray-400">
            Share your Telegram channel with our community
          </p>
        </div>

        <div className="bg-base-200 rounded-xl p-6 md:p-8 space-y-6">
          {/* Guidelines Toggle */}
          <button
            onClick={() => setShowGuidelines(!showGuidelines)}
            className="w-full flex items-center justify-between p-4 bg-base-300/50 rounded-lg hover:bg-base-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <InformationCircleIcon className="w-5 h-5 text-primary" />
              <span className="font-medium text-white">Submission Guidelines</span>
            </div>
            <span className="text-sm text-gray-400">{showGuidelines ? 'Hide' : 'Show'}</span>
          </button>

          {/* Guidelines Content */}
          {showGuidelines && (
            <div className="p-4 bg-base-300/30 rounded-lg text-sm text-gray-300 space-y-2">
              <p>• Channel must be public and have a username</p>
              <p>• Content must be appropriate and follow our community guidelines</p>
              <p>• Channel should be active with regular updates</p>
              <p>• Description should be clear and accurately represent the channel</p>
              <p>• You should have permission to submit the channel</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
                Channel Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="@yourchannel"
                  className="w-full px-4 py-2 bg-base-300/50 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary placeholder-gray-500"
                  required
                />
                {channelPreview && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {channelPreview && (
                <div className="mt-2 text-sm text-gray-400">
                  Found: {channelPreview.title} ({channelPreview.member_count?.toLocaleString()} members)
                </div>
              )}
            </div>

            {/* Category Select */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-base-300/50 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary"
                required
              >
                {categories.filter(cat => cat.value !== 'all').map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Textarea */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your channel..."
                className="w-full px-4 py-2 bg-base-300/50 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary placeholder-gray-500 resize-none"
                required
              />
              <div className="mt-1 text-xs text-gray-400 flex justify-between">
                <span>Be clear and descriptive</span>
                <span>{formData.description.length}/{MAX_DESCRIPTION_LENGTH}</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                Channel submitted successfully! Redirecting...
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Channel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Submit; 