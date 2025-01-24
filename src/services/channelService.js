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
  deleteDoc,
  startAfter,
  limit
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
    
    // Ensure submitter data is properly structured
    const submitterData = {
      id: submitter?.id || null,
      username: submitter?.username || null,
      firstName: submitter?.firstName || submitter?.first_name || null,
      lastName: submitter?.lastName || submitter?.last_name || null,
      photoUrl: submitter?.photoUrl || submitter?.photo_url || null
    };

    const channel = {
      ...channelData,
      status: 'pending',
      featured: false,
      verified: false,
      photoUrl: channelInfo?.photo_url || null,
      submittedBy: submitterData,
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

export const removeChannel = async (channelId) => {
  try {
    const channelRef = doc(channelsRef, channelId);
    await deleteDoc(channelRef);
  } catch (error) {
    console.error('Error removing channel:', error);
    throw error;
  }
};

export const updatePromoContent = async (promoData, isSecondary = false) => {
  try {
    const promoQuery = query(promoRef, where('isSecondary', '==', isSecondary));
    const snapshot = await getDocs(promoQuery);
    
    if (!snapshot.empty) {
      // Update existing promo
      const promoDoc = snapshot.docs[0];
      await updateDoc(doc(promoRef, promoDoc.id), {
        ...promoData,
        updatedAt: Timestamp.now()
      });
    } else {
      // Create new promo
      await addDoc(promoRef, {
        ...promoData,
        isSecondary,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    console.error('Error updating promo content:', error);
    throw error;
  }
};

// Fetch paginated channels with filters
export const fetchPaginatedChannels = async (filters = {}, lastDoc = null, limit = 10) => {
  try {
    let q = query(
      channelsRef,
      where('status', '==', 'approved')
    );

    // Apply filters
    if (filters.category && filters.category !== 'all') {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters.onlyVerified) {
      q = query(q, where('verified', '==', true));
    }

    // Add sorting
    switch (filters.sortBy) {
      case 'recent':
        q = query(q, orderBy('submittedAt', 'desc'));
        break;
      case 'popular':
      case 'trending':
      default:
        q = query(q, orderBy('statistics.memberCount', 'desc'));
    }

    // Add pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    q = query(q, limit(limit));

    const snapshot = await getDocs(q);
    const channels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      channels,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === limit
    };
  } catch (error) {
    console.error('Error fetching paginated channels:', error);
    throw error;
  }
}; 