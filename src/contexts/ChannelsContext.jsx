import { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchChannels, 
  storeChannel, 
  updateChannelStatus, 
  toggleChannelFeature 
} from '../utils/telegramBot';

const ChannelsContext = createContext(null);

export const ChannelsProvider = ({ children }) => {
  const [channels, setChannels] = useState({
    pending: [],
    approved: [],
    featured: [],
    rejected: []
  });

  // Fetch channels from Telegram storage on mount
  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const data = await fetchChannels();
      
      // Transform the data into our state structure
      const transformed = {
        pending: data.filter(c => c.status === 'pending'),
        approved: data.filter(c => c.status === 'approved'),
        featured: data.filter(c => c.status === 'approved' && c.featured),
        rejected: data.filter(c => c.status === 'rejected')
      };
      
      setChannels(transformed);
    } catch (err) {
      console.error('Error fetching channels:', err);
    }
  };

  const submitChannel = async (channelData) => {
    try {
      const savedChannel = await storeChannel(channelData);
      setChannels(prev => ({
        ...prev,
        pending: [...prev.pending, savedChannel]
      }));
      return savedChannel;
    } catch (err) {
      console.error('Error submitting channel:', err);
      throw err;
    }
  };

  const approveChannel = async (channelId) => {
    try {
      const updatedChannel = await updateChannelStatus(channelId, 'approved');
      setChannels(prev => ({
        ...prev,
        pending: prev.pending.filter(c => c.id !== channelId),
        rejected: prev.rejected.filter(c => c.id !== channelId),
        approved: [...prev.approved, updatedChannel]
      }));
    } catch (err) {
      console.error('Error approving channel:', err);
      throw err;
    }
  };

  const rejectChannel = async (channelId) => {
    try {
      const updatedChannel = await updateChannelStatus(channelId, 'rejected');
      setChannels(prev => ({
        ...prev,
        pending: prev.pending.filter(c => c.id !== channelId),
        approved: prev.approved.filter(c => c.id !== channelId),
        rejected: [...prev.rejected, updatedChannel]
      }));
    } catch (err) {
      console.error('Error rejecting channel:', err);
      throw err;
    }
  };

  const toggleFeature = async (channelId) => {
    try {
      const updatedChannel = await toggleChannelFeature(channelId);
      setChannels(prev => ({
        ...prev,
        approved: prev.approved.map(c => c.id === channelId ? updatedChannel : c),
        featured: updatedChannel.featured
          ? [...prev.featured, updatedChannel]
          : prev.featured.filter(c => c.id !== channelId)
      }));
    } catch (err) {
      console.error('Error toggling feature:', err);
      throw err;
    }
  };

  const value = {
    channels,
    submitChannel,
    approveChannel,
    rejectChannel,
    toggleFeature,
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