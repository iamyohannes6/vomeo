import { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchChannels, 
  storeChannel, 
  updateChannelStatus, 
  toggleChannelFeature 
} from '../../services/channelService';

const ChannelsContext = createContext();

export const ChannelsProvider = ({ children }) => {
  const [channels, setChannels] = useState({
    pending: [],
    approved: [],
    featured: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load channels on mount
  useEffect(() => {
    loadChannels();
  }, []);

  // Load all channels
  const loadChannels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchChannels();
      setChannels(data);
    } catch (err) {
      console.error('Error loading channels:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      setLoading(true);
      setError(null);
      await updateChannelStatus(channelId, 'approved');
      await loadChannels(); // Reload all channels
    } catch (err) {
      console.error('Error approving channel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reject a channel
  const rejectChannel = async (channelId) => {
    try {
      setLoading(true);
      setError(null);
      await updateChannelStatus(channelId, 'rejected');
      await loadChannels(); // Reload all channels
    } catch (err) {
      console.error('Error rejecting channel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle featured status
  const toggleFeature = async (channelId) => {
    try {
      setLoading(true);
      setError(null);
      await toggleChannelFeature(channelId);
      await loadChannels(); // Reload all channels
    } catch (err) {
      console.error('Error toggling feature:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    channels,
    loading,
    error,
    submitChannel,
    approveChannel,
    rejectChannel,
    toggleFeature,
    refreshChannels: loadChannels
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