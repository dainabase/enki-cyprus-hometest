import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

// Hook typewriter ultra smooth
const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText;
};

const HeroAlternative5 = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const typewriterText = useTypewriter("the first AI-powered real estate platform", 75);

  const restartAnimation = () => {
    setAnimationKey(prev => prev + 1);
  };

  return (
    <section 
      key={animationKey}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Bouton de relance d'animation */}
      <motion.button
        onClick={restartAnimation}
        className="fixed top-20 right-4 z-50 p-3 bg-primary/90 hover:bg-primary rounded-full text-white shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <RotateCcw className="w-5 h-5" />
      </motion.button>

      {/* Background avec double exposition */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/marina-bay-panoramic.jpg')`,
          }}
        />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-multiply opacity-60"
          style={{
            backgroundImage: `url('/lovable-uploads/marina-bay-panoramic.jpg')`,
          }}
        />
      </div>
      
      {/* Overlay minimaliste */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />
      
      {/* Lignes géométriques animées */}
      <div className="absolute inset-0">
        {/* Ligne verticale gauche */}
        <motion.div
          className="absolute left-20 top-0 w-[1px] bg-gradient-to-b from-transparent via-primary to-transparent opacity-30"
          initial={{ height: 0 }}
          animate={{ height: "100vh" }}
          transition={{ duration: 3, delay: 1 }}
        />
        
        {/* Ligne verticale droite */}
        <motion.div
          className="absolute right-20 top-0 w-[1px] bg-gradient-to-b from-transparent via-primary to-transparent opacity-30"
          initial={{ height: 0 }}
          animate={{ height: "100vh" }}
          transition={{ duration: 3, delay: 1.5 }}
        />
        
        {/* Ligne horizontale */}
        <motion.div
          className="absolute top-1/2 left-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ width: 0 }}
          animate={{ width: "100vw" }}
          transition={{ duration: 2, delay: 2.5 }}
        />
      </div>
      
      {/* Contenu central ultra épuré */}
      <div className="relative z-10 text-center">
        
        {/* ENKI-REALTY avec effet de matérialisation */}
        <motion.div className="mb-12">
          <motion.h1
            className="swaarg-hero-title text-white relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            {/* Effet de révélation par scanner */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ y: "100%" }}
              animate={{ y: "-100%" }}
              transition={{
                duration: 1.5,
                delay: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />
            
            {/* Texte avec effet de glitch subtil */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="relative inline-block"
            >
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 0 rgba(59, 130, 246, 0)",
                    "2px 0 0 rgba(59, 130, 246, 0.3), -2px 0 0 rgba(239, 68, 68, 0.3)",
                    "0 0 0 rgba(59, 130, 246, 0)"
                  ]
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: 5,
                  times: [0, 0.5, 1]
                }}
              >
                ΣNKI-REALTY
              </motion.span>
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Trait central ultra raffiné */}
        <motion.div
          className="relative w-96 h-[1px] mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent" />
          <motion.div
            className="absolute top-0 left-1/2 w-8 h-[3px] bg-primary rounded-full -translate-x-1/2 -translate-y-1"
            animate={{
              x: [-50, 150, -50],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
        </motion.div>

        {/* Cyprus Properties avec timing parfait */}
        <motion.h2
          className="swaarg-large-title text-white/90 mb-16"
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "-0.03em" }}
          transition={{ 
            duration: 2, 
            delay: 2.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          Cyprus Properties
        </motion.h2>

        {/* Typewriter minimaliste et élégant */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <motion.div
            className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="relative swaarg-body-large text-primary/90 font-mono tracking-wider">
            {typewriterText}
            <motion.span
              animate={{ 
                opacity: [0, 1, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="ml-2 inline-block w-[2px] h-6 bg-primary"
            />
          </div>
        </motion.div>
      </div>

      {/* Indicateur scroll ultra épuré */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 4 }}
      >
        <motion.div
          className="relative group cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-6 h-10 border border-white/40 rounded-full relative backdrop-blur-sm group-hover:border-white/70 transition-colors">
            <motion.div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[2px] h-3 bg-white/60 rounded-full"
              animate={{ 
                y: [0, 12, 0], 
                opacity: [0.6, 1, 0.6],
                height: [12, 8, 12]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          {/* Anneaux décoratifs */}
          <motion.div
            className="absolute -inset-4 border border-white/10 rounded-full"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroAlternative5;