import { StarIcon, ShieldCheckIcon, UsersIcon } from '@heroicons/react/24/solid';

const CompactChannelCard = ({ channel }) => {
  return (
    <div className="min-w-[200px] bg-surface border border-base-300 rounded-lg p-3 hover:border-primary/50 transition-colors">
      <div className="flex items-center space-x-3">
        {/* Channel Image */}
        <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center">
          {channel.profilePicture ? (
            <img 
              src={channel.profilePicture} 
              alt={channel.name} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-lg font-semibold text-gray-400">
              {channel.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Channel Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <h3 className="text-sm font-semibold text-gray-100 truncate">{channel.name}</h3>
            {channel.verified && (
              <ShieldCheckIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <UsersIcon className="w-3 h-3" />
            <span>{channel.subscribers || 0} members</span>
          </div>
        </div>

        {/* Join Button */}
        <a
          href={`https://t.me/${channel.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          Join
        </a>
      </div>
    </div>
  );
};

export default CompactChannelCard; 