import React from 'react';
import DiscussionItem from './DiscussionItem';
// ... rest of the file content remains the same 
const DiscussionList = ({ discussions, onLike, onComment, onLikeComment, onLikeReply, onEdit, onDelete, user }) => {
    // Add console.log to debug props
    console.log('DiscussionList props:', { onEdit, onDelete });

    return (
      <div className="space-y-4">
        {discussions.length === 0 ? (
          <p className="text-gray-500 text-center">No discussions yet. Be the first to start one!</p>
        ) : (
          discussions.map((discussion) => (
            <DiscussionItem
              key={discussion._id}
              discussion={discussion}
              onLike={onLike}
              onComment={onComment}
              onLikeComment={onLikeComment}
              onLikeReply={onLikeReply}
              onEdit={onEdit}
              onDelete={onDelete}
              user={user}
            />
          ))
        )}
      </div>
    );
  };
  
  export default DiscussionList; 