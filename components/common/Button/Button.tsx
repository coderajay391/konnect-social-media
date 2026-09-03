import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../utils/helpers';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2.5 text-sm font-medium gap-2',
    lg: 'px-6 py-3 text-base font-semibold gap-2.5',
    icon: 'p-2.5 rounded-xl aspect-square items-center justify-center',
  };

  const variantClasses = {
    primary:
      'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow-brand-500/20 active:scale-[0.98] focus:ring-brand-500/40',
    secondary:
      'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] focus:ring-slate-400/40',
    outline:
      'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-500 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50/40 dark:hover:bg-brand-950/20 active:scale-[0.98] focus:ring-brand-500/40',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-red-500/20 active:scale-[0.98] focus:ring-red-500/40',
    ghost:
      'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-[0.98] focus:ring-slate-400/40',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
