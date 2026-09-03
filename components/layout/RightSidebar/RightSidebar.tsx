import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, Sparkles, UserPlus } from 'lucide-react';
import { User } from '../../../types';
import { userApi } from '../../../services/api/userApi';
import { useAuth } from '../../../context/AuthContext';
import { Avatar } from '../../common/Avatar/Avatar';
import { Button } from '../../common/Button/Button';

export const RightSidebar: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const users = await userApi.getAllUsers();
        // Filter out current user and already followed users
        const filtered = users.filter((u) => u.id !== currentUser?.id && !u.isFollowing).slice(0, 3);
        setSuggestedUsers(filtered);
      } catch (err) {
        console.error('Failed to load suggested users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [currentUser]);

  const handleFollowToggle = async (targetUser: User) => {
    if (!currentUser) return;
    try {
      await userApi.toggleFollow(targetUser.id, currentUser.id);
      setSuggestedUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
    } catch (err) {
      console.error('Failed to follow:', err);
    }
  };

  const trendingTopics = [
    { tag: 'react', postsCount: '24.5K', category: 'Technology' },
    { tag: 'webdev', postsCount: '18.2K', category: 'Coding' },
    { tag: 'designsystem', postsCount: '12.8K', category: 'Design' },
    { tag: 'dolomites', postsCount: '8.4K', category: 'Travel' },
    { tag: 'cybersecurity', postsCount: '6.1K', category: 'Security' },
  ];

  return (
    <div className="sticky top-20 space-y-5 pb-8">
      {/* Trending Topics Widget */}
      <div className="card-base p-4">
        <div className="flex items-center gap-2 mb-3.5 px-1">
          <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Trending for You</h3>
        </div>

        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            <div
              key={topic.tag}
              onClick={() => navigate(`/explore?tag=${topic.tag}`)}
              className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  Trending in {topic.category}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mt-0.5">
                #{topic.tag}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{topic.postsCount} posts</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users Widget */}
      <div className="card-base p-4">
        <div className="flex items-center gap-2 mb-3.5 px-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Who to Follow</h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center justify-between p-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="w-20 h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="w-14 h-2.5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : suggestedUsers.length > 0 ? (
          <div className="space-y-3">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-1 group">
                <Link to={`/profile/${user.username}`} className="flex items-center gap-2.5 min-w-0">
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:underline">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">@{user.username}</p>
                  </div>
                </Link>

                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full text-xs px-3 py-1 shrink-0"
                  onClick={() => handleFollowToggle(user)}
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 px-1">You're caught up with all suggestions!</p>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3 text-[11px] text-slate-400 dark:text-slate-500 space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#" className="hover:underline">About</a>
          <span>·</span>
          <a href="#" className="hover:underline">Privacy</a>
          <span>·</span>
          <a href="#" className="hover:underline">Terms</a>
          <span>·</span>
          <a href="#" className="hover:underline">Security</a>
          <span>·</span>
          <a href="#" className="hover:underline">Help</a>
        </div>
        <p>© 2026 Pulse Platform, Inc.</p>
      </div>
    </div>
  );
};
