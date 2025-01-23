import { useState, useEffect } from 'react';
import { MegaphoneIcon } from '@heroicons/react/24/solid';

const PromoEditor = ({ currentPromo, onSave }) => {
  const [promo, setPromo] = useState({
    title: '',
    description: '',
    ctaLink: '',
    ctaText: '',
    image: ''
  });

  // Update local state when currentPromo changes
  useEffect(() => {
    if (currentPromo) {
      setPromo(currentPromo);
    }
  }, [currentPromo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure required fields are filled
    if (!promo.title || !promo.description) {
      return;
    }
    onSave(promo);
  };

  const handleReset = () => {
    if (currentPromo) {
      setPromo(currentPromo);
    } else {
      setPromo({
        title: '',
        description: '',
        ctaLink: '',
        ctaText: '',
        image: ''
      });
    }
  };

  return (
    <div className="bg-surface border border-base-300 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <MegaphoneIcon className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-100">Edit Promotional Content</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={promo.title}
            onChange={(e) => setPromo({ ...promo, title: e.target.value })}
            className="w-full px-4 py-2 bg-base-200 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary"
            placeholder="Enter promotional title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={promo.description}
            onChange={(e) => setPromo({ ...promo, description: e.target.value })}
            className="w-full px-4 py-2 bg-base-200 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary h-24"
            placeholder="Enter promotional description"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              CTA Link
            </label>
            <input
              type="url"
              value={promo.ctaLink}
              onChange={(e) => setPromo({ ...promo, ctaLink: e.target.value })}
              className="w-full px-4 py-2 bg-base-200 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              CTA Text
            </label>
            <input
              type="text"
              value={promo.ctaText}
              onChange={(e) => setPromo({ ...promo, ctaText: e.target.value })}
              className="w-full px-4 py-2 bg-base-200 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary"
              placeholder="Learn More"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={promo.image}
            onChange={(e) => setPromo({ ...promo, image: e.target.value })}
            className="w-full px-4 py-2 bg-base-200 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary"
            placeholder="https://..."
          />
          {promo.image && (
            <p className="text-xs text-gray-400 mt-1">
              Preview: <a href={promo.image} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Image</a>
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-base-300 rounded-lg text-gray-400 hover:text-gray-100 transition-colors"
          >
            Reset
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
  );
};

export default PromoEditor; 