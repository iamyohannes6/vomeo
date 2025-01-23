import { BOT_USERNAME } from '../config/telegram';
import { TELEGRAM_BOT_TOKEN } from '../config/telegram';

// Verify if channel exists and get its info
export const verifyChannel = async (username) => {
  try {
    // Remove @ if present
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    
    // TODO: Replace with actual API call
    // For now, simulate API response
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          result: {
            id: Math.floor(Math.random() * 1000000),
            title: cleanUsername,
            username: cleanUsername,
            type: 'channel',
            subscribers_count: Math.floor(Math.random() * 50000),
            description: 'Channel description',
          }
        });
      }, 1000);
    });

    if (!response.ok) {
      throw new Error('Channel verification failed');
    }

    return {
      success: true,
      data: response.result,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Check if user is channel admin
export const verifyChannelOwnership = async (username) => {
  try {
    // TODO: Replace with actual API call
    // For now, simulate API response
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          result: true,
        });
      }, 1000);
    });

    return {
      success: true,
      isAdmin: response.result,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get channel statistics
export const getChannelStats = async (username) => {
  try {
    // TODO: Replace with actual API call
    // For now, simulate API response
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          result: {
            members_count: Math.floor(Math.random() * 50000),
            messages_per_day: Math.floor(Math.random() * 100),
            growth_rate: Math.random() * 10,
            active_users: Math.floor(Math.random() * 1000),
          }
        });
      }, 1000);
    });

    return {
      success: true,
      data: response.result,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const TELEGRAM_FILE_API = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}`;

export const getChannelInfo = async (username) => {
  try {
    // Clean up username (remove @ if present)
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    
    // First get chat info
    const chatResponse = await fetch(`${TELEGRAM_API}/getChat?chat_id=@${cleanUsername}`);
    const chatData = await chatResponse.json();
    
    if (!chatData.ok) {
      throw new Error(chatData.description || 'Failed to fetch channel info');
    }

    // Get chat member count
    const memberCountResponse = await fetch(`${TELEGRAM_API}/getChatMemberCount?chat_id=@${cleanUsername}`);
    const memberCountData = await memberCountResponse.json();

    // Get profile photo if available
    let photoUrl = null;
    if (chatData.result.photo) {
      try {
        // Get file path for the photo
        const fileResponse = await fetch(`${TELEGRAM_API}/getFile?file_id=${chatData.result.photo.big_file_id}`);
        const fileData = await fileResponse.json();
        
        if (fileData.ok) {
          // Construct the full photo URL
          photoUrl = `${TELEGRAM_FILE_API}/${fileData.result.file_path}`;
        }
      } catch (photoError) {
        console.error('Error fetching channel photo:', photoError);
      }
    }

    return {
      chat_id: chatData.result.id,
      title: chatData.result.title,
      username: chatData.result.username,
      description: chatData.result.description,
      member_count: memberCountData.ok ? memberCountData.result : 0,
      message_count: null, // Telegram API doesn't provide this directly
      last_message_date: null, // Telegram API doesn't provide this directly
      photo_url: photoUrl,
      type: chatData.result.type,
      invite_link: chatData.result.invite_link
    };
  } catch (error) {
    console.error('Error fetching channel info:', error);
    // Return default values if channel info fetch fails
    return {
      member_count: 0,
      message_count: null,
      last_message_date: null,
      photo_url: null
    };
  }
}; 