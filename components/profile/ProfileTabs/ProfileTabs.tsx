import React from 'react';
import { Grid, Image, Heart, Bookmark } from 'lucide-react';
import { cn } from '../../../utils/helpers';

export type ProfileTabType = 'posts' | 'media' | 'likes' | 'saved';

export interface ProfileTabsProps {
  activeTab: ProfileTabType;
  onTabChange: (tab: ProfileTabType) => void;
  isOwner?: boolean;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange, isOwner }) => {
  const tabs = [
    { id: 'posts', label: 'Posts', icon: <Grid className="w-4 h-4" /> },
    { id: 'media', label: 'Media', icon: <Image className="w-4 h-4" /> },
    { id: 'likes', label: 'Likes', icon: <Heart className="w-4 h-4" /> },
  ];

  if (isOwner) {
    tabs.push({ id: 'saved', label: 'Saved', icon: <Bookmark className="w-4 h-4" /> });
  }

  return (
    <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-1 shadow-sm">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as ProfileTabType)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all',
              isActive
                ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 shadow-2xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
