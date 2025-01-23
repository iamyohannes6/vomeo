import { useState, useEffect } from 'react';
import { ShieldCheckIcon, StarIcon } from '@heroicons/react/24/solid';
import { getChannelInfo } from '../utils/telegramApi';

export const ChannelCard = ({ channel }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const channelInfo = await getChannelInfo(channel.username);
        setStats(channelInfo);
      } catch (error) {
        console.error('Error fetching channel stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [channel.username]);

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
          <div className="mt-1 text-sm text-neutral-400">
            {!loading && stats?.member_count && (
              <span>{stats.member_count.toLocaleString()} subscribers</span>
            )}
          </div>
          
          {/* Description */}
          <p className="mt-2 text-sm line-clamp-2">{channel.description}</p>
        </div>

        {/* Join Button */}
        <a 
          href={`https://t.me/${channel.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm flex-shrink-0"
        >
          Join
        </a>
      </div>
    </div>
  );
}; 