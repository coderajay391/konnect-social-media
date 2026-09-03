import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../utils/helpers';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', text, className }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-6 gap-3', className)}>
      <Loader2 className={cn('animate-spin text-brand-600 dark:text-brand-400', sizeMap[size])} />
      {text && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{text}</p>}
    </div>
  );
};
