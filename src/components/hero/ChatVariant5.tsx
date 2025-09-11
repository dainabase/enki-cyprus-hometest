import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

const useMultilingualTypewriter = (texts: string[], speed: number = 35) => {
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

// Variante 5: Design minimaliste avec bordure subtile
const ChatVariant5 = () => {
  const [inputValue, setInputValue] = useState('');
  const [showChat, setShowChat] = useState(false);
  const typewriterText = useMultilingualTypewriter([
    "Je suis suisse, 45 ans, budget 600 000 CHF. Je cherche un penthouse avec grande terrasse et vue mer.",
    "Je suis français, 38 ans, budget 200 000 €. Je recherche un appartement 2 pièces proche de la plage.",
    "Je suis italien, 52 ans, budget 1 000 000 €. Villa 4 chambres avec jardin et piscine privée."
  ], 35);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      console.log('Message sent:', inputValue);
      setInputValue('');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowChat(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
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
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/45" />
      
      {/* Contenu central */}
      <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
        <motion.div className="mb-4">
          <motion.h1
            className="swaarg-hero-title text-white relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
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
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="relative inline-block"
            >
              ΣNKI-REALTY
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.div
          className="relative w-96 h-[1px] mx-auto mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent" />
        </motion.div>

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
      </div>

      {/* Chat Interface - Ultra épuré avec bordure subtile */}
      <motion.div
        className="relative w-full max-w-3xl mx-auto mb-24 px-4 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: showChat ? 1 : 0, y: showChat ? 0 : 50 }}
        transition={{ 
          delay: 2.0, 
          duration: 1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <div className="relative bg-white/98 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl">
          {/* Message ultra simple */}
          <div className="mb-6 h-24 overflow-hidden flex items-center justify-center">
            <div className="text-gray-700 text-sm leading-relaxed font-light text-center max-w-lg">
              {typewriterText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="ml-1"
              >
                |
              </motion.span>
            </div>
          </div>

          {/* Ligne de séparation subtile */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

          {/* Input ultra simple */}
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tapez votre recherche..."
              className="w-full h-12 pr-12 border-0 focus:ring-1 focus:ring-primary/30 bg-gray-50/50 backdrop-blur-sm rounded-lg text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <motion.button
              onClick={handleSendMessage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-800 hover:bg-primary text-white rounded-md flex items-center justify-center transition-all duration-300"
              disabled={!inputValue.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ChatVariant5;