import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ShieldCheckIcon, FunnelIcon } from '@heroicons/react/24/solid';
import { useChannels } from '../contexts/ChannelsContext';
import CompactChannelCard from '../components/CompactChannelCard';
import PromoSection from '../components/PromoSection';

const Home = () => {
  const { channels, promo, secondaryPromo, loading, error } = useChannels();
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort channels
  const filteredChannels = channels.approved?.filter(channel => {
    const matchesCategory = filterCategory === 'all' || channel.category === filterCategory;
    const matchesSearch = !searchQuery || 
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  // Sort channels
  const sortedChannels = [...filteredChannels].sort((a, b) => {
    switch (sortBy) {
      case 'subscribers':
        return (b.subscribers || 0) - (a.subscribers || 0);
      case 'newest':
        return new Date(b.submittedAt?.toDate()) - new Date(a.submittedAt?.toDate());
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation remains unchanged */}
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Promo Section */}
        {promo && <PromoSection promo={promo} variant="hero" />}

        {/* Featured Channels */}
        {channels.featured && channels.featured.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-100">Featured Channels</h2>
              <button 
                onClick={() => document.getElementById('featured-scroll').scrollLeft += 200}
                className="text-sm text-primary hover:text-primary/80"
              >
                See More →
              </button>
            </div>
            <div 
              id="featured-scroll"
              className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-base-300"
            >
              {channels.featured.map(channel => (
                <CompactChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
          </div>
        )}

        {/* Secondary Promo Section */}
        {secondaryPromo && <PromoSection promo={secondaryPromo} variant="standard" />}

        {/* All Channels */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-100">All Channels</h2>
            <Link
              to="/submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              Submit Channel
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-surface border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary"
            />
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-surface border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary"
            >
              <option value="all">All Categories</option>
              <option value="tech">Technology</option>
              <option value="entertainment">Entertainment</option>
              <option value="news">News</option>
              <option value="education">Education</option>
              {/* Add more categories */}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-surface border border-base-300 rounded-lg text-gray-100 focus:outline-none focus:border-primary"
            >
              <option value="newest">Newest First</option>
              <option value="subscribers">Most Subscribers</option>
            </select>
          </div>

          {/* Channel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-base-300">
            {sortedChannels.map(channel => (
              <CompactChannelCard key={channel.id} channel={channel} />
            ))}
            
            {sortedChannels.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-400">
                No channels found matching your criteria
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 