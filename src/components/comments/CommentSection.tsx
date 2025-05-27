import React from 'react';
import { Comment } from '../../types';
import Button from '../ui/Button';

interface CommentSectionProps {
  comments: Comment[];
  commentText: string;
  setCommentText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  commentText,
  setCommentText,
  onSubmit
}) => {
  return (
    <div className="mt-6 bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
      
      {/* Add comment form */}
      <form onSubmit={onSubmit} className="mb-6">
        <div className="flex">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            rows={2}
          />
          <Button 
            type="submit" 
            disabled={!commentText.trim()}
            className="rounded-l-none"
          >
            Post
          </Button>
        </div>
      </form>
      
      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-600 overflow-hidden">
                  {comment.user.profilePicture && (
                    <img 
                      src={comment.user.profilePicture} 
                      alt={comment.user.username}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-center mb-1">
                  <span className="font-medium text-white mr-2">{comment.user.username}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;