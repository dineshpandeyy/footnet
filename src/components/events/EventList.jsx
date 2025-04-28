import React from 'react';

const EventList = ({ events, onAttendEvent, onEditEvent, user, showEditControls }) => {
  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <p className="text-gray-500 text-center">No events available.</p>
      ) : (
        events.map((event) => {
          const isRegistered = event.attendees.some(a => a.userId === user?.phoneNumber);
          const isFull = event.attendees.length >= event.maxParticipants;
          const isCreator = event.creatorId === user?.phoneNumber;

          return (
            <div key={event._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
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
              {new Date(event.date) > new Date() && !isCreator && onAttendEvent && (
                <button
                  onClick={() => onAttendEvent(event._id)}
                  disabled={isFull || isRegistered}
                  className={`mt-2 ${
                    isFull
                      ? 'text-gray-400 cursor-not-allowed'
                      : isRegistered
                      ? 'text-green-600'
                      : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  {isFull ? 'Event Full' : isRegistered ? 'Registered' : 'Attend Event'}
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default EventList; 