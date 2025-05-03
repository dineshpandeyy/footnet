import React, { useState } from 'react';
import CommunityCreator from './CommunityCreator';
import CommunityList from './CommunityList';

const CommunitiesPanel = ({
  communities,
  onCreateCommunity,
  onJoinCommunity,
  onLeaveCommunity,
  currentUser,
  isLoading,
}) => {
  // new: search term state
  const [searchTerm, setSearchTerm] = useState('');

  // split then search‐filter
  const joinedCommunities = communities
    .filter(c => c.members.some(m => m.userId === currentUser?.phoneNumber))
    .filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const discoverCommunities = communities
    .filter(c => !c.members.some(m => m.userId === currentUser?.phoneNumber))
    .filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="w-full">
      {/* header + creator */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Communities
        </h2>
        <CommunityCreator onCreateCommunity={onCreateCommunity} isLoading={isLoading} />
      </div>

      {/* NEW: search input */}
      <div className="mb-4 px-2">
        <input
          type="text"
          placeholder="Search communities..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* Your Communities */}
      <div className="mb-6">
        <h3
          className="flex items-center justify-between text-md font-medium text-gray-900 dark:text-white mb-3 cursor-pointer"
          onClick={() => setShowJoined(prev => !prev)}
        >
          …same as before…
        </h3>
        {showJoined && (
          <CommunityList
            communities={joinedCommunities}
            onJoinCommunity={onJoinCommunity}
            onLeaveCommunity={onLeaveCommunity}
            currentUser={currentUser}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Discover Communities */}
      <div>
        <h3
          className="flex items-center justify-between text-md font-medium text-gray-900 dark:text-white mb-3 cursor-pointer"
          onClick={() => setShowDiscover(prev => !prev)}
        >
          …same as before…
        </h3>
        {showDiscover && (
          <CommunityList
            communities={discoverCommunities}
            onJoinCommunity={onJoinCommunity}
            onLeaveCommunity={onLeaveCommunity}
            currentUser={currentUser}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default CommunitiesPanel; 