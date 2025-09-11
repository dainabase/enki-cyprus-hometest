import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RotateCcw, Send, Brain, Cpu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Exemples pour la version futuriste/tech
const searchExamples = [
  "Tech entrepreneur, 32 ans, 1.5M€. Smart home avec IA intégrée et panneaux solaires transparents. Éco-tech résidence : bornes Tesla, laboratoire domotique, datacenter privé. Hub innovation : incubateur startup, fablabs, université tech à 2km.",
  "Designer danois, 44 ans, 950k€. Loft minimaliste avec murs végétalisés et système aquaponique. Complexe bio-tech : jardins verticaux, recyclage d'air, énergie géothermique. Services : clinique médecine prédictive, école Steiner, ateliers créatifs.",
  "Investisseur chinois, 37 ans, 2.8M yuan. Penthouse connecté avec hologrammes et réalité augmentée. Tour intelligente : ascenseurs quantiques, sécurité biométrique, robots assistants. Infrastructure : 5G privée, blockchain center, métaverse office."
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
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
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

      {/* Background futuriste */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 w-full h-full object-cover opacity-15"
          style={{
            backgroundImage: `url(/lovable-uploads/7a1f4c1e-ed5d-401e-98a7-e7d380bb9d99.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Grille technologique */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full"
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
                 `,
                 backgroundSize: '40px 40px'
               }}>
          </div>
        </div>
        
        {/* Cercles tech flottants */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-purple-500/30"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Contenu central */}
      <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
        
        {/* ENKI-REALTY avec effet cyber */}
        <motion.div className="mb-4">
          <motion.h1
            className="swaarg-hero-title relative"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <motion.span
              className="relative inline-block bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent"
              style={{
                textShadow: "0 0 50px rgba(147, 51, 234, 0.8)",
                filter: "drop-shadow(0 0 20px rgba(147, 51, 234, 0.5))"
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                textShadow: [
                  "0 0 50px rgba(147, 51, 234, 0.8), 0 0 100px rgba(236, 72, 153, 0.4)",
                  "0 0 80px rgba(147, 51, 234, 1), 0 0 150px rgba(236, 72, 153, 0.6)",
                  "0 0 50px rgba(147, 51, 234, 0.8), 0 0 100px rgba(236, 72, 153, 0.4)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundSize: "200% 200%"
              }}
            >
              ΣNKI-REALTY
            </motion.span>
            
            {/* Effet de scan */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"
              animate={{
                x: ["-100%", "200%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
            />
          </motion.h1>
        </motion.div>

        {/* Trait cyber */}
        <motion.div
          className="relative w-96 h-[3px] mx-auto mb-4"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-2xl shadow-purple-500/50" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400 to-transparent"
            animate={{
              opacity: [0.5, 1, 0.5],
              scaleY: [1, 2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Cyprus Properties */}
        <motion.h2
          className="swaarg-large-title text-purple-200 mb-12"
          initial={{ opacity: 0, rotateX: 90 }}
          animate={{ opacity: 1, rotateX: 0 }}
          transition={{ 
            duration: 1.5, 
            delay: 2.5
          }}
          style={{
            textShadow: "0 0 30px rgba(196, 181, 253, 0.6)",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))"
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
                placeholder="ENTREZ_PARAMETRES_RECHERCHE_IMMOBILIERE..."
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