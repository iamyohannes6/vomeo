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
      setError(null);
      const savedChannel = await storeChannel(channelData);
      setChannels(prev => ({
        ...prev,
        pending: [...prev.pending, savedChannel]
      }));
      return savedChannel;
    } catch (err) {
      console.error('Error submitting channel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Approve a channel
  const approveChannel = async (channelId) => {
    try {
      await updateChannelStatus(channelId, 'approved');
      const updatedChannels = await fetchChannels();
      setChannels(updatedChannels);
    } catch (err) {
      console.error('Error approving channel:', err);
      throw err;
    }
  };

  // Reject a channel
  const rejectChannel = async (channelId) => {
    try {
      await updateChannelStatus(channelId, 'rejected');
      const updatedChannels = await fetchChannels();
      setChannels(updatedChannels);
    } catch (err) {
      console.error('Error rejecting channel:', err);
      throw err;
    }
  };

  // Toggle featured status
  const toggleFeature = async (channelId) => {
    try {
      await toggleChannelFeature(channelId);
      const updatedChannels = await fetchChannels();
      setChannels(updatedChannels);
    } catch (err) {
      console.error('Error toggling feature:', err);
      throw err;
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
    updatePromoContent
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