import React, { useState, useEffect } from 'react';
import { NEWS_API_KEY, NEWS_API_URL } from '../config/api';

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Updated query to focus on European football/soccer
        const response = await fetch(
          `${NEWS_API_URL}/everything?` +
          `q=(soccer OR "premier league" OR "la liga" OR "serie a" OR "bundesliga" OR "champions league")` +
          `&language=en` +
          `&sortBy=publishedAt` +
          `&apiKey=${NEWS_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        // Filter out American football articles
        const filteredNews = data.articles
          .filter(article => 
            !article.title.toLowerCase().includes('nfl') &&
            !article.title.toLowerCase().includes('american football') &&
            !article.title.toLowerCase().includes('super bowl')
          )
          .slice(0, 5);
        
        setNews(filteredNews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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
      <h2 className="text-2xl font-bold mb-4">Latest Football News</h2>
      <div className="space-y-4">
        {news.length === 0 ? (
          <p className="text-gray-500">No news available at the moment.</p>
        ) : (
          news.map((article, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <h3 className="text-lg font-semibold text-gray-800">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  {article.title}
                </a>
              </h3>
              <p className="text-gray-600 mt-1">{article.description}</p>
              <div className="flex items-center mt-2 text-sm text-gray-400">
                <span>{article.source.name}</span>
                <span className="mx-2">•</span>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LatestNews; 