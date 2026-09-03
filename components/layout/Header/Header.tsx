import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, MessageSquare, Plus, Sun, Moon, Laptop, LogOut, User as UserIcon, Settings, Bookmark } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useNotifications } from '../../../hooks/useNotifications';
import { Avatar } from '../../common/Avatar/Avatar';
import { DropdownMenu } from '../../common/DropdownMenu/DropdownMenu';
import { APP_NAME } from '../../../utils/constants';

export const Header: React.FC<{ onOpenCreatePost?: () => void }> = ({ onOpenCreatePost }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const { unreadCount } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const themeIcons = {
    light: <Sun className="w-4 h-4 text-amber-500" />,
    dark: <Moon className="w-4 h-4 text-indigo-400" />,
    system: <Laptop className="w-4 h-4 text-slate-400" />,
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/home" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <span className="text-lg font-black tracking-tight">K</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent hidden sm:inline-block">
            {APP_NAME}
          </span>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search people, posts, or #tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full bg-slate-100 dark:bg-slate-800/70 border border-transparent focus:border-brand-500/50 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Post (Desktop) */}
          {onOpenCreatePost && (
            <button
              onClick={onOpenCreatePost}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm hover:shadow-brand-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </button>
          )}

          {/* Theme Mode Toggle */}
          <button
            onClick={() => {
              if (theme === 'light') setTheme('dark');
              else if (theme === 'dark') setTheme('system');
              else setTheme('light');
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Theme: ${theme} (Click to toggle)`}
            aria-label="Toggle theme"
          >
            {themeIcons[theme]}
          </button>

          {/* Messages Link */}
          <Link
            to="/messages"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Messages"
          >
            <MessageSquare className="w-5 h-5" />
          </Link>

          {/* Notifications Link with dynamic badge */}
          <Link
            to="/notifications"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </Link>

          {/* User Profile Menu */}
          {user && (
            <DropdownMenu
              trigger={<Avatar src={user.avatar} name={user.name} size="sm" status="online" />}
              items={[
                {
                  id: 'profile',
                  label: `@${user.username}`,
                  icon: <UserIcon className="w-4 h-4 text-brand-500" />,
                  onClick: () => navigate(`/profile/${user.username}`),
                },
                {
                  id: 'bookmarks',
                  label: 'Bookmarks',
                  icon: <Bookmark className="w-4 h-4" />,
                  onClick: () => navigate('/bookmarks'),
                },
                {
                  id: 'settings',
                  label: 'Settings',
                  icon: <Settings className="w-4 h-4" />,
                  onClick: () => navigate('/settings'),
                },
                {
                  id: 'logout',
                  label: 'Sign Out',
                  icon: <LogOut className="w-4 h-4" />,
                  variant: 'danger',
                  onClick: () => {
                    logout();
                    navigate('/login');
                  },
                },
              ]}
            />
          )}
        </div>
      </div>
    </header>
  );
};
