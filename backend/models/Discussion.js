import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  userId: String,
  name: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [{
    userId: String,
    name: String,
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply'
  }]
});

const commentSchema = new mongoose.Schema({
  userId: String,
  name: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [{
    userId: String,
    name: String,
  }],
  replies: [replySchema]
});

const discussionSchema = new mongoose.Schema({
  clubId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null
  },
  author: {
    userId: String,
    name: String,
  },
  likes: [{
    userId: String,
    name: String,
  }],
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Discussion', discussionSchema); 