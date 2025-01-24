import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ChannelsProvider } from './contexts/ChannelsContext';
import { BookmarksProvider } from './contexts/BookmarksContext';
import { ToastProvider } from './components/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Submit from './pages/Submit';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';

function App() {
  return (
    <AuthProvider>
      <ChannelsProvider>
        <BookmarksProvider>
          <ToastProvider>
            <Router>
              <div className="min-h-screen bg-base-100">
                <Navbar />
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/submit" element={
                      <ProtectedRoute>
                        <Submit />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/bookmarks" element={
                      <ProtectedRoute>
                        <Bookmarks />
                      </ProtectedRoute>
                    } />
                    <Route path="/auth/login" element={<Login />} />
                  </Routes>
                </AnimatePresence>
              </div>
            </Router>
          </ToastProvider>
        </BookmarksProvider>
      </ChannelsProvider>
    </AuthProvider>
  );
}

export default App;
