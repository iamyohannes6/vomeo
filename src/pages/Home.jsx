import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { ChartBarIcon as TrendingUpIcon } from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="min-h-screen pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5"></div>
        <div className="section-container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center py-8 md:py-16 px-4"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 gradient-bg text-transparent bg-clip-text leading-tight">
              Discover Amazing Telegram Channels
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 mb-6 md:mb-8">
              Your gateway to the best Telegram channels and groups. Find, explore, and connect with communities that matter to you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button className="btn-primary w-full sm:w-auto">Start Exploring</button>
              <button className="w-full sm:w-auto px-6 py-2 rounded-lg border border-base-300/50 hover:border-primary transition-colors">
                Submit Your Channel
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Channels Section */}
      <section className="px-4 py-8 md:py-12">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Channels</h2>
            <button className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
              <span className="text-sm md:text-base">View All</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {featuredChannels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-base-200/50 px-4 py-8 md:py-12">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ChannelCard = ({ channel }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-base-200 border border-base-300/50 rounded-lg shadow-sm p-3 card-hover"
  >
    <div className="flex items-center gap-3">
      <img src={channel.image} alt={channel.name} className="w-8 h-8 md:w-10 md:h-10 rounded-lg" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm md:text-base font-semibold truncate">{channel.name}</h3>
          {channel.trending && (
            <span className="flex items-center text-orange-500 text-xs shrink-0 ml-2">
              <TrendingUpIcon className="w-3 h-3 md:w-4 md:h-4" />
            </span>
          )}
        </div>
        <p className="text-xs md:text-sm text-neutral-400 line-clamp-1 mt-0.5">{channel.description}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-neutral-500">{channel.members} members</span>
          <button className="text-primary hover:text-primary/80 transition-colors text-xs md:text-sm">
            Join
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const CategoryCard = ({ category }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-base-200 border border-base-300/50 rounded-xl p-4 md:p-6 text-center card-hover cursor-pointer"
  >
    <div className="text-2xl md:text-3xl mb-2">{category.icon}</div>
    <h3 className="font-semibold text-sm md:text-base">{category.name}</h3>
    <p className="text-xs md:text-sm text-neutral-500">{category.count} channels</p>
  </motion.div>
);

// Sample data
const featuredChannels = [
  {
    id: 1,
    name: "Crypto Daily",
    description: "Latest updates and analysis from the crypto world",
    members: "50K",
    image: "https://via.placeholder.com/48",
    trending: true,
  },
  {
    id: 2,
    name: "Tech News",
    description: "Breaking news and updates from the tech industry",
    members: "75K",
    image: "https://via.placeholder.com/48",
    trending: false,
  },
  {
    id: 3,
    name: "Gaming Hub",
    description: "Gaming news, updates, and community discussions",
    members: "100K",
    image: "https://via.placeholder.com/48",
    trending: true,
  },
];

const categories = [
  {
    id: 1,
    name: "Technology",
    count: "1.2K",
    icon: "🚀",
  },
  {
    id: 2,
    name: "Cryptocurrency",
    count: "850",
    icon: "💰",
  },
  {
    id: 3,
    name: "Gaming",
    count: "1.5K",
    icon: "🎮",
  },
  {
    id: 4,
    name: "Education",
    count: "950",
    icon: "📚",
  },
];

export default Home; 