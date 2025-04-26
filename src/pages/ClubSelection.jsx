import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClubSelection = () => {
  const navigate = useNavigate();
  const clubs = [
    { id: 'real-madrid', name: 'Real Madrid', logo: 'https://via.placeholder.com/64' },
    { id: 'barcelona', name: 'Barcelona', logo: 'https://via.placeholder.com/64' },
    { id: 'manchester-united', name: 'Manchester United', logo: 'https://via.placeholder.com/64' },
    { id: 'liverpool', name: 'Liverpool', logo: 'https://via.placeholder.com/64' },
    // Add more clubs
  ];

  const handleClubSelect = (clubId) => {
    // Navigate to the selected club page
    navigate(`/club/${clubId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 dark:text-white">Select a Club to Visit</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Choose any club to access its dedicated fan community and content
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clubs.map((club) => (
            <button
              key={club.id}
              onClick={() => handleClubSelect(club.id)}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center"
            >
              <img src={club.logo} alt={club.name} className="w-16 h-16 mb-4" />
              <span className="font-semibold dark:text-white">{club.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubSelection; 