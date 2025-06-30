import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
}

const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = 'column',
      gap = 4,
      align = 'stretch',
      justify = 'start',
      wrap = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          {
            'flex-row': direction === 'row',
            'flex-col': direction === 'column',
          },
          {
            'gap-0': gap === 0,
            'gap-1': gap === 1,
            'gap-2': gap === 2,
            'gap-3': gap === 3,
            'gap-4': gap === 4,
            'gap-5': gap === 5,
            'gap-6': gap === 6,
            'gap-8': gap === 8,
            'gap-10': gap === 10,
            'gap-12': gap === 12,
            'gap-16': gap === 16,
          },
          {
            'items-start': align === 'start',
            'items-center': align === 'center',
            'items-end': align === 'end',
            'items-stretch': align === 'stretch',
          },
          {
            'justify-start': justify === 'start',
            'justify-center': justify === 'center',
            'justify-end': justify === 'end',
            'justify-between': justify === 'between',
            'justify-around': justify === 'around',
            'justify-evenly': justify === 'evenly',
          },
          {
            'flex-wrap': wrap,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Stack.displayName = 'Stack';

export { Stack };
