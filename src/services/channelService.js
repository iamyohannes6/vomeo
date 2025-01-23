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
    const snapshot = await getDocs(query(channelsRef, where('id', '==', channelId)));
    const channel = snapshot.docs[0].data();
    
    await updateDoc(channelRef, {
      featured: !channel.featured,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error toggling channel feature:', error);
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