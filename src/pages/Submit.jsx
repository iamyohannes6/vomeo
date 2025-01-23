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
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    category: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Clean username
      const username = formData.username.startsWith('@') 
        ? formData.username 
        : `@${formData.username}`;

      // Verify channel exists
      const verification = await verifyChannel(username);
      if (!verification.success) {
        throw new Error('Channel verification failed. Please check the username and try again.');
      }

      // Prepare channel data
      const channelData = {
        ...formData,
        id: Date.now(), // Generate a temporary ID
        username,
        submittedBy: user.id,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        subscribers: verification.data.subscribers_count,
        verified: false,
        featured: false,
      };

      // Submit channel to context
      submitChannel(channelData);
      
      // Show success message and redirect
      alert('Channel submitted successfully! It will be reviewed by our team.');
      navigate('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-surface border border-base-300 rounded-lg p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-100 mb-6">Submit a Channel</h1>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Channel Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-base-300 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                placeholder="e.g. Tech News Daily"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Channel Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-base-300 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  placeholder="e.g. @technews"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Enter the channel's username (with or without @)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-base-300 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Gaming">Gaming</option>
                <option value="Cryptocurrency">Cryptocurrency</option>
                <option value="News">News</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 bg-base-300 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                placeholder="Describe what your channel is about..."
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Channel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Submit; 