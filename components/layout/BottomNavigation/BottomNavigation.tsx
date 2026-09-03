import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Plus, MessageSquare, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { cn } from '../../../utils/helpers';

export interface BottomNavigationProps {
  onOpenCreatePost?: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ onOpenCreatePost }) => {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-slate-200/80 dark:border-slate-800/80 glass-panel px-4 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            cn(
              'p-2 rounded-xl flex flex-col items-center gap-0.5 text-xs font-medium transition-colors',
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            cn(
              'p-2 rounded-xl flex flex-col items-center gap-0.5 text-xs font-medium transition-colors',
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )
          }
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </NavLink>

        {/* Center Floating Post Button */}
        {onOpenCreatePost && (
          <button
            onClick={onOpenCreatePost}
            className="p-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/30 active:scale-95 transition-all -translate-y-2"
            aria-label="Create new post"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}

        <NavLink
          to="/messages"
          className={({ isActive }) =>
            cn(
              'p-2 rounded-xl flex flex-col items-center gap-0.5 text-xs font-medium transition-colors',
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )
          }
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Messages</span>
        </NavLink>

        <NavLink
          to={user ? `/profile/${user.username}` : '/login'}
          className={({ isActive }) =>
            cn(
              'p-2 rounded-xl flex flex-col items-center gap-0.5 text-xs font-medium transition-colors',
              isActive
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )
          }
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};
