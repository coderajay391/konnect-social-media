import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search as SearchIcon, Users, FileText, Hash, X, History } from 'lucide-react';
import { userApi } from '../../services/api/userApi';
import { useDebounce } from '../../hooks/useDebounce';
import { User, Post } from '../../types';
import { Avatar } from '../../components/common/Avatar/Avatar';
import { Button } from '../../components/common/Button/Button';
import { PostCard } from '../../components/post/PostCard/PostCard';
import { Loader } from '../../components/common/Loader/Loader';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';
import { storage } from '../../utils/storage';
import { STORAGE_KEYS } from '../../utils/constants';
import { cn } from '../../utils/helpers';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'top' | 'people' | 'posts' | 'tags'>('top');
  const [results, setResults] = useState<{ users: User[]; posts: Post[]; tags: string[] }>({
    users: [],
    posts: [],
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    return storage.get<string[]>(STORAGE_KEYS.RECENT_SEARCHES, ['react', 'sarah', 'dolomites']);
  });

  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    const executeSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults({ users: [], posts: [], tags: [] });
        return;
      }

      setLoading(true);
      try {
        const data = await userApi.search(debouncedQuery.trim());
        setResults(data);

        // Update search URL param
        setSearchParams({ q: debouncedQuery.trim() });

        // Save to recent searches
        setRecentSearches((prev) => {
          const updated = [debouncedQuery.trim(), ...prev.filter((s) => s.toLowerCase() !== debouncedQuery.toLowerCase())].slice(0, 8);
          storage.set(STORAGE_KEYS.RECENT_SEARCHES, updated);
          return updated;
        });
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  }, [debouncedQuery, setSearchParams]);

  const handleRemoveRecent = (term: string) => {
    const updated = recentSearches.filter((t) => t !== term);
    setRecentSearches(updated);
    storage.set(STORAGE_KEYS.RECENT_SEARCHES, updated);
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
    storage.set(STORAGE_KEYS.RECENT_SEARCHES, []);
  };

  return (
    <div className="space-y-5">
      {/* Search Input Box */}
      <div className="card-base p-4">
        <div className="relative flex items-center">
          <SearchIcon className="w-5 h-5 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search creators, keywords, or #hashtags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        {query.trim() && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            {[
              { id: 'top', label: 'Top' },
              { id: 'people', label: `People (${results.users.length})` },
              { id: 'posts', label: `Posts (${results.posts.length})` },
              { id: 'tags', label: `Tags (${results.tags.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors',
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recent Searches (when query is empty) */}
      {!query.trim() && (
        <div className="card-base p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <History className="w-4 h-4 text-slate-400" />
              <span>Recent Searches</span>
            </div>
            {recentSearches.length > 0 && (
              <button
                onClick={handleClearAllRecent}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {recentSearches.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {recentSearches.map((term) => (
                <div
                  key={term}
                  onClick={() => setQuery(term)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span>{term}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveRecent(term);
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No recent searches</p>
          )}
        </div>
      )}

      {/* Search Results Display */}
      {loading ? (
        <Loader size="md" text="Searching Pulse..." />
      ) : query.trim() ? (
        <div className="space-y-4">
          {/* People Section */}
          {(activeTab === 'top' || activeTab === 'people') && results.users.length > 0 && (
            <div className="card-base p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">People</h3>
              <div className="space-y-2">
                {results.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <Link to={`/profile/${user.username}`} className="flex items-center gap-3 min-w-0">
                      <Avatar src={user.avatar} name={user.name} size="md" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
                      </div>
                    </Link>
                    <Link to={`/profile/${user.username}`}>
                      <Button size="sm" variant="outline" className="rounded-full text-xs px-3 py-1">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags Section */}
          {(activeTab === 'top' || activeTab === 'tags') && results.tags.length > 0 && (
            <div className="card-base p-4 space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hashtags</h3>
              <div className="flex flex-wrap gap-2">
                {results.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/explore?tag=${tag}`)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Hash className="w-3.5 h-3.5 text-brand-500" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Posts Section */}
          {(activeTab === 'top' || activeTab === 'posts') && results.posts.length > 0 && (
            <div className="space-y-4">
              {results.posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => {}}
                  onSave={() => {}}
                />
              ))}
            </div>
          )}

          {results.users.length === 0 && results.posts.length === 0 && results.tags.length === 0 && (
            <EmptyState
              icon={<SearchIcon className="w-6 h-6" />}
              title="No results found"
              description={`We couldn't find anything matching "${query}". Try checking for spelling or searching for a different keyword.`}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};
