import { 
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
  getFirestore 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getChannelInfo } from '../utils/telegramApi';

// Collection references
const channelsRef = collection(db, 'channels');
const promoRef = collection(db, 'promo');
const secondaryPromoRef = collection(db, 'secondaryPromo');

// Store a new channel
export const storeChannel = async (channelData, submitter) => {
  try {
    // Fetch channel statistics from Telegram
    const channelInfo = await getChannelInfo(channelData.username);
    
    const channel = {
      ...channelData,
      status: 'pending',
      featured: false,
      verified: false,
      submittedBy: {
        id: submitter.id,
        username: submitter.username,
        firstName: submitter.first_name,
        lastName: submitter.last_name
      },
      statistics: {
        memberCount: channelInfo.member_count || 0,
        messageCount: channelInfo.message_count || 0,
        lastMessageDate: channelInfo.last_message_date || null
      },
      submittedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(channelsRef, channel);
    return { id: docRef.id, ...channel };
  } catch (error) {
    console.error('Error storing channel:', error);
    throw error;
  }
};

// Fetch all channels
export const fetchChannels = async () => {
  try {
    const snapshot = await getDocs(channelsRef);
    const channels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      pending: channels.filter(channel => channel.status === 'pending'),
      approved: channels.filter(channel => channel.status === 'approved'),
      featured: channels.filter(channel => channel.featured)
    };
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
};

// Update channel status
export const updateChannelStatus = async (channelId, status) => {
  try {
    const channelRef = query(channelsRef, where('__name__', '==', channelId));
    const snapshot = await getDocs(channelRef);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      // Refresh channel statistics when approving
      let updateData = { status, updatedAt: Timestamp.now() };
      
      if (status === 'approved') {
        const channelInfo = await getChannelInfo(doc.data().username);
        updateData.statistics = {
          memberCount: channelInfo.member_count || 0,
          messageCount: channelInfo.message_count || 0,
          lastMessageDate: channelInfo.last_message_date || null
        };
      }
      
      await updateDoc(doc.ref, updateData);
      return { id: doc.id, ...doc.data(), ...updateData };
    }
    throw new Error('Channel not found');
  } catch (error) {
    console.error('Error updating channel status:', error);
    throw error;
  }
};

// Toggle channel feature status
export const toggleChannelFeature = async (channelId) => {
  try {
    const channelRef = query(channelsRef, where('__name__', '==', channelId));
    const snapshot = await getDocs(channelRef);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const featured = !doc.data().featured;
      
      // Refresh statistics when featuring a channel
      const channelInfo = await getChannelInfo(doc.data().username);
      const updateData = {
        featured,
        updatedAt: Timestamp.now(),
        statistics: {
          memberCount: channelInfo.member_count || 0,
          messageCount: channelInfo.message_count || 0,
          lastMessageDate: channelInfo.last_message_date || null
        }
      };
      
      await updateDoc(doc.ref, updateData);
      return { id: doc.id, ...doc.data(), ...updateData };
    }
    throw new Error('Channel not found');
  } catch (error) {
    console.error('Error toggling channel feature:', error);
    throw error;
  }
};

// Add toggle verified status
export const toggleChannelVerified = async (channelId) => {
  try {
    const channelRef = doc(db, 'channels', channelId);
    const channelSnap = await getDocs(query(channelsRef, where('__name__', '==', channelId)));
    
    if (!channelSnap.empty) {
      const channel = { id: channelSnap.docs[0].id, ...channelSnap.docs[0].data() };
      await updateDoc(channelRef, {
        verified: !channel.verified,
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error toggling channel verified status:', error);
    throw error;
  }
};

// Update channel
export const updateChannel = async (channelId, channelData) => {
  try {
    const channelRef = doc(db, 'channels', channelId);
    await updateDoc(channelRef, {
      ...channelData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating channel:', error);
    throw error;
  }
};

// Get featured channels
export const getFeaturedChannels = async () => {
  try {
    const channelsRef = collection(db, 'channels');
    const q = query(
      channelsRef,
      where('status', '==', 'approved'),
      where('featured', '==', true),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const channels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('Fetched featured channels:', channels);
    return channels;
  } catch (err) {
    console.error('Error fetching featured channels:', err);
    throw err;
  }
};

// Promo functions
export const getPromo = async () => {
  try {
    const querySnapshot = await getDocs(promoRef);
    const promos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Return the most recent promo
    return promos.sort((a, b) => b.updatedAt - a.updatedAt)[0] || null;
  } catch (error) {
    console.error('Error getting promo:', error);
    throw error;
  }
};

export const getSecondaryPromo = async () => {
  try {
    const querySnapshot = await getDocs(secondaryPromoRef);
    const promos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Return the most recent promo
    return promos.sort((a, b) => b.updatedAt - a.updatedAt)[0] || null;
  } catch (error) {
    console.error('Error getting secondary promo:', error);
    throw error;
  }
};

export const updatePromo = async (promoData) => {
  try {
    const timestamp = Timestamp.now();
    const data = {
      ...promoData,
      updatedAt: timestamp
    };

    // Get existing promo
    const existingPromo = await getPromo();

    if (existingPromo) {
      // Update existing promo
      await updateDoc(doc(promoRef, existingPromo.id), data);
      return { id: existingPromo.id, ...data };
    } else {
      // Create new promo
      const docRef = await addDoc(promoRef, {
        ...data,
        createdAt: timestamp
      });
      return { id: docRef.id, ...data };
    }
  } catch (error) {
    console.error('Error updating promo:', error);
    throw error;
  }
};

export const updateSecondaryPromo = async (promoData) => {
  try {
    const timestamp = Timestamp.now();
    const data = {
      ...promoData,
      updatedAt: timestamp
    };

    // Get existing secondary promo
    const existingPromo = await getSecondaryPromo();

    if (existingPromo) {
      // Update existing promo
      await updateDoc(doc(secondaryPromoRef, existingPromo.id), data);
      return { id: existingPromo.id, ...data };
    } else {
      // Create new promo
      const docRef = await addDoc(secondaryPromoRef, {
        ...data,
        createdAt: timestamp
      });
      return { id: docRef.id, ...data };
    }
  } catch (error) {
    console.error('Error updating secondary promo:', error);
    throw error;
  }
}; 