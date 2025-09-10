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

const HeroAlternative13 = () => {
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
        Alternative 9 - Executive White
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
        className="absolute top-6 right-6 z-50 p-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-600 hover:text-primary hover:border-primary transition-all shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
      >
        <RefreshCw size={20} />
      </motion.button>

      {/* Main content */}
      <div className="relative z-20 text-center px-8 max-w-7xl mx-auto">
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

        {/* Executive Interface */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden">
            {/* Premium Header */}
            <div className="px-10 py-8 bg-gradient-to-r from-white/90 to-gray-50/90 border-b border-gray-100/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <motion.div 
                    className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg"
                    animate={{ 
                      boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.4)', '0 0 0 10px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0)'] 
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xl font-semibold text-gray-800">AI System Online</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-500">Status: Active</div>
                  <motion.div 
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
            
            {/* Chat Content */}
            <div className="p-12">
              <div className="bg-white/70 rounded-2xl p-8 shadow-lg border border-gray-100/50">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 mt-1">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-primary via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <motion.div
                      className="bg-gradient-to-r from-gray-50 to-white rounded-2xl rounded-tl-sm p-6 shadow-sm border border-gray-100"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.6 }}
                    >
                      <p className="text-xl text-gray-800 leading-relaxed font-medium">
                        {typewriterText}
                        <motion.span
                          className="inline-block w-0.5 h-7 bg-primary ml-2"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      </p>
                    </motion.div>
                    
                    {/* Premium indicators */}
                    <motion.div
                      className="flex items-center justify-between mt-4 px-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 }}
                    >
                      <div className="flex items-center space-x-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.4, 1, 0.4]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.4
                            }}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">Processing...</span>
                      </div>
                      <div className="text-xs text-gray-400">Premium AI</div>
                    </motion.div>
                  </div>
                </div>
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

export default HeroAlternative13;