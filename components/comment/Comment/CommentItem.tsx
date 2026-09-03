import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Reply, Trash2 } from 'lucide-react';
import { Comment } from '../../../types';
import { Avatar } from '../../common/Avatar/Avatar';
import { CommentForm } from '../CommentForm/CommentForm';
import { formatRelativeTime } from '../../../utils/formatDate';
import { useAuth } from '../../../context/AuthContext';

export interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReply: (content: string, parentId: string) => Promise<any>;
  onDelete: (commentId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onLike, onReply, onDelete }) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const isOwner = user?.id === comment.authorId;

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-start gap-2.5 group">
        <Link to={`/profile/${comment.author.username}`}>
          <Avatar src={comment.author.avatar} name={comment.author.name} size="xs" />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="p-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 inline-block max-w-full">
            <div className="flex items-center gap-2 mb-0.5">
              <Link
                to={`/profile/${comment.author.username}`}
                className="font-bold text-slate-900 dark:text-white hover:underline"
              >
                {comment.author.name}
              </Link>
              <span className="text-[10px] text-slate-400">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed break-words whitespace-pre-line">
              {comment.content}
            </p>
          </div>

          {/* Comment Action Links */}
          <div className="flex items-center gap-3 mt-1 ml-1 text-[11px] text-slate-500 dark:text-slate-400">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 hover:text-pink-600 transition-colors ${
                comment.isLiked ? 'text-pink-600 font-bold' : ''
              }`}
            >
              <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likesCount > 0 ? comment.likesCount : 'Like'}</span>
            </button>

            <button
              onClick={() => setShowReplyForm((prev) => !prev)}
              className="flex items-center gap-1 hover:text-brand-600 transition-colors"
            >
              <Reply className="w-3 h-3" />
              <span>Reply</span>
            </button>

            {isOwner && (
              <button
                onClick={() => onDelete(comment.id)}
                className="hover:text-red-500 transition-colors"
                title="Delete comment"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-2 pl-2">
              <CommentForm
                placeholder={`Reply to @${comment.author.username}...`}
                autoFocus={true}
                onSubmit={async (text) => {
                  await onReply(text, comment.id);
                  setShowReplyForm(false);
                }}
              />
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2.5 pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-2">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-2 group">
                  <Link to={`/profile/${reply.author.username}`}>
                    <Avatar src={reply.author.avatar} name={reply.author.name} size="xs" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="p-2 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 inline-block max-w-full">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Link
                          to={`/profile/${reply.author.username}`}
                          className="font-bold text-slate-900 dark:text-white hover:underline text-[11px]"
                        >
                          {reply.author.name}
                        </Link>
                        <span className="text-[9px] text-slate-400">
                          {formatRelativeTime(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-800 dark:text-slate-200 break-words leading-relaxed">
                        {reply.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 mt-0.5 ml-1 text-[10px] text-slate-500">
                      <button
                        onClick={() => onLike(reply.id)}
                        className={`flex items-center gap-0.5 hover:text-pink-600 ${
                          reply.isLiked ? 'text-pink-600 font-bold' : ''
                        }`}
                      >
                        <Heart className={`w-2.5 h-2.5 ${reply.isLiked ? 'fill-current' : ''}`} />
                        <span>{reply.likesCount > 0 ? reply.likesCount : 'Like'}</span>
                      </button>

                      {user?.id === reply.authorId && (
                        <button
                          onClick={() => onDelete(reply.id)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
