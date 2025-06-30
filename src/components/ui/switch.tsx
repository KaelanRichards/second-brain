import { forwardRef } from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full',
      'backdrop-filter backdrop-blur-xl saturate-200 transition-all duration-300',
      'border border-white/40',
      'shadow-[0_2px_8px_rgba(31,38,135,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-accent data-[state=checked]:to-accent-muted',
      'data-[state=checked]:border-accent',
      'data-[state=checked]:shadow-[0_4px_16px_hsl(var(--color-accent)/0.4),inset_0_1px_2px_rgba(255,255,255,0.3)]',
      'data-[state=unchecked]:bg-white/10',
      'hover:bg-white/15 hover:border-white/50',
      'dark:data-[state=unchecked]:bg-slate-50/3 dark:border-slate-50/8',
      'dark:hover:bg-slate-50/6 dark:hover:border-slate-50/12',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-white ring-0',
        'shadow-[0_2px_8px_rgba(0,0,0,0.2),0_0_12px_rgba(255,255,255,0.8)]',
        'transition-all duration-300 ease-out',
        'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
        'data-[state=checked]:shadow-[0_4px_12px_rgba(0,0,0,0.3),0_0_20px_rgba(255,255,255,0.9)]'
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };