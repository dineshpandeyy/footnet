import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  selectedClub: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  followers: [{
    userId: String,
    name: String,
    phoneNumber: String,
    selectedClub: String
  }],
  following: [{
    userId: String,
    name: String,
    phoneNumber: String,
    selectedClub: String
  }],
});

// Drop the old email index if it exists
userSchema.index({ email: 1 }, { unique: true, sparse: true });

const User = mongoose.model('User', userSchema);

export default User; 