import React, { useRef, useEffect } from 'react';
import { Phone, Video, Info, ArrowLeft } from 'lucide-react';
import { Conversation, Message } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { Avatar } from '../../common/Avatar/Avatar';
import { MessageBubble } from '../Message/MessageBubble';
import { MessageInput } from '../MessageInput/MessageInput';
import { Loader } from '../../common/Loader/Loader';

export interface ChatWindowProps {
  conversation?: Conversation;
  messages: Message[];
  loading: boolean;
  isTyping: boolean;
  typingUser?: string | null;
  onSendMessage: (text: string, mediaUrl?: string) => Promise<any>;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  loading,
  isTyping,
  typingUser,
  onSendMessage,
  onBack,
}) => {
  const { user: currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUser = conversation?.participants.find((p) => p.id !== currentUser?.id) || conversation?.participants[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!conversation || !otherUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 flex items-center justify-center mb-3">
          <Phone className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Your Messages</h3>
        <p className="text-xs text-slate-400 max-w-xs">
          Select a conversation from the list to start chatting in real-time
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Chat Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 glass-panel">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <Avatar
            src={otherUser.avatar}
            name={otherUser.name}
            size="md"
            status={otherUser.status}
          />

          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {otherUser.name}
            </h3>
            <p className="text-[10px] text-slate-400">
              {otherUser.status === 'online' ? 'Active now' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-slate-50/50 dark:bg-slate-950/30">
        {loading ? (
          <Loader size="sm" text="Loading messages..." />
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMine={msg.senderId === currentUser?.id}
            />
          ))
        )}

        {/* Real-time Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 p-2 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl w-fit animate-pulse text-[11px] text-slate-500">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            <span className="ml-1 font-medium">{typingUser || 'Typing'}...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bottom Box */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};
