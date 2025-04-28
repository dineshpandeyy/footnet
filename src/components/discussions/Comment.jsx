import React, { useState } from 'react';
// ... rest of the file content remains the same 
const Comment = ({ comment, onReply, onLike, user, discussionId }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showReplies, setShowReplies] = useState(true);
  
    const handleReply = () => {
      if (replyContent.trim()) {
        onReply(comment._id, replyContent);
        setReplyContent('');
        setShowReplyForm(false);
      }
    };
  
    const handleLike = () => {
      onLike(discussionId, comment._id);
    };
  
    const isLiked = comment.likes.some(like => like.userId === user?.phoneNumber);
  
    return (
      <div className="ml-4 mt-4 border-l-2 border-gray-200 pl-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-semibold">{comment.name}</span>
            <span className="text-gray-500 text-sm ml-2">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <button
            onClick={handleLike}
            className={`text-sm ${isLiked ? 'text-blue-600' : 'text-gray-500'}`}
          >
            {comment.likes.length} {comment.likes.length === 1 ? 'like' : 'likes'}
          </button>
        </div>
        <p className="mt-1">{comment.content}</p>
        <div className="flex space-x-4 mt-2">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-blue-600 text-sm"
          >
            Reply
          </button>
          {comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-gray-500 text-sm"
            >
              {showReplies ? 'Hide Replies' : `Show ${comment.replies.length} Replies`}
            </button>
          )}
        </div>
        {showReplyForm && (
          <div className="mt-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Write a reply..."
              rows="2"
            />
            <button
              onClick={handleReply}
              className="bg-blue-600 text-white py-1 px-3 rounded text-sm mt-2"
            >
              Post Reply
            </button>
          </div>
        )}
        {showReplies && comment.replies.map((reply) => (
          <Reply
            key={reply._id}
            reply={reply}
            onReply={(replyId, content) => onReply(comment._id, content, reply._id)}
            onLike={onLike}
            user={user}
            discussionId={discussionId}
            commentId={comment._id}
          />
        ))}
      </div>
    );
  };
  
  const Reply = ({ reply, onReply, onLike, user, discussionId, commentId, parentReplyId }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showReplies, setShowReplies] = useState(true);
  
    const handleReply = () => {
      if (replyContent.trim()) {
        onReply(reply._id, replyContent);
        setReplyContent('');
        setShowReplyForm(false);
      }
    };
  
    const handleLike = () => {
      onLike(discussionId, commentId, reply._id);
    };
  
    const isLiked = reply.likes.some(like => like.userId === user?.phoneNumber);
  
    return (
      <div className="ml-4 mt-4 border-l-2 border-gray-200 pl-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-semibold">{reply.name}</span>
            <span className="text-gray-500 text-sm ml-2">
              {new Date(reply.createdAt).toLocaleDateString()}
            </span>
          </div>
          <button
            onClick={handleLike}
            className={`text-sm ${isLiked ? 'text-blue-600' : 'text-gray-500'}`}
          >
            {reply.likes.length} {reply.likes.length === 1 ? 'like' : 'likes'}
          </button>
        </div>
        <p className="mt-1">{reply.content}</p>
        <div className="flex space-x-4 mt-2">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-blue-600 text-sm"
          >
            Reply
          </button>
          {reply.replies && reply.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-gray-500 text-sm"
            >
              {showReplies ? 'Hide Replies' : `Show ${reply.replies.length} Replies`}
            </button>
          )}
        </div>
        {showReplyForm && (
          <div className="mt-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Write a reply..."
              rows="2"
            />
            <button
              onClick={handleReply}
              className="bg-blue-600 text-white py-1 px-3 rounded text-sm mt-2"
            >
              Post Reply
            </button>
          </div>
        )}
        {showReplies && reply.replies && reply.replies.map((nestedReply) => (
          <Reply
            key={nestedReply._id}
            reply={nestedReply}
            onReply={(replyId, content) => onReply(reply._id, content, nestedReply._id)}
            onLike={onLike}
            user={user}
            discussionId={discussionId}
            commentId={commentId}
            parentReplyId={reply._id}
          />
        ))}
      </div>
    );
  };
  
  export default Comment; 