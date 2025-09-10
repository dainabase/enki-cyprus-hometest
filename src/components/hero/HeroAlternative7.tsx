import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

// Hook typewriter qui écrit et efface
const useMultilingualTypewriter = (texts: string[], speed: number = 40) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[currentIndex];
    
    const timer = setInterval(() => {
      if (isTyping) {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsTyping(false), 1500);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setCurrentIndex((currentIndex + 1) % texts.length);
          setIsTyping(true);
        }
      }
    }, speed);

    return () => clearInterval(timer);
  }, [texts, currentIndex, isTyping, charIndex, speed]);

  return displayText;
};

const HeroAlternative7 = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const typewriterText = useMultilingualTypewriter(["The first AI powered real estate platform"], 80);

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
        className="absolute top-24 md:top-28 right-4 z-50 p-3 bg-primary/90 hover:bg-primary rounded-full text-white shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300"
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
          className="absolute inset-0 w-full h-full object-cover scale-125"
          style={{
            backgroundImage: `url(/lovable-uploads/7a1f4c1e-ed5d-401e-98a7-e7d380bb9d99.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div 
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60 scale-125"
          style={{
            backgroundImage: `url(/lovable-uploads/7a1f4c1e-ed5d-401e-98a7-e7d380bb9d99.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>
      
      {/* Overlay minimaliste */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/45" />
      
      {/* Contenu central ultra épuré */}
      <div className="relative z-10 text-center">
        
        {/* ENKI-REALTY avec effet de matérialisation */}
        <motion.div className="mb-4">
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
          className="relative w-96 h-[1px] mx-auto mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent" />
        </motion.div>

        {/* Cyprus Properties avec timing parfait */}
        <motion.h2
          className="swaarg-large-title text-white/90 mb-12"
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

        {/* Chat moderne style */}
        <motion.div
          className="relative w-full mx-auto mt-24 md:mt-40 px-4"
          initial={{ opacity: 0, scale: 0.3, z: -100 }}
          animate={{ opacity: 1, scale: 1, z: 0 }}
          transition={{ 
            delay: 3.2, 
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <div className="relative w-full bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-400/30 rounded-2xl p-6 min-h-[120px] shadow-2xl shadow-blue-400/10">
            {/* Header chat */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-400/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white/20"></div>
              </div>
              <div>
                <div className="text-blue-400 text-sm font-medium">AI Assistant</div>
                <div className="flex items-center gap-1">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-green-400"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-xs text-green-400">AI_SYSTEM_ONLINE</span>
                </div>
              </div>
            </div>
            
            {/* Message bubble */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex-shrink-0 mt-1"></div>
              <div className="flex-1 bg-blue-500/10 rounded-lg p-3 border border-blue-400/20">
                <div className="text-blue-100 text-left">
                  <span>{typewriterText}</span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1 text-blue-400"
                  >
                    |
                  </motion.span>
                </div>
              </div>
            </div>
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

export default HeroAlternative7;