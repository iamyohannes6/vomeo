import { TELEGRAM_API_BASE, TELEGRAM_FILE_API_BASE, BOT_USERNAME } from '../config/telegram';

// Verify if channel exists and get its info
export const verifyChannel = async (username) => {
  try {
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    const chatResponse = await fetch(`${TELEGRAM_API_BASE}/getChat?chat_id=@${cleanUsername}`);
    const chatData = await chatResponse.json();

    if (!chatData.ok) {
      throw new Error(chatData.description || 'Channel verification failed');
    }

    return {
      success: true,
      data: chatData.result,
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
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    const response = await fetch(`${TELEGRAM_API_BASE}/getChatAdministrators?chat_id=@${cleanUsername}`);
    const data = await response.json();

    return {
      success: true,
      isAdmin: data.ok,
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

export const getChannelInfo = async (username) => {
  try {
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    
    const chatResponse = await fetch(`${TELEGRAM_API_BASE}/getChat?chat_id=@${cleanUsername}`);
    const chatData = await chatResponse.json();
    
    if (!chatData.ok) {
      throw new Error(chatData.description || 'Failed to fetch channel info');
    }

    const memberCountResponse = await fetch(`${TELEGRAM_API_BASE}/getChatMemberCount?chat_id=@${cleanUsername}`);
    const memberCountData = await memberCountResponse.json();

    let photoUrl = null;
    if (chatData.result.photo) {
      try {
        const fileResponse = await fetch(`${TELEGRAM_API_BASE}/getFile?file_id=${chatData.result.photo.big_file_id}`);
        const fileData = await fileResponse.json();
        
        if (fileData.ok) {
          photoUrl = `${TELEGRAM_FILE_API_BASE}/${fileData.result.file_path}`;
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
      message_count: null,
      last_message_date: null,
      photo_url: photoUrl,
      type: chatData.result.type,
      invite_link: chatData.result.invite_link
    };
  } catch (error) {
    console.error('Error fetching channel info:', error);
    return {
      member_count: 0,
      message_count: null,
      last_message_date: null,
      photo_url: null
    };
  }
}; 