import { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchChannels, 
  storeChannel, 
  updateChannelStatus, 
  toggleChannelFeature,
  toggleChannelVerified,
  removeChannel,
  updatePromoContent,
  getPromo
} from '../services/channelService';
import { getChannelInfo } from '../utils/telegramApi';

const ChannelsContext = createContext();

export const ChannelsProvider = ({ children }) => {
  const [channels, setChannels] = useState({
    pending: [],
    approved: [],
    featured: [],
    rejected: []
  });
  const [promo, setPromo] = useState(null);
  const [secondaryPromo, setSecondaryPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch channels and promos
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [channelsData, promoData, secondaryPromoData] = await Promise.all([
        fetchChannels(),
        getPromo(false),
        getPromo(true)
      ]);
      
      setChannels(channelsData);
      setPromo(promoData);
      setSecondaryPromo(secondaryPromoData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Submit a new channel
  const submitChannel = async (channelData, submitter) => {
    try {
      setLoading(true);
      await storeChannel(channelData, submitter);
      await loadData(); // Refresh all data
      return true;
    } catch (err) {
      console.error('Error submitting channel:', err);
      throw new Error(err.message || 'Failed to submit channel');
    } finally {
      setLoading(false);
    }
  };

  // Approve a channel
  const approveChannel = async (channelId) => {
    try {
      setLoading(true);
      await updateChannelStatus(channelId, 'approved');
      await loadData();
    } catch (err) {
      console.error('Error approving channel:', err);
      setError('Failed to approve channel');
    } finally {
      setLoading(false);
    }
  };

  // Reject a channel
  const rejectChannel = async (channelId) => {
    try {
      setLoading(true);
      await updateChannelStatus(channelId, 'rejected');
      await loadData();
    } catch (err) {
      console.error('Error rejecting channel:', err);
      setError('Failed to reject channel');
    } finally {
      setLoading(false);
    }
  };

  // Toggle featured status
  const toggleFeature = async (channelId) => {
    try {
      setLoading(true);
      await toggleChannelFeature(channelId);
      await loadData();
    } catch (err) {
      console.error('Error toggling feature status:', err);
      setError('Failed to update feature status');
    } finally {
      setLoading(false);
    }
  };

  // Toggle verified status
  const toggleVerified = async (channelId) => {
    try {
      setLoading(true);
      await toggleChannelVerified(channelId);
      await loadData();
    } catch (err) {
      console.error('Error toggling verified status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove channel
  const handleRemoveChannel = async (channelId) => {
    try {
      setLoading(true);
      await removeChannel(channelId);
      await loadData();
    } catch (err) {
      console.error('Error removing channel:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update promo content
  const handleUpdatePromo = async (promoData, isSecondary = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedPromo = await updatePromoContent(promoData, isSecondary);
      
      // Update the correct promo state
      if (isSecondary) {
        setSecondaryPromo(updatedPromo);
      } else {
        setPromo(updatedPromo);
      }
      
      // Reload all data to ensure consistency
      await loadData();
    } catch (err) {
      console.error('Error updating promo:', err);
      setError('Failed to update promotional content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    channels,
    promo,
    secondaryPromo,
    loading,
    error,
    submitChannel,
    approveChannel,
    rejectChannel,
    toggleFeature,
    toggleVerified,
    removeChannel: handleRemoveChannel,
    updatePromoContent: handleUpdatePromo,
    loadData
  };

  return (
    <ChannelsContext.Provider value={value}>
      {children}
    </ChannelsContext.Provider>
  );
};

export const useChannels = () => {
  const context = useContext(ChannelsContext);
  if (!context) {
    throw new Error('useChannels must be used within a ChannelsProvider');
  }
  return context;
};

export default ChannelsContext; 