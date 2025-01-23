import { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchChannels, 
  storeChannel, 
  updateChannelStatus, 
  toggleChannelFeature,
  toggleChannelVerified,
  getPromo,
  getSecondaryPromo,
  updatePromo,
  updateSecondaryPromo
} from '../services/channelService';

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
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [channelsData, promoData, secondaryPromoData] = await Promise.all([
          fetchChannels(),
          getPromo(),
          getSecondaryPromo()
        ]);
        
        setChannels(channelsData);
        setPromo(promoData);
        setSecondaryPromo(secondaryPromoData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Submit a new channel
  const submitChannel = async (channelData) => {
    try {
      setLoading(true);
      await storeChannel({
        ...channelData,
        status: 'pending',
        featured: false,
        verified: false,
        submittedAt: new Date(),
        updatedAt: new Date()
      });
      await loadChannels(); // Refresh the channels list
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
      await loadChannels();
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
      await loadChannels();
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
      await loadChannels();
    } catch (err) {
      console.error('Error toggling feature status:', err);
      setError('Failed to update feature status');
    } finally {
      setLoading(false);
    }
  };

  const toggleVerified = async (channelId) => {
    try {
      await toggleChannelVerified(channelId);
      const updatedChannels = await fetchChannels();
      setChannels(updatedChannels);
    } catch (err) {
      console.error('Error toggling verified status:', err);
      throw err;
    }
  };

  const updatePromoContent = async (promoData, isSecondary = false) => {
    try {
      if (isSecondary) {
        const updatedPromo = await updateSecondaryPromo(promoData);
        setSecondaryPromo(updatedPromo);
        return updatedPromo;
      } else {
        const updatedPromo = await updatePromo(promoData);
        setPromo(updatedPromo);
        return updatedPromo;
      }
    } catch (err) {
      console.error('Error updating promo:', err);
      throw err;
    }
  };

  const loadChannels = async () => {
    try {
      setLoading(true);
      const data = await fetchChannels();
      setChannels(data);
    } catch (err) {
      console.error('Error loading channels:', err);
      setError('Failed to load channels');
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
    updatePromoContent,
    loadChannels
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