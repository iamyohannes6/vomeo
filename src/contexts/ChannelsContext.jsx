import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getChannelInfo } from '../utils/telegramApi';
import { 
  fetchChannels, 
  storeChannel, 
  updateChannelStatus, 
  toggleChannelFeature,
  toggleChannelVerified,
  removeChannel,
  updatePromoContent,
  getPromo
} from '../services/channelService';

const ChannelsContext = createContext();

// Collection references
const channelsRef = collection(db, 'channels');
const promoRef = collection(db, 'promo');
const secondaryPromoRef = collection(db, 'secondaryPromo');

// Channel query functions with fallbacks
const getPendingChannels = async () => {
  try {
    // Try with ordering
    const q = query(
      channelsRef,
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    if (error.code === 'failed-precondition') {
      // Fallback without ordering if index doesn't exist
      const q = query(
        channelsRef,
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.createdAt - a.createdAt);
    }
    throw error;
  }
};

const getApprovedChannels = async () => {
  try {
    const q = query(
      channelsRef,
      where('status', '==', 'approved'),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    if (error.code === 'failed-precondition') {
      const q = query(
        channelsRef,
        where('status', '==', 'approved')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.updatedAt - a.updatedAt);
    }
    throw error;
  }
};

const getFeaturedChannels = async () => {
  try {
    const q = query(
      channelsRef,
      where('status', '==', 'approved'),
      where('featured', '==', true),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    if (error.code === 'failed-precondition') {
      // Fallback to simpler query if index doesn't exist
      const q = query(
        channelsRef,
        where('status', '==', 'approved'),
        where('featured', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.updatedAt - a.updatedAt);
    }
    throw error;
  }
};

const getRejectedChannels = async () => {
  try {
    const q = query(
      channelsRef,
      where('status', '==', 'rejected'),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    if (error.code === 'failed-precondition') {
      const q = query(
        channelsRef,
        where('status', '==', 'rejected')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.updatedAt - a.updatedAt);
    }
    throw error;
  }
};

export const ChannelsProvider = ({ children }) => {
  const [channels, setChannels] = useState({
    pending: [],
    approved: [],
    featured: [],
    rejected: []
  });
  const [promo, setPromo] = useState(null);
  const [secondaryPromo, setSecondaryPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch channels with individual error handling
      const [pendingChannels, approvedChannels, featuredChannels, rejectedChannels] = await Promise.allSettled([
        getPendingChannels(),
        getApprovedChannels(),
        getFeaturedChannels(),
        getRejectedChannels()
      ]);

      // Process results and handle errors
      setChannels({
        pending: pendingChannels.status === 'fulfilled' ? pendingChannels.value : [],
        approved: approvedChannels.status === 'fulfilled' ? approvedChannels.value : [],
        featured: featuredChannels.status === 'fulfilled' ? featuredChannels.value : [],
        rejected: rejectedChannels.status === 'fulfilled' ? rejectedChannels.value : []
      });

      // Check for any errors in channel fetching
      const errors = [pendingChannels, approvedChannels, featuredChannels, rejectedChannels]
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

      if (errors.length > 0) {
        console.error('Some channel queries failed:', errors);
      }

      // Fetch promos with individual error handling
      const [primaryPromo, secondaryPromo] = await Promise.allSettled([
        getPromo(false),
        getPromo(true)
      ]);

      // Set promo states
      if (primaryPromo.status === 'fulfilled') {
        setPromo(primaryPromo.value);
      }
      if (secondaryPromo.status === 'fulfilled') {
        setSecondaryPromo(secondaryPromo.value);
      }

      // Set error state if any promo fetching failed
      if (primaryPromo.status === 'rejected' || secondaryPromo.status === 'rejected') {
        console.error('Error fetching promos:', {
          primary: primaryPromo.status === 'rejected' ? primaryPromo.reason : null,
          secondary: secondaryPromo.status === 'rejected' ? secondaryPromo.reason : null
        });
      }

      // Set overall error state if needed
      if (errors.length > 0 || primaryPromo.status === 'rejected' || secondaryPromo.status === 'rejected') {
        setError('Some data failed to load. Please try again later.');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Submit a new channel
  const submitChannel = async (channelData, submitter) => {
    try {
      setLoading(true);
      await storeChannel(channelData, submitter);
      await loadData(); // Refresh all data
      return true;
    } catch (err) {
      console.error('Error submitting channel:', err);
      throw new Error(err.message || 'Failed to submit channel');
    } finally {
      setLoading(false);
    }
  };

  // Approve a channel
  const approveChannel = async (channelId) => {
    try {
      setLoading(true);
      await updateChannelStatus(channelId, 'approved');
      await loadData();
    } catch (err) {
      console.error('Error approving channel:', err);
      setError('Failed to approve channel');
    } finally {
      setLoading(false);
    }
  };

  // Reject a channel
  const rejectChannel = async (channelId) => {
    try {
      setLoading(true);
      await updateChannelStatus(channelId, 'rejected');
      await loadData();
    } catch (err) {
      console.error('Error rejecting channel:', err);
      setError('Failed to reject channel');
    } finally {
      setLoading(false);
    }
  };

  // Toggle featured status
  const toggleFeature = async (channelId) => {
    try {
      setLoading(true);
      await toggleChannelFeature(channelId);
      await loadData();
    } catch (err) {
      console.error('Error toggling feature status:', err);
      setError('Failed to update feature status');
    } finally {
      setLoading(false);
    }
  };

  // Toggle verified status
  const toggleVerified = async (channelId) => {
    try {
      setLoading(true);
      await toggleChannelVerified(channelId);
      await loadData();
    } catch (err) {
      console.error('Error toggling verified status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove channel
  const handleRemoveChannel = async (channelId) => {
    try {
      setLoading(true);
      await removeChannel(channelId);
      await loadData();
    } catch (err) {
      console.error('Error removing channel:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update promo content
  const updatePromo = async (promoData, isSecondary = false) => {
    try {
      await updatePromoContent(promoData, isSecondary);
      if (isSecondary) {
        setSecondaryPromo(promoData);
      } else {
        setPromo(promoData);
      }
    } catch (err) {
      console.error('Error updating promo:', err);
      throw err;
    }
  };

  const value = {
    channels,
    loading,
    error,
    promo,
    secondaryPromo,
    updatePromo,
    submitChannel,
    approveChannel,
    rejectChannel,
    toggleFeature,
    toggleVerified,
    removeChannel: handleRemoveChannel,
    loadData
  };

  return (
    <ChannelsContext.Provider value={value}>
      {children}
    </ChannelsContext.Provider>
  );
};

export const useChannels = () => {
  const context = useContext(ChannelsContext);
  if (!context) {
    throw new Error('useChannels must be used within a ChannelsProvider');
  }
  return context;
};

export default ChannelsContext; 