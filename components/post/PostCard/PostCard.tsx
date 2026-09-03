import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BadgeCheck, MapPin } from 'lucide-react';
import { Post } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { Avatar } from '../../common/Avatar/Avatar';
import { PostMedia } from '../PostMedia/PostMedia';
import { PostActions } from '../PostActions/PostActions';
import { PostMenu } from '../PostMenu/PostMenu';
import { EditPostModal } from '../EditPostModal/EditPostModal';
import { ReportModal } from '../ReportModal/ReportModal';
import { ConfirmDialog } from '../../common/ConfirmDialog/ConfirmDialog';
import { CommentList } from '../../comment/CommentList/CommentList';
import { formatRelativeTime } from '../../../utils/formatDate';

export interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onUpdate?: (postId: string, content: string) => Promise<void>;
  onDelete?: (postId: string) => Promise<void>;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onSave,
  onUpdate,
  onDelete,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === post.authorId;

  // Helper to parse content and render clickable hashtags and mentions
  const renderFormattedContent = (content: string) => {
    const words = content.split(/(\s+)/);
    return words.map((word, i) => {
      if (word.startsWith('#') && word.length > 1) {
        const tag = word.slice(1).replace(/[^a-zA-Z0-9_]/g, '');
        return (
          <span
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/explore?tag=${tag}`);
            }}
            className="text-brand-600 dark:text-brand-400 font-semibold hover:underline cursor-pointer"
          >
            {word}
          </span>
        );
      }
      if (word.startsWith('@') && word.length > 1) {
        const username = word.slice(1).replace(/[^a-zA-Z0-9_]/g, '');
        return (
          <span
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${username}`);
            }}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
          >
            {word}
          </span>
        );
      }
      return word;
    });
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(post.id);
      setIsDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="card-base p-4 sm:p-5 transition-shadow hover:shadow-md">
      {/* Post Author Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={`/profile/${post.author.username}`}>
            <Avatar src={post.author.avatar} name={post.author.name} size="md" status={post.author.status} />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to={`/profile/${post.author.username}`}
                className="font-bold text-sm text-slate-900 dark:text-white hover:underline truncate"
              >
                {post.author.name}
              </Link>
              {post.author.verified && (
                <BadgeCheck className="w-4 h-4 text-brand-500 fill-brand-500/20 shrink-0" />
              )}
              <span className="text-xs text-slate-400 dark:text-slate-500">
                @{post.author.username}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
              <span className="text-xs text-slate-400 dark:text-slate-500" title={post.createdAt}>
                {formatRelativeTime(post.createdAt)}
              </span>
            </div>

            {post.location && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{post.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Options Context Menu */}
        <PostMenu
          postId={post.id}
          isOwner={isOwner}
          onEdit={onUpdate ? () => setIsEditOpen(true) : undefined}
          onDelete={onDelete ? () => setIsDeleteOpen(true) : undefined}
          onReport={() => setIsReportOpen(true)}
        />
      </div>

      {/* Post Text Content */}
      <div className="mt-3 text-sm text-slate-800 dark:text-slate-200 leading-relaxed break-words whitespace-pre-line">
        {renderFormattedContent(post.content)}
      </div>

      {/* Post Media Attachments */}
      <PostMedia media={post.media} />

      {/* Post Interactive Actions */}
      <PostActions
        postId={post.id}
        likesCount={post.likesCount}
        commentsCount={post.commentsCount}
        sharesCount={post.sharesCount}
        isLiked={post.isLiked}
        isSaved={post.isSaved}
        onLike={() => onLike(post.id)}
        onCommentToggle={() => setShowComments((prev) => !prev)}
        onSave={() => onSave(post.id)}
      />

      {/* Inline Threaded Comments */}
      {showComments && <CommentList postId={post.id} />}

      {/* Edit Modal */}
      {onUpdate && (
        <EditPostModal
          post={post}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={onUpdate}
        />
      )}

      {/* Report Modal */}
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </article>
  );
};
