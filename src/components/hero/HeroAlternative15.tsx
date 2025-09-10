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

const HeroAlternative15 = () => {
  const [key, setKey] = useState(0);

  const restartAnimation = () => {
    setKey(prev => prev + 1);
  };

  const typewriterText = useMultilingualTypewriter([
    "The first AI-powered real estate platform"
  ], 80);

  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center"
      key={key}
    >
      {/* Label */}
      <div className="absolute top-4 left-4 z-50 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
        Alternative 11 - Luxury White
      </div>

      {/* Premium floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary/30 rounded-full"
          animate={{ 
            scale: [1, 20, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-3/4 right-1/3 w-2 h-2 bg-blue-300/20 rounded-full"
          animate={{ 
            scale: [1, 15, 1],
            opacity: [0.2, 0.05, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Restart button */}
      <motion.button
        onClick={restartAnimation}
        className="absolute top-6 right-6 z-50 p-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl text-gray-600 hover:text-primary hover:border-primary transition-all shadow-xl hover:shadow-2xl"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
      >
        <RefreshCw size={22} />
      </motion.button>

      {/* Main content */}
      <div className="relative z-20 text-center px-8 max-w-7xl mx-auto">
        {/* Company name with reveal effect */}
        <div className="mb-8 overflow-hidden">
          <motion.h1
            className="text-8xl md:text-9xl font-bold tracking-tighter text-gray-900"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
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
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-gray-600">
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

        {/* Luxury Interface */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.div 
            className="relative"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Luxury glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-indigo-200/20 to-purple-200/20 rounded-[3rem] blur-3xl"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <div className="relative bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/60 overflow-hidden">
              {/* Luxury Header */}
              <div className="px-12 py-10 bg-gradient-to-r from-white/80 via-gray-50/80 to-white/80 border-b border-gray-100/60">
                <div className="flex items-center justify-center space-x-6">
                  <motion.div 
                    className="relative"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-full shadow-lg"></div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-full"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.8, 0, 0.8]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 tracking-tight">AI System Online</h3>
                  <motion.div 
                    className="w-3 h-3 bg-gradient-to-r from-primary to-blue-600 rounded-full shadow-lg"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                </div>
              </div>
              
              {/* Luxury Chat Content */}
              <div className="p-14">
                <motion.div
                  className="bg-gradient-to-br from-white/90 to-gray-50/90 rounded-3xl p-10 shadow-lg border border-gray-100/50 backdrop-blur-sm"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                >
                  <div className="flex items-start space-x-8">
                    <motion.div 
                      className="flex-shrink-0 relative"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-primary via-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <motion.div 
                          className="w-4 h-4 bg-white rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-3xl opacity-30 blur-lg"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.1, 0.3]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-2xl text-gray-800 leading-relaxed font-medium">
                        {typewriterText}
                        <motion.span
                          className="inline-block w-1 h-8 bg-primary ml-3 rounded-full"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      </p>
                      
                      {/* Luxury status indicators */}
                      <motion.div
                        className="flex items-center justify-between mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5 }}
                      >
                        <div className="flex items-center space-x-3">
                          {[0, 1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-gradient-to-r from-primary to-blue-600 rounded-full shadow-sm"
                              animate={{ 
                                scale: [1, 1.8, 1],
                                opacity: [0.4, 1, 0.4]
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: i * 0.5
                              }}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-4 font-medium">Premium AI Processing...</span>
                        </div>
                        <div className="text-xs text-gray-400 tracking-wider uppercase">Luxury Edition</div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
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
          className="flex flex-col items-center space-y-3"
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
          <div className="text-xs tracking-wider uppercase font-medium">Scroll</div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroAlternative15;