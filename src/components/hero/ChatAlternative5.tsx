import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RotateCcw, Send, Crown, Gem } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Exemples pour la version luxury/premium
const searchExamples = [
  "Britannique, 55 ans, £2M. Manoir contemporain avec cave à vin et home cinéma. Domaine privé : piscine olympique, court de tennis éclairé, héliport personnel. Services VIP : majordomie, chef privé, chauffeur dans 500m.",
  "Japonais, 39 ans, 1.8M€. Penthouse zen avec jardin japonais sur toit-terrasse. Résidence d'exception : onsen privé, dojo traditionnel, galerie d'art. Proximité : consulats, restaurants étoilés, boutiques de créateurs.",
  "Émirati, 31 ans, 3M AED. Villa ultra-moderne avec piscine à débordement et spa hammam. Complexe royal : golf privé, écuries, marina personnelle. Infrastructure : clinique privée, école internationale premium, centres d'affaires."
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

      {/* Background luxury avec or */}
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
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-yellow-900/30 to-orange-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-amber-900/30" />
        
        {/* Particules dorées */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full shadow-lg shadow-amber-400/50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 20 - 10, 0],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Contenu central */}
      <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
        
        {/* ENKI-REALTY avec effet or */}
        <motion.div className="mb-4">
          <motion.h1
            className="swaarg-hero-title relative"
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          >
            <motion.span
              className="relative inline-block bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent"
              style={{
                textShadow: "0 0 40px rgba(245, 158, 11, 0.6)",
                filter: "drop-shadow(0 4px 15px rgba(245, 158, 11, 0.4))"
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                textShadow: [
                  "0 0 40px rgba(245, 158, 11, 0.6)",
                  "0 0 60px rgba(245, 158, 11, 0.9)",
                  "0 0 40px rgba(245, 158, 11, 0.6)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundSize: "200% 200%"
              }}
            >
              ΣNKI-REALTY
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Trait doré luxueux */}
        <motion.div
          className="relative w-96 h-[4px] mx-auto mb-4"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 2, duration: 2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-2xl shadow-amber-400/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200 to-transparent opacity-70" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
            animate={{
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Cyprus Properties */}
        <motion.h2
          className="swaarg-large-title text-amber-100 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 2, 
            delay: 2.5
          }}
          style={{
            textShadow: "0 0 30px rgba(252, 211, 77, 0.5)",
            filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.3))"
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