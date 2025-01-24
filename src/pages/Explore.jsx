import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon, 
  XMarkIcon,
  UsersIcon,
  ClockIcon,
  ChartBarIcon,
  StarIcon,
  ShieldCheckIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';
import { useChannels } from '../contexts/ChannelsContext';
import { Link } from 'react-router-dom';
import { categories, memberRanges, sortOptions } from '../config/categories';
import { fetchPaginatedChannels } from '../services/channelService';

const ChannelCard = ({ channel }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-base-200 border border-base-300/50 rounded-xl p-4 hover:bg-base-300/50 transition-all duration-300 group"
  >
    <div className="flex items-center gap-4">
      {/* Channel Image */}
      {channel.photoUrl ? (
        <img 
          src={channel.photoUrl} 
          alt={channel.title}
          className="w-12 h-12 rounded-xl object-cover ring-2 ring-base-300/50 group-hover:ring-primary/50 transition-all"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-base-300/50 group-hover:ring-primary/50 transition-all flex items-center justify-center">
          <span className="text-xl font-semibold text-primary">
            {channel.title?.[0] || '@'}
          </span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-white truncate">
            {channel.title || `@${channel.username}`}
          </h3>
          {channel.verified && (
            <ShieldCheckIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
          )}
          {channel.featured && (
            <StarIcon className="h-4 w-4 text-yellow-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-neutral-400 truncate">@{channel.username}</p>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <UsersIcon className="w-3 h-3" />
            {channel.statistics?.memberCount?.toLocaleString() || '0'} members
          </span>
          {channel.category && (
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <HashtagIcon className="w-3 h-3" />
              {categories.find(c => c.value === channel.category)?.label || channel.category}
            </span>
          )}
        </div>
      </div>

      <a
        href={`https://t.me/${channel.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-primary/90 hover:bg-primary text-white text-sm rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 font-medium whitespace-nowrap"
      >
        Join Now
      </a>
    </div>

    <p className="mt-3 text-sm text-neutral-400 line-clamp-2">
      {channel.description}
    </p>
  </motion.div>
);

const FiltersSidebar = ({ 
  selectedCategory, 
  setSelectedCategory,
  selectedMemberRange,
  setSelectedMemberRange,
  onlyVerified,
  setOnlyVerified,
  onSelect 
}) => (
  <div className="space-y-8">
    <div>
      <h4 className="text-sm font-medium mb-4 text-neutral-200">Categories</h4>
      <div className="space-y-1">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.value}
              onClick={() => {
                setSelectedCategory(category.value);
                onSelect?.();
              }}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm flex items-center gap-3 transition-all ${
                selectedCategory === category.value
                  ? 'bg-primary text-white'
                  : 'text-neutral-400 hover:bg-base-300/50 hover:text-neutral-200'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {category.label}
            </button>
          );
        })}
      </div>
    </div>

    <div>
      <h4 className="text-sm font-medium mb-4 text-neutral-200">Member Count</h4>
      <div className="space-y-1">
        {memberRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => {
              setSelectedMemberRange(range.value);
              onSelect?.();
            }}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm flex items-center gap-3 transition-all ${
              selectedMemberRange === range.value
                ? 'bg-primary text-white'
                : 'text-neutral-400 hover:bg-base-300/50 hover:text-neutral-200'
            }`}
          >
            <UsersIcon className="w-4 h-4 flex-shrink-0" />
            {range.label}
          </button>
        ))}
      </div>
    </div>

    <div>
      <h4 className="text-sm font-medium mb-4 text-neutral-200">Verification</h4>
      <button
        onClick={() => {
          setOnlyVerified(!onlyVerified);
          onSelect?.();
        }}
        className={`w-full text-left px-4 py-2 rounded-lg text-sm flex items-center gap-3 transition-all ${
          onlyVerified
            ? 'bg-primary text-white'
            : 'text-neutral-400 hover:bg-base-300/50 hover:text-neutral-200'
        }`}
      >
        <ShieldCheckIcon className="w-4 h-4 flex-shrink-0" />
        Verified Only
      </button>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="animate-pulse bg-base-200 border border-base-300/50 rounded-xl p-4">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-base-300"></div>
      <div className="flex-1">
        <div className="h-4 bg-base-300 rounded w-3/4"></div>
        <div className="h-3 bg-base-300 rounded w-1/2 mt-2"></div>
        <div className="h-3 bg-base-300 rounded w-1/3 mt-2"></div>
      </div>
      <div className="w-24 h-8 bg-base-300 rounded-lg"></div>
    </div>
    <div className="h-4 bg-base-300 rounded w-full mt-3"></div>
    <div className="h-4 bg-base-300 rounded w-2/3 mt-2"></div>
  </div>
);

const CHANNELS_PER_PAGE = 10;

const Explore = () => {
  const { loading: contextLoading, error: contextError } = useChannels();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMemberRange, setSelectedMemberRange] = useState('any');
  const [sortBy, setSortBy] = useState('popular');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Pagination state
  const [channels, setChannels] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination when filters change
  useEffect(() => {
    setChannels([]);
    setLastDoc(null);
    setHasMore(true);
    loadChannels(true);
  }, [selectedCategory, onlyVerified, sortBy, debouncedSearch]);

  // Load more channels when scrolling
  useEffect(() => {
    if (isInView && hasMore && !loading) {
      loadChannels();
    }
  }, [isInView]);

  // Load channels
  const loadChannels = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        category: selectedCategory,
        onlyVerified,
        sortBy,
        search: debouncedSearch
      };

      const result = await fetchPaginatedChannels(
        filters,
        reset ? null : lastDoc,
        CHANNELS_PER_PAGE
      );

      setChannels(prev => reset ? result.channels : [...prev, ...result.channels]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Error loading channels:', err);
      setError('Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  // Filter channels by search query
  const filteredChannels = channels.filter(channel => {
    if (!debouncedSearch) return true;
    
    const searchLower = debouncedSearch.toLowerCase();
    return (
      channel.title?.toLowerCase().includes(searchLower) ||
      channel.description?.toLowerCase().includes(searchLower) ||
      channel.username?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Header */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search channels..."
              className="w-full pl-12 pr-4 py-3 bg-base-200 border border-base-300/50 rounded-xl focus:outline-none focus:border-primary/50 text-white"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          </div>
          
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4 py-3 bg-base-200 border border-base-300/50 rounded-xl text-white hover:bg-base-300/50 transition-all duration-300 flex items-center gap-2"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${
            isFilterOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 shrink-0`}>
            <FiltersSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedMemberRange={selectedMemberRange}
              setSelectedMemberRange={setSelectedMemberRange}
              onlyVerified={onlyVerified}
              setOnlyVerified={setOnlyVerified}
            />
          </div>

          {/* Channels Grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                {filteredChannels.length} Channels Found
              </h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-base-200 border border-base-300/50 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary/50"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {error ? (
              <div className="text-red-500 text-center py-8">
                {error}
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  {filteredChannels.map(channel => (
                    <ChannelCard key={channel.id} channel={channel} />
                  ))}
                </div>

                {loading && (
                  <div className="mt-4 space-y-4">
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                  </div>
                )}

                {!loading && !hasMore && filteredChannels.length > 0 && (
                  <div className="text-neutral-400 text-center mt-8">
                    No more channels to load
                  </div>
                )}

                {/* Infinite scroll trigger */}
                <div ref={loadMoreRef} className="h-4" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;