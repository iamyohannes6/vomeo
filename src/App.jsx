import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Submit from './pages/Submit';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <AuthProvider>
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
                <ProtectedRoute requiresAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
