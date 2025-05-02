import React, { useState } from 'react';
import { CommunitiesPanel } from './index';

const CommunitiesSidebar = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [communities, setCommunities] = useState([]);

  const handleCreateCommunity = async (communityData) => {
    setIsLoading(true);
    try {
      // Add your API call here to create community
      console.log('Creating community:', communityData);
    } catch (error) {
      console.error('Error creating community:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      console.log('Joining community:', communityId);
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    try {
      console.log('Leaving community:', communityId);
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  return (
    <div className="w-64 min-h-screen border-r border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
      <CommunitiesPanel
        communities={communities}
        onCreateCommunity={handleCreateCommunity}
        onJoinCommunity={handleJoinCommunity}
        onLeaveCommunity={handleLeaveCommunity}
        currentUser={currentUser}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CommunitiesSidebar; 