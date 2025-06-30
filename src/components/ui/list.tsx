import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const List = forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn('divide-y divide-border rounded-md border border-border', className)}
      {...props}
    />
  )
);
List.displayName = 'List';

const ListItem = forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        'px-4 py-3 transition-colors hover:bg-surface',
        className
      )}
      {...props}
    />
  )
);
ListItem.displayName = 'ListItem';

const ListHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center space-x-2 text-sm font-medium text-text-muted',
        className
      )}
      {...props}
    />
  )
);
ListHeader.displayName = 'ListHeader';

const ListContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-1 text-base text-text', className)}
      {...props}
    />
  )
);
ListContent.displayName = 'ListContent';

export { List, ListItem, ListHeader, ListContent };