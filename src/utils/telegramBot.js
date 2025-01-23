const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const STORAGE_CHANNEL = import.meta.env.VITE_TELEGRAM_STORAGE_CHANNEL || "@vomeo_storage";

if (!BOT_TOKEN || !STORAGE_CHANNEL) {
  console.error('Missing required environment variables');
}

// Helper to make bot API calls
const callBotApi = async (method, params = {}) => {
  if (!BOT_TOKEN) {
    throw new Error('Bot token not configured');
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    });
    
    const data = await response.json();
    console.log(`API ${method} response:`, data);

    if (!data.ok) {
      console.error(`Telegram API error in ${method}:`, data);
      throw new Error(data.description || 'Telegram API error');
    }

    return data.result;
  } catch (err) {
    console.error(`Error calling ${method}:`, err);
    throw err;
  }
};

// Format channel data as a message
const formatChannelMessage = (channel) => {
  return `#channel_submission
ID: ${channel.id}
Name: ${channel.name}
Username: ${channel.username}
Category: ${channel.category}
Status: ${channel.status}
Submitted By: ${channel.submittedBy}
Submitted At: ${channel.submittedAt}
Featured: ${channel.featured}
Verified: ${channel.verified}
Description: ${channel.description}`;
};

// Parse channel data from message
const parseChannelMessage = (message) => {
  if (!message?.text?.startsWith('#channel_submission')) return null;
  
  const lines = message.text.split('\n');
  const data = {};
  
  lines.forEach(line => {
    const [key, ...values] = line.split(': ');
    if (values.length) {
      const value = values.join(': ').trim();
      data[key.toLowerCase()] = value === 'true' ? true : 
                               value === 'false' ? false : 
                               value;
    }
  });
  
  return {
    id: data.id,
    name: data.name,
    username: data.username,
    category: data.category,
    status: data.status || 'pending',
    submittedBy: data.submitted_by,
    submittedAt: data.submitted_at,
    featured: Boolean(data.featured),
    verified: Boolean(data.verified),
    description: data.description
  };
};

// Get channel ID from username or ID
const resolveChannelId = async (channelIdentifier) => {
  try {
    // If it's already a numeric ID, return it
    if (channelIdentifier.startsWith('-100')) {
      return channelIdentifier;
    }

    // Otherwise, get the chat info to resolve the ID
    const chatInfo = await callBotApi('getChat', {
      chat_id: channelIdentifier
    });
    console.log('Resolved chat info:', chatInfo);
    return chatInfo.id.toString();
  } catch (err) {
    console.error('Error resolving channel ID:', err);
    throw err;
  }
};

// Store a channel submission
export const storeChannel = async (channelData) => {
  try {
    const channelId = await resolveChannelId(STORAGE_CHANNEL);
    const message = formatChannelMessage(channelData);
    const result = await callBotApi('sendMessage', {
      chat_id: channelId,
      text: message
    });
    console.log('Stored channel:', result);
    return channelData;
  } catch (err) {
    console.error('Error storing channel:', err);
    throw err;
  }
};

// Get messages from channel
export const getChannelMessages = async (channelIdentifier) => {
  try {
    // First get chat info
    const chatInfo = await callBotApi('getChat', {
      chat_id: channelIdentifier
    });
    console.log('Chat info:', chatInfo);

    // Get the most recent message in the channel
    const recentMessage = await callBotApi('sendMessage', {
      chat_id: chatInfo.id,
      text: '🔄 Syncing messages...'
    });
    console.log('Recent message:', recentMessage);

    // Try to get the last 100 messages before this one
    const messageIds = Array.from(
      { length: 100 }, 
      (_, i) => recentMessage.message_id - (i + 1)
    ).filter(id => id > 0);

    // Get messages in batches of 10
    const messages = [];
    for (let i = 0; i < messageIds.length; i += 10) {
      const batch = messageIds.slice(i, i + 10);
      try {
        const result = await callBotApi('getMessages', {
          chat_id: chatInfo.id,
          message_ids: batch
        });
        if (Array.isArray(result)) {
          messages.push(...result);
        }
      } catch (err) {
        console.warn('Error getting batch:', batch, err);
      }
    }

    // Delete our sync message
    await callBotApi('deleteMessage', {
      chat_id: chatInfo.id,
      message_id: recentMessage.message_id
    });

    console.log('Retrieved messages:', messages);
    return messages.filter(Boolean);
  } catch (err) {
    console.error('Error getting channel messages:', err);
    console.error('Error details:', err.message);
    return [];
  }
};

