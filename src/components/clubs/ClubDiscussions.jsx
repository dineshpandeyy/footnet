import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ClubDiscussions = ({ currentUser }) => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ... existing fetch logic ...

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Club Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8
                     border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3
                         bg-clip-text text-transparent bg-gradient-to-r 
                         from-blue-600 to-indigo-600">
              {club?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {club?.description}
            </p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">
                  {club?.members?.length || 0} members
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">
                  {posts.length} posts
                </span>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPostForm(!showPostForm)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                     hover:from-blue-700 hover:to-indigo-700 text-white rounded-full 
                     shadow-lg hover:shadow-xl transition-all duration-200 
                     flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 4v16m8-8H4" />
            </svg>
            <span>New Post</span>
          </motion.button>
        </div>
      </div>

      {/* Post Creation Form */}
      <AnimatePresence>
        {showPostForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8
                     border border-gray-100 dark:border-gray-700"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700
                         text-gray-900 dark:text-gray-200 border border-gray-300
                         dark:border-gray-600 focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition-colors"
                rows="4"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg
                             bg-gray-100 dark:bg-gray-700 text-gray-700
                             dark:text-gray-300 hover:bg-gray-200
                             dark:hover:bg-gray-600 cursor-pointer
                             transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Add Image</span>
                  </label>
                  {selectedImage && (
                    <span className="text-sm text-gray-500">
                      {selectedImage.name}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600
                           hover:from-blue-700 hover:to-indigo-700 text-white
                           rounded-full shadow-md hover:shadow-lg
                           transition-all duration-200"
                >
                  Post
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6
                     border border-gray-100 dark:border-gray-700
                     hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 
                           flex items-center justify-center text-white font-semibold text-lg">
                {post.author.name[0].toUpperCase()}
              </div>
              <div className="ml-3">
                <div className="text-gray-900 dark:text-white font-medium">
                  {post.author.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()} at{' '}
                  {new Date(post.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
            
            <p className="text-gray-800 dark:text-gray-200 text-lg mb-4">
              {post.content}
            </p>
            
            {post.image && (
              <img
                src={`${API_URL}${post.image}`}
                alt="Post"
                className="rounded-lg w-full max-h-96 object-cover mb-4"
              />
            )}

            <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
              <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>{post.likes?.length || 0}</span>
              </button>

              <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{post.comments?.length || 0}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClubDiscussions; 