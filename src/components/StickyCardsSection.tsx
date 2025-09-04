import { motion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';

interface CardData {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: number;
  gradient: string;
}

interface StickyCardsSectionProps {
  cards: CardData[];
}

export const StickyCardsSection: React.FC<StickyCardsSectionProps> = ({ cards }) => {
  const { scrollProgress, sectionRef } = useScrollProgress({
    totalDistance: 2000, // Pixels to scroll through entire sequence
    cardCount: cards.length
  });

  const getCardTransform = (cardIndex: number) => {
    const { activeCard, cardProgress, isInStickyZone } = scrollProgress;
    
    if (!isInStickyZone || activeCard < cardIndex) {
      return {
        scale: 1,
        rotateY: 0,
        z: 0,
        opacity: 1
      };
    }
    
    if (activeCard === cardIndex) {
      // Active card 360° spin with slight z-move forward then back
      const spinProgress = cardProgress; // 0 → 1
      const zMove = 50 * (1 - Math.abs(1 - spinProgress * 2)); // 0 → 50 → 0
      return {
        scale: 1 + (zMove / 500),
        rotateY: spinProgress * 360,
        z: zMove,
        opacity: 1
      };
    }
    
    // Card has been animated already
    return {
      scale: 1,
      rotateY: 0,
      z: 0,
      opacity: 1
    };
  };

  return (
    <div
      ref={sectionRef}
      className="relative bg-background"
      style={{ height: `calc(100vh + 2000px)` }}
    >
      <motion.div
        className="sticky top-[10vh] py-32 md:py-40 px-4 md:px-8 overflow-hidden min-h-[80vh] flex items-center z-40"
        style={{
          perspective: '1000px',
        }}
      >
        {/* Background overlays */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          viewport={{ once: true }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          {/* Title */}
          <motion.h2 
            className="text-5xl md:text-7xl font-bold text-primary text-center mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Pourquoi choisir ENKI Realty ?
          </motion.h2>

          {/* Subtitle */}
          <motion.p 
            className="text-xl text-muted-foreground max-w-4xl mx-auto text-center mb-20 leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Une expérience d'investissement immobilier redéfinie, alliant expertise, technologie de pointe et service d'excellence pour des résultats exceptionnels.
          </motion.p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
            {cards.map((card, index) => {
              const transform = getCardTransform(index);
              const isActive = scrollProgress.activeCard === index && scrollProgress.isInStickyZone;
              
              return (
                <motion.div
                  key={index}
                  className="relative group"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{
                    scale: transform.scale,
                    rotateY: transform.rotateY,
                    z: transform.z,
                  }}
                  transition={{
                    duration: 0.1,
                    ease: "easeOut"
                  }}
                >
                  {/* Front of card */}
                  <div 
                    className="relative bg-secondary border border-border/50 rounded-3xl p-8 lg:p-10 hover:border-primary/30 transition-all duration-500 overflow-hidden w-full h-full"
                    style={{
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Premium background overlays */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/15"
                      initial={{ opacity: 0, scale: 1.1 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 2 }}
                      viewport={{ once: true }}
                    />
                    <motion.div 
                      className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
                      animate={{ 
                        x: [0, 20, -20, 0],
                        y: [0, -10, 10, 0],
                      }}
                      transition={{ 
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Brilliance effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl z-10"></div>
                    
                    {/* Icon */}
                    <motion.div 
                      className="mb-8 flex justify-center lg:justify-start relative z-20"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { 
                          type: "spring", 
                          damping: 15 
                        }
                      }}
                    >
                      {card.icon}
                    </motion.div>
                    
                    {/* Title */}
                    <h3 className="font-bold text-lg lg:text-xl xl:text-2xl text-primary mb-6 leading-tight text-center lg:text-left whitespace-nowrap relative z-20">
                      {card.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-lg text-muted-foreground leading-relaxed text-center lg:text-left font-light relative z-20">
                      {card.description}
                    </p>
                    
                    {/* Decorative line */}
                    <motion.div 
                      className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    />
                  </div>

                  {/* Back of card */}
                  <div 
                    className="absolute top-0 left-0 w-full h-full bg-primary rounded-3xl p-8 lg:p-10 flex flex-col items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div className="text-white text-center">
                      <div className="text-8xl font-bold mb-4 opacity-80">
                        {card.number}
                      </div>
                      <div className="text-2xl font-semibold">
                        {card.title}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress indicator */}
          {scrollProgress.isInStickyZone && (
            <motion.div 
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="flex items-center space-x-2">
                {cards.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index <= scrollProgress.activeCard 
                        ? 'bg-primary' 
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};