// Fetch all channels
export const fetchChannels = async () => {
  try {
    // First delete webhook
    await deleteWebhook();

    // Try to get messages directly from the channel
    const result = await callBotApi('getChat', {
      chat_id: STORAGE_CHANNEL
    });
    console.log('Channel info:', result);

    // Get messages from channel
    const messages = await getChannelMessages(STORAGE_CHANNEL);
    console.log('Got messages:', messages);

    if (!messages || !Array.isArray(messages)) {
      console.warn('No messages received');
      return [];
    }

    // Parse channel data from messages
    const channels = messages
      .filter(msg => {
        if (!msg || !msg.text) {
          console.warn('Invalid message:', msg);
          return false;
        }
        return msg.text.startsWith('#channel_submission');
      })
      .map(msg => {
        try {
          const channel = parseChannelMessage(msg);
          if (!channel) {
            console.warn('Failed to parse message:', msg);
            return null;
          }
          return channel;
        } catch (err) {
          console.warn('Error parsing message:', msg, err);
          return null;
        }
      })
      .filter(Boolean);

    console.log('Parsed channels:', channels);
    return channels;
  } catch (err) {
    console.error('Error fetching channels:', err);
    return [];
  }
};

// Update a channel's status
export const updateChannelStatus = async (channelId, status) => {
  try {
    // Get channel messages
    const messages = await getChannelMessages();
    console.log('Found messages:', messages);
    
    // Find the message with our channel
    const targetMessage = messages.find(msg => {
      const channel = parseChannelMessage(msg);
      return channel?.id === channelId;
    });
    
    if (!targetMessage) throw new Error('Channel not found');
    
    // Update the message
    const channel = parseChannelMessage(targetMessage);
    channel.status = status;
    
    const result = await callBotApi('editMessageText', {
      chat_id: STORAGE_CHANNEL,
      message_id: targetMessage.message_id,
      text: formatChannelMessage(channel)
    });

    console.log('Updated channel status:', result);
    return channel;
  } catch (err) {
    console.error('Error updating channel status:', err);
    throw err;
  }
};

// Toggle channel feature status
export const toggleChannelFeature = async (channelId) => {
  try {
    const messages = await getChannelMessages();
    console.log('Found messages for feature toggle:', messages);
    
    const targetMessage = messages.find(msg => {
      const channel = parseChannelMessage(msg);
      return channel?.id === channelId;
    });
    
    if (!targetMessage) throw new Error('Channel not found');
    
    const channel = parseChannelMessage(targetMessage);
    channel.featured = !channel.featured;
    
    const result = await callBotApi('editMessageText', {
      chat_id: STORAGE_CHANNEL,
      message_id: targetMessage.message_id,
      text: formatChannelMessage(channel)
    });

    console.log('Toggled channel feature:', result);
    return channel;
  } catch (err) {
    console.error('Error toggling channel feature:', err);
    throw err;
  }
};

// First delete the webhook to use getUpdates
export const deleteWebhook = async () => {
  try {
    await callBotApi('deleteWebhook');
    console.log('Webhook deleted successfully');
  } catch (err) {
    console.error('Error deleting webhook:', err);
  }
};

// Initialize: First delete webhook then fetch messages
export const initializeBot = async () => {
  await deleteWebhook();
  return fetchChannels();
}; 