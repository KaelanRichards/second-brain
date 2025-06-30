import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useGlassEffect } from '@/hooks/use-glass-effect';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'aurora' | 'holographic' | 'frosted' | 'clear' | 'crystal';
  depth?: 'shallow' | 'medium' | 'deep';
  interactive?: boolean;
  shimmer?: boolean;
}

const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ 
    className, 
    variant = 'default', 
    depth = 'medium',
    interactive = true,
    shimmer = false,
    children,
    ...props 
  }, ref) => {
    const glassRef = useGlassEffect<HTMLDivElement>();
    const combinedRef = ref || glassRef;
    
    return (
      <div
        ref={combinedRef}
        className={cn(
          'relative rounded-xl overflow-hidden',
          
          // Base glass styles
          variant === 'default' && 'glass-card glass-texture',
          variant === 'aurora' && 'glass-aurora glass',
          variant === 'holographic' && 'glass-holographic glass',
          variant === 'frosted' && 'glass-frosted glass-texture',
          variant === 'clear' && 'glass-clear glass',
          variant === 'crystal' && 'glass-crystal glass glass-depth',
          
          // Depth variations
          depth === 'shallow' && 'shadow-md',
          depth === 'medium' && 'shadow-xl',
          depth === 'deep' && 'shadow-2xl',
          
          // Interactive effects
          interactive && 'glass-interactive',
          shimmer && 'glass-shimmer',
          
          className
        )}
        {...props}
      >
        {/* Content wrapper with z-index to stay above effects */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Additional glass layers for depth */}
        {depth === 'deep' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-bl from-white/3 to-transparent pointer-events-none" />
          </>
        )}
      </div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

export { GlassPanel };