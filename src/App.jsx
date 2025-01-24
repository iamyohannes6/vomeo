import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChannelsProvider } from './contexts/ChannelsContext';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load route components
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const Submit = lazy(() => import('./pages/Submit'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  return (
    <AuthProvider>
      <ChannelsProvider>
        <Router>
          <div className="min-h-screen bg-base-100">
            <Navbar />
            <Layout>
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              }>
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
                  <Route path="/login" element={<Login />} />
                </Routes>
              </Suspense>
            </Layout>
          </div>
        </Router>
      </ChannelsProvider>
    </AuthProvider>
  );
}

export default App;
