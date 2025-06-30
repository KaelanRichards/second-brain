import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const RadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full',
        'backdrop-filter backdrop-blur-xl saturate-200',
        'bg-white/10 border border-white/40',
        'shadow-[0_2px_8px_rgba(31,38,135,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:border-accent',
        'data-[state=checked]:shadow-[0_4px_12px_hsl(var(--color-accent)/0.3),inset_0_1px_2px_rgba(255,255,255,0.3)]',
        'transition-all duration-300 ease-out',
        'hover:bg-white/15 hover:border-white/50',
        'dark:bg-slate-50/3 dark:border-slate-50/8',
        'dark:hover:bg-slate-50/6 dark:hover:border-slate-50/12',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-accent text-accent drop-shadow-[0_0_4px_hsl(var(--color-accent)/0.5)]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
