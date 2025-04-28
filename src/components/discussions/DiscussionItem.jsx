import React, { useState } from 'react';
import Comment from './Comment';
import { useNavigate } from 'react-router-dom';
// ... rest of the file content remains the same 

const DiscussionItem = ({ discussion, onLike, onComment, onLikeComment, onLikeReply, user, onEdit, onDelete }) => {
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(discussion.content);
    const [editedTitle, setEditedTitle] = useState(discussion.title);
    const [showComments, setShowComments] = useState(false);
    const [isImageFullscreen, setIsImageFullscreen] = useState(false);
    const navigate = useNavigate();
  
    const handleComment = () => {
      if (commentContent.trim()) {
        onComment(discussion._id, commentContent);
        setCommentContent('');
        setShowCommentForm(false);
      }
    };
  
    const handleLikeComment = (discussionId, commentId) => {
      onLikeComment(discussionId, commentId);
    };
  
    const isLiked = discussion.likes.some(like => like.userId === user?.phoneNumber);
  
    const isAuthor = user?.phoneNumber === discussion.author.userId;
  
    const handleEdit = () => {
      onEdit(discussion._id, {
        title: editedTitle,
        content: editedContent
      });
      setIsEditing(false);
    };
  
    const handleDelete = () => {
      console.log('Delete button clicked', {
        discussionId: discussion._id,
        onDelete: typeof onDelete
      });
      
      if (window.confirm('Are you sure you want to delete this discussion?')) {
        onDelete(discussion._id);
      }
    };
  
    const handleLike = async (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Store current scroll position
      const currentScroll = window.scrollY;
      
      // Call the like function
      await onLike(discussion._id);
      
      // Use requestAnimationFrame to ensure the scroll is restored after the DOM updates
      requestAnimationFrame(() => {
        window.scrollTo(0, currentScroll);
      });
    };
  
    return (
      <div id={discussion._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-4 transition-all duration-200 hover:shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {discussion.title}
              </h3>
            )}
            {isAuthor && (
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="text-sm px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-sm px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
  
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span 
              className="flex items-center cursor-pointer hover:text-blue-600"
              onClick={() => navigate(`/profile/${discussion.author.userId}`)}
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              {discussion.author.name}
            </span>
            <span className="mx-2">•</span>
            <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
          </div>
  
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border rounded mt-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {discussion.content}
            </p>
          )}
  
          {discussion.image && (
            <div className="mb-4">
              <img
                src={discussion.image}
                alt="Discussion"
                className="max-h-96 w-full rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsImageFullscreen(true)}
              />
            </div>
          )}
  
          {/* Fullscreen Image Modal */}
          {isImageFullscreen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
              onClick={() => setIsImageFullscreen(false)}
            >
              <div className="relative max-w-[90vw] max-h-[90vh]">
                <button
                  className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                  onClick={() => setIsImageFullscreen(false)}
                >
                  <svg 
                    className="w-8 h-8" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <img
                  src={discussion.image}
                  alt="Discussion"
                  className="max-w-full max-h-[90vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
  
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${isLiked ? 'text-blue-600' : 'hover:text-blue-600'} transition-colors`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{discussion.likes.length} likes</span>
            </button>
  
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{discussion.comments.length} comments</span>
            </button>
  
            <button
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Comment</span>
            </button>
          </div>
        </div>
  
        {showCommentForm && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Write a comment..."
              rows="2"
            />
            <button
              onClick={handleComment}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Post Comment
            </button>
          </div>
        )}
  
        {showComments && discussion.comments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
            {discussion.comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onReply={(commentId, content) => onComment(discussion._id, content, commentId)}
                onLike={(discussionId, commentId) => handleLikeComment(discussionId, commentId)}
                user={user}
                discussionId={discussion._id}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default DiscussionItem; 