import { useState, useEffect, useCallback } from 'react';
import { Comment } from '../types';
import { commentApi } from '../services/api/commentApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function useComments(postId: string) {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await commentApi.getComments(postId);
      setComments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (content: string, parentId?: string) => {
    if (!user) return null;
    try {
      const newComment = await commentApi.createComment(postId, user.id, content, parentId);
      if (parentId) {
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newComment],
              };
            }
            return c;
          })
        );
      } else {
        setComments((prev) => [newComment, ...prev]);
      }
      success('Comment added', 'Success');
      return newComment;
    } catch (err: any) {
      toastError(err.message || 'Failed to post comment');
      throw err;
    }
  };

  const toggleLike = async (commentId: string) => {
    // Optimistic toggle
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          const likesCount = c.likesCount + (isLiked ? 1 : -1);
          return { ...c, isLiked, likesCount };
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) => {
              if (r.id === commentId) {
                const isLiked = !r.isLiked;
                const likesCount = r.likesCount + (isLiked ? 1 : -1);
                return { ...r, isLiked, likesCount };
              }
              return r;
            }),
          };
        }
        return c;
      })
    );

    try {
      await commentApi.toggleLike(commentId);
    } catch {
      fetchComments();
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return;
    try {
      await commentApi.deleteComment(commentId, user.id);
      setComments((prev) =>
        prev
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: c.replies?.filter((r) => r.id !== commentId),
          }))
      );
      success('Comment deleted', 'Deleted');
    } catch (err: any) {
      toastError(err.message || 'Failed to delete comment');
    }
  };

  return {
    comments,
    loading,
    error,
    refresh: fetchComments,
    addComment,
    toggleLike,
    deleteComment,
  };
}
