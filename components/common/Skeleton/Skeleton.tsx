import React from 'react';
import { cn } from '../../../utils/helpers';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'bg-slate-200 dark:bg-slate-800 rounded-lg skeleton-shimmer',
        className
      )}
    />
  );
};

export const PostSkeleton: React.FC = () => {
  return (
    <div className="card-base p-5 space-y-4">
      {/* Author header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="w-32 h-4 rounded-md" />
          <Skeleton className="w-20 h-3 rounded-md" />
        </div>
      </div>
      {/* Content lines */}
      <div className="space-y-2">
        <Skeleton className="w-full h-4 rounded-md" />
        <Skeleton className="w-5/6 h-4 rounded-md" />
        <Skeleton className="w-2/3 h-4 rounded-md" />
      </div>
      {/* Media skeleton */}
      <Skeleton className="w-full h-64 rounded-xl" />
      {/* Action buttons */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="w-16 h-6 rounded-lg" />
        <Skeleton className="w-16 h-6 rounded-lg" />
        <Skeleton className="w-16 h-6 rounded-lg" />
        <Skeleton className="w-8 h-6 rounded-lg" />
      </div>
    </div>
  );
};

export const UserCardSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="w-24 h-4 rounded-md" />
          <Skeleton className="w-16 h-3 rounded-md" />
        </div>
      </div>
      <Skeleton className="w-20 h-8 rounded-xl" />
    </div>
  );
};
