import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';

const BookmarksContext = createContext(null);

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
};

export const BookmarksProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load user's bookmarks
  useEffect(() => {
    const loadBookmarks = async () => {
      if (!user) {
        setBookmarks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const bookmarksRef = doc(db, 'bookmarks', user.id.toString());
        const bookmarksDoc = await getDoc(bookmarksRef);
        
        if (bookmarksDoc.exists()) {
          setBookmarks(bookmarksDoc.data().channels || []);
        } else {
          // Initialize empty bookmarks for new users
          await setDoc(bookmarksRef, { channels: [] });
          setBookmarks([]);
        }
      } catch (err) {
        console.error('Error loading bookmarks:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [user]);

  // Add a channel to bookmarks
  const addBookmark = async (channel) => {
    if (!user) throw new Error('You must be logged in to bookmark channels');

    try {
      const bookmarksRef = doc(db, 'bookmarks', user.id.toString());
      await setDoc(bookmarksRef, {
        channels: arrayUnion(channel)
      }, { merge: true });

      setBookmarks(prev => [...prev, channel]);
      return true;
    } catch (err) {
      console.error('Error adding bookmark:', err);
      throw err;
    }
  };

  // Remove a channel from bookmarks
  const removeBookmark = async (channelId) => {
    if (!user) throw new Error('You must be logged in to manage bookmarks');

    try {
      const channelToRemove = bookmarks.find(b => b.id === channelId);
      if (!channelToRemove) return;

      const bookmarksRef = doc(db, 'bookmarks', user.id.toString());
      await setDoc(bookmarksRef, {
        channels: arrayRemove(channelToRemove)
      }, { merge: true });

      setBookmarks(prev => prev.filter(b => b.id !== channelId));
      return true;
    } catch (err) {
      console.error('Error removing bookmark:', err);
      throw err;
    }
  };

  // Check if a channel is bookmarked
  const isBookmarked = (channelId) => {
    return bookmarks.some(b => b.id === channelId);
  };

  const value = {
    bookmarks,
    loading,
    error,
    addBookmark,
    removeBookmark,
    isBookmarked
  };

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
};

export default BookmarksContext; 