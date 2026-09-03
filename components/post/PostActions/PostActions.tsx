import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Bookmark } from 'lucide-react';
import { formatNumber } from '../../../utils/formatDate';
import { copyToClipboard } from '../../../utils/helpers';
import { useToast } from '../../../context/ToastContext';

export interface PostActionsProps {
  postId: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike: () => void;
  onCommentToggle: () => void;
  onSave: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  postId,
  likesCount,
  commentsCount,
  isLiked = false,
  isSaved = false,
  onLike,
  onCommentToggle,
  onSave,
}) => {
  const [animateHeart, setAnimateHeart] = useState(false);
  const { success } = useToast();

  const handleLikeClick = () => {
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 300);
    onLike();
  };

  const handleShareClick = async () => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pulse Post',
          text: 'Check out this post on Pulse',
          url: postUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await copyToClipboard(postUrl);
    success('Post link copied to clipboard!', 'Link Copied');
  };

  return (
    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 select-none">
      {/* Like Button */}
      <button
        onClick={handleLikeClick}
        className={`flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors ${
          isLiked ? 'text-pink-600 dark:text-pink-500 font-bold' : 'hover:text-pink-600'
        }`}
        aria-label={isLiked ? 'Unlike post' : 'Like post'}
      >
        <Heart
          className={`w-4 h-4 ${isLiked ? 'fill-current text-pink-600' : ''} ${
            animateHeart ? 'animate-heart-pop' : ''
          }`}
        />
        <span>{formatNumber(likesCount)}</span>
      </button>

      {/* Comment Toggle Button */}
      <button
        onClick={onCommentToggle}
        className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-950/30 hover:text-brand-600 transition-colors"
        aria-label="Comments"
      >
        <MessageSquare className="w-4 h-4" />
        <span>{formatNumber(commentsCount)}</span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShareClick}
        className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 transition-colors"
        aria-label="Share post"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </button>

      {/* Bookmark Button */}
      <button
        onClick={onSave}
        className={`flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors ${
          isSaved ? 'text-amber-500 font-bold' : 'hover:text-amber-500'
        }`}
        aria-label={isSaved ? 'Remove bookmark' : 'Bookmark post'}
      >
        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-amber-500' : ''}`} />
      </button>
    </div>
  );
};
