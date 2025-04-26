import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClubMatches from '../components/ClubMatches';
import { NEWS_API_KEY, NEWS_API_URL } from '../config/api';

const ClubPage = () => {
  const { clubId } = useParams();
  const [activeTab, setActiveTab] = useState('discussion');
  const [clubNews, setClubNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);

  const clubData = {
    'real-madrid': {
      name: 'Real Madrid',
      logo: 'https://via.placeholder.com/100',
      banner: 'https://via.placeholder.com/1200x300',
      description: 'Official Real Madrid fan community. Join discussions, share news, and connect with fellow Madridistas.',
      news: [
        { id: 1, title: 'Champions League Quarter-Final Draw', date: '2024-03-15', excerpt: 'Real Madrid will face Manchester City in the quarter-finals...' },
        { id: 2, title: 'Bellingham Wins Player of the Month', date: '2024-03-10', excerpt: 'Jude Bellingham has been named La Liga Player of the Month...' },
      ],
      events: [
        { id: 1, title: 'El Clásico Watch Party', date: '2024-04-21', location: 'Madrid Fan Club' },
        { id: 2, title: 'Champions League Screening', date: '2024-04-09', location: 'Santiago Bernabéu' },
      ],
      discussions: [
        { id: 1, title: 'Match Preview: Real Madrid vs Barcelona', author: 'Madridista123', replies: 45 },
        { id: 2, title: 'Transfer Rumors: Mbappé to Madrid?', author: 'HalaMadrid', replies: 78 },
      ],
    },
    'barcelona': {
      name: 'Barcelona',
      logo: 'https://via.placeholder.com/100',
      banner: 'https://via.placeholder.com/1200x300',
      description: 'Official Barcelona fan community. Join discussions, share news, and connect with fellow Culés.',
      news: [
        { id: 1, title: 'La Liga Title Race Heats Up', date: '2024-03-14', excerpt: 'Barcelona remains in the hunt for the La Liga title...' },
        { id: 2, title: 'Xavi\'s Tactical Masterclass', date: '2024-03-12', excerpt: 'Xavi\'s new formation proves successful...' },
      ],
      events: [
        { id: 1, title: 'Camp Nou Tour', date: '2024-04-15', location: 'Camp Nou' },
        { id: 2, title: 'Fan Meetup', date: '2024-04-05', location: 'Barcelona City Center' },
      ],
      discussions: [
        { id: 1, title: 'El Clásico Predictions', author: 'Cule4Life', replies: 32 },
        { id: 2, title: 'Youth Academy Updates', author: 'LaMasia', replies: 56 },
      ],
    },
    // Add more clubs as needed
  };

  const club = clubData[clubId] || {
    name: 'Club Not Found',
    logo: 'https://via.placeholder.com/100',
    banner: 'https://via.placeholder.com/1200x300',
    description: 'This club page does not exist.',
  };

  const tabs = [
    { id: 'discussion', label: 'Discussion' },
    { id: 'news', label: 'News' },
    { id: 'matches', label: 'Matches' },
    { id: 'events', label: 'Events' },
    { id: 'members', label: 'Members' },
  ];

  // Update the clubSearchTerms to be more specific
  const clubSearchTerms = {
    'real-madrid': 'Real Madrid AND (football OR soccer) AND NOT (basketball OR handball)',
    'barcelona': 'FC Barcelona AND (football OR soccer) AND NOT (basketball OR handball)',
    'manchester-united': 'Manchester United AND (football OR soccer) AND NOT (basketball OR handball)',
    'liverpool': 'Liverpool FC AND (football OR soccer) AND NOT (basketball OR handball)',
  };

  useEffect(() => {
    const fetchClubNews = async () => {
      if (activeTab === 'news') {
        setNewsLoading(true);
        setNewsError(null);
        try {
          const searchTerm = clubSearchTerms[clubId];
          if (!searchTerm) {
            throw new Error('Club not found');
          }

          const response = await fetch(
            `${NEWS_API_URL}/everything?` +
            `q=${encodeURIComponent(searchTerm)}` +
            `&language=en` +
            `&sortBy=publishedAt` +
            `&apiKey=${NEWS_API_KEY}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch news');
          }

          const data = await response.json();
          const filteredNews = data.articles
            .filter(article => {
              // Additional filtering for Real Madrid
              if (clubId === 'real-madrid') {
                return (
                  !article.title.toLowerCase().includes('basketball') &&
                  !article.title.toLowerCase().includes('handball') &&
                  !article.title.toLowerCase().includes('nfl') &&
                  !article.title.toLowerCase().includes('american football')
                );
              }
              // Similar filtering for other clubs
              return true;
            })
            .slice(0, 5);

          setClubNews(filteredNews);
        } catch (err) {
          setNewsError(err.message);
        } finally {
          setNewsLoading(false);
        }
      }
    };

    fetchClubNews();
  }, [activeTab, clubId]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Banner Section */}
      <div className="relative h-64">
        <img 
          src={club.banner} 
          alt={`${club.name} banner`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <img 
              src={club.logo} 
              alt={`${club.name} logo`} 
              className="w-24 h-24 mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold text-white">{club.name}</h1>
            <p className="text-white mt-2">{club.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          {activeTab === 'discussion' && (
            <div className="space-y-4">
              {club.discussions?.map((discussion) => (
                <div key={discussion.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {discussion.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    By {discussion.author} • {discussion.replies} replies
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-4">
              {newsLoading ? (
                <div className="flex justify-center items-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : newsError ? (
                <div className="p-4 text-red-500">
                  Error: {newsError}
                </div>
              ) : clubNews.length === 0 ? (
                <p className="text-gray-500 text-center">No news available at the moment.</p>
              ) : (
                clubNews.map((article, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {article.title}
                      </a>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {article.description}
                    </p>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Source: {article.source.name}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'matches' && (
            <ClubMatches clubId={clubId} />
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              {club.events?.map((event) => (
                <div key={event.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {event.date} • {event.location}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Members section coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubPage; 