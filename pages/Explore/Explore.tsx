import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Compass, TrendingUp, Sparkles, Heart, MessageSquare } from 'lucide-react';
import { postApi } from '../../services/api/postApi';
import { userApi } from '../../services/api/userApi';
import { Post, User } from '../../types';
import { POST_CATEGORIES } from '../../utils/constants';
import { Avatar } from '../../components/common/Avatar/Avatar';
import { Button } from '../../components/common/Button/Button';
import { Loader } from '../../components/common/Loader/Loader';
import { cn } from '../../utils/helpers';

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get('tag') || '';
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [posts, setPosts] = useState<Post[]>([]);
  const [creators, setCreators] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const postsRes = await postApi.getFeed({
          tag: activeTag || (selectedCategory !== 'All' ? selectedCategory.toLowerCase() : undefined),
        });
        setPosts(postsRes.posts);

        const usersRes = await userApi.getAllUsers();
        setCreators(usersRes.slice(0, 3));
      } catch (err) {
        console.error('Failed to load explore data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTag, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="card-base p-6 bg-gradient-to-br from-indigo-900 via-brand-900 to-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-brand-300" />
            <span>Discover & Connect</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Explore the Pulse</h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Discover trending visual stories, insightful architectural thoughts, and inspiring creators across the globe.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {POST_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              if (activeTag) setSearchParams({});
            }}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all shadow-2xs',
              (selectedCategory === cat && !activeTag) || (activeTag && activeTag.toLowerCase() === cat.toLowerCase())
                ? 'bg-brand-600 text-white shadow-brand-500/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-500'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <Loader size="lg" text="Curating recommendations..." />
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {posts.map((post) => {
            const hasMedia = post.media && post.media.length > 0;
            const previewUrl = hasMedia
              ? post.media![0].url
              : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

            return (
              <div
                key={post.id}
                onClick={() => navigate(`/profile/${post.author.username}`)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 dark:border-slate-800/80 cursor-pointer shadow-sm"
              >
                <img
                  src={previewUrl}
                  alt={post.content.slice(0, 30)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Dark Hover Overlay with Stats and Author */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Avatar src={post.author.avatar} name={post.author.name} size="xs" />
                    <span className="text-xs font-bold truncate">@{post.author.username}</span>
                  </div>

                  <p className="text-xs line-clamp-2 text-slate-200 font-medium">{post.content}</p>

                  <div className="flex items-center justify-between text-xs font-semibold pt-1 border-t border-white/20">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                      <span>{post.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-brand-300" />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card-base p-12 text-center text-slate-400">
          <p className="text-sm font-semibold">No posts found for this category</p>
        </div>
      )}
    </div>
  );
};
