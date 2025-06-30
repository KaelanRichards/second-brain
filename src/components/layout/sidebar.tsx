import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  side?: 'left' | 'right';
  open?: boolean;
}

const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ className, side = 'left', open = true, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          'fixed top-0 h-full w-64 bg-surface border-border transition-transform duration-normal',
          {
            'left-0 border-r': side === 'left',
            'right-0 border-l': side === 'right',
            'translate-x-0': open,
            '-translate-x-full': !open && side === 'left',
            'translate-x-full': !open && side === 'right',
          },
          'md:relative md:translate-x-0',
          className
        )}
        {...props}
      />
    );
  }
);

Sidebar.displayName = 'Sidebar';

const SidebarContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4', className)} {...props} />
  )
);

SidebarContent.displayName = 'SidebarContent';

export { Sidebar, SidebarContent };