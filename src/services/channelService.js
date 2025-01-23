import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const CHANNELS_COLLECTION = 'channels';

// Store a new channel submission
export const storeChannel = async (channelData) => {
  try {
    const docRef = await addDoc(collection(db, CHANNELS_COLLECTION), {
      ...channelData,
      status: 'pending',
      featured: false,
      verified: false,
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Channel stored with ID:', docRef.id);
    return { id: docRef.id, ...channelData };
  } catch (err) {
    console.error('Error storing channel:', err);
    throw err;
  }
};

// Fetch all channels
export const fetchChannels = async () => {
  try {
    const channelsRef = collection(db, CHANNELS_COLLECTION);
    const snapshot = await getDocs(channelsRef);
    
    const channels = {
      pending: [],
      approved: [],
      featured: []
    };

    snapshot.forEach(doc => {
      const channel = { id: doc.id, ...doc.data() };
      
      // Add to appropriate lists
      if (channel.status === 'pending') {
        channels.pending.push(channel);
      } else if (channel.status === 'approved') {
        channels.approved.push(channel);
        if (channel.featured) {
          channels.featured.push(channel);
        }
      }
    });

    console.log('Fetched channels:', channels);
    return channels;
  } catch (err) {
    console.error('Error fetching channels:', err);
    throw err;
  }
};

// Update channel status
export const updateChannelStatus = async (channelId, status) => {
  try {
    const channelRef = doc(db, CHANNELS_COLLECTION, channelId);
    await updateDoc(channelRef, {
      status,
      updatedAt: serverTimestamp()
    });
    
    console.log('Updated channel status:', channelId, status);
    return { id: channelId, status };
  } catch (err) {
    console.error('Error updating channel status:', err);
    throw err;
  }
};

// Toggle channel feature status
export const toggleChannelFeature = async (channelId) => {
  try {
    const channelRef = doc(db, CHANNELS_COLLECTION, channelId);
    const snapshot = await getDocs(query(channelRef));
    const channel = snapshot.data();
    
    await updateDoc(channelRef, {
      featured: !channel.featured,
      updatedAt: serverTimestamp()
    });
    
    console.log('Toggled channel feature:', channelId);
    return { id: channelId, featured: !channel.featured };
  } catch (err) {
    console.error('Error toggling channel feature:', err);
    throw err;
  }
};

// Get featured channels
export const getFeaturedChannels = async () => {
  try {
    const channelsRef = collection(db, CHANNELS_COLLECTION);
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