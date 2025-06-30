import { useEffect, useRef } from 'react';

export function useGlassEffect<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if backdrop-filter is supported
    const supportsBackdrop = CSS.supports('backdrop-filter', 'blur(4px)') || 
                           CSS.supports('-webkit-backdrop-filter', 'blur(4px)');
    
    if (!supportsBackdrop) {
      element.style.setProperty('--glass-blur', '0px');
      element.classList.add('glass-fallback');
    }

    // Interactive highlight tracking
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const rect = element.getBoundingClientRect();
      
      let clientX: number;
      let clientY: number;
      
      if ('touches' in e && e.touches.length > 0) {
        const touch = e.touches[0];
        if (touch) {
          clientX = touch.clientX;
          clientY = touch.clientY;
        } else {
          return;
        }
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return; // Exit if we can't get coordinates
      }
      
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      
      element.style.setProperty('--glass-x', `${x}%`);
      element.style.setProperty('--glass-y', `${y}%`);
    };

    const handleLeave = () => {
      element.style.setProperty('--glass-x', '50%');
      element.style.setProperty('--glass-y', '50%');
    };

    element.addEventListener('mousemove', handleMove);
    element.addEventListener('touchmove', handleMove, { passive: true });
    element.addEventListener('mouseleave', handleLeave);

    return () => {
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('touchmove', handleMove);
      element.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return ref;
}