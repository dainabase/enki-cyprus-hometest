import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

// Hook typewriter multilingue
const useMultilingualTypewriter = (texts: string[], speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);
  
  useEffect(() => {
    const currentText = texts[currentTextIndex];
    
    const timer = setInterval(() => {
      if (isTyping) {
        // Phase d'écriture
        if (charIndex < currentText.length) {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        } else {
          // Attendre 2 secondes avant d'effacer
          setTimeout(() => {
            setIsTyping(false);
            setCharIndex(currentText.length);
          }, 2000);
        }
      } else {
        // Phase d'effacement
        if (charIndex > 0) {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        } else {
          // Passer au texte suivant
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          setIsTyping(true);
          setCharIndex(0);
          setDisplayText('');
        }
      }
    }, isTyping ? speed : speed / 2);

    return () => clearInterval(timer);
  }, [texts, speed, currentTextIndex, isTyping, charIndex]);

  return displayText;
};

const HeroAlternative2 = () => {
  const [animationKey, setAnimationKey] = useState(0);
  
  const multilingualTexts = [
    "the first AI-powered real estate platform",
    "la première plateforme immobilière alimentée par l'IA",
    "первая платформа недвижимости на базе ИИ",
    "η πρώτη πλατφόρμα ακινήτων με τεχνητή νοημοσύνη",
    "la primera plataforma inmobiliaria impulsada por IA",
    "la prima piattaforma immobiliare alimentata dall'IA",
    "die erste KI-gestützte Immobilienplattform",
    "het eerste AI-aangedreven vastgoedplatform"
  ];
  
  const typewriterText = useMultilingualTypewriter(multilingualTexts, 80);

  const restartAnimation = () => {
    setAnimationKey(prev => prev + 1);
  };

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

      {/* Overlay géométrique moderne */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-primary/30" />
        <motion.div
          className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </div>
      
      {/* Grid pattern animé */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
          animate={{
            backgroundPosition: ['0 0', '50px 50px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      {/* Contenu en colonnes */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Colonne gauche - Texte */}
        <div>
          {/* ENKI-REALTY sur une seule ligne */}
          <div className="mb-6">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white inline-block whitespace-nowrap"
              initial={{ opacity: 0, x: "-100vw" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 2,
                delay: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              ΣNKI-REALTY
            </motion.h1>
          </div>

          {/* Trait moderne avec segments */}
          <motion.div className="flex items-center gap-2 mb-6">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="h-[2px] bg-gradient-to-r from-white to-primary"
                style={{ width: i === 3 ? '32px' : '16px' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
              />
            ))}
          </motion.div>

          {/* Cyprus Properties */}
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white/90 mb-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            Cyprus Properties
          </motion.h2>

          {/* Texte typewriter avec style terminal */}
          <motion.div
            className="bg-black/30 backdrop-blur-sm border border-primary/30 rounded-lg p-4 font-mono"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="text-primary swaarg-body">
              &gt; {typewriterText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                _
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Colonne droite - Éléments décoratifs */}
        <div className="relative">
          <motion.div
            className="w-64 h-64 border border-primary/30 rounded-full mx-auto relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 2, delay: 1.5 }}
          >
            <motion.div
              className="absolute inset-4 border border-white/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-8 border border-primary/50 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Icône scroll */}
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

export default HeroAlternative2;