import React from 'react';

const UpcomingEvents = ({ events, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Upcoming Events</h2>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Upcoming Events</h2>
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center">You haven't registered for any upcoming events.</p>
        ) : (
          events.map((event) => (
            <div 
              key={event._id} 
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
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
                <span className="mx-2">•</span>
                <span>⏰ {new Date(event.date).toLocaleTimeString()}</span>
              </div>
              <div className="mt-2 text-sm text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Registered
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents; 