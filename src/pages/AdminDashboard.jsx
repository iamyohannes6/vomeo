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
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-100">{channel.name}</h3>
              {channel.featured && (
                <StarIcon className="w-5 h-5 text-yellow-500" title="Featured Channel" />
              )}
              {channel.verified && (
                <ShieldCheckIcon className="w-5 h-5 text-blue-500" title="Verified Channel" />
              )}
            </div>
            <p className="text-gray-400">@{channel.username}</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-400">Category: {channel.category}</p>
              <p className="text-sm text-gray-400">Submitted by: {channel.submittedBy}</p>
              <p className="text-sm text-gray-400">Submitted at: {new Date(channel.submittedAt?.toDate()).toLocaleString()}</p>
              {channel.description && (
                <p className="text-sm text-gray-400 mt-2">{channel.description}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            {channel.status === 'pending' && (
              <div className="flex space-x-2">
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
              </div>
            )}
            {channel.status === 'approved' && (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleToggleFeature(channel.id)}
                  className={`px-3 py-1 rounded-md transition-colors flex items-center justify-center space-x-1 ${
                    channel.featured 
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  <StarIcon className="w-4 h-4" />
                  <span>{channel.featured ? 'Unfeature' : 'Feature'}</span>
                </button>
                <button
                  onClick={() => handleToggleVerified(channel.id)}
                  className={`px-3 py-1 rounded-md transition-colors flex items-center justify-center space-x-1 ${
                    channel.verified 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span>{channel.verified ? 'Unverify' : 'Verify'}</span>
                </button>
              </div>
            )}
            <button
              onClick={() => handleEdit(channel.id)}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
            >
              <PencilIcon className="w-4 h-4" />
              <span>Edit</span>
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