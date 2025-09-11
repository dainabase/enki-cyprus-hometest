import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RotateCcw, Send, MessageCircle, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const useMultilingualTypewriter = (texts: string[], speed: number = 40) => {
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

const ChatAlternative3 = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showChat, setShowChat] = useState(false);
  const typewriterText = useMultilingualTypewriter(["Welcome to the future of real estate. What property are you looking for?"], 40);

  const restartAnimation = () => {
    setAnimationKey(prev => prev + 1);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      console.log('Message sent:', inputValue);
      setInputValue('');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowChat(true), 4000);
    return () => clearTimeout(timer);
  }, [animationKey]);

  const suggestions = [
    "Show me luxury villas",
    "Apartments near the sea",
    "Investment opportunities",
    "Properties under €500k"
  ];

  return (
    <section 
      key={animationKey}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
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
        
        {/* ENKI-REALTY */}
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

      {/* Chat Interface avec suggestions */}
      <motion.div
        className="relative w-full max-w-5xl mx-auto mb-24 px-4 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: showChat ? 1 : 0, y: showChat ? 0 : 50 }}
        transition={{ 
          delay: 3.5, 
          duration: 1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <div className="relative bg-white/98 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl">
          {/* Header avec icône */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Property Assistant</h3>
              <p className="text-sm text-gray-500">Powered by advanced AI technology</p>
            </div>
            <motion.div
              className="ml-auto w-3 h-3 rounded-full bg-green-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Message AI avec animation */}
          <div className="mb-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
            <div className="text-gray-800 text-lg leading-relaxed">
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

          {/* Suggestions rapides */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3 font-medium">Quick suggestions:</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 group"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setInputValue(suggestion)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 4 + index * 0.1 }}
                >
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{suggestion}</span>
                  <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-primary ml-2 inline" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input principal */}
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about Cyprus real estate..."
              className="flex-1 h-14 border-gray-200 focus:border-primary bg-white text-lg px-6"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              className="h-14 px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white rounded-xl font-medium"
              disabled={!inputValue.trim()}
            >
              <Send className="w-5 h-5 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ChatAlternative3;