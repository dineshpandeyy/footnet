# Football Connect

A social platform for football fans to connect, discuss matches, and follow their favorite clubs.

## Features

- 👤 User authentication with phone number
- ⚽ Club-specific discussion boards (Real Madrid, Barcelona)
- 💬 Create and interact with discussions
- 👥 Follow/unfollow other users
- 📱 View user profiles and their activity

## Setup

### Prerequisites
- Node.js
- MongoDB
- npm

### Installation

1. Install dependencies:
   ```bash
   # Frontend dependencies
   npm install

   # Backend dependencies
   cd backend
   npm install
   ```

2. Environment Setup:
   ```bash
   # Frontend (.env)
   REACT_APP_API_URL=http://localhost:5001

   # Backend (.env)
   PORT=5001
   MONGODB_URI=your_mongodb_uri
   ```

3. Start the development server:
   ```bash
   # Start backend
   cd backend
   npm run dev

   # Start frontend (new terminal)
   cd ..
   npm start
   ```
    
## Main Components

- `UserProfile`: View user info and discussions
- `DiscussionItem`: Create and interact with discussions
- `Sidebar`: Navigate between clubs
- `ClubMembers`: View and follow other club members

## Tech Stack

- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- State Management: Context API
- Routing: React Router

## Project Structure
```
football-connect/
├── src/
│   ├── components/
│   │   ├── discussions/
│   │   │   └── DiscussionItem.jsx
│   │   ├── layout/
│   │   ├── UserProfile.jsx
│   │   ├── Sidebar.jsx
│   │   └── ClubMembers.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   └── App.jsx
└── backend/
    ├── models/
    │   ├── User.js
    │   └── Discussion.js
    └── server.js
```

## API Endpoints

### User Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### User Operations
- `GET /api/users/:userId` - Get user profile
- `POST /api/users/:userId/follow` - Follow/unfollow user

### Discussions
- `GET /api/discussions/user/:userId` - Get user's discussions
- `POST /api/discussions` - Create new discussion
- `POST /api/discussions/:id/like` - Like/unlike discussion
- `POST /api/discussions/:id/comments` - Add comment


