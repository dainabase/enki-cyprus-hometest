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

      {/* 
        ✅ PHOTO ALIGNÉE AVEC LE MENU - HARMONIE PARFAITE
        
        Alignement vertical :
        - HAUT de la photo = HAUT du texte "Accueil" (premier item)
        - BAS de la photo = BAS des icônes réseaux sociaux
        
        Ajustements finaux (v2) :
        - Hauteur réduite à 36rem (au lieu de 38rem) pour éviter débordement haut
        - Top ajusté à calc(50vh - 18rem) pour maintenir centrage
        - Position horizontale décalée à left: 54% pour meilleur équilibre visuel
        
        Calcul hauteur menu : ~36rem
        - 7 items navigation avec espacements
        - Séparateur
        - Icônes réseaux sociaux
      */}
      <div className="fixed pointer-events-none hidden xl:block z-40"
           style={{
             left: '54%',
             transform: 'translateX(-50%)',
             top: 'calc(50vh - 18rem)',
             height: '36rem'
           }}>
        <AnimatePresence mode="wait">
          {hoveredItem && imagesLoaded && (
            <motion.div
              key="preview-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {/* ✅ PHOTO AVEC RATIO 16:9 ET HAUTEUR FIXÉE PAR LE CONTENEUR */}
              <div className="relative h-full overflow-hidden rounded-sm shadow-2xl"
                   style={{ aspectRatio: '16 / 9', width: 'auto' }}>
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
                    
                    {/* Overlay gradient subtle pour meilleure lisibilité du texte */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/20" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Description sous la photo - largeur adaptée à la photo */}
              <div className="absolute top-full left-0 right-0 mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${hoveredItem.href}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                  >
                    {/* Texte proportionnel */}
                    <p className="text-black/70 text-base leading-relaxed line-clamp-2">
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
