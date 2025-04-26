import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  clubId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
  },
  creatorId: {
    type: String,
    required: true,
  },
  maxParticipants: {
    type: Number,
    required: true,
  },
  attendees: [{
    userId: String,
    name: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Event', eventSchema); 