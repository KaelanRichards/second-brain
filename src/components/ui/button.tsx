import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base glass styles
          'relative inline-flex items-center justify-center font-medium',
          'rounded-lg transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',

          // Variants - all glass-based
          {
            'glass-accent focus-visible:ring-accent': variant === 'primary',
            'glass-button focus-visible:ring-white/20': variant === 'secondary',
            'glass-subtle hover:glass-button focus-visible:ring-white/10': variant === 'ghost',
          },

          // Sizes
          {
            'h-8 px-3 text-sm gap-1.5': size === 'sm',
            'h-10 px-4 text-base gap-2': size === 'md',
            'h-12 px-6 text-lg gap-2.5': size === 'lg',
          },

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
