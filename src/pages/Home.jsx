import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const Home = () => {
  const [channels, setChannels] = useState({
    featured: [],
    approved: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchChannels = async () => {
      try {
        // Simulate API call
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              featured: [
                {
                  id: 1,
                  name: 'AI News',
                  username: '@ainews',
                  category: 'Technology',
                  subscribers: 25000,
                  description: 'Latest updates in AI and machine learning',
                  featured: true,
                  verified: true
                },
                {
                  id: 2,
                  name: 'Web Dev Tips',
                  username: '@webdevtips',
                  category: 'Programming',
                  subscribers: 20000,
                  description: 'Daily web development tips and tricks',
                  featured: true,
                  verified: true
                }
              ],
              approved: [
                {
                  id: 3,
                  name: 'Crypto Updates',
                  username: '@cryptoupdates',
                  category: 'Cryptocurrency',
                  subscribers: 10000,
                  description: 'Real-time cryptocurrency news and analysis',
                  featured: false,
                  verified: true
                },
                {
                  id: 4,
                  name: 'Design Inspiration',
                  username: '@designdaily',
                  category: 'Design',
                  subscribers: 15000,
                  description: 'Daily design inspiration and resources',
                  featured: false,
                  verified: true
                }
              ]
            });
          }, 1000);
        });

        setChannels(response);
      } catch (error) {
        console.error('Error fetching channels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  const renderChannelCard = (channel) => (
    <div
      key={channel.id}
      className="bg-surface border border-base-300 rounded-lg p-4 hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-100">{channel.name}</h3>
            {channel.featured && (
              <StarIcon className="w-5 h-5 text-yellow-500" />
            )}
            {channel.verified && (
              <ShieldCheckIcon className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <p className="text-gray-400">{channel.username}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-400">Category: {channel.category}</p>
            <p className="text-sm text-gray-400">
              {channel.subscribers.toLocaleString()} subscribers
            </p>
          </div>
          <p className="mt-3 text-sm text-gray-400">{channel.description}</p>
        </div>
      </div>
      <div className="mt-4">
        <a
          href={`https://t.me/${channel.username.slice(1)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Join Channel
        </a>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Discover the Best Telegram Channels
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Find and join curated Telegram channels in various categories
          </p>
          <Link
            to="/submit"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Submit Your Channel
          </Link>
        </div>

        {/* Featured Channels */}
        {channels.featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">
              Featured Channels
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {channels.featured.map(renderChannelCard)}
            </div>
          </div>
        )}

        {/* All Channels */}
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-6">
            All Channels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.approved.map(renderChannelCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 