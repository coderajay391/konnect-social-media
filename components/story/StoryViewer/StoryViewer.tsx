import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Heart } from 'lucide-react';
import { Story } from '../../../types';
import { Avatar } from '../../common/Avatar/Avatar';
import { formatRelativeTime } from '../../../utils/formatDate';
import { useToast } from '../../../context/ToastContext';

export interface StoryViewerProps {
  stories: Story[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onStoryViewed?: (storyId: string) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex = 0,
  isOpen,
  onClose,
  onStoryViewed,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { success } = useToast();

  const currentStory = stories[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Auto progression timer
  useEffect(() => {
    if (!isOpen || isPaused || !currentStory) return;

    if (onStoryViewed) {
      onStoryViewed(currentStory.id);
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2; // ~5 seconds for 100%
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, currentStory, handleNext, onStoryViewed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !currentStory) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    success(`Reply sent to @${currentStory.user.username}`);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Close story viewer"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev Button */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous story"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Button */}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next story"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Story Container Card */}
      <div
        className="relative w-full max-w-sm h-[85vh] max-h-[720px] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl flex flex-col justify-between select-none"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Background Image */}
        <img
          src={currentStory.mediaUrl}
          alt={currentStory.caption || 'Story'}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top Gradient & Progress bars */}
        <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent space-y-3">
          {/* Segmented Progress Bars */}
          <div className="flex gap-1 w-full">
            {stories.map((story, idx) => (
              <div key={story.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Author Header */}
          <div className="flex items-center gap-2.5">
            <Avatar src={currentStory.user.avatar} name={currentStory.user.name} size="sm" />
            <div className="min-w-0 flex-1 text-white text-xs">
              <span className="font-bold drop-shadow">{currentStory.user.name}</span>
              <span className="text-white/70 ml-2 font-normal">{formatRelativeTime(currentStory.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Left & Right Touch Tap Navigation */}
        <div className="absolute inset-0 z-0 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Bottom Gradient & Caption & Reply */}
        <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-3">
          {currentStory.caption && (
            <p className="text-white text-sm font-medium drop-shadow-md leading-relaxed px-1">
              {currentStory.caption}
            </p>
          )}

          {/* Interactive Reply Input */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Reply to ${currentStory.user.name}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              className="flex-1 px-4 py-2 text-xs rounded-full bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm"
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-white text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Send reply"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => success(`Liked @${currentStory.user.username}'s story!`)}
              className="p-2 rounded-full bg-white/20 text-white hover:text-pink-400 hover:bg-white/30 transition-colors shrink-0"
              aria-label="Like story"
            >
              <Heart className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
