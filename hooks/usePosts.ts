import { useState, useEffect, useCallback } from 'react';
import { Post, PostMedia } from '../types';
import { postApi } from '../services/api/postApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export interface UsePostsOptions {
  tag?: string;
  authorId?: string;
  autoFetch?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { tag, authorId, autoFetch = true } = options;
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const fetchPosts = useCallback(
    async (pageNum = 1, append = false) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const res = await postApi.getFeed({ page: pageNum, limit: 10, tag, authorId });
        if (append) {
          setPosts((prev) => [...prev, ...res.posts]);
        } else {
          setPosts(res.posts);
        }
        setHasMore(res.hasMore);
        setPage(pageNum);
      } catch (err: any) {
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [tag, authorId]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchPosts(1, false);
    }
  }, [fetchPosts, autoFetch]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      fetchPosts(page + 1, true);
    }
  }, [loading, loadingMore, hasMore, page, fetchPosts]);

  const createPost = async (data: { content: string; media?: PostMedia[]; location?: string; visibility?: 'public' | 'followers' | 'private' }) => {
    if (!user) return null;
    try {
      const newPost = await postApi.createPost(user.id, data);
      setPosts((prev) => [newPost, ...prev]);
      success('Your post has been published!', 'Post Created');
      return newPost;
    } catch (err: any) {
      toastError(err.message || 'Failed to create post');
      throw err;
    }
  };

  const updatePost = async (postId: string, content: string) => {
    if (!user) return;
    try {
      const updated = await postApi.updatePost(postId, user.id, content);
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
      success('Post has been updated', 'Success');
    } catch (err: any) {
      toastError(err.message || 'Failed to update post');
      throw err;
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return;
    try {
      await postApi.deletePost(postId, user.id);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      success('Post removed from feed', 'Post Deleted');
    } catch (err: any) {
      toastError(err.message || 'Failed to delete post');
      throw err;
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          const likesCount = p.likesCount + (isLiked ? 1 : -1);
          return { ...p, isLiked, likesCount };
        }
        return p;
      })
    );

    try {
      await postApi.toggleLike(postId, user.id);
    } catch (err) {
      // Revert on error
      fetchPosts(1, false);
    }
  };

  const toggleSave = async (postId: string) => {
    if (!user) return;

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isSaved = !p.isSaved;
          return { ...p, isSaved };
        }
        return p;
      })
    );

    try {
      const res = await postApi.toggleSave(postId);
      if (res.isSaved) {
        success('Added to your bookmarks', 'Post Saved');
      } else {
        success('Removed from bookmarks', 'Post Unsaved');
      }
    } catch (err) {
      fetchPosts(1, false);
    }
  };

  return {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    refresh: () => fetchPosts(1, false),
    loadMore,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    toggleSave,
  };
}
