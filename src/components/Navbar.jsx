import React from 'react';
import { Link } from 'react-router-dom';
import UserProfile from './UserProfile';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              FootballConnect
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <UserProfile userName={user.name} />
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 