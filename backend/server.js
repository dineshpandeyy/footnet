import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import Event from './models/Event.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

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
    const { clubId, title, description, date, location, organizer, maxParticipants, creatorId } = req.body;
    
    if (!clubId || !title || !description || !date || !location || !organizer || !maxParticipants || !creatorId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const event = new Event({
      clubId,
      title,
      description,
      date,
      location,
      organizer,
      creatorId,
      maxParticipants,
      attendees: []
    });
    
    await event.save();
    
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    const { userId, ...updateData } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creatorId !== userId) {
      return res.status(403).json({ message: 'Only the event creator can edit this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true }
    );

    res.json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 