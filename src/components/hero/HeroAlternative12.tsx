import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const useMultilingualTypewriter = (texts: string[], speed = 80) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (texts.length === 0) return;

    const currentText = texts[currentIndex];
    
    if (isTyping) {
      if (charIndex < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, speed);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else {
      if (charIndex > 0) {
        const timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, speed / 2);
        return () => clearTimeout(timer);
      } else {
        setCurrentIndex((currentIndex + 1) % texts.length);
        setIsTyping(true);
      }
    }
  }, [texts, currentIndex, isTyping, charIndex, speed]);

  return displayText;
};

const HeroAlternative12 = () => {
  const [key, setKey] = useState(0);

  const restartAnimation = () => {
    setKey(prev => prev + 1);
  };

  const typewriterText = useMultilingualTypewriter([
    "The first AI-powered real estate platform"
  ], 80);

  return (
    <section className="relative h-screen overflow-hidden bg-background flex items-center justify-center"
      key={key}
    >
      {/* Label */}
      <div className="absolute top-4 left-4 z-50 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
        Alternative 8 - Minimal Clean
      </div>

      {/* Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/5"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(0,144,230,0.1) 0%, transparent 50%, rgba(0,144,230,0.05) 100%)',
              'linear-gradient(45deg, rgba(0,144,230,0.05) 0%, transparent 50%, rgba(0,144,230,0.1) 100%)',
              'linear-gradient(45deg, rgba(0,144,230,0.1) 0%, transparent 50%, rgba(0,144,230,0.05) 100%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Restart button */}
      <motion.button
        onClick={restartAnimation}
        className="absolute top-6 right-6 z-50 p-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-primary hover:border-primary transition-all shadow-sm hover:shadow-md"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
      >
        <RefreshCw size={20} />
      </motion.button>

      {/* Main content */}
      <div className="relative z-20 text-center px-8 max-w-6xl mx-auto">
        {/* Company name with reveal effect */}
        <div className="mb-8 overflow-hidden">
          <motion.h1
            className="text-8xl md:text-9xl font-bold tracking-tighter"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #0090E6 50%, #FFFFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(0,144,230,0.3))'
            }}
          >
            ΣNKI-REALTY
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-white/90">
            {'Cyprus Properties'.split('').map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                className="inline-block"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </h2>
        </motion.div>

        {/* Clean White Interface */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Elegant Header */}
            <div className="px-8 py-6 border-b border-gray-50">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="w-4 h-4 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-lg font-semibold text-gray-800">AI System Online</span>
                  <motion.div 
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
            
            {/* Message Area */}
            <div className="p-10">
              <div className="text-center space-y-6">
                <motion.div
                  className="inline-block bg-gray-50 rounded-2xl px-8 py-6 max-w-lg"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                >
                  <p className="text-xl text-gray-800 leading-relaxed">
                    {typewriterText}
                    <motion.span
                      className="inline-block w-0.5 h-6 bg-primary ml-2"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </p>
                </motion.div>
                
                {/* Status dots */}
                <motion.div
                  className="flex justify-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-primary rounded-full"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center space-y-2"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
          <div className="text-xs tracking-wider uppercase">Scroll</div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroAlternative12;