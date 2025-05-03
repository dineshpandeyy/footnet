import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
// import { Navbar } from './components/layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ClubPage from './pages/ClubPage';
import UserProfile from './components/UserProfile';
import News from './pages/News';
import CommunityDiscussions from './components/communities/CommunityDiscussions';
import CommunitiesSidebar from './components/communities/CommunitiesSidebar';
import CommunityAdminNotifications from './components/communities/CommunityAdminNotifications';

// Create a wrapper component for routes that need authentication
const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/club/:clubId" element={<ClubPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
      <Route path="/news" element={<News />} />
      <Route
        path="/communities/:communityId"
        element={
          <div className="flex">
            <div className="w-64">
              <CommunitiesSidebar currentUser={user} />
            </div>
            <div className="flex-1">
              <CommunityDiscussions currentUser={user} />
            </div>
          </div>
        }
      />
    </Routes>
  );
};

function AppContent() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      {user && <CommunityAdminNotifications currentUser={user} />}
      <main className="container mx-auto px-4 py-8">
        <AppRoutes />
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 