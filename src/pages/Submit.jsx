import { useState } from 'react';
import { motion } from 'framer-motion';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const Submit = () => {
  const [formData, setFormData] = useState({
    channelName: '',
    channelUsername: '',
    category: '',
    description: '',
    tags: '',
    contactInfo: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="section-container max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Submit Your Channel</h1>
            <p className="text-neutral-600">
              List your Telegram channel in our directory and reach more subscribers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Channel Name
                </label>
                <input
                  type="text"
                  name="channelName"
                  value={formData.channelName}
                  onChange={handleChange}
                  className="w-full rounded-lg border-base-300 focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g., Crypto Daily News"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Channel Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    @
                  </span>
                  <input
                    type="text"
                    name="channelUsername"
                    value={formData.channelUsername}
                    onChange={handleChange}
                    className="w-full rounded-lg border-base-300 pl-8 focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="username"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border-base-300 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Channel Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-lg border-base-300 focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Describe your channel and what subscribers can expect..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full rounded-lg border-base-300 focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="e.g., crypto, trading, news"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Contact Information
              </label>
              <input
                type="email"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                className="w-full rounded-lg border-base-300 focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Your email address"
                required
              />
            </div>

            <div className="bg-base-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CloudArrowUpIcon className="w-6 h-6 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">Submission Guidelines</p>
                  <ul className="mt-1 text-neutral-600 list-disc list-inside">
                    <li>Channel must be active and have regular content updates</li>
                    <li>No adult content or illegal activities</li>
                    <li>Accurate and honest description required</li>
                    <li>Channel must have at least 100 subscribers</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary px-8"
              >
                Submit Channel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const categories = [
  { label: 'Technology', value: 'tech' },
  { label: 'Cryptocurrency', value: 'crypto' },
  { label: 'Gaming', value: 'gaming' },
  { label: 'Education', value: 'education' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'News', value: 'news' },
  { label: 'Business', value: 'business' },
  { label: 'Lifestyle', value: 'lifestyle' },
];

export default Submit; 