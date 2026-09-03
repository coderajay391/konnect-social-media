import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '../../../hooks/useNotifications';
import { NotificationItem } from '../NotificationItem/NotificationItem';
import { Loader } from '../../common/Loader/Loader';
import { EmptyState } from '../../common/EmptyState/EmptyState';
import { Button } from '../../common/Button/Button';
import { cn } from '../../../utils/helpers';

export const NotificationList: React.FC = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'likes' | 'mentions'>('all');

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'likes') return n.type === 'like';
    if (activeFilter === 'mentions') return n.type === 'mention';
    return true;
  });

  return (
    <div className="card-base p-4 sm:p-5 space-y-4">
      {/* Header with Title and Mark All Read */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-xs text-slate-500">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={markAllAsRead}
            leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'likes', label: 'Likes' },
          { id: 'mentions', label: 'Mentions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors',
              activeFilter === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      {loading ? (
        <Loader size="md" text="Loading notifications..." />
      ) : filtered.length > 0 ? (
        <div className="space-y-1.5">
          {filtered.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bell className="w-6 h-6" />}
          title="No notifications yet"
          description="When someone likes your posts, replies, or follows you, you'll see it here."
        />
      )}
    </div>
  );
};
