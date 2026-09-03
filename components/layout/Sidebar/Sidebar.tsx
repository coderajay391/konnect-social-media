import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  Bell,
  MessageSquare,
  Bookmark,
  User as UserIcon,
  Settings,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../hooks/useNotifications';
import { Avatar } from '../../common/Avatar/Avatar';
import { cn } from '../../../utils/helpers';

export interface SidebarProps {
  onOpenCreatePost?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreatePost }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { to: '/explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { to: '/messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    { to: '/bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-5 h-5" /> },
    {
      to: user ? `/profile/${user.username}` : '/login',
      label: 'Profile',
      icon: <UserIcon className="w-5 h-5" />,
    },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="sticky top-20 flex flex-col justify-between h-[calc(100vh-5.5rem)] py-2">
      <div className="space-y-6">
        {/* Navigation Items */}
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 group',
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                )
              }
            >
              <span className="shrink-0 transition-transform group-hover:scale-110">{link.icon}</span>
              <span className="flex-1 hidden lg:inline">{link.label}</span>
              {link.badge && (
                <span className="px-2 py-0.5 text-xs font-bold bg-brand-600 text-white rounded-full">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Primary Post Button */}
        {onOpenCreatePost && (
          <button
            onClick={onOpenCreatePost}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30 active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-5 h-5 shrink-0" />
            <span className="hidden lg:inline">Post</span>
          </button>
        )}
      </div>

      {/* User Footer Profile Card */}
      {user && (
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group">
            <button
              onClick={() => navigate(`/profile/${user.username}`)}
              className="flex items-center gap-3 text-left min-w-0 flex-1"
            >
              <Avatar src={user.avatar} name={user.name} size="md" status="online" />
              <div className="min-w-0 hidden lg:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{user.username}</p>
              </div>
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="hidden lg:block p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
