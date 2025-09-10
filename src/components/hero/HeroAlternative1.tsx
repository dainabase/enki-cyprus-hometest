import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

// Hook pour effet typewriter
const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

const HeroAlternative1 = () => {
  const [animationKey, setAnimationKey] = useState(0);

  const restartAnimation = () => {
    setAnimationKey(prev => prev + 1);
  };
  const { displayText } = useTypewriter("the first AI-powered real estate platform", 60);

  return (
    <section 
      key={animationKey}
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/lovable-uploads/marina-bay-panoramic.jpg')`,
      }}
    >
      {/* Bouton de relance d'animation */}
      <motion.button
        onClick={restartAnimation}
        className="absolute top-24 md:top-28 right-4 z-50 p-3 bg-primary/90 hover:bg-primary rounded-full text-white shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <RotateCcw className="w-5 h-5" />
      </motion.button>

      {/* Overlay moderne dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-primary/20 to-black/80" />
      
      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Contenu principal */}
      <div className="relative z-10 text-center">
        {/* ENKI-REALTY avec effet de glitch moderne */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-6"
        >
          <motion.h1
            className="swaarg-hero-title text-white relative"
            initial={{ filter: "blur(20px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 0px rgba(59, 130, 246, 0)",
                  "0 0 20px rgba(59, 130, 246, 0.8)",
                  "0 0 0px rgba(59, 130, 246, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 2 }}
            >
              ΣNKI
            </motion.span>
            <span className="mx-4">-</span>
            <motion.span
              animate={{
                textShadow: [
                  "0 0 0px rgba(59, 130, 246, 0)",
                  "0 0 20px rgba(59, 130, 246, 0.8)",
                  "0 0 0px rgba(59, 130, 246, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
            >
              REALTY
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Trait de séparation avec effet néon */}
        <motion.div
          className="w-64 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6 relative"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{
              opacity: [0, 1, 0],
              scaleX: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 2,
            }}
          />
        </motion.div>

        {/* Cyprus Properties */}
        <motion.h2
          className="swaarg-large-title text-white/90 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          Cyprus Properties
        </motion.h2>

        {/* Texte typewriter */}
        <motion.div
          className="swaarg-body-large text-primary font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          {displayText}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="ml-1"
          >
            |
          </motion.span>
        </motion.div>
      </div>

      {/* Icône scroll animée */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
      >
        <motion.div
          className="w-7 h-11 border-2 border-white/70 rounded-full flex items-start justify-center backdrop-blur-sm"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full mt-1.5"
            animate={{ y: [0, 12, 0], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroAlternative1;