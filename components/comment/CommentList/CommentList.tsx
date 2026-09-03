import React from 'react';
import { useComments } from '../../../hooks/useComments';
import { CommentItem } from '../Comment/CommentItem';
import { CommentForm } from '../CommentForm/CommentForm';
import { Loader } from '../../common/Loader/Loader';

export interface CommentListProps {
  postId: string;
}

export const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const { comments, loading, addComment, toggleLike, deleteComment } = useComments(postId);

  return (
    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
      {/* Top Add Comment input */}
      <CommentForm onSubmit={(content) => addComment(content)} />

      {/* Comments items thread */}
      {loading ? (
        <Loader size="sm" text="Loading discussion..." />
      ) : comments.length > 0 ? (
        <div className="space-y-3 pt-2">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={toggleLike}
              onReply={addComment}
              onDelete={deleteComment}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-[11px] text-slate-400 py-2">
          No comments yet. Be the first to start the conversation!
        </p>
      )}
    </div>
  );
};
