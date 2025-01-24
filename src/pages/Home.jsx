import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ShieldCheckIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useChannels } from '../contexts/ChannelsContext';
import CompactChannelCard from '../components/CompactChannelCard';
import PromoSection from '../components/PromoSection';
import { categories } from '../config/categories';

const ChannelCard = ({ channel }) => (
  <div className="bg-base-200 rounded-lg p-3 hover:bg-base-300 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border border-base-300/10">
    <div className="flex items-center space-x-3">
      {/* Channel Image */}
      {channel.photoUrl ? (
        <img 
          src={channel.photoUrl} 
          alt={channel.title}
          className="w-10 h-10 rounded-lg object-cover ring-1 ring-base-300/50"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-base-300/50 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary">
            {channel.title?.[0] || '@'}
          </span>
        </div>
      )}

      {/* Channel Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-medium text-white truncate">
            {channel.title || `@${channel.username}`}
          </h3>
          {channel.verified && (
            <ShieldCheckIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
          )}
          {channel.featured && (
            <StarIcon className="h-4 w-4 text-yellow-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-400 truncate">@{channel.username}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
          {channel.statistics?.memberCount?.toLocaleString() || '0'} members
        </p>
      </div>

      {/* Join Button */}
      <a
        href={`https://t.me/${channel.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-md hover:shadow-primary/20 font-medium whitespace-nowrap"
      >
        Join
      </a>
    </div>

    {/* Description */}
    <p className="mt-2 text-xs text-gray-400 line-clamp-2">
      {channel.description}
    </p>

    {/* Tags */}
    {channel.category && (
      <div className="mt-2">
        <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-base-300 text-gray-300">
          {categories.find(c => c.value === channel.category)?.label || channel.category}
        </span>
      </div>
    )}
  </div>
);

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-base-200 rounded-xl p-4">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-xl bg-base-300"></div>
        <div className="flex-1">
          <div className="h-4 bg-base-300 rounded w-3/4"></div>
          <div className="h-3 bg-base-300 rounded w-1/2 mt-2"></div>
          <div className="h-3 bg-base-300 rounded w-1/3 mt-2"></div>
        </div>
        <div className="w-20 h-8 bg-base-300 rounded-lg"></div>
      </div>
      <div className="h-4 bg-base-300 rounded w-full mt-3"></div>
      <div className="h-4 bg-base-300 rounded w-2/3 mt-2"></div>
    </div>
  </div>
);

const Home = () => {
  const { channels, promo, secondaryPromo, loading, error } = useChannels();
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const featuredScrollRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort channels
  const filteredChannels = channels.approved?.filter(channel => {
    // Category filter
    const matchesCategory = filterCategory === 'all' || channel.category === filterCategory;
    
    // Search filter
    const matchesSearch = !debouncedSearch || 
      channel.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      channel.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      channel.username?.toLowerCase().includes(debouncedSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  }) || [];

  // Sort channels
  const sortedChannels = [...filteredChannels].sort((a, b) => {
    switch (sortBy) {
      case 'subscribers':
        return (b.statistics?.memberCount || 0) - (a.statistics?.memberCount || 0);
      case 'newest':
        return new Date(b.submittedAt?.toDate()) - new Date(a.submittedAt?.toDate());
      default:
        return 0;
    }
  });

  const scrollFeatured = (direction) => {
    if (featuredScrollRef.current) {
      const scrollAmount = direction * 320; // Width of card + gap
      featuredScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Promo Section */}
      {promo && <PromoSection promo={promo} variant="hero" />}
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Featured Channels */}
        {channels.featured && channels.featured.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Featured Channels</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => scrollFeatured(-1)}
                  className="p-2 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scrollFeatured(1)}
                  className="p-2 rounded-lg bg-base-200 hover:bg-base-300 transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div 
              ref={featuredScrollRef}
              className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-base-300 scroll-smooth"
            >
              {channels.featured.map(channel => (
                <div key={channel.id} className="min-w-[300px] w-[300px]">
                  <ChannelCard channel={channel} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Secondary Promo Section */}
        {secondaryPromo && <PromoSection promo={secondaryPromo} variant="standard" />}

        {/* All Channels */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">All Channels</h2>
              <p className="text-sm text-gray-400 mt-1">
                {sortedChannels.length} channels available
              </p>
            </div>
            <Link
              to="/submit"
              className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-md hover:shadow-primary/20 font-medium text-sm"
            >
              Submit
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-base-200/50 rounded-lg p-3 mb-6">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search channels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 pl-9 bg-base-300 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary text-sm"
                  />
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 bg-base-300 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary min-w-[150px] text-sm"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-base-300 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary min-w-[150px] text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="subscribers">Most Subscribers</option>
              </select>
            </div>
          </div>

          {/* Channel Grid */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-base-300">
            {sortedChannels.map(channel => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
            
            {sortedChannels.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 bg-base-200/50 rounded-lg">
                <FunnelIcon className="w-10 h-10 mb-3" />
                <p className="text-sm">No channels found matching your criteria</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCategory('all');
                    setSortBy('newest');
                  }}
                  className="mt-3 text-primary hover:text-primary/80 text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 