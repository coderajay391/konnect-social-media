import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../../../types';
import { formatTimeOnly } from '../../../utils/formatDate';
import { cn } from '../../../utils/helpers';

export interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMine }) => {
  return (
    <div className={cn('flex flex-col mb-3', isMine ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[78%] sm:max-w-[65%] rounded-2xl p-3 shadow-xs text-xs sm:text-sm leading-relaxed break-words space-y-1.5',
          isMine
            ? 'bg-brand-600 text-white rounded-br-xs'
            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-100 dark:border-slate-700/60 rounded-bl-xs'
        )}
      >
        {message.mediaUrl && (
          <div className="rounded-xl overflow-hidden mb-1.5 max-h-56">
            <img src={message.mediaUrl} alt="Attachment" className="w-full h-full object-cover" />
          </div>
        )}

        <p>{message.text}</p>

        <div
          className={cn(
            'flex items-center justify-end gap-1 text-[10px]',
            isMine ? 'text-brand-100' : 'text-slate-400'
          )}
        >
          <span>{formatTimeOnly(message.createdAt)}</span>
          {isMine && (
            message.readBy.length > 1 ? (
              <CheckCheck className="w-3 h-3 text-brand-200" />
            ) : (
              <Check className="w-3 h-3 text-brand-200" />
            )
          )}
        </div>
      </div>
    </div>
  );
};
