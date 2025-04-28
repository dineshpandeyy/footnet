import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import Event from './models/Event.js';
import Discussion from './models/Discussion.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Create uploads directory with absolute path
const uploadsDir = path.join(__dirname, '../uploads');

// Create uploads directory if it doesn't exist
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created at:', uploadsDir);
  }
} catch (err) {
  console.error('Error creating uploads directory:', err);
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the directory exists before trying to save
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// Routes
app.post('/api/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in database with expiration
    await User.findOneAndUpdate(
      { phoneNumber },
      { 
        otp,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
      },
      { upsert: true, new: true }
    );
    
    // For development, return the OTP
    res.json({ 
      message: 'OTP sent successfully',
      otp: otp // For development only
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp, name, password, selectedClub } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber, isVerified: true });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Phone number already registered. Please login or use a different number.' 
      });
    }

    // Verify OTP
    const user = await User.findOne({ 
      phoneNumber, 
      otp,
      otpExpires: { $gt: new Date() } // Check if OTP is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with verified status
    user.name = name;
    user.password = hashedPassword;
    user.selectedClub = selectedClub;
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    
    await user.save();

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        name: user.name,
        phoneNumber: user.phoneNumber,
        selectedClub: user.selectedClub
      }
    });
  } catch (error) {
    console.error('Error in verify-otp:', error);
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Find user by phone number
    const user = await User.findOne({ phoneNumber });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Return user data (excluding password)
    const userData = {
      name: user.name,
      phoneNumber: user.phoneNumber,
      selectedClub: user.selectedClub
    };

    res.json({ user: userData });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this route for news
app.get('/api/news', (req, res) => {
  // For now, return some sample data
  const newsData = [
    {
      id: "1",
      title: "Welcome to Our Club!",
      content: "We're excited to announce the launch of our new club management system.",
      date: new Date().toISOString()
    },
    {
      id: "2",
      title: "Upcoming Events",
      content: "Stay tuned for our upcoming events calendar. More details coming soon!",
      date: new Date().toISOString()
    }
  ];
  
  res.json(newsData);
});

app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants, clubId, organizer, creatorId } = req.body;
    
    console.log('Creating new event:', {
      creatorId,
      organizer,
      clubId
    });

    const event = new Event({
      title,
      description,
      date,
      location,
      maxParticipants,
      clubId,
      organizer,
      creatorId,
      attendees: []
    });

    await event.save();
    console.log('Event created:', {
      id: event._id,
      creatorId: event.creatorId
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/events/:clubId', async (req, res) => {
  try {
    const { clubId } = req.params;
    
    if (!clubId) {
      return res.status(400).json({ message: 'Club ID is required' });
    }

    const events = await Event.find({ clubId })
      .sort({ date: 1 });
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/events/:eventId/attend', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, name } = req.body;
    
    if (!eventId || !userId) {
      return res.status(400).json({ message: 'Event ID and User ID are required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already registered
    if (event.attendees.some(a => a.userId === userId)) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Check if event is full
    if (event.attendees.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }
    
    // Add user to attendees
    event.attendees.push({ userId, name });
    await event.save();
    
    res.status(200).json({ message: 'Successfully registered for event', event });
  } catch (error) {
    console.error('Error attending event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, date, location, maxParticipants, clubId, organizer, creatorId } = req.body;

    // Find the event first
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Clean and compare the IDs
    const storedCreatorId = event.creatorId.toString().replace(/[^0-9]/g, '');
    const requestCreatorId = creatorId.toString().replace(/[^0-9]/g, '');

    console.log('Debug IDs:', {
      stored: storedCreatorId,
      request: requestCreatorId,
      original: {
        stored: event.creatorId,
        request: creatorId
      }
    });

    // Compare the cleaned numbers
    if (storedCreatorId !== requestCreatorId) {
      return res.status(403).json({ 
        message: 'Only the event creator can edit this event',
        debug: {
          stored: storedCreatorId,
          request: requestCreatorId
        }
      });
    }

    // If we get here, update is authorized
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title,
        description,
        date,
        location,
        maxParticipants
      },
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/events/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find events where the user is either the creator or an attendee
    const events = await Event.find({
      $or: [
        { creatorId: userId },
        { 'attendees.userId': userId }
      ]
    }).sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/discussions', upload.single('image'), async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);
    
    const { title, content, clubId, authorUserId, authorName } = req.body;

    // Validate required fields with detailed error message
    if (!clubId || !title || !content || !authorUserId || !authorName) {
      const missingFields = [];
      if (!clubId) missingFields.push('clubId');
      if (!title) missingFields.push('title');
      if (!content) missingFields.push('content');
      if (!authorUserId) missingFields.push('authorUserId');
      if (!authorName) missingFields.push('authorName');

      return res.status(400).json({ 
        message: 'Missing required fields',
        missingFields: missingFields,
        received: req.body
      });
    }

    const discussion = new Discussion({
      clubId,
      title,
      content,
      author: {
        userId: authorUserId,
        name: authorName
      },
      image: req.file ? `/uploads/${req.file.filename}` : null,
      likes: [],
      comments: []
    });
    
    await discussion.save();
    res.status(201).json(discussion);
  } catch (error) {
    console.error('Server error creating discussion:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/discussions/:clubId', async (req, res) => {
  try {
    const { clubId } = req.params;
    const discussions = await Discussion.find({ clubId })
      .sort({ createdAt: -1 });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/discussions/:discussionId/like', async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { userId, name } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const likeIndex = discussion.likes.findIndex(like => like.userId === userId);
    if (likeIndex === -1) {
      discussion.likes.push({ userId, name });
    } else {
      discussion.likes.splice(likeIndex, 1);
    }

    await discussion.save();
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/discussions/:discussionId/comments', async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { userId, name, content, parentCommentId } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const newComment = {
      userId,
      name,
      content,
      createdAt: new Date(),
      replies: []
    };

    if (parentCommentId) {
      // Add reply to existing comment
      const parentComment = discussion.comments.id(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
      parentComment.replies.push(newComment);
    } else {
      // Add new comment
      discussion.comments.push(newComment);
    }

    await discussion.save();
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/discussions/:discussionId/comments/:commentId/replies', async (req, res) => {
  try {
    const { discussionId, commentId } = req.params;
    const { userId, name, content, parentReplyId } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = discussion.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const newReply = {
      userId,
      name,
      content,
      createdAt: new Date(),
      likes: [],
      replies: []
    };

    if (parentReplyId) {
      // Find the parent reply in the comment's replies
      const parentReply = findReplyInReplies(comment.replies, parentReplyId);
      if (!parentReply) {
        return res.status(404).json({ message: 'Parent reply not found' });
      }
      parentReply.replies.push(newReply);
    } else {
      // Add new reply to the comment
      comment.replies.push(newReply);
    }

    await discussion.save();
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to find a reply in nested replies
function findReplyInReplies(replies, replyId) {
  for (const reply of replies) {
    if (reply._id.toString() === replyId) {
      return reply;
    }
    if (reply.replies && reply.replies.length > 0) {
      const found = findReplyInReplies(reply.replies, replyId);
      if (found) return found;
    }
  }
  return null;
}

app.post('/api/discussions/:discussionId/comments/:commentId/replies/:replyId/like', async (req, res) => {
  try {
    const { discussionId, commentId, replyId } = req.params;
    const { userId, name } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = discussion.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Find the reply in the comment's replies
    const reply = findReplyInReplies(comment.replies, replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    const likeIndex = reply.likes.findIndex(like => like.userId === userId);
    if (likeIndex === -1) {
      reply.likes.push({ userId, name });
    } else {
      reply.likes.splice(likeIndex, 1);
    }

    await discussion.save();
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/discussions/:discussionId/comments/:commentId/like', async (req, res) => {
  try {
    const { discussionId, commentId } = req.params;
    const { userId, name } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = discussion.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const likeIndex = comment.likes.findIndex(like => like.userId === userId);
    if (likeIndex === -1) {
      comment.likes.push({ userId, name });
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    await discussion.save();
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit discussion
app.put('/api/discussions/:discussionId', async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { title, content, userId } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if the user is the author
    if (discussion.author.userId !== userId) {
      return res.status(403).json({ message: 'Only the author can edit this discussion' });
    }

    discussion.title = title;
    discussion.content = content;
    await discussion.save();

    res.json(discussion);
  } catch (error) {
    console.error('Error editing discussion:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete discussion
app.delete('/api/discussions/:discussionId', async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { userId } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if the user is the author
    if (discussion.author.userId !== userId) {
      return res.status(403).json({ message: 'Only the author can delete this discussion' });
    }

    await Discussion.findByIdAndDelete(discussionId);
    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get club members
app.get('/api/clubs/:clubId/members', async (req, res) => {
  try {
    const { clubId } = req.params;
    const members = await User.find(
      { selectedClub: clubId },
      { name: 1, phoneNumber: 1, selectedClub: 1, followers: 1, following: 1 }
    );
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Follow/Unfollow user
app.post('/api/users/:userId/follow', async (req, res) => {
  try {
    const { userId } = req.params;
    const { followerId, followerName, followerPhone, followerClub } = req.body;

    // Get both users
    const [userToFollow, follower] = await Promise.all([
      User.findOne({ phoneNumber: userId }),
      User.findOne({ phoneNumber: followerId })
    ]);

    if (!userToFollow || !follower) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    const isFollowing = userToFollow.followers.some(f => f.userId === followerId);

    if (isFollowing) {
      // Unfollow
      userToFollow.followers = userToFollow.followers.filter(f => f.userId !== followerId);
      follower.following = follower.following.filter(f => f.userId !== userId);
    } else {
      // Follow
      userToFollow.followers.push({
        userId: followerId,
        name: followerName,
        phoneNumber: followerPhone,
        selectedClub: followerClub
      });
      follower.following.push({
        userId: userToFollow.phoneNumber,
        name: userToFollow.name,
        phoneNumber: userToFollow.phoneNumber,
        selectedClub: userToFollow.selectedClub
      });
    }

    await Promise.all([userToFollow.save(), follower.save()]);
    res.json({ userToFollow, follower });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this new route to get user discussions
app.get('/api/discussions/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Use lean() and only select needed fields
    const discussions = await Discussion.find({ 'author.userId': userId })
      .select('title content createdAt likes comments clubId author')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(discussions);
  } catch (error) {
    console.error('Error in /api/discussions/user/:userId:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add this new route to get user profile
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Use lean() for better performance when you don't need the full Mongoose document
    const user = await User.findOne({ phoneNumber: userId }).lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data without sensitive information
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 