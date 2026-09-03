import React from 'react';
import { StoryList } from '../../components/story/StoryList/StoryList';
import { CreatePost } from '../../components/post/CreatePost/CreatePost';
import { PostCard } from '../../components/post/PostCard/PostCard';
import { PostSkeleton } from '../../components/common/Skeleton/Skeleton';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';
import { Button } from '../../components/common/Button/Button';
import { usePosts } from '../../hooks/usePosts';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { Sparkles, MessageCircle } from 'lucide-react';

export const Home: React.FC = () => {
  const {
    posts,
    loading,
    loadingMore,
    hasMore,
    refresh,
    loadMore,
    updatePost,
    deletePost,
    toggleLike,
    toggleSave,
  } = usePosts();

  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loadingMore);

  return (
    <div className="space-y-5">
      {/* Top Stories Circle Carousel Tray */}
      <div className="card-base p-4">
        <StoryList />
      </div>

      {/* Main Feed Post Composer */}
      <CreatePost onPostCreated={refresh} />

      {/* Posts Stream */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                onSave={toggleSave}
                onUpdate={updatePost}
                onDelete={deletePost}
              />
            ))}

            {/* Infinite Scroll Sentinel / Load More Trigger */}
            <div ref={sentinelRef} className="py-4 text-center">
              {loadingMore ? (
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-brand-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.4s]" />
                  <span>Loading more posts...</span>
                </div>
              ) : hasMore ? (
                <Button variant="outline" size="sm" onClick={loadMore}>
                  Load more posts
                </Button>
              ) : (
                <p className="text-xs text-slate-400">You're all caught up! 🎉</p>
              )}
            </div>
          </>
        ) : (
          <EmptyState
            icon={<MessageCircle className="w-6 h-6" />}
            title="No posts in your feed"
            description="Follow other creators or share your thoughts to see updates in your feed."
            actionText="Refresh Feed"
            onAction={refresh}
          />
        )}
      </div>
    </div>
  );
};
