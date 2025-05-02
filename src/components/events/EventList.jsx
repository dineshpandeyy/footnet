import React from 'react';

const EventList = ({ events, onAttendEvent, onEditEvent, user, showEditControls, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <p className="text-gray-500 text-center">No events available.</p>
      ) : (
        events.map((event) => {
          const isRegistered = event.attendees.some(a => a.userId === user?.phoneNumber);
          const isFull = event.attendees.length >= event.maxParticipants;
          const isCreator = event.creatorId === user?.phoneNumber;
          const isEventPassed = new Date(event.date) < new Date();

          return (
            <div key={event._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-all hover:shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Organized by {event.organizer}
                  </p>
                </div>
                {showEditControls && isCreator && (
                  <button
                    onClick={() => onEditEvent(event)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {event.description}
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>📍 {event.location}</span>
                <span className="mx-2">•</span>
                <span>👤 {event.attendees.length}/{event.maxParticipants} attending</span>
              </div>
              {!isEventPassed && !isCreator && onAttendEvent && (
                <button
                  onClick={() => onAttendEvent(event._id)}
                  disabled={isFull || isRegistered}
                  className={`mt-2 px-4 py-2 rounded-md transition-colors ${
                    isFull
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isRegistered
                      ? 'bg-green-100 text-green-600'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {isFull ? 'Event Full' : isRegistered ? 'Registered' : 'Attend Event'}
                </button>
              )}
              {isEventPassed && (
                <span className="mt-2 text-orange-600 text-sm">
                  This event has already passed
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default EventList; 