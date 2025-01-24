import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  StarIcon, 
  BookmarkIcon as BookmarkOutline 
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { getChannelInfo } from '../utils/telegramApi';
import { channelCache } from '../utils/cache';
import { useBookmarks } from '../contexts/BookmarkContext';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

export const ChannelCard = ({ channel }) => {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const { addToast } = useToast();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const fetchStats = async (force = false) => {
    try {
      setRefreshing(force);
      if (force) {
        // Clear cache for this channel before fetching
        channelCache.clear(channel.username);
      }
      const channelInfo = await getChannelInfo(channel.username);
      setStats(channelInfo);
    } catch (error) {
      console.error('Error fetching channel stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [channel.username]);

  const handleRefresh = () => {
    fetchStats(true);
  };

  const handleBookmark = async () => {
    if (!user) {
      addToast('Please login to bookmark channels', 'info');
      return;
    }

    const isCurrentlyBookmarked = isBookmarked(channel.id);
    const success = isCurrentlyBookmarked 
      ? await removeBookmark(channel.id)
      : await addBookmark(channel);

    if (success) {
      addToast(
        isCurrentlyBookmarked 
          ? 'Channel removed from bookmarks' 
          : 'Channel added to bookmarks',
        'success'
      );
    } else {
      addToast('Failed to update bookmark', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-base-200 rounded-xl p-4 hover:bg-base-300/50 transition-all duration-300 group border border-base-300/50"
    >
      <div className="flex items-center gap-4">
        {/* Channel Image */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-12 h-12"
        >
          {stats?.photo_url ? (
            <img 
              src={stats.photo_url} 
              alt={channel.title}
              className="w-full h-full rounded-xl object-cover ring-2 ring-base-300/50 group-hover:ring-primary/50 transition-all"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-base-300/50 group-hover:ring-primary/50 transition-all flex items-center justify-center">
              <span className="text-xl font-semibold text-primary">
                {channel.title?.[0] || '@'}
              </span>
            </div>
          )}
        </motion.div>

        {/* Channel Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white truncate">
              {channel.title || `@${channel.username}`}
            </h3>
            <div className="flex items-center gap-1">
              {channel.verified && (
                <motion.div whileHover={{ scale: 1.2 }}>
                  <ShieldCheckIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                </motion.div>
              )}
              {channel.featured && (
                <motion.div whileHover={{ scale: 1.2 }}>
                  <StarIcon className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                </motion.div>
              )}
            </div>
          </div>
          <p className="text-sm text-neutral-400 truncate">@{channel.username}</p>
          <p className="text-sm text-neutral-400 flex items-center gap-1.5 mt-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
            {channel.statistics?.memberCount?.toLocaleString() || '0'} members
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookmark}
            className="p-2 rounded-lg hover:bg-base-300 transition-colors"
          >
            {isBookmarked(channel.id) ? (
              <BookmarkSolid className="w-5 h-5 text-primary" />
            ) : (
              <BookmarkOutline className="w-5 h-5 text-neutral-400 hover:text-primary" />
            )}
          </motion.button>
          
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`https://t.me/${channel.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium whitespace-nowrap"
          >
            Join Now
          </motion.a>
        </div>
      </div>

      {/* Description */}
      <motion.p 
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isHovered ? 'auto' : 0,
          opacity: isHovered ? 1 : 0
        }}
        className="mt-3 text-sm text-neutral-400 overflow-hidden"
      >
        {channel.description}
      </motion.p>
    </motion.div>
  );
}; 