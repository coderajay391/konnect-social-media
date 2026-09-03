import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Avatar } from '../../common/Avatar/Avatar';

export interface CommentFormProps {
  onSubmit: (content: string) => Promise<any>;
  placeholder?: string;
  autoFocus?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  placeholder = 'Write a comment...',
  autoFocus = false,
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2.5 pt-2">
      <Avatar src={user.avatar} name={user.name} size="xs" />
      <div className="relative flex-1 flex items-center">
        <input
          type="text"
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus={autoFocus}
          className="w-full pl-3.5 pr-9 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-brand-500/50 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="absolute right-2 p-1 text-brand-600 disabled:opacity-30 disabled:pointer-events-none hover:text-brand-700 transition-colors"
          aria-label="Send comment"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};
