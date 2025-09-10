import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Hook typewriter
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

const HeroAlternative2 = () => {
  const typewriterText = useTypewriter("the first AI-powered real estate platform", 80);

  return (
    <section 
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/lovable-uploads/marina-bay-panoramic.jpg')`,
      }}
    >
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
          {/* ENKI-REALTY avec effet de construction lettre par lettre */}
          <div className="mb-6">
            {['Σ', 'N', 'K', 'I', '-', 'R', 'E', 'A', 'L', 'T', 'Y'].map((letter, index) => (
              <motion.span
                key={index}
                className="swaarg-hero-title text-white inline-block"
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.1,
                  color: "#3b82f6",
                  transition: { duration: 0.2 }
                }}
              >
                {letter === '-' ? <span className="mx-2">-</span> : letter}
              </motion.span>
            ))}
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
            className="swaarg-large-title text-white/90 mb-8"
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