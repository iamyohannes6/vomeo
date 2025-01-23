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

// Collection reference
const channelsRef = collection(db, 'channels');
const promoRef = collection(db, 'promo');

// Store a new channel
export const storeChannel = async (channelData) => {
  try {
    const docRef = await addDoc(channelsRef, {
      ...channelData,
      status: 'pending',
      featured: false,
      verified: false,
      submittedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { id: docRef.id, ...channelData };
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
    const channelRef = doc(db, 'channels', channelId);
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
    const channelRef = doc(db, 'channels', channelId);
    const channelSnap = await getDocs(query(channelsRef, where('__name__', '==', channelId)));
    
    if (!channelSnap.empty) {
      const channel = { id: channelSnap.docs[0].id, ...channelSnap.docs[0].data() };
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