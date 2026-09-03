import React, { forwardRef } from 'react';
import { cn } from '../../../utils/helpers';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3.5 text-slate-400 pointer-events-none">{leftIcon}</div>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm transition-all duration-150 focus:outline-none focus:ring-2',
              leftIcon ? 'pl-10' : 'pl-4',
              rightIcon ? 'pr-10' : 'pr-4',
              error
                ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                : 'border-slate-200 dark:border-slate-700/80 focus:ring-brand-500/30 focus:border-brand-500',
              className
            )}
            {...props}
          />
          {rightIcon && <div className="absolute right-3.5 text-slate-400">{rightIcon}</div>}
        </div>
        {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
        {!error && hint && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
