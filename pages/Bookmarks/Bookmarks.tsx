import React, { useState, useEffect } from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import { Post } from '../../types';
import { postApi } from '../../services/api/postApi';
import { PostCard } from '../../components/post/PostCard/PostCard';
import { PostSkeleton } from '../../components/common/Skeleton/Skeleton';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';

export const Bookmarks: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const data = await postApi.getSavedPosts();
      setSavedPosts(data);
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleToggleSave = async (postId: string) => {
    setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
    await postApi.toggleSave(postId);
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="card-base p-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Bookmarks</h1>
          <p className="text-xs text-slate-400">All the posts and articles you've saved for later</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
          <Bookmark className="w-5 h-5 fill-current" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : savedPosts.length > 0 ? (
        <div className="space-y-4">
          {savedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={{ ...post, isSaved: true }}
              onLike={() => {}}
              onSave={handleToggleSave}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bookmark className="w-8 h-8" />}
          title="No saved bookmarks"
          description="Click the bookmark icon on any post across Pulse to save it for easy access here."
        />
      )}
    </div>
  );
};
