import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

// Add API_URL constant
const API_URL = 'http://localhost:5001'; // Make sure this matches your backend port

const UserProfile = () => {
  const [profileData, setProfileData] = useState({
    user: null,
    discussions: [],
    loading: true,
    error: null
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const targetUserId = userId || currentUser?.phoneNumber;
        if (!targetUserId) return;

        // Fetch user data and discussions in parallel
        const [userResponse, discussionsResponse] = await Promise.all([
          fetch(`${API_URL}/api/users/${targetUserId}`),
          fetch(`${API_URL}/api/discussions/user/${targetUserId}`)
        ]);

        if (!userResponse.ok || !discussionsResponse.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const [userData, discussionsData] = await Promise.all([
          userResponse.json(),
          discussionsResponse.json()
        ]);

        setProfileData({
          user: userData,
          discussions: discussionsData,
          loading: false,
          error: null
        });

        // Check following status
        if (currentUser && userId) {
          setIsFollowing(userData.followers?.some(f => f.userId === currentUser.phoneNumber));
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setProfileData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load profile data'
        }));
      }
    };

    fetchProfileData();
  }, [userId, currentUser]);

  const handleFollow = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${profileData.user.phoneNumber}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId: currentUser.phoneNumber,
          followerName: currentUser.name,
          followerPhone: currentUser.phoneNumber,
          followerClub: currentUser.selectedClub
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to follow/unfollow user');
      }

      setIsFollowing(!isFollowing);
      
      // Update followers count immediately in UI
      setProfileData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          followers: isFollowing 
            ? prev.user.followers.filter(f => f.userId !== currentUser.phoneNumber)
            : [...prev.user.followers, { userId: currentUser.phoneNumber }]
        }
      }));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleDiscussionClick = (discussion) => {
    navigate(`/club/${discussion.clubId}`, { state: { scrollToDiscussion: discussion._id } });
  };

  const handleLikeDiscussion = async (discussionId) => {
    try {
      // Store current scroll position
      const currentScroll = window.scrollY;
      
      const response = await fetch(`${API_URL}/api/discussions/${discussionId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.phoneNumber,
          name: currentUser.name
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to like discussion');
      }

      const updatedDiscussion = await response.json();
      
      // Update discussions without causing a scroll jump
      setProfileData(prev => ({
        ...prev,
        discussions: prev.discussions.map(d => 
          d._id === discussionId ? updatedDiscussion : d
        )
      }));
      
      // Restore scroll position
      window.scrollTo(0, currentScroll);
    } catch (error) {
      console.error('Error liking discussion:', error);
    }
  };

  if (profileData.loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (profileData.error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {profileData.error}
        </div>
      </div>
    );
  }

  const isOwnProfile = !userId || userId === currentUser?.phoneNumber;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h2 className="text-3xl font-bold">
            {isOwnProfile ? 'My Profile' : `${profileData.user?.name}'s Profile`}
          </h2>
        </div>

        {/* User Information */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">User Information</h3>
            {!isOwnProfile && (
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-md ${
                  isFollowing 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-24 text-gray-600">Name:</span>
              <span className="font-medium">{profileData.user?.name}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-600">Club:</span>
              <span className="font-medium">{profileData.user?.selectedClub}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-600">Followers:</span>
              <span className="font-medium">{profileData.user?.followers?.length || 0}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-600">Following:</span>
              <span className="font-medium">{profileData.user?.following?.length || 0}</span>
            </div>
          </div>
        </div>
        
        {/* User's Discussions */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">My Discussions</h3>
          {profileData.discussions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No discussions yet</p>
          ) : (
            <div className="space-y-4">
              {profileData.discussions.map((discussion) => (
                <div 
                  key={discussion._id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleDiscussionClick(discussion)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-medium text-blue-600 hover:text-blue-800">
                      {discussion.title}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(discussion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 line-clamp-2">{discussion.content}</p>
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      {discussion.likes?.length || 0} likes
                    </span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {discussion.comments?.length || 0} comments
                    </span>
                    <span className="mx-2">•</span>
                    <span>Club: {discussion.clubId}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 