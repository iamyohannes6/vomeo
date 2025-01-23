import { useState, useEffect } from 'react';
import { MegaphoneIcon, PhotoIcon, LinkIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PromoEditor = ({ currentPromo, onSave, isSecondary = false }) => {
  const [promo, setPromo] = useState({
    title: '',
    description: '',
    ctaLink: '',
    ctaText: '',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentPromo) {
      setPromo({
        title: currentPromo.title || '',
        description: currentPromo.description || '',
        ctaLink: currentPromo.ctaLink || '',
        ctaText: currentPromo.ctaText || '',
        image: currentPromo.image || ''
      });
    }
  }, [currentPromo]);

  const validateForm = () => {
    const newErrors = {};
    if (!promo.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!promo.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (promo.ctaLink && !isValidUrl(promo.ctaLink)) {
      newErrors.ctaLink = 'Please enter a valid URL';
    }
    if (promo.image && !isValidUrl(promo.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSave(promo);
      // Form submitted successfully
    } catch (error) {
      console.error('Error saving promo:', error);
      setErrors({ submit: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (currentPromo) {
      setPromo({
        title: currentPromo.title || '',
        description: currentPromo.description || '',
        ctaLink: currentPromo.ctaLink || '',
        ctaText: currentPromo.ctaText || '',
        image: currentPromo.image || ''
      });
    } else {
      setPromo({
        title: '',
        description: '',
        ctaLink: '',
        ctaText: '',
        image: ''
      });
    }
    setErrors({});
  };

  return (
    <div className="bg-surface border border-base-300 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MegaphoneIcon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-100">
            {isSecondary ? 'Secondary Promotional Content' : 'Hero Promotional Content'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={promo.title}
            onChange={(e) => {
              setPromo({ ...promo, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            className={`w-full px-4 py-2 bg-base-200 border rounded-lg text-gray-100 focus:outline-none focus:ring-1 ${
              errors.title ? 'border-red-500 focus:ring-red-500' : 'border-base-300 focus:ring-primary'
            }`}
            placeholder="Enter promotional title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={promo.description}
            onChange={(e) => {
              setPromo({ ...promo, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            className={`w-full px-4 py-2 bg-base-200 border rounded-lg text-gray-100 focus:outline-none focus:ring-1 h-24 ${
              errors.description ? 'border-red-500 focus:ring-red-500' : 'border-base-300 focus:ring-primary'
            }`}
            placeholder="Enter promotional description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* CTA Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              CTA Link
            </label>
            <div className="relative">
              <input
                type="url"
                value={promo.ctaLink}
                onChange={(e) => {
                  setPromo({ ...promo, ctaLink: e.target.value });
                  if (errors.ctaLink) setErrors({ ...errors, ctaLink: '' });
                }}
                className={`w-full pl-10 pr-4 py-2 bg-base-200 border rounded-lg text-gray-100 focus:outline-none focus:ring-1 ${
                  errors.ctaLink ? 'border-red-500 focus:ring-red-500' : 'border-base-300 focus:ring-primary'
                }`}
                placeholder="https://..."
              />
              <LinkIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            {errors.ctaLink && (
              <p className="mt-1 text-sm text-red-500">{errors.ctaLink}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              CTA Text
            </label>
            <input
              type="text"
              value={promo.ctaText}
              onChange={(e) => setPromo({ ...promo, ctaText: e.target.value })}
              className="w-full px-4 py-2 bg-base-200 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Learn More"
            />
          </div>
        </div>

        {/* Image URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Image URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={promo.image}
              onChange={(e) => {
                setPromo({ ...promo, image: e.target.value });
                if (errors.image) setErrors({ ...errors, image: '' });
              }}
              className={`w-full pl-10 pr-4 py-2 bg-base-200 border rounded-lg text-gray-100 focus:outline-none focus:ring-1 ${
                errors.image ? 'border-red-500 focus:ring-red-500' : 'border-base-300 focus:ring-primary'
              }`}
              placeholder="https://..."
            />
            <PhotoIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image}</p>
          )}
          {promo.image && !errors.image && (
            <div className="mt-2">
              <img
                src={promo.image}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  setErrors({ ...errors, image: 'Failed to load image' });
                }}
              />
            </div>
          )}
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-base-300 rounded-lg text-gray-400 hover:text-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromoEditor; 