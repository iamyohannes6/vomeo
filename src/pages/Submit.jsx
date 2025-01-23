import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChannels } from '../contexts/ChannelsContext';

const Submit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { storeChannel, loading, error } = useChannels();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    category: 'general',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Clean up username (remove @ if present)
      const cleanUsername = formData.username.startsWith('@') 
        ? formData.username.slice(1) 
        : formData.username;
      
      await storeChannel({
        ...formData,
        username: cleanUsername
      }, user); // Pass the user object as submitter
      
      navigate('/');
    } catch (err) {
      console.error('Error submitting channel:', err);
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Submit a Channel</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Channel Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-base-200 border border-base-300 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Channel Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Channel Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-base-200 border border-base-300 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="@username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-base-200 border border-base-300 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="general">General</option>
              <option value="tech">Technology</option>
              <option value="news">News</option>
              <option value="entertainment">Entertainment</option>
              <option value="education">Education</option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 rounded-lg bg-base-200 border border-base-300 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe your channel..."
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Channel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Submit; 