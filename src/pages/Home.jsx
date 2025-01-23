import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ShieldCheckIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useChannels } from '../contexts/ChannelsContext';
import CompactChannelCard from '../components/CompactChannelCard';
import PromoSection from '../components/PromoSection';
import { categories } from '../config/categories';

const ChannelCard = ({ channel }) => (
  <div className="bg-base-200 rounded-xl p-4 hover:bg-base-300 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border border-base-300/10">
    <div className="flex items-center space-x-4">
      {/* Channel Image */}
      {channel.photo_url ? (
        <img 
          src={channel.photo_url} 
          alt={channel.title}
          className="w-14 h-14 rounded-xl object-cover ring-2 ring-base-300/50"
        />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-base-300/50 flex items-center justify-center">
          <span className="text-2xl font-semibold text-primary">
            {channel.title?.[0] || '@'}
          </span>
        </div>
      )}

      {/* Channel Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-white truncate">
            {channel.title || `@${channel.username}`}
          </h3>
          {channel.verified && (
            <ShieldCheckIcon className="h-5 w-5 text-blue-500" />
          )}
          {channel.featured && (
            <StarIcon className="h-5 w-5 text-yellow-500" />
          )}
        </div>
        <p className="text-sm text-gray-400">@{channel.username}</p>
        <p className="text-sm text-gray-400 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
          {channel.member_count?.toLocaleString() || '0'} members
        </p>
      </div>

      {/* Join Button */}
      <a
        href={`https://t.me/${channel.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-md hover:shadow-primary/20 font-medium"
      >
        Join Now
      </a>
    </div>

    {/* Description */}
    <p className="mt-3 text-sm text-gray-400 line-clamp-2">
      {channel.description}
    </p>

    {/* Tags */}
    {channel.category && (
      <div className="mt-3">
        <span className="inline-block px-2 py-1 text-xs rounded-md bg-base-300 text-gray-300">
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
        return (b.member_count || 0) - (a.member_count || 0);
      case 'newest':
        return new Date(b.submittedAt?.toDate()) - new Date(a.submittedAt?.toDate());
      default:
        return 0;
    }
  });

  const scrollFeatured = (direction) => {
    if (featuredScrollRef.current) {
      featuredScrollRef.current.scrollBy({
        left: direction * 300,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-xl">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/20 via-base-100 to-base-100 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Discover the Best Telegram Channels
            </h1>
            <p className="text-lg text-gray-400">
              Join thriving communities and stay updated with the content that matters to you
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 font-medium"
              >
                Submit Your Channel
              </Link>
              <Link
                to="/explore"
                className="px-6 py-3 bg-base-200 text-white rounded-lg hover:bg-base-300 transition-all duration-300 font-medium"
              >
                Explore All
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Promo Section */}
        {promo && <PromoSection promo={promo} variant="hero" />}

        {/* Featured Channels */}
        {channels.featured && channels.featured.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Featured Channels</h2>
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
              className="flex space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-base-300 scroll-smooth"
            >
              {channels.featured.map(channel => (
                <div key={channel.id} className="min-w-[400px]">
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">All Channels</h2>
            <Link
              to="/submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-md hover:shadow-primary/20 font-medium"
            >
              Submit Channel
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-base-200/50 rounded-xl p-4 mb-8">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search channels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-base-300 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary"
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 bg-base-300 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary min-w-[150px]"
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
                className="px-4 py-2 bg-base-300 border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary min-w-[150px]"
              >
                <option value="newest">Newest First</option>
                <option value="subscribers">Most Subscribers</option>
              </select>
            </div>
          </div>

          {/* Channel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-base-300">
            {sortedChannels.map(channel => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
            
            {sortedChannels.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400 bg-base-200/50 rounded-xl">
                <FunnelIcon className="w-12 h-12 mb-4" />
                <p className="text-lg">No channels found matching your criteria</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCategory('all');
                    setSortBy('newest');
                  }}
                  className="mt-4 text-primary hover:text-primary/80"
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