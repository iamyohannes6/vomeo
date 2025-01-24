import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useBookmarks } from '../contexts/BookmarkContext';
import ChannelCard from '../components/ChannelCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Bookmarks = () => {
  const { bookmarks, loading } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const channel = bookmark.channelData;
    return !searchQuery || 
      channel.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Saved Channels</h1>
            <p className="text-sm text-neutral-400 mt-1">
              {bookmarks.length} channels saved
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search saved channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl bg-base-200 border border-base-300/50 focus:border-primary focus:ring-1 focus:ring-primary placeholder-neutral-500 text-neutral-200"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Bookmarks List */}
        {loading ? (
          <LoadingSkeleton variant="card" count={3} />
        ) : filteredBookmarks.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredBookmarks.map(bookmark => (
              <ChannelCard 
                key={bookmark.channelId} 
                channel={bookmark.channelData} 
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-base-200 rounded-xl"
          >
            <div className="text-4xl mb-4">🔖</div>
            {searchQuery ? (
              <>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No matching channels found
                </h3>
                <p className="text-neutral-400">
                  Try adjusting your search terms
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No saved channels yet
                </h3>
                <p className="text-neutral-400">
                  Bookmark channels to access them quickly later
                </p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks; 