import React, { useState } from 'react';
import { Image, Upload, Sparkles } from 'lucide-react';
import { Modal } from '../../common/Modal/Modal';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import { storyApi } from '../../../services/api/storyApi';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

export interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated?: () => void;
}

const SAMPLE_STORY_IMAGES = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
];

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ isOpen, onClose, onStoryCreated }) => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [selectedImage, setSelectedImage] = useState(SAMPLE_STORY_IMAGES[0]);
  const [caption, setCaption] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const finalUrl = customImageUrl.trim() || selectedImage;
    if (!finalUrl) return;

    setIsSubmitting(true);
    try {
      await storyApi.createStory(user.id, finalUrl, caption.trim() || undefined);
      success('Story posted! Visible for 24 hours.', 'Story Added');
      setCaption('');
      setCustomImageUrl('');
      if (onStoryCreated) onStoryCreated();
      onClose();
    } catch (err: any) {
      toastError(err.message || 'Failed to create story');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a Story" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Story Preview Card */}
        <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800">
          <img
            src={customImageUrl.trim() || selectedImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-white text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Story Preview</span>
            </div>
            {caption && <p className="text-white text-xs font-medium drop-shadow">{caption}</p>}
          </div>
        </div>

        {/* Quick Image Presets */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Choose Background Photo
          </label>
          <div className="flex gap-2">
            {SAMPLE_STORY_IMAGES.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedImage(img);
                  setCustomImageUrl('');
                }}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === img && !customImageUrl
                    ? 'border-brand-600 scale-105 shadow-sm'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Preset" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Image URL Input */}
        <Input
          label="Or Custom Image URL"
          placeholder="https://images.unsplash.com/..."
          value={customImageUrl}
          onChange={(e) => setCustomImageUrl(e.target.value)}
          leftIcon={<Image className="w-4 h-4" />}
        />

        {/* Story Caption */}
        <Input
          label="Add Caption (Optional)"
          placeholder="What's happening?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} leftIcon={<Upload className="w-4 h-4" />}>
            Share to Story
          </Button>
        </div>
      </form>
    </Modal>
  );
};
