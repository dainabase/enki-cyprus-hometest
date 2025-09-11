import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RotateCcw, Send, Crown, Gem } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Exemples pour la version luxury/premium
const searchExamples = [
  "Je suis suisse, 45 ans, budget 600 000 CHF. Je cherche un penthouse avec grande terrasse et vue mer. Résidence: spa, salle de sport, jardin d’enfants, piscine. À moins de 2 km: banque, supermarché, école.",
  "Je suis français, 38 ans, budget 200 000 €. Je recherche un appartement 2 pièces proche de la plage, avec balcon. Résidence: piscine et salle de sport. Commodités à moins de 2 km: supermarché, école, pharmacie.",
  "Je suis italien, 52 ans, budget 1 000 000 €. Villa 4 chambres avec jardin et piscine privée. Résidence sécurisée avec spa et concierge. À moins de 2 km: banque, lycée international, centre commercial."
];

const useTypewriterExamples = (texts: string[], speed: number = 15) => {
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
          setTimeout(() => setIsTyping(false), 4000);
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

const ChatAlternative5 = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showChat, setShowChat] = useState(false);
  const typewriterText = useTypewriterExamples(searchExamples, 20);

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

  return (
    <section 
      key={animationKey}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Bouton de relance d'animation */}
      <motion.button
        onClick={restartAnimation}
        className="absolute top-24 md:top-28 right-4 z-50 p-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 rounded-full text-white shadow-xl backdrop-blur-sm border border-amber-300/50 transition-all duration-300"
        whileHover={{ scale: 1.1, rotate: 360 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <RotateCcw className="w-5 h-5" />
      </motion.button>

      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            backgroundImage: `url(/lovable-uploads/7a1f4c1e-ed5d-401e-98a7-e7d380bb9d99.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div 
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60"
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
        
        {/* ENKI-REALTY avec effet de matérialisation */}
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
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 0 rgba(59, 130, 246, 0)",
                    "2px 0 0 rgba(59, 130, 246, 0.3), -2px 0 0 rgba(239, 68, 68, 0.3)",
                    "0 0 0 rgba(59, 130, 246, 0)"
                  ]
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: 5,
                  times: [0, 0.5, 1]
                }}
              >
                ΣNKI-REALTY
              </motion.span>
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Trait central ultra raffiné */}
        <motion.div
          className="relative w-96 h-[1px] mx-auto mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent" />
        </motion.div>

        {/* Cyprus Properties */}
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

      {/* Chat Interface - Style luxury premium */}
      <motion.div
        className="relative w-full max-w-6xl mx-auto mb-24 px-4 z-10"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: showChat ? 1 : 0, y: showChat ? 0 : 50, scale: showChat ? 1 : 0.9 }}
        transition={{ 
          delay: 3.5, 
          duration: 1.3,
          ease: "easeOut"
        }}
      >
        <div className="relative bg-gradient-to-br from-amber-50/95 to-yellow-50/90 backdrop-blur-xl border-2 border-amber-200/50 rounded-3xl p-8 shadow-2xl shadow-amber-500/20">
          {/* Bordure dorée animée */}
          <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 opacity-30 -z-10" 
               style={{ padding: '2px' }}>
            <div className="w-full h-full bg-gradient-to-br from-amber-50/95 to-yellow-50/90 rounded-3xl"></div>
          </div>
          
          {/* Header premium luxury */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-amber-400/50"
                animate={{ 
                  scale: [1, 1.2, 1],
                  boxShadow: [
                    "0 0 15px rgba(245, 158, 11, 0.5)",
                    "0 0 25px rgba(245, 158, 11, 0.8)",
                    "0 0 15px rgba(245, 158, 11, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Crown className="w-6 h-6 text-amber-600" />
              <span className="text-sm text-amber-800 font-bold">ENKI-AI ROYAL EDITION</span>
              <Gem className="w-5 h-5 text-amber-600" />
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-full">
              <span className="text-xs text-amber-800 font-semibold">LUXURY CONCIERGE</span>
            </div>
          </div>

          {/* Message du bot luxury */}
          <div className="mb-6 p-6 bg-gradient-to-r from-amber-100/50 to-yellow-100/50 rounded-2xl border border-amber-200/50 shadow-inner">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-amber-500/40">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-amber-800">ROYAL CONCIERGE</span>
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <span className="text-xs text-amber-600">Service Premium Activé</span>
                </div>
                <p className="text-sm mb-4 text-amber-700 font-semibold">
                  🏰 Service de conciergerie immobilière de luxe • Décrivez votre palace idéal :
                </p>
                <div className="text-amber-900 text-sm leading-relaxed min-h-[120px] p-5 bg-white/80 rounded-xl border-2 border-amber-200/30 shadow-inner">
                  <span>{typewriterText}</span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1 text-amber-600"
                  >
                    |
                  </motion.span>
                </div>
              </div>
            </div>
          </div>

          {/* Input luxury */}
          <div className="flex gap-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Exprimez vos désirs immobiliers les plus exclusifs..."
              className="flex-1 h-14 bg-white/90 border-2 border-amber-200 focus:border-amber-400 text-amber-900 placeholder:text-amber-600/70 shadow-inner"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              className="h-14 px-8 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white rounded-xl shadow-xl shadow-amber-500/40 border border-amber-300"
              disabled={!inputValue.trim()}
            >
              <Crown className="w-5 h-5 mr-2" />
              Envoyer
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Indicateur scroll luxury */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 5 }}
      >
        <motion.div
          className="relative group cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-7 h-11 border-2 border-amber-300/60 rounded-full relative backdrop-blur-sm group-hover:border-amber-300 transition-colors shadow-xl shadow-amber-400/30">
            <motion.div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[3px] h-4 bg-gradient-to-b from-amber-300 to-yellow-400 rounded-full shadow-lg shadow-amber-400/50"
              animate={{ 
                y: [0, 14, 0], 
                opacity: [0.6, 1, 0.6],
                height: [16, 10, 16]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ChatAlternative5;