import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-[calc(100vh-4rem)]">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">My Clubs</h2>
        <div className="space-y-2">
          <Link
            to="/club/real-madrid"
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <img
              src="https://via.placeholder.com/24"
              alt="Real Madrid"
              className="w-6 h-6"
            />
            <span>Real Madrid</span>
          </Link>
          <Link
            to="/club/barcelona"
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <img
              src="https://via.placeholder.com/24"
              alt="Barcelona"
              className="w-6 h-6"
            />
            <span>Barcelona</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 