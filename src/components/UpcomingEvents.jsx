import React from 'react';

const UpcomingEvents = ({ events }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Upcoming Events</h2>
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center">You haven't registered for any upcoming events.</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {event.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {event.description}
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>📍 {event.location}</span>
              </div>
              <div className="mt-2 text-sm text-green-600">
                ✓ Registered
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents; 