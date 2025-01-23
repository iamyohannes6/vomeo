const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const STORAGE_CHANNEL_ID = import.meta.env.VITE_TELEGRAM_STORAGE_CHANNEL || '@vomeo_storage';

// Helper to make bot API calls
const callBotApi = async (method, params = {}) => {
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
  if (!message.text?.startsWith('#channel_submission')) return null;
  
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
  const message = formatChannelMessage(channelData);
  await callBotApi('sendMessage', {
    chat_id: STORAGE_CHANNEL_ID,
    text: message
  });
  return channelData;
};

// Update a channel's status
export const updateChannelStatus = async (channelId, status) => {
  // Get channel messages
  const messages = await callBotApi('getUpdates', {
    allowed_updates: ['message'],
    offset: -100 // Get last 100 messages
  });
  
  // Find the message with our channel
  const targetMessage = messages.find(update => {
    const channel = parseChannelMessage(update.message);
    return channel?.id === channelId;
  });
  
  if (!targetMessage) throw new Error('Channel not found');
  
  // Update the message
  const channel = parseChannelMessage(targetMessage.message);
  channel.status = status;
  
  await callBotApi('editMessageText', {
    chat_id: STORAGE_CHANNEL_ID,
    message_id: targetMessage.message.message_id,
    text: formatChannelMessage(channel)
  });
  
  return channel;
};

// Fetch all channels
export const fetchChannels = async () => {
  const messages = await callBotApi('getUpdates', {
    allowed_updates: ['message'],
    offset: -100 // Get last 100 messages
  });
  
  return messages
    .map(update => parseChannelMessage(update.message))
    .filter(Boolean);
};

// Toggle channel feature status
export const toggleChannelFeature = async (channelId) => {
  // Similar to updateChannelStatus but toggles the featured flag
  const messages = await callBotApi('getUpdates', {
    allowed_updates: ['message'],
    offset: -100
  });
  
  const targetMessage = messages.find(update => {
    const channel = parseChannelMessage(update.message);
    return channel?.id === channelId;
  });
  
  if (!targetMessage) throw new Error('Channel not found');
  
  const channel = parseChannelMessage(targetMessage.message);
  channel.featured = !channel.featured;
  
  await callBotApi('editMessageText', {
    chat_id: STORAGE_CHANNEL_ID,
    message_id: targetMessage.message.message_id,
    text: formatChannelMessage(channel)
  });
  
  return channel;
}; 