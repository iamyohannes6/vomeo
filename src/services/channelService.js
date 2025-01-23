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
  getFirestore,
  deleteDoc
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
      photoUrl: channelInfo?.photo_url || null,
      submittedBy: submitter ? {
        id: submitter.id,
        username: submitter.username,
        firstName: submitter.first_name,
        lastName: submitter.last_name
      } : {
        id: null,
        username: 'anonymous',
        firstName: null,
        lastName: null
      },
      statistics: {
        memberCount: channelInfo?.member_count || 0,
        messageCount: channelInfo?.message_count || 0,
        lastMessageDate: channelInfo?.last_message_date || null,
        title: channelInfo?.title || channelData.name,
        description: channelInfo?.description || channelData.description,
        inviteLink: channelInfo?.invite_link || null
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
    const channels = {
      pending: [],
      approved: [],
      featured: [],
      rejected: []
    };

    snapshot.forEach((doc) => {
      const channel = { id: doc.id, ...doc.data() };
      if (channel.featured) {
        channels.featured.push(channel);
      }
      channels[channel.status].push(channel);
    });

    return channels;
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
};

// Update channel status
export const updateChannelStatus = async (channelId, status) => {
  try {
    const channelRef = doc(channelsRef, channelId);
    await updateDoc(channelRef, {
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating channel status:', error);
    throw error;
  }
};

// Toggle channel feature status
export const toggleChannelFeature = async (channelId) => {
  try {
    const channelRef = doc(channelsRef, channelId);
    const channelDoc = await getDocs(query(channelsRef, where('__name__', '==', channelId)));
    
    if (!channelDoc.empty) {
      const channel = channelDoc.docs[0].data();
      await updateDoc(channelRef, {
        featured: !channel.featured,
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error toggling channel feature:', error);
    throw error;
  }
};

// Add toggle verified status
export const toggleChannelVerified = async (channelId) => {
  try {
    const channelRef = doc(channelsRef, channelId);
    const channelDoc = await getDocs(query(channelsRef, where('__name__', '==', channelId)));
    
    if (!channelDoc.empty) {
      const channel = channelDoc.docs[0].data();
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
    const channelRef = doc(channelsRef, channelId);
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

// Consolidated promo functions
export const getPromo = async (isSecondary = false) => {
  try {
    const targetRef = isSecondary ? secondaryPromoRef : promoRef;
    const querySnapshot = await getDocs(targetRef);
    const promos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return promos.sort((a, b) => b.updatedAt - a.updatedAt)[0] || null;
  } catch (error) {
    console.error('Error getting promo:', error);
    throw error;
  }
};

export const updatePromoContent = async (promoData, isSecondary = false) => {
  try {
    const timestamp = Timestamp.now();
    const data = {
      ...promoData,
      updatedAt: timestamp
    };

    const targetRef = isSecondary ? secondaryPromoRef : promoRef;
    const existingPromo = await getPromo(isSecondary);

    if (existingPromo) {
      // Update existing promo
      await updateDoc(doc(targetRef, existingPromo.id), data);
      return { id: existingPromo.id, ...data };
    } else {
      // Create new promo
      const docRef = await addDoc(targetRef, {
        ...data,
        createdAt: timestamp
      });
      return { id: docRef.id, ...data };
    }
  } catch (error) {
    console.error('Error updating promo content:', error);
    throw error;
  }
};

export const removeChannel = async (channelId) => {
  try {
    const channelRef = doc(channelsRef, channelId);
    await deleteDoc(channelRef);
  } catch (error) {
    console.error('Error removing channel:', error);
    throw error;
  }
}; 