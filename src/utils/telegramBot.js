const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const STORAGE_CHANNEL_ID = "-1002430549957"; // Use the numeric ID directly

if (!BOT_TOKEN) {
  console.error('Missing required environment variables');
}

// Helper to make bot API calls
const callBotApi = async (method, params = {}) => {
  if (!BOT_TOKEN) {
    throw new Error('Bot token not configured');
  }

  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
  
  const data = await response.json();
  if (!data.ok) throw new Error(data.description || 'Telegram API error');
  return data.result;
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

// Store a channel submission
export const storeChannel = async (channelData) => {
  try {
    const message = formatChannelMessage(channelData);
    const result = await callBotApi('sendMessage', {
      chat_id: STORAGE_CHANNEL_ID,
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
export const getChannelMessages = async (channelId) => {
  try {
    // First verify we have access to the channel
    const chatInfo = await callBotApi('getChat', {
      chat_id: channelId
    });
    console.log('Chat info:', chatInfo);

    // Get message history from channel
    const messages = await callBotApi('getHistory', {
      chat_id: channelId,
      limit: 100 // Get last 100 messages
    });
    console.log('Raw messages:', messages);

    if (!messages || !Array.isArray(messages)) {
      console.warn('No messages received or invalid response');
      return [];
    }

    console.log('Channel messages:', messages);
    return messages;
  } catch (err) {
    console.error('Error getting channel messages:', err);
    console.error('Error details:', err.message);
    return [];
  }
};

// Fetch all channels
export const fetchChannels = async () => {
  try {
    const messages = await getChannelMessages(STORAGE_CHANNEL_ID);
    console.log('Got messages:', messages);

    const channels = messages
      .map(msg => parseChannelMessage(msg))
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
      chat_id: STORAGE_CHANNEL_ID,
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
      chat_id: STORAGE_CHANNEL_ID,
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