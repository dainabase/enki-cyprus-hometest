import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export interface MenuItemPreview {
  label: string;
  href: string;
  image: string;
  description: string;
}

interface MenuHoverPreviewProps {
  hoveredItem: MenuItemPreview | null;
  allItems: MenuItemPreview[];
}

export const MenuHoverPreview = ({ hoveredItem, allItems }: MenuHoverPreviewProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isHovering, setIsHovering] = useState(false);

  // ⚡ LAZY LOAD - Charge uniquement l'image hoverée
  useEffect(() => {
    if (!hoveredItem || loadedImages.has(hoveredItem.image)) return;

    const img = new Image();
    img.onload = () => {
      setLoadedImages(prev => new Set([...prev, hoveredItem.image]));
    };
    img.onerror = () => {
      setLoadedImages(prev => new Set([...prev, hoveredItem.image])); // Continue même si erreur
    };
    img.src = hoveredItem.image;
  }, [hoveredItem, loadedImages]);

  // Track hover state pour pause scale animation
  useEffect(() => {
    setIsHovering(!!hoveredItem);
  }, [hoveredItem]);


  return (
    <>

      {/* 
        ✅ ALIGNEMENT PHOTO - CALCUL PRÉCIS
        
        Structure du menu:
        - 7 items centrés verticalement à 50vh
        - Chaque item: py-4 (1rem top + 1rem bottom) + text-4xl (line-height 2.5rem)
        - Hauteur par item: 4.5rem
        - Hauteur totale: 31.5rem
        - Premier item (Accueil) commence à: 50vh - 15.75rem
        - HAUT du texte "Accueil" (après padding-top): 50vh - 14.75rem
        
        Position photo: calc(50vh - 15rem) aligne le HAUT de la photo avec le HAUT du texte "Accueil"
      */}
      <div className="fixed right-[10%] top-[50%] -translate-y-1/2 pointer-events-none hidden xl:block z-40">
        <AnimatePresence mode="wait">
          {hoveredItem && loadedImages.has(hoveredItem.image) && (
            <motion.div
              key="preview-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-[640px] h-[360px] overflow-hidden rounded-[1px] shadow-2xl">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={hoveredItem.href}
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-100%' }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="absolute inset-0 bg-black"
                  >
                    <motion.img
                      src={hoveredItem.image}
                      alt={hoveredItem.label}
                      className="w-full h-full object-cover"
                      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                      animate={isHovering ? { scale: [1, 1.05] } : { scale: 1 }}
                      transition={{
                        duration: 12,
                        repeat: isHovering ? Infinity : 0,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="absolute top-full left-0 right-0 mt-8 w-[640px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${hoveredItem.href}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                  >
                    <motion.p
                      className="text-black/70 text-base leading-tight line-clamp-2 w-full px-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {hoveredItem.description}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
