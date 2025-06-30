import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'accent';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          'backdrop-filter backdrop-blur-sm transition-all duration-200',
          {
            'bg-white/20 text-text border border-white/30 dark:bg-slate-50/5 dark:border-slate-50/10':
              variant === 'default',
            'bg-white/10 text-text-muted border border-white/20 dark:bg-slate-50/3 dark:border-slate-50/8':
              variant === 'muted',
            'bg-accent text-white border border-accent': variant === 'accent',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
