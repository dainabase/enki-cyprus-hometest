import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RotateCcw, Send, Brain, Cpu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Exemples pour la version futuriste/tech
const searchExamples = [
  "Je suis suisse, 45 ans, budget 600 000 CHF. Je cherche un penthouse avec grande terrasse et vue mer. Résidence: spa, salle de sport, jardin d’enfants, piscine. À moins de 2 km: banque, supermarché, école.",
  "Je suis français, 38 ans, budget 200 000 €. Je recherche un appartement 2 pièces proche de la plage, avec balcon. Résidence: piscine et salle de sport. Commodités à moins de 2 km: supermarché, école, pharmacie.",
  "Je suis italien, 52 ans, budget 1 000 000 €. Villa 4 chambres avec jardin et piscine privée. Résidence sécurisée avec spa et concierge. À moins de 2 km: banque, lycée international, centre commercial."
];

const useTypewriterExamples = (texts: string[], speed: number = 18) => {
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
          setTimeout(() => setIsTyping(false), 3000);
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

const ChatAlternative6 = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showChat, setShowChat] = useState(false);
  const typewriterText = useTypewriterExamples(searchExamples, 22);

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
        className="absolute top-24 md:top-28 right-4 z-50 p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full text-white shadow-xl backdrop-blur-sm border border-purple-400/50 transition-all duration-300"
        whileHover={{ scale: 1.1, rotate: -360 }}
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

      {/* Chat Interface - Style cyber futuriste */}
      <motion.div
        className="relative w-full max-w-6xl mx-auto mb-24 px-4 z-10"
        initial={{ opacity: 0, y: 50, rotateX: 30 }}
        animate={{ opacity: showChat ? 1 : 0, y: showChat ? 0 : 50, rotateX: showChat ? 0 : 30 }}
        transition={{ 
          delay: 3.5, 
          duration: 1.2,
          ease: "easeOut"
        }}
      >
        <div className="relative bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
          {/* Effet néon sur les bordures */}
          <div className="absolute inset-0 rounded-3xl border border-purple-400/50 shadow-inner shadow-purple-500/20" />
          <motion.div
            className="absolute inset-0 rounded-3xl border border-pink-400/30"
            animate={{
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Header cyber */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 shadow-lg shadow-purple-400/50"
                animate={{ 
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    "0 0 15px rgba(147, 51, 234, 0.5)",
                    "0 0 30px rgba(147, 51, 234, 1)",
                    "0 0 15px rgba(147, 51, 234, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Brain className="w-6 h-6 text-purple-400" />
              <span className="text-sm text-purple-300 font-mono">ENKI-AI.NEURAL_NET</span>
              <Cpu className="w-5 h-5 text-pink-400" />
            </div>
            <div className="px-3 py-1 bg-purple-900/50 border border-purple-500/50 rounded-full">
              <span className="text-xs text-purple-300 font-mono">QUANTUM_READY</span>
            </div>
          </div>

          {/* Message du bot cyber */}
          <div className="mb-6 p-6 bg-slate-800/50 rounded-2xl border border-purple-500/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-purple-500/40">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-mono text-purple-300">NEURAL.SYSTEM</span>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-xs text-purple-400 font-mono">PROCESSING...</span>
                </div>
                <p className="text-sm mb-4 text-purple-200 font-mono">
                  &gt; INITIALIZING PROPERTY_ANALYSIS_PROTOCOL
                </p>
                <div className="text-purple-100 text-sm leading-relaxed min-h-[120px] p-4 bg-black/40 rounded-xl border border-purple-500/20 font-mono">
                  <span>{typewriterText}</span>
                  <motion.span
                    animate={{ opacity: [0, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="ml-1 bg-purple-400 w-[2px] h-4 inline-block"
                  >
                  </motion.span>
                </div>
              </div>
            </div>
          </div>

          {/* Input cyber */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 font-mono text-sm">&gt;</span>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="ENTREZ_VOTRE_PROJET_IMMOBILIER (budget, type, vue, équipements, commodités à 2 km)..."
                className="pl-8 h-12 bg-slate-800/50 border-purple-500/30 focus:border-purple-400 text-purple-100 placeholder:text-purple-400/70 font-mono"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl shadow-lg shadow-purple-500/30 font-mono"
              disabled={!inputValue.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              EXEC
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Indicateur scroll cyber */}
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
          <div className="w-6 h-10 border border-purple-400/60 rounded-full relative backdrop-blur-sm group-hover:border-purple-400 transition-colors shadow-xl shadow-purple-400/30">
            <motion.div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[2px] h-3 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full shadow-lg shadow-purple-400/50"
              animate={{ 
                y: [0, 12, 0], 
                opacity: [0.6, 1, 0.6],
                height: [12, 8, 12]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ChatAlternative6;