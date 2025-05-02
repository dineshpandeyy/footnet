import React, { useState, useEffect } from 'react';
import { FOOTBALL_API_KEY } from '../config/api';

const ClubMatches = ({ clubId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map club IDs to API team IDs and logos
  const teamInfo = {
    'real-madrid': {
      id: 541,
      logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg'
    },
    'barcelona': {
      id: 529,
      logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg'
    },
    'manchester-united': {
      id: 33,
      logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg'
    },
    'liverpool': {
      id: 40,
      logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg'
    },
    // Add more teams as needed
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const team = teamInfo[clubId];
        if (!team) {
          throw new Error('Team not found');
        }

        const response = await fetch(
          `https://v3.football.api-sports.io/fixtures?team=${team.id}&season=2023`,
          {
            headers: {
              'x-rapidapi-host': 'v3.football.api-sports.io',
              'x-rapidapi-key': FOOTBALL_API_KEY
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }

        const data = await response.json();
        const sortedMatches = data.response.sort((a, b) =>
          new Date(a.fixture.date) - new Date(b.fixture.date)
        );
        setMatches(sortedMatches);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
    // eslint-disable-next-line
  }, [clubId]);

  const now = new Date();
  const pastMatches = matches.filter(match =>
    new Date(match.fixture.date) < now
  );
  const upcomingMatches = matches.filter(match =>
    new Date(match.fixture.date) >= now
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Club Matches</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Past Matches */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Past Matches</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {pastMatches.length === 0 ? (
              <p className="text-gray-500 text-center">No past matches available</p>
            ) : (
              pastMatches
                .slice(-20) // Show up to 20 most recent past matches
                .reverse()
                .map((match) => (
                  <div
                    key={match.fixture.id}
                    className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex-1 flex flex-col items-end">
                      <span className="font-semibold text-right">{match.teams.home.name}</span>
                      <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-8 h-8 mt-1" />
                    </div>
                    <div className="mx-4 flex flex-col items-center">
                      <span className="font-bold text-lg text-gray-800 dark:text-white">
                        {match.goals.home} - {match.goals.away}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(match.fixture.date)}</span>
                    </div>
                    <div className="flex-1 flex flex-col items-start">
                      <span className="font-semibold">{match.teams.away.name}</span>
                      <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-8 h-8 mt-1" />
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Upcoming Matches */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Upcoming Matches</h3>
          <div className="space-y-4">
            {upcomingMatches.length === 0 ? (
              <p className="text-gray-500 text-center">No upcoming matches available</p>
            ) : (
              upcomingMatches.slice(0, 5).map((match, idx) => (
                <div
                  key={match.fixture.id}
                  className={`flex items-center rounded-lg shadow p-4 border
                    ${idx === 0 ? 'bg-blue-50 dark:bg-blue-900 border-blue-400 dark:border-blue-600' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'}
                  `}
                >
                  <div className="flex-1 flex flex-col items-end">
                    <span className="font-semibold text-right">{match.teams.home.name}</span>
                    <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-8 h-8 mt-1" />
                  </div>
                  <div className="mx-4 flex flex-col items-center">
                    <span className="text-gray-500">vs</span>
                    <span className="text-xs text-gray-500">{formatDate(match.fixture.date)}</span>
                    <span className="text-xs text-gray-400">{formatTime(match.fixture.date)}</span>
                  </div>
                  <div className="flex-1 flex flex-col items-start">
                    <span className="font-semibold">{match.teams.away.name}</span>
                    <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-8 h-8 mt-1" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubMatches; 