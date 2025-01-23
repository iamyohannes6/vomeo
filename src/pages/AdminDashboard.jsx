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
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useChannels } from '../contexts/ChannelsContext';
import ChannelEditModal from '../components/ChannelEditModal';
import PromoEditor from '../components/PromoEditor';
import { getChannelInfo } from '../utils/telegramApi';

const ChannelCard = ({ channel, onApprove, onReject, onRemove, onToggleFeature, onToggleVerified }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  // Fetch latest channel stats when card is rendered
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const info = await getChannelInfo(channel.username);
        if (info) {
          setStats(info);
        }
      } catch (err) {
        console.error('Error fetching channel stats:', err);
      }
    };
    fetchStats();
  }, [channel.username]);

  return (
    <div className="bg-base-200 rounded-lg p-3 space-y-2">
      <div className="flex items-center space-x-3">
        {/* Channel Image */}
        {(channel.photo_url || stats?.photo_url) ? (
          <img 
            src={channel.photo_url || stats?.photo_url} 
            alt={channel.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-xl text-primary">
              {channel.title?.[0] || '@'}
            </span>
          </div>
        )}

        {/* Channel Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white truncate">
              {channel.title || `@${channel.username}`}
            </h3>
            {channel.verified && (
              <ShieldCheckIcon className="h-4 w-4 text-blue-500" />
            )}
            {channel.featured && (
              <StarIcon className="h-4 w-4 text-yellow-500" />
            )}
          </div>
          <p className="text-xs text-gray-400">@{channel.username}</p>
          <p className="text-xs text-gray-400">
            {stats?.member_count?.toLocaleString() || channel.member_count?.toLocaleString() || 0} members
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {channel.status === 'pending' ? (
            <>
              <button
                onClick={onApprove}
                disabled={loading}
                className="p-1 text-green-500 hover:bg-base-300 rounded-lg"
                title="Approve"
              >
                <CheckCircleIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onReject}
                disabled={loading}
                className="p-1 text-red-500 hover:bg-base-300 rounded-lg"
                title="Reject"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onToggleFeature}
                disabled={loading}
                className={`p-1 hover:bg-base-300 rounded-lg ${channel.featured ? 'text-yellow-500' : 'text-gray-400'}`}
                title={channel.featured ? 'Remove from featured' : 'Add to featured'}
              >
                <StarIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onToggleVerified}
                disabled={loading}
                className={`p-1 hover:bg-base-300 rounded-lg ${channel.verified ? 'text-blue-500' : 'text-gray-400'}`}
                title={channel.verified ? 'Remove verification' : 'Verify channel'}
              >
                <ShieldCheckIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onRemove}
                disabled={loading}
                className="p-1 text-red-500 hover:bg-base-300 rounded-lg"
                title="Remove channel"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Channel Details */}
      <div className="text-xs text-gray-400 space-y-1">
        <p>{channel.description}</p>
        <p>
          Category: {channel.category} • 
          Submitted by: {channel.submittedBy?.username || 'Anonymous'} • 
          {new Date(channel.submittedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const { 
    channels, 
    promo,
    secondaryPromo,
    loading, 
    error, 
    approveChannel, 
    rejectChannel, 
    toggleFeature,
    toggleVerified,
    updatePromoContent,
    removeChannel
  } = useChannels();
  const [activeTab, setActiveTab] = useState('pending');
  const [editingChannel, setEditingChannel] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

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

  const handleRemove = async (channelId) => {
    if (window.confirm('Are you sure you want to remove this channel?')) {
      try {
        await removeChannel(channelId);
      } catch (err) {
        console.error('Error removing channel:', err);
      }
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

  const handleToggleVerified = async (channelId) => {
    try {
      await toggleVerified(channelId);
    } catch (err) {
      console.error('Error toggling verified status:', err);
    }
  };

  const handleSavePromo = async (promoData, isSecondary = false) => {
    try {
      setSaveStatus(isSecondary ? 'saving-secondary' : 'saving');
      await updatePromoContent(promoData, isSecondary);
      setSaveStatus(isSecondary ? 'saved-secondary' : 'saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      console.error('Error saving promo:', err);
      setSaveStatus(isSecondary ? 'error-secondary' : 'error');
      setTimeout(() => setSaveStatus(''), 3000);
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
      <ChannelCard
        key={channel.id}
        channel={channel}
        onApprove={() => handleApprove(channel.id)}
        onReject={() => handleReject(channel.id)}
        onRemove={() => handleRemove(channel.id)}
        onToggleFeature={() => handleToggleFeature(channel.id)}
        onToggleVerified={() => handleToggleVerified(channel.id)}
      />
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
              <button
                className={`py-3 md:py-4 px-3 md:px-4 border-b-2 transition-colors text-sm md:text-base ${
                  activeTab === 'promo'
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('promo')}
              >
                Promotional
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            {activeTab === 'promo' ? (
              <div className="space-y-8">
                {/* Hero Promo Editor */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Hero Promotional Content</h3>
                  <PromoEditor 
                    currentPromo={promo} 
                    onSave={(data) => handleSavePromo(data, false)} 
                  />
                  {saveStatus.includes('saving') && !saveStatus.includes('secondary') && (
                    <div className={`mt-4 p-3 rounded-lg text-center ${
                      saveStatus === 'saving' ? 'bg-primary/10 text-primary' :
                      saveStatus === 'saved' ? 'bg-green-500/10 text-green-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {saveStatus === 'saving' ? 'Saving changes...' :
                       saveStatus === 'saved' ? 'Changes saved successfully!' :
                       'Error saving changes'}
                    </div>
                  )}
                </div>

                {/* Secondary Promo Editor */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Secondary Promotional Content</h3>
                  <PromoEditor 
                    currentPromo={secondaryPromo} 
                    onSave={(data) => handleSavePromo(data, true)}
                  />
                  {saveStatus.includes('secondary') && (
                    <div className={`mt-4 p-3 rounded-lg text-center ${
                      saveStatus === 'saving-secondary' ? 'bg-primary/10 text-primary' :
                      saveStatus === 'saved-secondary' ? 'bg-green-500/10 text-green-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {saveStatus === 'saving-secondary' ? 'Saving changes...' :
                       saveStatus === 'saved-secondary' ? 'Changes saved successfully!' :
                       'Error saving changes'}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              renderChannelList(channels[activeTab])
            )}
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