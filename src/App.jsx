import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChannelsProvider } from './contexts/ChannelsContext';
import { ToastProvider } from './contexts/ToastContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import Navbar from './components/Navbar';
import Routes from './Routes';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChannelsProvider>
          <BookmarkProvider>
            <ToastProvider>
              <div className="min-h-screen bg-base-100 text-white">
                <Navbar />
                <Routes />
              </div>
            </ToastProvider>
          </BookmarkProvider>
        </ChannelsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
