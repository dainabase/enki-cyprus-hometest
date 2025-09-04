import { useState, useEffect, useRef } from 'react';

interface UseScrollProgressProps {
  /** Total scroll distance for the animation sequence */
  totalDistance: number;
  /** Number of cards to animate */
  cardCount: number;
}

interface ScrollProgress {
  /** Current active card index (0, 1, 2) */
  activeCard: number;
  /** Progress within current card animation (0-1) */
  cardProgress: number;
  /** Overall progress through entire sequence (0-1) */
  totalProgress: number;
  /** Whether we're in the sticky section */
  isInStickyZone: boolean;
}

export const useScrollProgress = ({ totalDistance, cardCount }: UseScrollProgressProps) => {
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    activeCard: -1,
    cardProgress: 0,
    totalProgress: 0,
    isInStickyZone: false
  });
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);

  useEffect(() => {
    const updateSectionPosition = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setSectionTop(rect.top + window.scrollY);
      }
    };

    updateSectionPosition();
    window.addEventListener('resize', updateSectionPosition);
    return () => window.removeEventListener('resize', updateSectionPosition);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate when section becomes sticky (when it reaches the top)
      const stickyStart = sectionTop; // Start when section reaches top
      const stickyEnd = stickyStart + totalDistance + windowHeight; // Add window height to extend sticky duration
      
      // Check if we're in the sticky zone
      const isInStickyZone = scrollY >= stickyStart && scrollY <= stickyEnd;
      
      if (!isInStickyZone) {
        setScrollProgress(prev => ({
          ...prev,
          isInStickyZone: false,
          activeCard: scrollY < stickyStart ? -1 : cardCount,
          cardProgress: 0,
          totalProgress: scrollY < stickyStart ? 0 : 1
        }));
        return;
      }

      // Calculate progress within sticky zone
      const progressInZone = (scrollY - stickyStart) / totalDistance;
      const clampedProgress = Math.max(0, Math.min(1, progressInZone));
      
      // Calculate which card should be active and its progress
      const cardSegmentSize = 1 / cardCount;
      const currentCardIndex = Math.min(cardCount - 1, Math.floor(clampedProgress / cardSegmentSize));
      const cardProgress = (clampedProgress % cardSegmentSize) / cardSegmentSize;

      setScrollProgress({
        activeCard: currentCardIndex,
        cardProgress,
        totalProgress: clampedProgress,
        isInStickyZone: true
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionTop, totalDistance, cardCount]);

  return { scrollProgress, sectionRef };
};