import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5001';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Update the check to include both club and community pages
  const isSearchVisible = location.pathname.includes('/club/') || location.pathname.includes('/communities/');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const debouncedSearch = useCallback(async (searchTerm, clubId) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(
        `${API_URL}/api/users/search/query?query=${searchTerm}&clubId=${clubId}`
      );
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      const clubId = location.pathname.split('/')[2];
      debouncedSearch(value, clubId);
    }, 300);

    setTypingTimeout(newTimeout);
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const clubId = location.pathname.split('/')[2]; // Get clubId from URL
      const response = await fetch(
        `${API_URL}/api/users/search/query?query=${searchQuery}&clubId=${clubId}`
      );
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserSelect = (userId) => {
    setSearchResults([]);
    setSearchQuery('');
    navigate(`/profile/${userId}`);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white dark:bg-gray-800 shadow-lg backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95 
                 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <span className="text-2xl font-bold bg-clip-text text-transparent 
                               bg-gradient-to-r from-blue-600 to-indigo-600
                               group-hover:from-blue-500 group-hover:to-purple-600
                               transition-all duration-300">
                  FootballConnect
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r 
                               from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300" />
              </motion.div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 ml-10">
              <Link
                to="/news"
                className="relative group text-gray-700 dark:text-gray-300 
                         hover:text-blue-600 dark:hover:text-blue-400
                         transition-colors duration-200 font-medium"
              >
                News
              </Link>
              {user && (
                <Link
                  to={`/club/${user.selectedClub}`}
                  className="relative group text-gray-700 dark:text-gray-300 
                           hover:text-blue-600 dark:hover:text-blue-400
                           transition-colors duration-200 font-medium"
                >
                  My Club
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar */}
          {isSearchVisible && (
            <div className="relative flex-1 max-w-lg mx-4" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search users..."
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 
                           dark:border-gray-600 bg-gray-50 dark:bg-gray-700
                           text-gray-900 dark:text-gray-100 focus:ring-2 
                           focus:ring-blue-500 dark:focus:ring-blue-400 
                           focus:border-transparent transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 
                             rounded-lg shadow-lg border border-gray-200 
                             dark:border-gray-700 overflow-hidden"
                  >
                    {isSearching ? (
                      <div className="p-4 flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      searchResults.map((user) => (
                        <div
                          key={user.phoneNumber}
                          onClick={() => handleUserSelect(user.phoneNumber)}
                          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {highlightMatchedText(user.name, searchQuery)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.followers.length} followers • {user.following.length} following
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            View Profile →
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button
                  onClick={handleProfileClick}
                  className="relative group flex items-center space-x-2 px-4 py-2 
                           rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                           dark:hover:bg-gray-600 transition-all duration-200"
                >
                  <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{user.name}</span>
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full text-sm font-medium text-white
                           bg-gradient-to-r from-red-500 to-pink-500 
                           hover:from-red-600 hover:to-pink-600
                           transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </motion.button>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400
                             transition-colors duration-200"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white
                             bg-gradient-to-r from-blue-600 to-indigo-600 
                             hover:from-blue-700 hover:to-indigo-700
                             transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const highlightMatchedText = (text, query) => {
  if (!query) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="bg-yellow-200 dark:bg-yellow-900">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default Navbar; 