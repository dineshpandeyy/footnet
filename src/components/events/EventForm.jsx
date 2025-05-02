import React, { useState, useEffect } from 'react';

const EventForm = ({ clubId, onEventCreated, onEventEdited, editingEvent, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxParticipants: 50,
  });
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (new Date(formData.date) < new Date()) newErrors.date = 'Date must be in the future';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.maxParticipants < 1) newErrors.maxParticipants = 'Must allow at least 1 participant';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingEvent) {
      onEventEdited(editingEvent._id, formData);
    } else {
      onEventCreated(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      <div>
        <input
          type="text"
          placeholder="Event Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`p-2 border rounded w-full ${errors.title ? 'border-red-500' : ''}`}
          disabled={isSubmitting}
          required
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
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
        disabled={isSubmitting}
        className={`
          py-2 px-4 rounded
          ${isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
          }
          text-white transition-colors
        `}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {editingEvent ? 'Updating...' : 'Creating...'}
          </span>
        ) : (
          editingEvent ? 'Update Event' : 'Create Event'
        )}
      </button>
    </form>
  );
};

export default EventForm; 