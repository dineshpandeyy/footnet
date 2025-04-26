import React from 'react';

const ClubFeed = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src="https://via.placeholder.com/48"
            alt="User"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-gray-500 text-sm">2 hours ago</p>
          </div>
        </div>
        <p className="text-gray-800">
          What a fantastic match yesterday! The team showed great character coming back from behind.
        </p>
        <div className="flex items-center space-x-4 mt-4">
          <button className="text-gray-500 hover:text-blue-600">Like</button>
          <button className="text-gray-500 hover:text-blue-600">Comment</button>
          <button className="text-gray-500 hover:text-blue-600">Share</button>
        </div>
      </div>
    </div>
  );
};

export default ClubFeed; 