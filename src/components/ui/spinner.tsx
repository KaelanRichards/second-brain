import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          {
            'h-4 w-4': size === 'sm',
            'h-6 w-6': size === 'md',
            'h-8 w-8': size === 'lg',
          },
          className
        )}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <div className={cn(
          'absolute animate-spin rounded-full border-2 border-accent/20',
          'h-full w-full'
        )} />
        <div className={cn(
          'absolute animate-spin rounded-full border-2 border-transparent border-t-accent',
          'h-full w-full',
          'animation-delay-150'
        )} />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export { Spinner };