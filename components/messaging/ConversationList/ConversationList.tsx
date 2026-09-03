import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Conversation } from '../../../types';
import { ConversationItem } from '../ConversationItem/ConversationItem';
import { Loader } from '../../common/Loader/Loader';

export interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  loading: boolean;
  onSelectConversation: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeId,
  loading,
  onSelectConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = conversations.filter((c) =>
    c.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 space-y-3">
      {/* Top Header & Search */}
      <div className="space-y-2">
        <h2 className="text-base font-bold text-slate-900 dark:text-white px-1">Messages</h2>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {loading ? (
          <Loader size="sm" text="Loading chats..." />
        ) : filtered.length > 0 ? (
          filtered.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeId}
              onSelect={() => onSelectConversation(conv.id)}
            />
          ))
        ) : (
          <p className="text-center text-xs text-slate-400 py-6">No conversations found</p>
        )}
      </div>
    </div>
  );
};
