import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  StarIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import ChannelEditModal from '../components/ChannelEditModal';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [activeActions, setActiveActions] = useState(null);
  const [editingChannel, setEditingChannel] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const closeActions = () => setActiveActions(null);

  // Mock data for development - replace with real data later
  const channels = {
    pending: [
      { id: 1, name: 'Tech News Daily', username: '@technews', category: 'Technology', subscribers: 5000, status: 'pending' },
      { id: 2, name: 'Gaming Central', username: '@gamingcentral', category: 'Gaming', subscribers: 3000, status: 'pending' },
    ],
    approved: [
      { id: 3, name: 'Crypto Updates', username: '@cryptoupdates', category: 'Cryptocurrency', subscribers: 10000, status: 'approved', featured: false },
      { id: 5, name: 'Design Inspiration', username: '@designdaily', category: 'Design', subscribers: 15000, status: 'approved', featured: false },
    ],
    featured: [
      { id: 6, name: 'AI News', username: '@ainews', category: 'Technology', subscribers: 25000, status: 'approved', featured: true },
      { id: 7, name: 'Web Dev Tips', username: '@webdevtips', category: 'Programming', subscribers: 20000, status: 'approved', featured: true },
    ],
    rejected: [
      { id: 4, name: 'Spam Channel', username: '@spam', category: 'Other', subscribers: 100, status: 'rejected' },
    ],
  };

  const handleApprove = (channelId) => {
    // TODO: Implement approval logic with API call
    console.log('Approve channel:', channelId);
  };

  const handleReject = (channelId) => {
    // TODO: Implement rejection logic with API call
    console.log('Reject channel:', channelId);
  };

  const handleEdit = (channelId) => {
    const channel = Object.values(channels)
      .flat()
      .find(c => c.id === channelId);
    
    if (channel) {
      setEditingChannel(channel);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = (updatedChannel) => {
    console.log('Save channel updates:', updatedChannel);
    // TODO: Implement API call to update channel
    setIsEditModalOpen(false);
    setEditingChannel(null);
  };

  const handleToggleFeature = (channelId) => {
    // TODO: Implement feature toggle logic with API call
    console.log('Toggle feature status:', channelId);
  };

  const renderChannelList = (channelList) => {
    return channelList.map((channel) => (
      <div key={channel.id} className="bg-surface p-4 rounded-lg mb-4 border border-base-300">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-100">{channel.name}</h3>
              {channel.featured && (
                <StarIcon className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <p className="text-gray-400">{channel.username}</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-400">Category: {channel.category}</p>
              <p className="text-sm text-gray-400">Subscribers: {channel.subscribers.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {channel.status === 'pending' && (
              <>
                <button
                  onClick={() => handleApprove(channel.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(channel.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </>
            )}
            {channel.status === 'approved' && (
              <button
                onClick={() => handleToggleFeature(channel.id)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  channel.featured 
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {channel.featured ? 'Unfeature' : 'Feature'}
              </button>
            )}
            <button
              onClick={() => handleEdit(channel.id)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    ));
  };

  const stats = [
    {
      label: 'Total Channels',
      value: Object.values(channels).flat().length,
      icon: <ChartBarIcon className="w-5 h-5 text-primary" />,
    },
    {
      label: 'Featured Channels',
      value: channels.featured.length,
      icon: <StarIcon className="w-5 h-5 text-primary" />,
    },
    {
      label: 'Pending Review',
      value: channels.pending.length,
      icon: <ClockIcon className="w-5 h-5 text-primary" />,
    },
    {
      label: 'Total Users',
      value: '1.2k',
      icon: <UsersIcon className="w-5 h-5 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <div className="px-4 py-6 md:py-8">
        {/* Dashboard Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-100">Admin Dashboard</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -2 }}
                className="bg-surface border border-base-300 rounded-lg p-3 md:p-4 card-hover"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-400">{stat.label}</p>
                    <p className="text-lg md:text-xl font-semibold text-gray-100">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-surface border border-base-300 rounded-lg">
          {/* Tabs */}
          <div className="border-b border-base-300 overflow-x-auto">
            <div className="flex whitespace-nowrap px-4 md:px-6">
              <button
                className={`py-3 md:py-4 px-3 md:px-4 border-b-2 transition-colors text-sm md:text-base ${
                  activeTab === 'pending'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('pending')}
              >
                Pending ({channels.pending.length})
              </button>
              <button
                className={`py-3 md:py-4 px-3 md:px-4 border-b-2 transition-colors text-sm md:text-base ${
                  activeTab === 'approved'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('approved')}
              >
                Approved ({channels.approved.length})
              </button>
              <button
                className={`py-3 md:py-4 px-3 md:px-4 border-b-2 transition-colors text-sm md:text-base ${
                  activeTab === 'featured'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('featured')}
              >
                Featured ({channels.featured.length})
              </button>
              <button
                className={`py-3 md:py-4 px-3 md:px-4 border-b-2 transition-colors text-sm md:text-base ${
                  activeTab === 'rejected'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('rejected')}
              >
                Rejected ({channels.rejected.length})
              </button>
            </div>
          </div>

          {/* Channel List */}
          <div className="p-4 md:p-6">
            <div className="space-y-4">
              {renderChannelList(channels[activeTab])}
            </div>
          </div>
        </div>
      </div>

      {/* Add the modal */}
      <ChannelEditModal
        channel={editingChannel}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingChannel(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

const ChannelListItem = ({ channel, isActive, onToggleActions, onCloseActions }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative bg-base-200 rounded-lg p-3 md:p-4 border border-base-300 hover:border-primary/50 transition-colors"
  >
    <div className="flex items-center gap-3 md:gap-4">
      <img
        src={channel.image}
        alt={channel.name}
        className="w-10 h-10 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm md:text-base text-gray-100 truncate">{channel.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">
            Submitted {channel.submittedAt}
          </span>
          {channel.status && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              channel.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
              channel.status === 'approved' ? 'bg-green-500/10 text-green-400' :
              'bg-red-500/10 text-red-400'
            }`}>
              {channel.status}
            </span>
          )}
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center space-x-2">
        <ActionButton icon={<CheckCircleIcon className="w-5 h-5" />} label="Approve" color="text-green-400" />
        <ActionButton icon={<XCircleIcon className="w-5 h-5" />} label="Reject" color="text-red-400" />
        <ActionButton icon={<PencilIcon className="w-5 h-5" />} label="Edit" color="text-primary" />
        <ActionButton icon={<StarIcon className="w-5 h-5" />} label="Feature" color="text-yellow-400" />
      </div>

      {/* Mobile Actions Toggle */}
      <button
        onClick={onToggleActions}
        className="md:hidden p-2 hover:bg-base-300 rounded-lg"
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>

      {/* Mobile Actions Menu */}
      {isActive && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onCloseActions}
          />
          <div className="absolute right-0 top-full mt-2 bg-surface border border-base-300 rounded-lg shadow-lg py-2 z-50">
            <MobileActionButton
              icon={<CheckCircleIcon className="w-5 h-5" />}
              label="Approve"
              color="text-green-400"
            />
            <MobileActionButton
              icon={<XCircleIcon className="w-5 h-5" />}
              label="Reject"
              color="text-red-400"
            />
            <MobileActionButton
              icon={<PencilIcon className="w-5 h-5" />}
              label="Edit"
              color="text-primary"
            />
            <MobileActionButton
              icon={<StarIcon className="w-5 h-5" />}
              label="Feature"
              color="text-yellow-400"
            />
          </div>
        </>
      )}
    </div>
  </motion.div>
);

const ActionButton = ({ icon, label, color }) => (
  <button
    className={`p-2 rounded-lg hover:bg-base-300 ${color} tooltip`}
    data-tip={label}
  >
    {icon}
  </button>
);

const MobileActionButton = ({ icon, label, color }) => (
  <button
    className={`w-full px-4 py-2 flex items-center space-x-3 hover:bg-base-300 ${color}`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

const tabs = [
  { label: 'Pending Review', value: 'pending', count: '23' },
  { label: 'Approved', value: 'approved', count: '156' },
  { label: 'Featured', value: 'featured', count: '12' },
  { label: 'Rejected', value: 'rejected', count: '45' },
];

const channels = [
  {
    id: 1,
    name: 'Tech News Daily',
    category: 'Technology',
    submittedAt: '2 hours ago',
    image: 'https://via.placeholder.com/48',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Crypto Alerts',
    category: 'Cryptocurrency',
    submittedAt: '5 hours ago',
    image: 'https://via.placeholder.com/48',
    status: 'approved',
  },
  {
    id: 3,
    name: 'Gaming Updates',
    category: 'Gaming',
    submittedAt: '1 day ago',
    image: 'https://via.placeholder.com/48',
    status: 'rejected',
  },
];

export default AdminDashboard; 