import { useAuth } from '../contexts/AuthContext';
import { useChannels } from '../contexts/ChannelsContext';

const Profile = () => {
  const { user } = useAuth();
  const { channels } = useChannels();

  // Filter channels submitted by the user
  const userChannels = channels.approved?.filter(
    channel => channel.submittedBy?.id === user?.id
  ) || [];

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-base-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-6">
            <img
              src={user.photoUrl}
              alt={user.firstName}
              className="w-24 h-24 rounded-xl ring-2 ring-base-300/50"
            />
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-neutral-400 mb-4">@{user.username}</p>
              <div className="flex gap-4 text-sm text-neutral-400">
                <div>
                  <span className="text-white font-medium">{userChannels.length}</span> channels submitted
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User's Channels */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Your Channels</h2>
          {userChannels.length > 0 ? (
            <div className="grid gap-4">
              {userChannels.map(channel => (
                <div
                  key={channel.id}
                  className="bg-base-200 rounded-lg p-4 hover:bg-base-300/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {channel.photoUrl ? (
                      <img
                        src={channel.photoUrl}
                        alt={channel.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-base-300 flex items-center justify-center">
                        <span className="text-xl font-bold text-neutral-400">
                          {channel.title[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-white">{channel.title}</h3>
                      <p className="text-sm text-neutral-400">@{channel.username}</p>
                    </div>
                    <a
                      href={`https://t.me/${channel.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      View Channel
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-base-200 rounded-lg">
              <p className="text-neutral-400">You haven't submitted any channels yet.</p>
              <a
                href="/submit"
                className="inline-block mt-4 text-primary hover:text-primary/80 transition-colors"
              >
                Submit your first channel
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 