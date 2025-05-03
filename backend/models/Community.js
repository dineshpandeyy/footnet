import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  clubId: {
    type: String,
    required: true,
  },
  creatorId: {
    type: String,
    required: true,
  },
  members: [{
    userId: String,
    name: String,
    phoneNumber: String,
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    }
  }],
  pendingMembers: [{
    userId: String,
    name: String,
    requestDate: {
      type: Date,
      default: Date.now
    }
  }],
  admins: [{
    userId: String,
    name: String
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Community', communitySchema); 