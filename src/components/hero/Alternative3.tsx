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

// Alternative 3: Format horizontal ultra fin
const Alternative3 = () => {
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

      {/* Chat Interface - Format horizontal avec ligne de message au-dessus */}
      <motion.div
        className="relative w-full max-w-4xl mx-auto mb-24 px-4 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: showChat ? 1 : 0, y: showChat ? 0 : 50 }}
        transition={{ 
          delay: 2.0, 
          duration: 1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {/* Message séparé au-dessus */}
        <div className="mb-3 p-3 bg-white/94 backdrop-blur-xl border border-white/25 rounded-lg shadow-xl">
          <div className="text-gray-800 text-xs leading-relaxed font-light text-center h-12 overflow-hidden">
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

        {/* Input horizontal en bas */}
        <div className="bg-white/94 backdrop-blur-xl border border-white/25 rounded-lg p-3 shadow-xl">
          <div className="flex gap-3 items-center">
            <div className="text-gray-600 text-xs font-medium whitespace-nowrap">
              Powered by AI
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Décrivez votre projet..."
              className="flex-1 h-9 border-gray-200/40 focus:border-primary bg-transparent rounded-md text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <motion.button
              onClick={handleSendMessage}
              className="h-9 px-4 bg-primary hover:bg-primary/90 text-white rounded-md flex items-center gap-1 transition-all duration-200 text-xs font-medium"
              disabled={!inputValue.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-3 h-3" />
              Send
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Alternative3;