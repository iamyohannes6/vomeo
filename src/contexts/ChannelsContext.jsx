import { createContext, useContext, useState, useEffect } from 'react';
import { initializeBot, getChannelMessages } from '../utils/telegramBot';

const STORAGE_CHANNEL_ID = '-1002430549957';

const ChannelsContext = createContext();

export const ChannelsProvider = ({ children }) => {
  const [channels, setChannels] = useState({
    pending: [],
    approved: [],
    featured: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize bot and get messages
      const messages = await initializeBot();
      console.log('Fetched messages:', messages);

      if (!messages || !Array.isArray(messages)) {
        console.warn('No messages received');
        setChannels({ pending: [], approved: [], featured: [] });
        return;
      }

      const parsedChannels = messages.reduce((acc, msg) => {
        try {
          // Try to parse channel data from message text
          const channelData = JSON.parse(msg.text);
          
          // Add message ID and date
          channelData.messageId = msg.message_id;
          channelData.submittedAt = msg.date;

          // Sort into appropriate category
          if (channelData.status === 'pending') {
            acc.pending.push(channelData);
          } else if (channelData.status === 'approved') {
            if (channelData.featured) {
              acc.featured.push(channelData);
            }
            acc.approved.push(channelData);
          }
        } catch (err) {
          console.warn('Failed to parse message:', msg);
        }
        return acc;
      }, { pending: [], approved: [], featured: [] });

      console.log('Parsed channels:', parsedChannels);
      setChannels(parsedChannels);
    } catch (err) {
      console.error('Error fetching channels:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const value = {
    channels,
    loading,
    error,
    refreshChannels: fetchChannels
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