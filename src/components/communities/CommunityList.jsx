import React from 'react';

const CommunityList = ({ communities, onJoinCommunity, onLeaveCommunity, currentUser, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {communities.map((community) => {
        const isMember = community.members.includes(currentUser?.phoneNumber);

        return (
          <div key={community._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  {community.name}
                  {community.type === 'private' && (
                    <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {community.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {community.members.length} member{community.members.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => isMember ? onLeaveCommunity(community._id) : onJoinCommunity(community._id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  isMember
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'
                } transition-colors`}
              >
                {isMember ? 'Leave' : 'Join'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommunityList; 