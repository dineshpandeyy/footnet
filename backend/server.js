import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';

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
    
    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }
    
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
    
    // Find the OTP record
    const otpRecord = await User.findOne({ 
      phoneNumber,
      otp,
      otpExpires: { $gt: new Date() } // Check if OTP hasn't expired
    });
    
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      phoneNumber,
      name,
      password: hashedPassword,
      selectedClub,
      isVerified: true
    });
    
    await user.save();
    
    // Delete the OTP record
    await User.deleteOne({ phoneNumber, otp });
    
    res.json({ 
      message: 'Account created successfully',
      user: {
        name: user.name,
        phoneNumber: user.phoneNumber,
        selectedClub: user.selectedClub
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 