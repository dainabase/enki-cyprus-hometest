import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface SmartTrustBarProps {
  isVisible: boolean;
  targetRef: React.RefObject<HTMLElement>;
}

const SmartTrustBar = ({ isVisible, targetRef }: SmartTrustBarProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const trustBarRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  const items = [
    "20+ Développeurs Vérifiés",
    "Recherche Assistée par IA",
    "Multilingue (8 langues)",
    "Accompagnement Personnalisé"
  ];

  useEffect(() => {
    if (!isVisible || !trustBarRef.current || !targetRef.current) return;

    const handleScroll = () => {
      if (!placeholderRef.current || !targetRef.current) return;

      const placeholderRect = placeholderRef.current.getBoundingClientRect();
      const targetRect = targetRef.current.getBoundingClientRect();

      // Si le placeholder sort de l'écran vers le haut ET qu'on n'a pas encore atteint le titre
      if (placeholderRect.top < 0 && targetRect.top > 100) {
        setIsSticky(true);
      } 
      // Si on remonte et que le placeholder revient en vue OU si le titre arrive à 100px du top
      else if (placeholderRect.top >= 0 || targetRect.top <= 100) {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, targetRef]);

  if (!isVisible) return null;

  return (
    <>
      {/* Placeholder pour maintenir l'espace dans le flux */}
      <div 
        ref={placeholderRef} 
        className={`w-full ${isSticky ? 'h-[60px]' : 'h-0'}`}
        aria-hidden="true"
      />

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
          ${isSticky ? 'fixed top-0' : 'relative'}
          left-0 right-0 z-40
          py-3
          transition-all duration-300
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-10">
            {/* Mobile: Grid 2 colonnes - aligné à droite */}
            <div className="
              grid grid-cols-2 gap-x-4 gap-y-2
              md:hidden
            ">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="
                    bg-black
                    text-white text-xs font-light tracking-wide text-center
                    px-3 py-1.5
                    rounded-none
                  "
                >
                  {item}
                </motion.div>
              ))}
            </div>

            {/* Desktop: Ligne horizontale - aligné à droite */}
            <div className="
              hidden md:flex
              items-center
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
                    rounded-none
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
        </div>
      </motion.div>
    </>
  );
};

export default SmartTrustBar;
