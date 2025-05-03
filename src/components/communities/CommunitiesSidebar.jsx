import React, { useState, useEffect } from 'react';
import { CommunitiesPanel } from './index';

const API_URL = 'http://localhost:5001';

const CommunitiesSidebar = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    if (currentUser?.selectedClub) {
      fetchCommunities();
    }
  }, [currentUser?.selectedClub]);

  const fetchCommunities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/communities?clubId=${currentUser.selectedClub}`);
      const data = await response.json();
      setCommunities(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching communities:', error);
      setIsLoading(false);
    }
  };

  const handleCreateCommunity = async (communityData) => {
    setIsLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`${API_URL}/api/communities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...communityData,
          creatorId: userData.phoneNumber,
          creatorName: userData.name,
          creatorPhone: userData.phoneNumber,
          clubId: userData.selectedClub
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create community');
      }

      const newCommunity = await response.json();
      setCommunities([newCommunity, ...communities]);
    } catch (error) {
      console.error('Error creating community:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`${API_URL}/api/communities/${communityId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.phoneNumber,
          name: userData.name,
          phoneNumber: userData.phoneNumber
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join community');
      }

      const updatedCommunity = await response.json();
      setCommunities(communities.map(c => 
        c._id === communityId ? updatedCommunity : c
      ));
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`${API_URL}/api/communities/${communityId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.phoneNumber
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to leave community');
      }

      const updatedCommunity = await response.json();
      setCommunities(communities.map(c => 
        c._id === communityId ? updatedCommunity : c
      ));
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  return (
    <div className="w-64 min-h-screen border-r border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
      <CommunitiesPanel
        communities={communities}
        onCreateCommunity={handleCreateCommunity}
        onJoinCommunity={handleJoinCommunity}
        onLeaveCommunity={handleLeaveCommunity}
        currentUser={currentUser}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CommunitiesSidebar; 