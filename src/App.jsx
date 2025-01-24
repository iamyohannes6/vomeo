import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ChannelsProvider } from './contexts/ChannelsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Submit from './pages/Submit';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <ChannelsProvider>
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
                    <div className="min-h-screen bg-base-100 flex items-center justify-center">
                      <div className="text-neutral-400">Bookmarks coming soon...</div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-base-100 flex items-center justify-center">
                      <div className="text-neutral-400">Settings coming soon...</div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/auth/login" element={<Login />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </ChannelsProvider>
    </AuthProvider>
  );
}

export default App;
