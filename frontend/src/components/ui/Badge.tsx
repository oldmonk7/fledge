import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'full' | 'md';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { children, className, variant = 'primary', size = 'md', rounded = 'full', ...props },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center font-medium';
    
    const variants = {
      primary: 'bg-primary-50 text-primary-700 border border-primary-200/50',
      secondary: 'bg-secondary-50 text-secondary-700 border border-secondary-200/50',
      success: 'bg-success-50 text-success-700 border border-success-200/50',
      warning: 'bg-warning-50 text-warning-700 border border-warning-200/50',
      error: 'bg-error-50 text-error-700 border border-error-200/50',
      neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200/50',
    };
    
    const sizes = {
      sm: 'px-2.5 py-0.5 text-xs font-medium',
      md: 'px-3 py-1 text-xs font-medium',
      lg: 'px-3.5 py-1.5 text-sm font-medium',
    };

    const roundedStyles = {
      full: 'rounded-full',
      md: 'rounded-lg',
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          roundedStyles[rounded],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;

