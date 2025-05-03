import mongoose from 'mongoose';

const communityPostSchema = new mongoose.Schema({
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  author: {
    userId: String,
    name: String,
  },
  content: {
    type: String,
    required: true
  },
  image: String,
  likes: [{
    userId: String,
    name: String
  }],
  comments: [{
    userId: String,
    name: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('CommunityPost', communityPostSchema); 