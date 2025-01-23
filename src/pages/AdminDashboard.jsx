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
import PromoEditor from '../components/PromoEditor';

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
    updatePromoContent
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
      <div key={channel.id} className="bg-surface p-4 rounded-lg mb-4 border border-base-300">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            {/* Channel Photo */}
            <div className="flex-shrink-0">
              {channel.photoUrl ? (
                <img
                  src={channel.photoUrl}
                  alt={channel.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-base-300 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400">
                    {channel.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">{channel.name}</h3>
              <p className="text-sm text-gray-400">@{channel.username}</p>
              
              {/* Submitter Info */}
              <div className="mt-2 text-sm text-gray-400">
                <p>Submitted by: {channel.submittedBy?.username || 'Anonymous'}</p>
                <p>Submitted: {channel.submittedAt?.toDate().toLocaleDateString()}</p>
              </div>
              
              {/* Channel Statistics */}
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-400">
                  <span className="font-medium text-primary">{channel.statistics?.memberCount?.toLocaleString()}</span> members
                </p>
                {channel.statistics?.messageCount && (
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-primary">{channel.statistics.messageCount.toLocaleString()}</span> messages
                  </p>
                )}
                {channel.statistics?.lastMessageDate && (
                  <p className="text-sm text-gray-400">
                    Last active: {new Date(channel.statistics.lastMessageDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {channel.status === 'pending' && (
              <>
                <button
                  onClick={() => handleApprove(channel.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(channel.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </>
            )}
            {channel.status === 'approved' && (
              <button
                onClick={() => handleToggleFeature(channel.id)}
                className={`px-3 py-1 rounded ${
                  channel.featured
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                } text-white`}
              >
                {channel.featured ? 'Unfeature' : 'Feature'}
              </button>
            )}
          </div>
        </div>

        <p className="text-gray-300 mb-3">{channel.description}</p>
        
        <div className="flex gap-2 text-sm">
          <span className={`px-2 py-1 rounded ${
            channel.status === 'approved' ? 'bg-green-600/20 text-green-400' :
            channel.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
            'bg-red-600/20 text-red-400'
          }`}>
            {channel.status.charAt(0).toUpperCase() + channel.status.slice(1)}
          </span>
          {channel.featured && (
            <span className="px-2 py-1 rounded bg-primary/20 text-primary">
              Featured
            </span>
          )}
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