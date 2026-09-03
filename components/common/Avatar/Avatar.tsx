import React, { useState } from 'react';
import { cn } from '../../../utils/helpers';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  status?: 'online' | 'offline' | 'away';
  hasStory?: boolean;
  storyViewed?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name = 'User',
  size = 'md',
  status,
  hasStory = false,
  storyViewed = false,
  className,
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-medium',
    xl: 'w-20 h-20 text-xl font-semibold',
    '2xl': 'w-28 h-28 text-3xl font-bold',
  };

  const statusDotSizeMap = {
    xs: 'w-1.5 h-1.5 border-[1px]',
    sm: 'w-2 h-2 border-[1.5px]',
    md: 'w-2.5 h-2.5 border-2',
    lg: 'w-3.5 h-3.5 border-2',
    xl: 'w-4 h-4 border-2',
    '2xl': 'w-5 h-5 border-3',
  };

  const statusColorMap = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-400',
  };

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const ringPadding = hasStory ? 'p-0.5' : '';

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 select-none items-center justify-center rounded-full',
        hasStory && (storyViewed ? 'story-ring-viewed' : 'story-ring-gradient'),
        ringPadding,
        onClick && 'cursor-pointer hover:opacity-95 transition-opacity',
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-brand-500 to-indigo-700 text-white font-medium border-2 border-white dark:border-slate-900',
          sizeMap[size]
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
            loading="lazy"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-white dark:border-slate-900',
            statusDotSizeMap[size],
            statusColorMap[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};
