import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

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

  // Check if we're on a club page
  const isClubPage = location.pathname.includes('/club/');

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
      className="bg-white dark:bg-gray-800 shadow-lg backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  FootballConnect
                </span>
              </motion.div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 ml-10">
              <Link
                to="/news"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400
                         transition-colors duration-200 font-medium"
              >
                News
              </Link>
              {user && (
                <Link
                  to={`/club/${user.selectedClub}`}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400
                           transition-colors duration-200 font-medium"
                >
                  My Club
                </Link>
              )}
            </div>

            {/* Search bar - only show on club pages */}
            {isClubPage && (
              <div className="ml-8 relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg 
                        className={`h-5 w-5 transition-colors duration-200 ${
                          isSearchFocused ? 'text-blue-500' : 'text-gray-400'
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                        />
                      </svg>
                    </div>
                    <input
                      type="search"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onFocus={() => setIsSearchFocused(true)}
                      className="w-64 pl-10 pr-4 py-2 border rounded-lg text-sm placeholder-gray-500 
                               transition-all duration-200 ease-in-out
                               dark:bg-gray-700 dark:border-gray-600 dark:text-white
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               hover:border-blue-300 dark:hover:border-blue-400"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="ml-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                             rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 
                             transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
                  >
                    Search
                  </motion.button>
                </form>

                {/* Updated Search Results Dropdown with Highlighted Text */}
                {(searchResults.length > 0 || isSearching) && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700">
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
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 
                           hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full 
                                flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium
                           text-white bg-gradient-to-r from-red-500 to-pink-500 
                           hover:from-red-600 hover:to-pink-600 transition-all duration-200
                           shadow-md hover:shadow-lg"
                >
                  Logout
                </motion.button>
              </div>
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