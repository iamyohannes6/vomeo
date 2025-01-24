import { useAuth } from '../contexts/AuthContext';
import { useChannels } from '../contexts/ChannelsContext';
import { StarIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const { channels } = useChannels();

  // Filter channels by user
  const userChannels = {
    approved: channels.approved?.filter(channel => channel.submittedBy?.id === user?.id) || [],
    pending: channels.pending?.filter(channel => channel.submittedBy?.id === user?.id) || [],
    rejected: channels.rejected?.filter(channel => channel.submittedBy?.id === user?.id) || [],
  };

  const totalSubmissions = userChannels.approved.length + userChannels.pending.length + userChannels.rejected.length;

  const ChannelList = ({ channels, status }) => (
    <div className="space-y-4">
      {channels.map(channel => (
        <div
          key={channel.id}
          className="bg-base-200 rounded-lg p-4 hover:bg-base-300/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            {channel.photoUrl ? (
              <img
                src={channel.photoUrl}
                alt={channel.title}
                className="w-12 h-12 rounded-lg object-cover ring-1 ring-base-300/50"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-base-300 flex items-center justify-center ring-1 ring-base-300/50">
                <span className="text-xl font-bold text-neutral-400">
                  {channel.title?.[0]}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white truncate">{channel.title}</h3>
                {channel.verified && <ShieldCheckIcon className="w-4 h-4 text-blue-500" />}
                {channel.featured && <StarIcon className="w-4 h-4 text-yellow-500" />}
              </div>
              <p className="text-sm text-neutral-400 truncate">@{channel.username}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-base-300 text-neutral-400">
                  {status}
                </span>
                {channel.submittedAt && (
                  <span className="text-xs text-neutral-500">
                    Submitted {new Date(channel.submittedAt.toDate()).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <a
              href={`https://t.me/${channel.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View Channel
            </a>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-base-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-6">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.firstName}
                className="w-24 h-24 rounded-xl ring-2 ring-base-300/50"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-base-300/50 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {user.firstName?.[0] || '@'}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user.firstName} {user.lastName}
              </h1>
              {user.username && (
                <p className="text-neutral-400 mb-4">@{user.username}</p>
              )}
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-base-300/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">{totalSubmissions}</div>
                  <div className="text-xs text-neutral-400">Total Submissions</div>
                </div>
                <div className="bg-base-300/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-500">{userChannels.approved.length}</div>
                  <div className="text-xs text-neutral-400">Approved</div>
                </div>
                <div className="bg-base-300/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-500">{userChannels.pending.length}</div>
                  <div className="text-xs text-neutral-400">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Channel Lists */}
        <div className="space-y-8">
          {/* Pending Channels */}
          {userChannels.pending.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Pending Channels</h2>
              <ChannelList channels={userChannels.pending} status="pending" />
            </section>
          )}

          {/* Approved Channels */}
          {userChannels.approved.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Approved Channels</h2>
              <ChannelList channels={userChannels.approved} status="approved" />
            </section>
          )}

          {/* Rejected Channels */}
          {userChannels.rejected.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Rejected Channels</h2>
              <ChannelList channels={userChannels.rejected} status="rejected" />
            </section>
          )}

          {/* Empty State */}
          {totalSubmissions === 0 && (
            <div className="text-center py-12 bg-base-200 rounded-lg">
              <p className="text-neutral-400">You haven't submitted any channels yet.</p>
              <Link
                to="/submit"
                className="inline-block mt-4 text-primary hover:text-primary/80 transition-colors"
              >
                Submit your first channel
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 