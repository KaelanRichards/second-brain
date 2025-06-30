import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: 'sm' | 'md' | 'lg';
}

const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ className, blur = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'glass-surface rounded-lg p-6',
        {
          'glass-blur-sm': blur === 'sm',
          'glass-blur-md': blur === 'md',
          'glass-blur-lg': blur === 'lg',
        },
        className
      )}
      {...props}
    />
  )
);

Panel.displayName = 'Panel';

export { Panel };
