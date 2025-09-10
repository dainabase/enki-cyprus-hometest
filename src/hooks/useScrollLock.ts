import { useEffect } from 'react';

/**
 * Hook to lock/unlock body scroll
 * Useful for modals, overlays, and fullscreen menus
 */
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // Store original overflow
      const originalOverflow = document.body.style.overflow;
      
      // Lock scroll
      document.body.style.overflow = 'hidden';
      
      // Cleanup function
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isLocked]);
};

export default useScrollLock;