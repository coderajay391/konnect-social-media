import React from 'react';
import { Conversation } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { Avatar } from '../../common/Avatar/Avatar';
import { formatRelativeTime } from '../../../utils/formatDate';
import { cn } from '../../../utils/helpers';

export interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isActive, onSelect }) => {
  const { user: currentUser } = useAuth();

  // Identify the other participant in 1-on-1 chat
  const otherUser = conversation.participants.find((p) => p.id !== currentUser?.id) || conversation.participants[0];

  return (
    <div
      onClick={onSelect}
      className={cn(
        'flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all select-none',
        isActive
          ? 'bg-brand-50 dark:bg-brand-950/50 text-slate-900 dark:text-white shadow-2xs'
          : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
      )}
    >
      <Avatar
        src={otherUser.avatar}
        name={otherUser.name}
        size="md"
        status={otherUser.status}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white">
            {otherUser.name}
          </h4>
          {conversation.lastMessage && (
            <span className="text-[10px] text-slate-400 shrink-0">
              {formatRelativeTime(conversation.lastMessage.createdAt)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {conversation.lastMessage?.text || 'No messages yet'}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-brand-600 text-white rounded-full shrink-0">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
