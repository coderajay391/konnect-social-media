import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Story } from '../../../types';
import { storyApi } from '../../../services/api/storyApi';
import { useAuth } from '../../../context/AuthContext';
import { Avatar } from '../../common/Avatar/Avatar';
import { StoryViewer } from '../StoryViewer/StoryViewer';
import { CreateStoryModal } from '../CreateStory/CreateStoryModal';

export const StoryList: React.FC = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchStories = async () => {
    try {
      const data = await storyApi.getStories();
      setStories(data);
    } catch (err) {
      console.error('Failed to load stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleStoryClick = (index: number) => {
    setActiveStoryIndex(index);
  };

  const handleStoryViewed = async (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, isViewed: true } : s))
    );
    await storyApi.markViewed(storyId);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 overflow-x-auto py-2 px-1 scrollbar-none">
        {/* Add Story Button / Current User */}
        {user && (
          <div className="flex flex-col items-center gap-1.5 shrink-0 select-none">
            <div
              onClick={() => setIsCreateOpen(true)}
              className="relative cursor-pointer group"
            >
              <Avatar src={user.avatar} name={user.name} size="lg" />
              <div className="absolute bottom-0 right-0 p-1 bg-brand-600 group-hover:bg-brand-700 text-white rounded-full ring-2 ring-white dark:ring-slate-900 shadow-md transition-transform group-hover:scale-110">
                <Plus className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 max-w-[64px] truncate">
              Your story
            </span>
          </div>
        )}

        {/* Stories list */}
        {loading ? (
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="w-10 h-2.5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          stories.map((story, index) => (
            <div
              key={story.id}
              onClick={() => handleStoryClick(index)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group select-none"
            >
              <Avatar
                src={story.user.avatar}
                name={story.user.name}
                size="lg"
                hasStory={true}
                storyViewed={story.isViewed}
              />
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 max-w-[68px] truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {story.user.username}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Story Viewer Overlay Modal */}
      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={activeStoryIndex}
          isOpen={activeStoryIndex !== null}
          onClose={() => setActiveStoryIndex(null)}
          onStoryViewed={handleStoryViewed}
        />
      )}

      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onStoryCreated={fetchStories}
      />
    </div>
  );
};
