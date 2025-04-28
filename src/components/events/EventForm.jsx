import React, { useState, useEffect } from 'react';

const EventForm = ({ clubId, onEventCreated, onEventEdited, editingEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxParticipants: 50,
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description,
        date: new Date(editingEvent.date).toISOString().slice(0, 16),
        location: editingEvent.location,
        maxParticipants: editingEvent.maxParticipants,
      });
    }
  }, [editingEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingEvent) {
      onEventEdited(editingEvent._id, formData);
    } else {
      onEventCreated(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      <input
        type="text"
        placeholder="Event Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="p-2 border rounded"
        required
      />
      <textarea
        placeholder="Event Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="p-2 border rounded"
        required
      />
      <input
        type="datetime-local"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Maximum Participants"
        value={formData.maxParticipants}
        onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
        className="p-2 border rounded"
        required
        min="1"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {editingEvent ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  );
};

export default EventForm; 