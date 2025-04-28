import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api.js';

const ClubMembers = ({ clubId, currentUser }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, [clubId]);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/clubs/${clubId}/members`);
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (memberToFollow) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${memberToFollow.phoneNumber}/follow`, {
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

      // Refresh members list
      fetchMembers();
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  if (loading) return <div>Loading members...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Club Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => {
          const isFollowing = member.followers.some(f => f.userId === currentUser.phoneNumber);
          const isSelf = member.phoneNumber === currentUser.phoneNumber;

          return (
            <div 
              key={member.phoneNumber}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {member.name}
                    {isSelf && " (You)"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {member.followers.length} followers • {member.following.length} following
                  </p>
                </div>
                {!isSelf && (
                  <button
                    onClick={() => handleFollowToggle(member)}
                    className={`px-4 py-1 rounded text-sm ${
                      isFollowing 
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClubMembers; 