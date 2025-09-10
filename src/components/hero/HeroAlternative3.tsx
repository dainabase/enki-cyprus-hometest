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

const HeroAlternative3 = () => {
  const typewriterText = useTypewriter("the first AI-powered real estate platform", 70);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Fond vidéo simulé avec plusieurs couches */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/marina-bay-sea-view.jpg')`,
        }}
      />
      
      {/* Overlay avec effet parallax */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-primary/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      
      {/* Formes géométriques flottantes */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div
          className="absolute bottom-32 right-32 w-24 h-24 border border-primary/30"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          animate={{
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      {/* Contenu centré avec design minimal */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
        {/* ENKI-REALTY avec effet de révélation par masque */}
        <div className="overflow-hidden mb-8">
          <motion.h1
            className="swaarg-hero-title text-white"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <motion.span
              className="inline-block"
              animate={{
                backgroundImage: [
                  "linear-gradient(45deg, #ffffff, #ffffff)",
                  "linear-gradient(45deg, #3b82f6, #ffffff)",
                  "linear-gradient(45deg, #ffffff, #3b82f6)",
                  "linear-gradient(45deg, #ffffff, #ffffff)"
                ]
              }}
              style={{
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent"
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 2
              }}
            >
              ΣNKI-REALTY
            </motion.span>
          </motion.h1>
        </div>

        {/* Trait avec effet de charge */}
        <motion.div className="relative w-80 h-[1px] mx-auto mb-8">
          <div className="absolute inset-0 bg-white/30" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              delay: 1,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        </motion.div>

        {/* Cyprus Properties avec effet de slide */}
        <div className="overflow-hidden mb-12">
          <motion.h2
            className="swaarg-large-title text-white/90"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 1.5,
              delay: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            Cyprus Properties
          </motion.h2>
        </div>

        {/* Container pour typewriter avec design futuriste */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="absolute inset-0 bg-primary/10 blur-xl rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="relative bg-black/20 backdrop-blur-sm border border-primary/20 rounded-2xl px-8 py-6">
            <motion.div
              className="swaarg-body-large text-primary font-mono text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              {typewriterText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="ml-1"
              >
                ●
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Icône scroll avec style moderne */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.5 }}
      >
        <motion.div
          className="relative"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-8 h-12 border-2 border-white/50 rounded-full relative backdrop-blur-sm">
            <motion.div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-white rounded-full"
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroAlternative3;