import React from 'react';
import { useNavigate } from 'react-router-dom';

const CommunityList = ({ communities, onJoinCommunity, onLeaveCommunity, currentUser, isLoading }) => {
  const navigate = useNavigate();

  const handleCommunityClick = (communityId) => {
    navigate(`/communities/${communityId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No communities found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {communities.map((community) => {
        const isMember = community.members.some(member => member.userId === currentUser?.phoneNumber);
        const isPending = community.pendingMembers?.some(member => member.userId === currentUser?.phoneNumber);

        return (
          <div 
            key={community._id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => isMember && handleCommunityClick(community._id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  {community.name}
                  {community.type === 'private' && (
                    <svg className="w-4 h-4 ml-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {community.description}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {community.members.length} member{community.members.length !== 1 ? 's' : ''}
                  </p>
                  {isPending && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">
                      Request Pending
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isMember) {
                    onLeaveCommunity(community._id);
                  } else if (community.type === 'private') {
                    onJoinCommunity(community._id, true); // true indicates it's a join request
                  } else {
                    onJoinCommunity(community._id, false); // false for public communities
                  }
                }}
                disabled={isPending}
                className={`px-3 py-1 rounded-full text-sm ${
                  isPending
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isMember
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                    : community.type === 'private'
                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'
                } transition-colors`}
              >
                {isPending 
                  ? 'Pending'
                  : isMember 
                  ? 'Leave' 
                  : community.type === 'private'
                  ? 'Request to Join'
                  : 'Join'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommunityList; 