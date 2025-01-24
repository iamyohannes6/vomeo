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
  const { channels, loading, error } = useChannels();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMemberRange, setSelectedMemberRange] = useState('any');
  const [sortBy, setSortBy] = useState('popular');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [displayedChannels, setDisplayedChannels] = useState([]);
  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort channels
  const getFilteredAndSortedChannels = () => {
    const filtered = channels.approved?.filter(channel => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || channel.category === selectedCategory;
      
      // Search filter
      const matchesSearch = !debouncedSearch || 
        channel.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        channel.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        channel.username?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      // Member range filter
      const range = memberRanges.find(r => r.value === selectedMemberRange);
      const memberCount = channel.statistics?.memberCount || 0;
      const matchesMemberRange = memberCount >= range.min && memberCount < range.max;

      // Verification filter
      const matchesVerification = !onlyVerified || channel.verified;

      return matchesCategory && matchesSearch && matchesMemberRange && matchesVerification;
    }) || [];

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.statistics?.memberCount || 0) - (a.statistics?.memberCount || 0);
        case 'recent':
          return new Date(b.submittedAt?.toDate()) - new Date(a.submittedAt?.toDate());
        case 'trending':
          // For now, just use member count as a proxy for trending
          return (b.statistics?.memberCount || 0) - (a.statistics?.memberCount || 0);
        default:
          return 0;
      }
    });
  };

  // Load more channels when scrolling
  useEffect(() => {
    if (isInView && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [isInView, hasMore, loading]);

  // Update displayed channels when filters change
  useEffect(() => {
    const allChannels = getFilteredAndSortedChannels();
    const totalPages = Math.ceil(allChannels.length / CHANNELS_PER_PAGE);
    const channelsToShow = allChannels.slice(0, page * CHANNELS_PER_PAGE);
    
    setDisplayedChannels(channelsToShow);
    setHasMore(page < totalPages);
  }, [
    channels.approved,
    selectedCategory,
    selectedMemberRange,
    onlyVerified,
    debouncedSearch,
    sortBy,
    page
  ]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [selectedCategory, selectedMemberRange, onlyVerified, debouncedSearch, sortBy]);

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
      {/* Search Header */}
      <div className="bg-base-200/50 backdrop-blur-lg sticky top-16 z-40 border-b border-base-300/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, description, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl bg-base-300/50 border border-base-300/50 focus:border-primary focus:ring-1 focus:ring-primary placeholder-neutral-500 text-neutral-200"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden p-3 rounded-xl bg-base-300/50 border border-base-300/50 hover:bg-base-300 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar for Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-36">
              <FiltersSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedMemberRange={selectedMemberRange}
                setSelectedMemberRange={setSelectedMemberRange}
                onlyVerified={onlyVerified}
                setOnlyVerified={setOnlyVerified}
              />
            </div>
          </div>

          {/* Mobile Filters Modal */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsFilterOpen(false);
                  }
                }}
              >
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="absolute right-0 top-0 h-full w-80 bg-base-200 border-l border-base-300/50 p-6 overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">Filters</h3>
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
                    selectedMemberRange={selectedMemberRange}
                    setSelectedMemberRange={setSelectedMemberRange}
                    onlyVerified={onlyVerified}
                    setOnlyVerified={setOnlyVerified}
                    onSelect={() => setIsFilterOpen(false)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Channel Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {loading ? 'Loading Channels...' : `${getFilteredAndSortedChannels().length} Channels Found`}
                </h2>
                <p className="text-sm text-neutral-400 mt-1">
                  {selectedCategory !== 'all' && `Filtered by ${categories.find(c => c.value === selectedCategory)?.label}`}
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-base-300/50 border border-base-300/50 rounded-lg text-sm text-neutral-200 focus:outline-none focus:border-primary min-w-[150px]"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {loading && page === 1 ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, i) => (
                  <LoadingSkeleton key={i} />
                ))}
              </div>
            ) : displayedChannels.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {displayedChannels.map((channel) => (
                    <ChannelCard key={channel.id} channel={channel} />
                  ))}
                </div>
                
                {/* Loading indicator */}
                <div ref={loadMoreRef} className="mt-8 flex justify-center">
                  {hasMore && (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-base-200/50 rounded-xl">
                <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
                <h3 className="text-lg font-semibold text-white mb-2">No Channels Found</h3>
                <p className="text-neutral-400 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedMemberRange('any');
                    setOnlyVerified(false);
                    setSortBy('popular');
                  }}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;