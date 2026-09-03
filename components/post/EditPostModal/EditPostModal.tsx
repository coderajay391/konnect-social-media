import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal/Modal';
import { Button } from '../../common/Button/Button';
import { Post } from '../../../types';
import { MAX_POST_LENGTH } from '../../../utils/constants';

export interface EditPostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (postId: string, newContent: string) => Promise<void>;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({ post, isOpen, onClose, onSave }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setContent(post.content);
    }
  }, [post]);

  if (!post) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(post.id, content.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Post" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          placeholder="Edit your post..."
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {MAX_POST_LENGTH - content.length} chars left
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={!content.trim()}>
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
