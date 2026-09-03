import { useState, useEffect, useCallback } from 'react';
import { User, Post } from '../types';
import { userApi } from '../services/api/userApi';
import { postApi } from '../services/api/postApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function useProfile(username: string) {
  const { user: currentUser, updateCurrentUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [profile, setProfile] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      const user = await userApi.getUserByUsername(username);
      setProfile(user);

      const postsRes = await postApi.getFeed({ authorId: user.id });
      setUserPosts(postsRes.posts);
    } catch (err: any) {
      setError(err.message || 'User profile not found');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const toggleFollow = async () => {
    if (!profile || !currentUser) return;

    // Optimistic toggle
    const isFollowing = !profile.isFollowing;
    const followersCount = profile.followersCount + (isFollowing ? 1 : -1);
    setProfile({ ...profile, isFollowing, followersCount });

    try {
      await userApi.toggleFollow(profile.id, currentUser.id);
      if (isFollowing) {
        success(`You are now following @${profile.username}`, 'Followed');
      } else {
        success(`Unfollowed @${profile.username}`, 'Unfollowed');
      }
    } catch {
      fetchProfileData();
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!profile || !currentUser) return;
    try {
      const updated = await userApi.updateProfile(currentUser.id, data);
      setProfile(updated);
      updateCurrentUser(updated);
      success('Profile updated successfully!', 'Profile Saved');
      return updated;
    } catch (err: any) {
      toastError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  return {
    profile,
    userPosts,
    loading,
    error,
    isOwner: currentUser?.username.toLowerCase() === username.toLowerCase(),
    refresh: fetchProfileData,
    toggleFollow,
    updateProfile,
  };
}
