import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChannels } from '../contexts/ChannelsContext';

export default function Submit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submitChannel, loading, error } = useChannels();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    category: '',
    description: ''
  });
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      // Prepare channel data
      const channelData = {
        ...formData,
        submittedBy: user?.email || 'anonymous',
        submittedAt: new Date().toISOString()
      };

      // Submit to Firebase
      await submitChannel(channelData);
      
      // Show success message
      alert('Channel submitted successfully! It will be reviewed by an admin.');
      
      // Redirect to home
      navigate('/');
    } catch (err) {
      console.error('Error submitting channel:', err);
      setSubmitError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-base-100 rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Submit Channel</h2>
          <p className="mt-2 text-neutral-content">
            Submit your Telegram channel for review
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Channel Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Channel Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full mt-1"
              placeholder="Enter channel name"
            />
          </div>

          {/* Channel Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Channel Username
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-base-300">
                @
              </span>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="input input-bordered flex-1 rounded-none rounded-r-md"
                placeholder="channel_username"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered w-full mt-1"
            >
              <option value="">Select a category</option>
              <option value="news">News</option>
              <option value="entertainment">Entertainment</option>
              <option value="education">Education</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full mt-1"
              placeholder="Describe your channel..."
            />
          </div>

          {/* Error Message */}
          {(error || submitError) && (
            <div className="text-error text-sm">
              {error || submitError}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            >
              {loading ? 'Submitting...' : 'Submit Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 