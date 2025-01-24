import { useState, useEffect } from 'react';
import { ShieldCheckIcon, StarIcon, ArrowPathIcon, BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { getChannelInfo } from '../utils/telegramApi';
import { channelCache } from '../utils/cache';
import { useBookmarks } from '../contexts/BookmarksContext';
import { useToast } from './ToastProvider';
import { useAuth } from '../contexts/AuthContext';

export const ChannelCard = ({ channel }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const showToast = useToast();
  const { user } = useAuth();

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
      showToast('Failed to refresh channel stats', 'error');
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
      showToast('Please login to bookmark channels', 'error');
      return;
    }

    try {
      const isCurrentlyBookmarked = isBookmarked(channel.id);
      if (isCurrentlyBookmarked) {
        await removeBookmark(channel.id);
        showToast('Channel removed from bookmarks', 'success');
      } else {
        await addBookmark(channel);
        showToast('Channel added to bookmarks', 'success');
      }
    } catch (error) {
      console.error('Error managing bookmark:', error);
      showToast('Failed to update bookmark', 'error');
    }
  };

  return (
    <div className="bg-surface p-4 rounded-lg hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        {/* Channel Image */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-base-300 flex-shrink-0">
          {stats?.photo_url ? (
            <img 
              src={stats.photo_url} 
              alt={channel.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-bold">
              {channel.title?.[0] || '?'}
            </div>
          )}
        </div>

        {/* Channel Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg truncate">{channel.title}</h3>
            {channel.verified && (
              <ShieldCheckIcon className="w-5 h-5 text-primary flex-shrink-0" />
            )}
            {channel.featured && (
              <StarIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            )}
          </div>
          
          <div className="text-sm text-neutral-400">@{channel.username}</div>
          
          {/* Stats */}
          <div className="mt-1 text-sm text-neutral-400 flex items-center gap-2">
            {!loading && stats?.member_count && (
              <>
                <span>{stats.member_count.toLocaleString()} subscribers</span>
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-1 hover:text-primary transition-colors"
                  title="Refresh stats"
                >
                  <ArrowPathIcon 
                    className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
                  />
                </button>
              </>
            )}
          </div>
          
          {/* Description */}
          <p className="mt-2 text-sm line-clamp-2">{channel.description}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleBookmark}
            className="p-2 hover:bg-base-300/50 rounded-lg transition-colors"
            title={isBookmarked(channel.id) ? 'Remove from bookmarks' : 'Add to bookmarks'}
          >
            {isBookmarked(channel.id) ? (
              <BookmarkSolid className="w-5 h-5 text-primary" />
            ) : (
              <BookmarkOutline className="w-5 h-5" />
            )}
          </button>
          <a 
            href={`https://t.me/${channel.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            Join
          </a>
        </div>
      </div>
    </div>
  );
}; 