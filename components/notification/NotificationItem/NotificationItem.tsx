import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageSquare, UserPlus, AtSign, Mail, Trash2, Check } from 'lucide-react';
import { Notification } from '../../../types';
import { Avatar } from '../../common/Avatar/Avatar';
import { formatRelativeTime } from '../../../utils/formatDate';
import { cn } from '../../../utils/helpers';

export interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
  onDelete,
}) => {
  const navigate = useNavigate();

  const iconMap = {
    like: <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />,
    comment: <MessageSquare className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />,
    follow: <UserPlus className="w-3.5 h-3.5 text-emerald-500" />,
    mention: <AtSign className="w-3.5 h-3.5 text-indigo-500" />,
    message: <Mail className="w-3.5 h-3.5 text-amber-500" />,
  };

  const actionTextMap = {
    like: 'liked your post',
    comment: 'commented on your post',
    follow: 'started following you',
    mention: 'mentioned you in a post',
    message: 'sent you a new message',
  };

  const handleClick = () => {
    onMarkRead(notification.id);
    if (notification.type === 'message') {
      navigate('/messages');
    } else if (notification.type === 'follow') {
      navigate(`/profile/${notification.sender.username}`);
    } else if (notification.entityId) {
      navigate('/home');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-start gap-3 p-3.5 rounded-2xl cursor-pointer transition-colors group select-none relative',
        notification.isRead
          ? 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
          : 'bg-brand-50/50 dark:bg-brand-950/20 hover:bg-brand-50/80 dark:hover:bg-brand-950/30 text-slate-900 dark:text-white'
      )}
    >
      {/* Sender Avatar with Notification Type Badge */}
      <div className="relative shrink-0">
        <Avatar src={notification.sender.avatar} name={notification.sender.name} size="md" />
        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-slate-900 shadow-xs">
          {iconMap[notification.type]}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-xs leading-relaxed">
        <p>
          <strong className="font-bold text-slate-900 dark:text-white">
            {notification.sender.name}
          </strong>{' '}
          {actionTextMap[notification.type]}
        </p>

        {notification.postPreview && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 italic">
            "{notification.postPreview}"
          </p>
        )}

        {notification.content && (
          <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2 mt-0.5">
            "{notification.content}"
          </p>
        )}

        <span className="text-[10px] text-slate-400 mt-1 block">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-brand-600 transition-colors"
            title="Mark as read"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-colors"
          title="Delete notification"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Unread indicator dot */}
      {!notification.isRead && (
        <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0 self-center" />
      )}
    </div>
  );
};
