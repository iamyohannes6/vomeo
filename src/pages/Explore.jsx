import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Search Header */}
      <div className="bg-base-200/50 backdrop-blur-lg sticky top-16 z-40 border-b border-base-300/50">
        <div className="container mx-auto px-4 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl bg-base-300/50 border-base-300/50 focus:border-primary focus:ring-1 focus:ring-primary placeholder-neutral-500 text-neutral-200"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar for Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FiltersSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          {/* Mobile Filters Modal */}
          {isFilterOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="absolute right-0 top-0 h-full w-80 bg-base-200 border-l border-base-300/50 p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-base-300/50 rounded-lg"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <FiltersSidebar
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  onSelect={() => setIsFilterOpen(false)}
                />
              </motion.div>
            </div>
          )}

          {/* Channel Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">All Channels</h2>
              <select className="bg-base-300/50 border-base-300/50 rounded-lg text-sm text-neutral-200">
                <option>Most Popular</option>
                <option>Recently Added</option>
                <option>Trending</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {channels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FiltersSidebar = ({ selectedCategory, setSelectedCategory, onSelect }) => (
  <div className="space-y-6">
    <div>
      <h4 className="text-sm font-medium mb-3">Categories</h4>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => {
              setSelectedCategory(category.value);
              onSelect?.();
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              selectedCategory === category.value
                ? 'bg-primary text-white'
                : 'text-neutral-400 hover:bg-base-300/50'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>

    <div>
      <h4 className="text-sm font-medium mb-3">Member Count</h4>
      <select className="w-full rounded-lg bg-base-300/50 border-base-300/50 text-sm text-neutral-200">
        <option>Any size</option>
        <option>1K - 10K</option>
        <option>10K - 50K</option>
        <option>50K+</option>
      </select>
    </div>
  </div>
);

const ChannelCard = ({ channel }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-base-200 border border-base-300/50 rounded-lg p-3 card-hover"
  >
    <div className="flex items-center gap-3">
      <img src={channel.image} alt={channel.name} className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm md:text-base font-semibold truncate">{channel.name}</h3>
          <span className="text-xs text-neutral-500 shrink-0 ml-2">{channel.members}</span>
        </div>
        <p className="text-xs md:text-sm text-neutral-400 line-clamp-1 mt-0.5">{channel.description}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-neutral-500">{channel.category}</span>
          <button className="text-primary hover:text-primary/80 transition-colors text-xs md:text-sm">
            Join
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

// Sample data
const categories = [
  { label: 'All Categories', value: 'all' },
  { label: 'Technology', value: 'tech' },
  { label: 'Cryptocurrency', value: 'crypto' },
  { label: 'Gaming', value: 'gaming' },
  { label: 'Education', value: 'education' },
  { label: 'Entertainment', value: 'entertainment' },
];

const channels = [
  {
    id: 1,
    name: 'Crypto Signals Daily',
    description: 'Get the latest crypto signals and market analysis',
    members: '75K',
    category: 'Cryptocurrency',
    image: 'https://via.placeholder.com/64',
  },
  {
    id: 2,
    name: 'Tech Insider',
    description: 'Breaking news and updates from the tech world',
    members: '120K',
    category: 'Technology',
    image: 'https://via.placeholder.com/64',
  },
  {
    id: 3,
    name: 'Gaming Community',
    description: 'Join the largest gaming community on Telegram',
    members: '250K',
    category: 'Gaming',
    image: 'https://via.placeholder.com/64',
  },
  {
    id: 4,
    name: 'Learn to Code',
    description: 'Free programming tutorials and resources',
    members: '45K',
    category: 'Education',
    image: 'https://via.placeholder.com/64',
  },
];

export default Explore; 