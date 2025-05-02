import React, { useState, useEffect } from 'react';
import { NEWS_API_KEY, NEWS_API_URL } from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';

const LatestNews = () => {
  const [news, setNews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('trending');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const tabs = [
    { id: 'trending', label: 'Trending' },
    { id: 'premier-league', label: 'Premier League' },
    { id: 'la-liga', label: 'La Liga' },
    { id: 'champions-league', label: 'Champions League' }
  ];

  const queries = {
    'trending': '(soccer OR football) AND (transfer OR breaking)',
    'premier-league': '"premier league"',
    'la-liga': '"la liga"',
    'champions-league': '"champions league"'
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${NEWS_API_URL}/everything?` +
          `q=${encodeURIComponent(queries[activeTab])}` +
          `&language=en` +
          `&sortBy=publishedAt` +
          `&pageSize=20` +
          `&page=${page}` +
          `&apiKey=${NEWS_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        
        const filteredNews = data.articles.filter(article => 
          !article.title.toLowerCase().includes('nfl') &&
          !article.title.toLowerCase().includes('american football') &&
          !article.title.toLowerCase().includes('super bowl')
        );
        
        setNews(prev => ({
          ...prev,
          [activeTab]: page === 1 
            ? filteredNews 
            : [...(prev[activeTab] || []), ...filteredNews]
        }));
        setHasMore(filteredNews.length === 20);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeTab, page]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(1);
    setHasMore(true);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-4 px-6 py-4 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                ${activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* News Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {loading && page === 1 ? (
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-red-500">
                Error: {error}
              </div>
            ) : (news[activeTab]?.length || 0) === 0 ? (
              <p className="text-gray-500 text-center">No news available at the moment.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news[activeTab]?.map((article, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg 
                               hover:shadow-xl transition-shadow duration-300 border border-gray-200 
                               dark:border-gray-700 flex flex-col"
                    >
                      <div className="relative h-48 overflow-hidden">
                        {article.urlToImage ? (
                          <img 
                            src={article.urlToImage} 
                            alt={article.title}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/600x400?text=No+Image+Available';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400">No Image Available</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <span className="text-white text-sm">{article.source.name}</span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 mb-2">
                          <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {article.title}
                          </a>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-1">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 
                                     dark:hover:text-blue-300 font-medium"
                          >
                            Read More →
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                               transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Loading...' : 'Load More News'}
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LatestNews; 