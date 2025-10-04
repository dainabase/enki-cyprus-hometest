import { useEffect } from 'react';

/**
 * Calcule la largeur de la scrollbar du navigateur
 */
const getScrollbarWidth = (): number => {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);
  
  const inner = document.createElement('div');
  outer.appendChild(inner);
  
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  
  outer.parentNode?.removeChild(outer);
  
  return scrollbarWidth;
};

/**
 * Hook to lock/unlock body scroll with scrollbar compensation
 * Prevents layout shift when scrollbar disappears
 * Useful for modals, overlays, and fullscreen menus
 */
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    if (isLocked) {
      const scrollbarWidth = getScrollbarWidth();
      
      // Lock scroll
      document.body.style.overflow = 'hidden';
      
      // Compensate for scrollbar disappearance to prevent layout shift
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }
    
    // Cleanup function - restore original values
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
};

export default useScrollLock;