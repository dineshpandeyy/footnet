import React from 'react';
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
  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Communities</h2>
        <CommunityCreator onCreateCommunity={onCreateCommunity} isLoading={isLoading} />
      </div>
      <CommunityList
        communities={communities}
        onJoinCommunity={onJoinCommunity}
        onLeaveCommunity={onLeaveCommunity}
        currentUser={currentUser}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CommunitiesPanel; 