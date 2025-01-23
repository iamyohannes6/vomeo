import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  StarIcon,
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { useChannels } from '../contexts/ChannelsContext';
import ChannelEditModal from '../components/ChannelEditModal';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { channels, loading, error, approveChannel, rejectChannel, toggleFeature, updateChannel } = useChannels();
  const [activeTab, setActiveTab] = useState('pending');
  const [editingChannel, setEditingChannel] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Add logging when channels change
  useEffect(() => {
    console.log('Current channels state:', channels);
  }, [channels]);

  const handleApprove = async (channelId) => {
    try {
      await approveChannel(channelId);
    } catch (err) {
      console.error('Error approving channel:', err);
    }
  };

  const handleReject = async (channelId) => {
    try {
      await rejectChannel(channelId);
    } catch (err) {
      console.error('Error rejecting channel:', err);
    }
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

  const handleSaveEdit = async (updatedChannel) => {
    try {
      await updateChannel(updatedChannel.id, updatedChannel);
      setIsEditModalOpen(false);
      setEditingChannel(null);
    } catch (err) {
      console.error('Error updating channel:', err);
    }
  };

  const handleToggleFeature = async (channelId) => {
    try {
      await toggleFeature(channelId);
    } catch (err) {
      console.error('Error toggling feature:', err);
    }
  };

  const renderChannelList = (channelList) => {
    if (loading) {
      return <div className="text-center py-8 text-gray-400">Loading channels...</div>;
    }

    if (error) {
      return <div className="text-center py-8 text-red-400">Error: {error}</div>;
    }

    if (!channelList?.length) {
      return <div className="text-center py-8 text-gray-400">No channels found</div>;
    }

    return channelList.map((channel) => (
      <div key={channel.id} className="bg-surface p-4 rounded-lg mb-4 border border-base-300">
        <div className="flex justify-between items-start">
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
            <p className="text-gray-400">@{channel.username}</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-400">Category: {channel.category}</p>
              <p className="text-sm text-gray-400">Submitted by: {channel.submittedBy}</p>
              <p className="text-sm text-gray-400">Submitted at: {new Date(channel.submittedAt).toLocaleString()}</p>
              {channel.description && (
                <p className="text-sm text-gray-400 mt-2">{channel.description}</p>
              )}
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
      value: channels.featured?.length || 0,
      icon: <StarIcon className="w-5 h-5 text-primary" />,
    },
    {
      label: 'Pending Review',
      value: channels.pending?.length || 0,
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
                Pending ({channels.pending?.length || 0})
              </button>
              <button
                className={`py-3 md:py-4 px-3 md:px-4 border-b-2 transition-colors text-sm md:text-base ${
                  activeTab === 'approved'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('approved')}
              >
                Approved ({channels.approved?.length || 0})
              </button>
              <button
                className={`py-3 md:py-4 px-3 md:px-4 border-b-2 transition-colors text-sm md:text-base ${
                  activeTab === 'featured'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('featured')}
              >
                Featured ({channels.featured?.length || 0})
              </button>
              <button
                className={`py-3 md:py-4 px-3 md:px-4 border-b-2 transition-colors text-sm md:text-base ${
                  activeTab === 'rejected'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('rejected')}
              >
                Rejected ({channels.rejected?.length || 0})
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

      {/* Edit Modal */}
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

export default AdminDashboard; 