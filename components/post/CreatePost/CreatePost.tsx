import React, { useState } from 'react';
import { Image, Send, Globe, Users, Lock, X, Smile, Hash } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { usePosts } from '../../../hooks/usePosts';
import { Avatar } from '../../common/Avatar/Avatar';
import { Button } from '../../common/Button/Button';
import { MAX_POST_LENGTH } from '../../../utils/constants';
import { PostMedia } from '../../../types';

export interface CreatePostProps {
  onPostCreated?: () => void;
  className?: string;
}

const SAMPLE_POST_IMAGES = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80',
];

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, className }) => {
  const { user } = useAuth();
  const { createPost } = usePosts({ autoFetch: false });
  const [content, setContent] = useState('');
  const [mediaList, setMediaList] = useState<PostMedia[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleAddMedia = (url: string) => {
    if (!url) return;
    const newMedia: PostMedia = {
      id: `media_${Date.now()}`,
      url,
      type: 'image',
    };
    setMediaList((prev) => [...prev, newMedia]);
    setCustomImageUrl('');
    setShowMediaPicker(false);
  };

  const handleRemoveMedia = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddTag = (tag: string) => {
    setContent((prev) => (prev ? `${prev} #${tag}` : `#${tag}`));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaList.length === 0) return;

    setIsSubmitting(true);
    try {
      await createPost({
        content: content.trim(),
        media: mediaList.length > 0 ? mediaList : undefined,
        visibility,
      });
      setContent('');
      setMediaList([]);
      if (onPostCreated) onPostCreated();
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = MAX_POST_LENGTH - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className={`card-base p-4 sm:p-5 ${className || ''}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3 items-start">
          <Avatar src={user.avatar} name={user.name} size="md" status="online" />
          <div className="flex-1 min-w-0">
            {/* Visibility Selector */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none rounded-lg px-2 py-0.5 focus:ring-1 focus:ring-brand-500 cursor-pointer"
              >
                <option value="public">🌐 Public</option>
                <option value="followers">👥 Followers</option>
                <option value="private">🔒 Only Me</option>
              </select>
            </div>

            {/* Content Textarea */}
            <textarea
              rows={3}
              placeholder="What's happening? Share thoughts, #tags or @mentions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-transparent border-none resize-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0 p-0 leading-relaxed"
            />
          </div>
        </div>

        {/* Media Attachments Preview */}
        {mediaList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
            {mediaList.map((media) => (
              <div key={media.id} className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 group">
                <img src={media.url} alt="Attachment" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(media.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Media Picker Modal Dropdown */}
        {showMediaPicker && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Choose Sample Image or Custom URL
              </span>
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              {SAMPLE_POST_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddMedia(img)}
                  className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-all opacity-80 hover:opacity-100 shrink-0"
                >
                  <img src={img} alt="Sample" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste custom image URL..."
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => handleAddMedia(customImageUrl.trim())}
                disabled={!customImageUrl.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        )}

        {/* Bottom Toolbar & Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowMediaPicker((prev) => !prev)}
              className="p-2 rounded-xl text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors"
              title="Add Image"
            >
              <Image className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleAddTag('react')}
              className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Add #tag"
            >
              <Hash className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-semibold ${
                isOverLimit
                  ? 'text-red-500 font-bold'
                  : remainingChars < 50
                  ? 'text-amber-500'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {remainingChars}
            </span>

            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              disabled={(!content.trim() && mediaList.length === 0) || isOverLimit}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Publish
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
