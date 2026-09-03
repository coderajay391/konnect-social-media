import React, { useState } from 'react';
import { Send, Image, X } from 'lucide-react';
import { Button } from '../../common/Button/Button';

export interface MessageInputProps {
  onSendMessage: (text: string, mediaUrl?: string) => Promise<any>;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !mediaUrl.trim()) return;

    setIsSending(true);
    try {
      await onSendMessage(text.trim(), mediaUrl.trim() || undefined);
      setText('');
      setMediaUrl('');
      setShowAttach(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl">
      {/* Attached Media Preview */}
      {mediaUrl && (
        <div className="relative inline-block mb-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <img src={mediaUrl} alt="Attached" className="w-20 h-20 object-cover" />
          <button
            type="button"
            onClick={() => setMediaUrl('')}
            className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {showAttach && !mediaUrl && (
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            placeholder="Paste image URL..."
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
          <button
            type="button"
            onClick={() =>
              setMediaUrl('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80')
            }
            className="text-[10px] px-2 py-1 bg-brand-50 text-brand-600 rounded-lg"
          >
            Sample
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowAttach((prev) => !prev)}
          className="p-2 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Attach media"
        >
          <Image className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-brand-500/50 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
        />

        <Button
          type="submit"
          size="icon"
          isLoading={isSending}
          disabled={!text.trim() && !mediaUrl.trim()}
          className="shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
