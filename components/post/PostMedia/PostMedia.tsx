import React, { useState } from 'react';
import { PostMedia as PostMediaType } from '../../../types';
import { Modal } from '../../common/Modal/Modal';

export interface PostMediaProps {
  media?: PostMediaType[];
}

export const PostMedia: React.FC<PostMediaProps> = ({ media }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!media || media.length === 0) return null;

  if (media.length === 1) {
    return (
      <>
        <div
          onClick={() => setActiveImage(media[0].url)}
          className="relative mt-3 rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 dark:border-slate-800/80 cursor-pointer group max-h-[500px]"
        >
          <img
            src={media[0].url}
            alt="Post media"
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {activeImage && (
          <Modal isOpen={!!activeImage} onClose={() => setActiveImage(null)} maxWidth="full">
            <div className="flex items-center justify-center p-2">
              <img src={activeImage} alt="Expanded" className="max-h-[80vh] w-auto object-contain rounded-xl" />
            </div>
          </Modal>
        )}
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 mt-3 rounded-2xl overflow-hidden">
        {media.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => setActiveImage(item.url)}
            className="relative aspect-4/3 bg-slate-900 overflow-hidden cursor-pointer group"
          >
            <img
              src={item.url}
              alt={`Media ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {activeImage && (
        <Modal isOpen={!!activeImage} onClose={() => setActiveImage(null)} maxWidth="full">
          <div className="flex items-center justify-center p-2">
            <img src={activeImage} alt="Expanded" className="max-h-[80vh] w-auto object-contain rounded-xl" />
          </div>
        </Modal>
      )}
    </>
  );
};
