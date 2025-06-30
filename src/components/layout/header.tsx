import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  sticky?: boolean;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ className, sticky = true, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          'w-full glass border-b',
          {
            'sticky top-0 z-sticky': sticky,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Header.displayName = 'Header';

const HeaderContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  )
);

HeaderContent.displayName = 'HeaderContent';

export { Header, HeaderContent };
