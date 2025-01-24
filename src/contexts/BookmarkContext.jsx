import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const BookmarkContext = createContext(null);

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
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
        const bookmarksRef = collection(db, 'bookmarks');
        const q = query(bookmarksRef, where('userId', '==', user.id));
        const snapshot = await getDocs(q);
        const bookmarkData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBookmarks(bookmarkData);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [user]);

  const addBookmark = async (channel) => {
    if (!user) return;

    try {
      const bookmarksRef = collection(db, 'bookmarks');
      const bookmark = {
        userId: user.id,
        channelId: channel.id,
        channelData: channel,
        createdAt: new Date()
      };
      const docRef = await addDoc(bookmarksRef, bookmark);
      setBookmarks(prev => [...prev, { id: docRef.id, ...bookmark }]);
      return true;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      return false;
    }
  };

  const removeBookmark = async (channelId) => {
    if (!user) return;

    try {
      const bookmark = bookmarks.find(b => b.channelId === channelId);
      if (bookmark) {
        await deleteDoc(doc(db, 'bookmarks', bookmark.id));
        setBookmarks(prev => prev.filter(b => b.channelId !== channelId));
      }
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      return false;
    }
  };

  const isBookmarked = (channelId) => {
    return bookmarks.some(b => b.channelId === channelId);
  };

  return (
    <BookmarkContext.Provider value={{ 
      bookmarks, 
      loading, 
      addBookmark, 
      removeBookmark, 
      isBookmarked 
    }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}; 