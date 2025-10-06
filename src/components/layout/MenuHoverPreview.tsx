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
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Préchargement FORCÉ de toutes les images dès le mount
  useEffect(() => {
    const loadPromises = allItems.map((item) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = item.image;
      });
    });

    Promise.all(loadPromises)
      .then(() => setImagesLoaded(true))
      .catch(() => setImagesLoaded(true)); // Continue même si erreur
  }, [allItems]);

  // Effet typewriter - divise le texte en caractères
  const TypewriterText = ({ text }: { text: string }) => {
    const characters = text.split('');
    
    return (
      <span className="inline-block">
        {characters.map((char, index) => (
          <motion.span
            key={`${text}-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.05,
              delay: index * 0.02, // 20ms entre chaque lettre
              ease: 'easeOut'
            }}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    );
  };

  return (
    <>
      {/* Images cachées pour préchargement */}
      <div className="hidden">
        {allItems.map((item) => (
          <img key={item.href} src={item.image} alt="" />
        ))}
      </div>

      {/* Photo: LE HAUT aligné PRÉCISÉMENT avec le début d'Accueil */}
      <div className="fixed left-1/2 -translate-x-1/2 top-[calc(50vh-12rem)] pointer-events-none hidden xl:block z-40">
        <AnimatePresence mode="wait">
          {hoveredItem && imagesLoaded && (
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
                      animate={{
                        scale: [1, 1.05],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
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
                    <p className="text-black/70 text-base leading-tight line-clamp-2 w-full px-0">
                      <TypewriterText text={hoveredItem.description} />
                    </p>
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