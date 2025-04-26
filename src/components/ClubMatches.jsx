import React, { useState, useEffect } from 'react';
import { FOOTBALL_API_KEY } from '../config/api';

const ClubMatches = ({ clubId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map club IDs to API team IDs
  const teamIds = {
    'real-madrid': 541, // Real Madrid team ID
    'barcelona': 529,   // Barcelona team ID
    'manchester-united': 33, // Manchester United team ID
    'liverpool': 40,    // Liverpool team ID
    // Add more teams as needed
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const teamId = teamIds[clubId];
        if (!teamId) {
          throw new Error('Team not found');
        }

        const response = await fetch(
          `https://v3.football.api-sports.io/fixtures?team=${teamId}&season=2023`,
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
  }, [clubId]);

  const pastMatches = matches.filter(match => 
    new Date(match.fixture.date) < new Date()
  );
  const upcomingMatches = matches.filter(match => 
    new Date(match.fixture.date) >= new Date()
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Club Matches</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Past Matches</h3>
          <div className="space-y-4">
            {pastMatches.length === 0 ? (
              <p className="text-gray-500 text-center">No past matches available</p>
            ) : (
              pastMatches.map((match) => (
                <div key={match.fixture.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 text-right">
                      <span className="font-semibold">{match.teams.home.name}</span>
                    </div>
                    <div className="mx-4">
                      <span className="font-bold">
                        {match.goals.home} - {match.goals.away}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold">{match.teams.away.name}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2 text-center">
                    {formatDate(match.fixture.date)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Upcoming Matches</h3>
          <div className="space-y-4">
            {upcomingMatches.length === 0 ? (
              <p className="text-gray-500 text-center">No upcoming matches available</p>
            ) : (
              upcomingMatches.map((match) => (
                <div key={match.fixture.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 text-right">
                      <span className="font-semibold">{match.teams.home.name}</span>
                    </div>
                    <div className="mx-4">
                      <span className="text-gray-500">vs</span>
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold">{match.teams.away.name}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2 text-center">
                    {formatDate(match.fixture.date)}
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