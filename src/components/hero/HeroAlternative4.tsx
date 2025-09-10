import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

// Hook typewriter avec effet de scintillement
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

const HeroAlternative4 = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const typewriterText = useTypewriter("the first AI-powered real estate platform", 90);

  const restartAnimation = () => {
    setAnimationKey(prev => prev + 1);
  };

  return (
    <section 
      key={animationKey}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
    >
      {/* Bouton de relance d'animation */}
      <motion.button
        onClick={restartAnimation}
        className="fixed top-4 right-4 z-50 p-3 bg-primary/90 hover:bg-primary rounded-full text-white shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <RotateCcw className="w-5 h-5" />
      </motion.button>

      {/* Image de fond avec blend mode */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-40"
        style={{
          backgroundImage: `url('/lovable-uploads/marina-bay-panoramic.jpg')`,
        }}
      />
      
      {/* Mesh gradient animé */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Grille isométrique */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'perspective(1000px) rotateX(60deg)'
          }}
          animate={{
            backgroundPosition: ['0 0', '60px 60px'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      {/* Contenu principal avec layout asymétrique */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-center min-h-screen">
          {/* Colonne principale - décalée */}
          <div className="lg:col-span-8 lg:col-start-3">
            
            {/* ENKI-REALTY avec effet holographique */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.h1
                className="swaarg-hero-title text-transparent bg-clip-text relative"
                style={{
                  backgroundImage: "linear-gradient(45deg, #ffffff, #3b82f6, #ffffff)"
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                ΣNKI-REALTY
                
                {/* Effet de scan holographique */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 2,
                    delay: 1,
                    repeat: Infinity,
                    repeatDelay: 4
                  }}
                />
              </motion.h1>
            </motion.div>

            {/* Trait central avec segments lumineux */}
            <motion.div className="flex justify-center items-center gap-1 mb-8">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-[2px] bg-gradient-to-r from-blue-400 to-purple-400"
                  style={{ 
                    width: i === 5 || i === 6 ? '24px' : '8px',
                    opacity: i === 5 || i === 6 ? 1 : 0.6
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ 
                    delay: 1.5 + i * 0.05, 
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Cyprus Properties avec perspective */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, rotateX: 90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{ 
                duration: 1, 
                delay: 2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <h2 className="swaarg-large-title text-white/90">
                Cyprus Properties
              </h2>
            </motion.div>

            {/* Typewriter dans un container futuriste */}
            <motion.div
              className="relative max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30"
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8">
                <div className="flex items-center gap-2 mb-4">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-400"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-xs text-gray-400 font-mono">AI_SYSTEM_ONLINE</span>
                </div>
                <div className="swaarg-body-large text-blue-400 font-mono">
                  &gt; {typewriterText}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1"
                  >
                    █
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator futuriste */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 4 }}
      >
        <motion.div
          className="relative"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-8 h-14 border border-blue-400/50 rounded-full relative backdrop-blur-sm">
            <motion.div
              className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1.5 h-3 bg-gradient-to-b from-blue-400 to-transparent rounded-full"
              animate={{ y: [0, 20, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          {/* Cercles décoratifs */}
          <motion.div
            className="absolute -top-2 -left-2 w-12 h-12 border border-blue-400/20 rounded-full"
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ 
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroAlternative4;