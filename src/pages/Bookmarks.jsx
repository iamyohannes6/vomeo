import { motion } from 'framer-motion';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { useBookmarks } from '../contexts/BookmarksContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ChannelCard from '../components/ChannelCard';

const Bookmarks = () => {
  const { bookmarks, loading, error } = useBookmarks();

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Saved Channels</h1>
            <p className="text-neutral-400 mt-1">Your bookmarked channels</p>
          </div>
          <LoadingSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:text-primary/80"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Saved Channels</h1>
          <p className="text-neutral-400 mt-1">
            {bookmarks.length} {bookmarks.length === 1 ? 'channel' : 'channels'} bookmarked
          </p>
        </div>

        {bookmarks.length > 0 ? (
          <div className="space-y-4">
            {bookmarks.map((channel, index) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ChannelCard channel={channel} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-base-200/50 rounded-xl">
            <BookmarkIcon className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
            <h3 className="text-lg font-semibold text-white mb-2">No Saved Channels</h3>
            <p className="text-neutral-400 mb-4">
              Start exploring and bookmark channels you like
            </p>
            <a
              href="/explore"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Explore Channels
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;