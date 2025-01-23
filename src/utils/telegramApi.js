import { TELEGRAM_API_BASE, TELEGRAM_FILE_API_BASE } from '../config/telegram';

// Get channel information including photo
export const getChannelInfo = async (username) => {
  try {
    // Get channel info
    const response = await fetch(`${TELEGRAM_API_BASE}/getChat?chat_id=@${username}`);
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description || 'Failed to get channel info');
    }

    const channel = data.result;
    let photoUrl = null;

    // Get photo if available
    if (channel.photo?.small_file_id) {
      const fileResponse = await fetch(
        `${TELEGRAM_API_BASE}/getFile?file_id=${channel.photo.small_file_id}`
      );
      const fileData = await fileResponse.json();
      
      if (fileData.ok) {
        photoUrl = `${TELEGRAM_FILE_API_BASE}/${fileData.result.file_path}`;
      }
    }

    return {
      id: channel.id,
      title: channel.title,
      username: channel.username,
      description: channel.description,
      photo_url: photoUrl,
      member_count: channel.member_count || 0,
      message_count: channel.message_count || 0,
      invite_link: channel.invite_link
    };
  } catch (error) {
    console.error('Error getting channel info:', error);
    return null;
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