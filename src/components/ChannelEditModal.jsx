import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const ChannelEditModal = ({ channel, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    category: '',
    description: '',
    featured: false,
    verified: false,
  });

  useEffect(() => {
    if (channel) {
      setFormData({
        name: channel.name || '',
        username: channel.username || '',
        category: channel.category || '',
        description: channel.description || '',
        featured: channel.featured || false,
        verified: channel.verified || false,
      });
    }
  }, [channel]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: channel.id });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface border border-base-300 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b border-base-300">
            <h2 className="text-xl font-semibold text-gray-100">Edit Channel</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-base-300 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-base-300 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
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
                rows="3"
                className="w-full px-3 py-2 bg-base-300 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="form-checkbox rounded bg-base-300 border-base-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-400">Featured</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleChange}
                  className="form-checkbox rounded bg-base-300 border-base-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-400">Verified</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-base-300">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChannelEditModal; 