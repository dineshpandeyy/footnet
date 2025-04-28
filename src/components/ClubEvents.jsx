import React, { useState, useEffect } from 'react';
import { EventForm, EventList, UpcomingEvents } from './events';

const API_URL = 'http://localhost:5001'; // Update this to match your backend URL

const ClubEvents = ({ clubId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchEvents();
  }, [clubId]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Fetch all events for the club
      const response = await fetch(`${API_URL}/api/events/${clubId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (formData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        throw new Error('User not logged in');
      }

      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          clubId,
          organizer: userData.name,
          creatorId: userData.phoneNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }

      const data = await response.json();
      setEvents([...events, data.event]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating event:', error);
      setError(error.message);
    }
  };

  const handleEditEvent = (event) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const userPhoneNumber = String(userData.phoneNumber).replace(/\s+/g, '');
    const eventCreatorId = String(event.creatorId).replace(/\s+/g, '');
    
    console.log('Edit event check:', {
      eventId: event._id,
      eventCreatorId,
      userPhoneNumber,
      areEqual: eventCreatorId === userPhoneNumber
    });
    
    if (eventCreatorId !== userPhoneNumber) {
      setError('Only the event creator can edit this event');
      return;
    }
    
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleEditSubmit = async (eventId, formData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      
      // Clean the phone number to only include digits
      const userPhoneNumber = userData.phoneNumber.toString().replace(/[^0-9]/g, '');
      
      console.log('Submitting edit:', {
        eventId,
        userPhone: userPhoneNumber,
        originalPhone: userData.phoneNumber
      });
      
      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          clubId,
          organizer: userData.name,
          creatorId: userPhoneNumber // Send cleaned phone number
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Edit failed:', responseData);
        throw new Error(responseData.message || 'Failed to update event');
      }

      setEvents(events.map(e => e._id === eventId ? responseData : e));
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
      setError(error.message);
    }
  };

  const handleAttendEvent = async (eventId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const event = events.find(e => e._id === eventId);
      
      if (!event) {
        throw new Error('Event not found');
      }

      if (event.attendees.some(a => a.userId === userData.phoneNumber)) {
        setError('You are already registered for this event');
        return;
      }

      if (event.attendees.length >= event.maxParticipants) {
        setError('Event is full');
        return;
      }

      const response = await fetch(`${API_URL}/api/events/${eventId}/attend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.phoneNumber,
          name: userData.name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to attend event');
      }

      const { event: updatedEvent } = await response.json();
      setEvents(events.map(e => e._id === eventId ? updatedEvent : e));
      setError(null);
    } catch (error) {
      console.error('Error attending event:', error);
      setError(error.message);
    }
  };

  // Filter events for display
  const userEvents = events.filter(event => 
    event.attendees.some(a => a.userId === user?.phoneNumber)
  );

  const createdEvents = events.filter(event => 
    event.creatorId === user?.phoneNumber
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Club Events</h2>
          <button
            onClick={() => {
              setEditingEvent(null);
              setShowForm(!showForm);
            }}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Create Event'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <EventForm
              clubId={clubId}
              onEventCreated={handleCreateEvent}
              onEventEdited={handleEditSubmit}
              editingEvent={editingEvent}
            />
          </div>
        )}

        <EventList 
          events={events} 
          onAttendEvent={handleAttendEvent}
          user={user}
          showEditControls={false}
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Events</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-3">Events You Created</h3>
            <EventList 
              events={createdEvents}
              onEditEvent={handleEditEvent}
              user={user}
              showEditControls={true}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Events You're Attending</h3>
            <EventList 
              events={userEvents}
              user={user}
              showEditControls={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubEvents; 