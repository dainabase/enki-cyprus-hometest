import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface SmartTrustBarProps {
  isVisible: boolean;
  targetRef: React.RefObject<HTMLElement>;
  onAnalysisComplete?: boolean;
}

const SmartTrustBar = ({ isVisible, targetRef, onAnalysisComplete = false }: SmartTrustBarProps) => {
  const [isSticky, setIsSticky] = useState(true);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const trustBarRef = useRef<HTMLDivElement>(null);

  const items = [
    "20+ Développeurs Vérifiés",
    "Recherche Assistée par IA",
    "Multilingue (8 langues)",
    "Accompagnement Personnalisé"
  ];

  // Gérer la disparition après analyse
  useEffect(() => {
    if (onAnalysisComplete && isVisible) {
      // Attendre 2 secondes après la fin de l'analyse, puis disparaître
      const timer = setTimeout(() => {
        setShouldFadeOut(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [onAnalysisComplete, isVisible]);

  useEffect(() => {
    if (!isVisible || !targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.boundingClientRect.top <= 100) {
          setIsSticky(false);
        } else if (!entry.isIntersecting && entry.boundingClientRect.top > 100) {
          setIsSticky(true);
        }
      },
      {
        threshold: 0,
        rootMargin: '-80px 0px 0px 0px'
      }
    );

    observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [isVisible, targetRef]);

  if (!isVisible || shouldFadeOut) return null;

  return (
    <motion.div
      ref={trustBarRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`
        ${isSticky ? 'fixed' : 'absolute'}
        top-0 left-0 right-0 z-40
        py-3
      `}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile: Grid 2 colonnes */}
        <div className="
          grid grid-cols-2 gap-x-4 gap-y-2
          md:hidden
          text-center
        ">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="
                bg-black
                text-white text-xs font-light tracking-wide
                px-3 py-1.5
                rounded-sm
              "
            >
              {item}
            </motion.div>
          ))}
        </div>

        {/* Desktop: Ligne horizontale */}
        <div className="
          hidden md:flex
          items-center justify-center
          gap-8
        ">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="
                bg-black
                text-white text-sm font-light tracking-wide whitespace-nowrap
                px-4 py-2
                rounded-sm
              ">
                {item}
              </span>
              {i < items.length - 1 && (
                <div className="w-px h-4 bg-gray-400" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SmartTrustBar;
