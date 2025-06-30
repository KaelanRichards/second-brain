import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm',
      'backdrop-filter backdrop-blur-xl saturate-200',
      'bg-white/10 border border-white/40',
      'shadow-[0_2px_8px_rgba(31,38,135,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-accent data-[state=checked]:to-accent-muted',
      'data-[state=checked]:border-accent data-[state=checked]:text-white',
      'data-[state=checked]:shadow-[0_4px_12px_hsl(var(--color-accent)/0.3),inset_0_1px_2px_rgba(255,255,255,0.3)]',
      'transition-all duration-300 ease-out',
      'hover:bg-white/15 hover:border-white/50',
      'dark:bg-slate-50/3 dark:border-slate-50/8',
      'dark:hover:bg-slate-50/6 dark:hover:border-slate-50/12',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
