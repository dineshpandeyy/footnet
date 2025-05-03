import React from 'react';

const CommunityAdminPanel = ({ community, onApproveRequest, onDenyRequest }) => {
  if (!community.pendingMembers?.length) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Pending Join Requests
      </h3>
      <div className="space-y-3">
        {community.pendingMembers.map(member => (
          <div key={member.userId} className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">{member.name}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => onApproveRequest(member.userId)}
                className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm
                         hover:bg-green-200 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => onDenyRequest(member.userId)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm
                         hover:bg-red-200 transition-colors"
              >
                Deny
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityAdminPanel; 