import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CommunityAdminNotifications = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/communities/admin-notifications/${currentUser.phoneNumber}`
        );
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    // Set up polling or WebSocket here for real-time updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleAction = async (notificationId, action, userId, communityId) => {
    try {
      await fetch(`${API_URL}/api/communities/${communityId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, adminId: currentUser.phoneNumber })
      });

      // Remove the notification locally
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
    }
  };

  return (
    <AnimatePresence>
      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-4 z-50 w-96"
        >
          {notifications.map(notification => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-semibold">{notification.userName}</span> wants to join{' '}
                    <span className="font-semibold">{notification.communityName}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAction(
                      notification._id,
                      'approve',
                      notification.userId,
                      notification.communityId
                    )}
                    className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm
                             hover:bg-green-200 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(
                      notification._id,
                      'deny',
                      notification.userId,
                      notification.communityId
                    )}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm
                             hover:bg-red-200 transition-colors"
                  >
                    Deny
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommunityAdminNotifications; 