import { createContext, useContext, useState, useEffect } from 'react';

const ChannelsContext = createContext(null);

export const ChannelsProvider = ({ children }) => {
  const [channels, setChannels] = useState({
    pending: [],
    approved: [],
    featured: [],
    rejected: []
  });

  // Load channels from localStorage on mount
  useEffect(() => {
    const savedChannels = localStorage.getItem('channels');
    if (savedChannels) {
      setChannels(JSON.parse(savedChannels));
    }
  }, []);

  // Save channels to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('channels', JSON.stringify(channels));
  }, [channels]);

  const submitChannel = (channelData) => {
    setChannels(prev => ({
      ...prev,
      pending: [...prev.pending, channelData]
    }));
  };

  const approveChannel = (channelId) => {
    setChannels(prev => {
      const channel = prev.pending.find(c => c.id === channelId);
      if (!channel) return prev;

      return {
        ...prev,
        pending: prev.pending.filter(c => c.id !== channelId),
        approved: [...prev.approved, { ...channel, status: 'approved' }]
      };
    });
  };

  const rejectChannel = (channelId) => {
    setChannels(prev => {
      const channel = prev.pending.find(c => c.id === channelId);
      if (!channel) return prev;

      return {
        ...prev,
        pending: prev.pending.filter(c => c.id !== channelId),
        rejected: [...prev.rejected, { ...channel, status: 'rejected' }]
      };
    });
  };

  const toggleFeature = (channelId) => {
    setChannels(prev => {
      const channel = prev.approved.find(c => c.id === channelId);
      if (!channel) return prev;

      const updatedChannel = { ...channel, featured: !channel.featured };
      
      return {
        ...prev,
        approved: prev.approved.filter(c => c.id !== channelId),
        featured: channel.featured
          ? prev.featured.filter(c => c.id !== channelId)
          : [...prev.featured, updatedChannel]
      };
    });
  };

  const updateChannel = (channelId, updatedData) => {
    setChannels(prev => {
      const newChannels = { ...prev };
      
      // Find which list contains the channel
      for (const list of Object.keys(newChannels)) {
        const index = newChannels[list].findIndex(c => c.id === channelId);
        if (index !== -1) {
          newChannels[list][index] = { ...newChannels[list][index], ...updatedData };
          break;
        }
      }

      return newChannels;
    });
  };

  const value = {
    channels,
    submitChannel,
    approveChannel,
    rejectChannel,
    toggleFeature,
    updateChannel,
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