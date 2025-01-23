import { TELEGRAM_API_BASE, TELEGRAM_FILE_API_BASE, TELEGRAM_BOT_TOKEN } from '../config/telegram';
import { channelCache } from './cache';

const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const TELEGRAM_FILE_API = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}`;

// Get channel information including photo
export const getChannelInfo = async (username) => {
  try {
    // Check cache first
    const cachedData = channelCache.get(username);
    if (cachedData) {
      console.log(`Using cached data for ${username}`);
      return cachedData;
    }

    // Clean up username (remove @ if present)
    const cleanUsername = username.replace('@', '');
    
    // First get chat info
    const chatResponse = await fetch(`${TELEGRAM_API}/getChat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: `@${cleanUsername}`
      })
    });

    if (!chatResponse.ok) {
      throw new Error('Failed to fetch channel info');
    }

    const chatData = await chatResponse.json();
    
    if (!chatData.ok) {
      throw new Error(chatData.description || 'Failed to fetch channel info');
    }

    const chat = chatData.result;
    let photoUrl = null;

    // Get photo URL if available
    if (chat.photo) {
      const fileResponse = await fetch(`${TELEGRAM_API}/getFile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: chat.photo.big_file_id
        })
      });

      if (fileResponse.ok) {
        const fileData = await fileResponse.json();
        if (fileData.ok) {
          photoUrl = `${TELEGRAM_FILE_API}/${fileData.result.file_path}`;
        }
      }
    }

    // Get channel statistics
    const statsResponse = await fetch(`${TELEGRAM_API}/getChatMemberCount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: `@${cleanUsername}`
      })
    });

    let memberCount = 0;
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      if (statsData.ok) {
        memberCount = statsData.result;
      }
    }

    const channelInfo = {
      id: chat.id,
      title: chat.title,
      username: chat.username,
      description: chat.description,
      photo_url: photoUrl,
      member_count: memberCount,
      invite_link: chat.invite_link,
      type: chat.type
    };

    // Store in cache
    channelCache.set(username, channelInfo);
    console.log(`Cached data for ${username}`);

    return channelInfo;
  } catch (error) {
    console.error('Error fetching channel info:', error);
    throw error;
  }
};

// Verify channel exists
export const verifyChannel = async (username) => {
  try {
    const info = await getChannelInfo(username);
    return !!info;
  } catch (error) {
    console.error('Error verifying channel:', error);
    return false;
  }
};

// Verify channel ownership
export const verifyChannelOwnership = async (username, userId) => {
  try {
    const response = await fetch(
      `${TELEGRAM_API_BASE}/getChatAdministrators?chat_id=@${username}`
    );
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description || 'Failed to get channel administrators');
    }

    return data.result.some(
      admin => admin.user.id === userId && admin.status === 'creator'
    );
  } catch (error) {
    console.error('Error verifying channel ownership:', error);
    return false;
  }
};

// Get channel statistics
export const getChannelStats = async (username) => {
  try {
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    const response = await fetch(`${TELEGRAM_API_BASE}/getChatMemberCount?chat_id=@${cleanUsername}`);
    const data = await response.json();

    if (!data.ok) {
      throw new Error('Failed to fetch channel stats');
    }

    return {
      success: true,
      data: {
        members_count: data.result
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}; 