import React, { useState } from 'react';
import CommunityCreator from './CommunityCreator';
import CommunityList from './CommunityList';
import { motion, AnimatePresence } from 'framer-motion';

const CommunitiesPanel = ({
  communities,
  onCreateCommunity,
  onJoinCommunity,
  onLeaveCommunity,
  currentUser,
  isLoading,
}) => {
  // search term + section toggles
  const [searchTerm, setSearchTerm] = useState('');
  const [showJoined, setShowJoined] = useState(true);
  const [showDiscover, setShowDiscover] = useState(false);

  // Filter communities into joined and discover sections, then apply searchTerm
  const joinedCommunities = communities
    .filter(c => c.members.some(m => m.userId === currentUser?.phoneNumber))
    .filter(c => {
      const q = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });

  const discoverCommunities = communities
    .filter(c => !c.members.some(m => m.userId === currentUser?.phoneNumber))
    .filter(c => {
      const q = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6
                    border border-gray-100 dark:border-gray-700">
      {/* Header + Creator */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4
                       bg-clip-text text-transparent bg-gradient-to-r 
                       from-blue-600 to-indigo-600">
          Communities
        </h2>
        <CommunityCreator onCreateCommunity={onCreateCommunity} isLoading={isLoading} />
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 pr-4 rounded-full
                       bg-gray-50 dark:bg-gray-700 
                       text-gray-900 dark:text-gray-200
                       border border-gray-300 dark:border-gray-600
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-colors duration-200"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Community Sections */}
      <div className="space-y-6">
        {/* Your Communities */}
        <div>
          <h3 className="flex items-center justify-between text-lg font-semibold 
                         text-gray-900 dark:text-white mb-4 cursor-pointer
                         hover:text-blue-600 dark:hover:text-blue-400
                         transition-colors duration-200"
              onClick={() => setShowJoined(prev => !prev)}>
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Your Communities</span>
            </span>
            <motion.span
              animate={{ rotate: showJoined ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          </h3>
          <AnimatePresence>
            {showJoined && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CommunityList
                  communities={joinedCommunities}
                  onJoinCommunity={onJoinCommunity}
                  onLeaveCommunity={onLeaveCommunity}
                  currentUser={currentUser}
                  isLoading={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Discover Communities */}
        <div>
          <h3
            className="flex items-center justify-between text-lg font-semibold 
                           text-gray-900 dark:text-white mb-4 cursor-pointer
                           hover:text-blue-600 dark:hover:text-blue-400
                           transition-colors duration-200"
            onClick={() => setShowDiscover(prev => !prev)}
          >
            <span className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2s-.055 1.35-.166 2c-.11.65-.166 1.32-.166 2 0 2.651.11 5.297.337 7.942.662 1.1.165 2.2.54 3.24 1.62 4.32 4.32 4.32 4.32 4.32 4.32 4.32-2.64 0-5.28.336-7.92.66-1.08.165-2.16.54-3.24.915-4.32 1.08-2.64.336-5.28.336-7.92 0-1.08-.336-2.16-.336-3.24-.66-4.32-1.08-2.64-.336-5.28-.66-7.92 0-1.08.336-2.16.336-3.24.66z" clipRule="evenodd" />
              </svg>
              <span>Discover Communities</span>
            </span>
            <motion.span
              animate={{ rotate: showDiscover ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          </h3>
          <AnimatePresence>
            {showDiscover && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CommunityList
                  communities={discoverCommunities}
                  onJoinCommunity={onJoinCommunity}
                  onLeaveCommunity={onLeaveCommunity}
                  currentUser={currentUser}
                  isLoading={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CommunitiesPanel; 