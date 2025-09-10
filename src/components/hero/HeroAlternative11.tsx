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

const HeroAlternative11 = () => {
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
        Alternative 7 - Premium White
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
        className="absolute top-6 right-6 z-50 p-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-gray-600 hover:text-primary hover:bg-white transition-all shadow-sm"
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

        {/* Premium White Chat Interface */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">AI System Online</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Chat Content */}
            <div className="p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4">
                    <p className="text-lg text-gray-800 font-medium">
                      {typewriterText}
                      <motion.span
                        className="inline-block w-0.5 h-6 bg-primary ml-1"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Typing indicator */}
              <motion.div
                className="flex items-center space-x-2 mt-4 ml-14"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">AI is typing...</span>
              </motion.div>
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
          <div className="w-0.5 h-8 bg-gradient-to-b from-transparent to-gray-300"></div>
          <div className="text-xs tracking-wider uppercase">Scroll</div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroAlternative11;