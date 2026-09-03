import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileHeader } from '../../components/profile/ProfileHeader/ProfileHeader';
import { ProfileTabs, ProfileTabType } from '../../components/profile/ProfileTabs/ProfileTabs';
import { PostCard } from '../../components/post/PostCard/PostCard';
import { PostSkeleton } from '../../components/common/Skeleton/Skeleton';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';
import { useProfile } from '../../hooks/useProfile';
import { usePosts } from '../../hooks/usePosts';
import { Image, FileText, Heart, Bookmark } from 'lucide-react';

export const Profile: React.FC = () => {
  const { username = '' } = useParams<{ username: string }>();
  const { profile, userPosts, loading, isOwner, toggleFollow, updateProfile } = useProfile(username);
  const { toggleLike, toggleSave, deletePost, updatePost } = usePosts({ autoFetch: false });
  const [activeTab, setActiveTab] = useState<ProfileTabType>('posts');

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="card-base h-64 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <PostSkeleton />
      </div>
    );
  }

  if (!profile) {
    return (
      <EmptyState
        icon={<FileText className="w-8 h-8" />}
        title="User not found"
        description="The account you are looking for does not exist or has been deactivated."
      />
    );
  }

  // Filter content based on active tab
  const mediaPosts = userPosts.filter((p) => p.media && p.media.length > 0);
  const likedPosts = userPosts.filter((p) => p.isLiked);
  const savedPosts = userPosts.filter((p) => p.isSaved);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                onSave={toggleSave}
                onUpdate={updatePost}
                onDelete={deletePost}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No posts yet"
            description={`@${profile.username} hasn't posted anything yet.`}
          />
        );

      case 'media':
        return mediaPosts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mediaPosts.map((post) => (
              <div
                key={post.id}
                className="aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <img
                  src={post.media![0].url}
                  alt="Media"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Image className="w-6 h-6" />}
            title="No media shared"
            description="Photos and videos shared in posts will appear here."
          />
        );

      case 'likes':
        return likedPosts.length > 0 ? (
          <div className="space-y-4">
            {likedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                onSave={toggleSave}
                onUpdate={updatePost}
                onDelete={deletePost}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart className="w-6 h-6" />}
            title="No liked posts"
            description="Posts you've liked will show up here."
          />
        );

      case 'saved':
        return savedPosts.length > 0 ? (
          <div className="space-y-4">
            {savedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                onSave={toggleSave}
                onUpdate={updatePost}
                onDelete={deletePost}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Bookmark className="w-6 h-6" />}
            title="No bookmarks"
            description="Save posts to view them later in your bookmarks."
          />
        );
    }
  };

  return (
    <div className="space-y-5">
      <ProfileHeader
        user={profile}
        isOwner={isOwner}
        onFollowToggle={toggleFollow}
        onUpdateProfile={updateProfile}
      />

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} isOwner={isOwner} />

      <div className="pt-1">{renderTabContent()}</div>
    </div>
  );
};
