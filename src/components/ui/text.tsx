import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted';
}

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ 
    className, 
    as: Component = 'p', 
    size = 'base', 
    weight = 'normal',
    color = 'default',
    ...props 
  }, ref) => {
    return (
      <Component
        className={cn(
          // Size
          {
            'text-xs': size === 'xs',
            'text-sm': size === 'sm',
            'text-base': size === 'base',
            'text-lg': size === 'lg',
            'text-xl': size === 'xl',
            'text-2xl': size === '2xl',
            'text-3xl': size === '3xl',
          },
          
          // Weight
          {
            'font-normal': weight === 'normal',
            'font-medium': weight === 'medium',
            'font-semibold': weight === 'semibold',
            'font-bold': weight === 'bold',
          },
          
          // Color
          {
            'text-text': color === 'default',
            'text-text-muted': color === 'muted',
          },
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text };