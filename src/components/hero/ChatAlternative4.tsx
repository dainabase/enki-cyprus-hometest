import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RotateCcw, Send, Zap, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Exemples pour la version glassmorphism
const searchExamples = [
  "Américain, 41 ans, 900k USD. Penthouse high-tech avec domotique complète. Tour résidentielle premium : sky lounge, infinity pool, spa nordique. Infrastructure : fibre optique, data center, smart city à proximité.",
  "Australien, 36 ans, 650k AUD. Maison écologique passive avec géothermie. Éco-village innovant : panneaux solaires, permaculture, mobilité électrique. Services : FabLab, coworking vert, école alternative dans 1km.",
  "Singapourien, 29 ans, 1.5M SGD. Loft design avec terrasse suspendue et jacuzzi. Complexe futuriste : ascenseurs privatifs, robots de service, sécurité biométrique. Proximité : business district, startups, innovation hub."
];

const useTypewriterExamples = (texts: string[], speed: number = 20) => {
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
          setTimeout(() => setIsTyping(false), 3500);
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

const ChatAlternative4 = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showChat, setShowChat] = useState(false);
  const typewriterText = useTypewriterExamples(searchExamples, 25);

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
        className="absolute top-24 md:top-28 right-4 z-50 p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full text-white shadow-lg border border-white/20 transition-all duration-300"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <RotateCcw className="w-5 h-5" />
      </motion.button>

      {/* Background avec effet glassmorphism */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 w-full h-full object-cover scale-110"
          style={{
            backgroundImage: `url(/lovable-uploads/7a1f4c1e-ed5d-401e-98a7-e7d380bb9d99.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-blue-600/40 to-purple-700/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-blue-900/30" />
        
        {/* Bulles flottantes */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-sm"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Contenu central */}
      <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
        
        {/* ENKI-REALTY avec effet cristal */}
        <motion.div className="mb-4">
          <motion.h1
            className="swaarg-hero-title text-white relative"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <motion.span
              className="relative inline-block"
              style={{
                textShadow: "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(59,130,246,0.3)",
                filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))"
              }}
              animate={{
                textShadow: [
                  "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(59,130,246,0.3)",
                  "0 0 40px rgba(255,255,255,0.8), 0 0 80px rgba(59,130,246,0.5)",
                  "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(59,130,246,0.3)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ΣNKI-REALTY
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Trait cristallin */}
        <motion.div
          className="relative w-96 h-[3px] mx-auto mb-4"
          initial={{ opacity: 0, rotateX: 90 }}
          animate={{ opacity: 1, rotateX: 0 }}
          transition={{ delay: 2, duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent backdrop-blur-sm shadow-lg shadow-white/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
        </motion.div>

        {/* Cyprus Properties */}
        <motion.h2
          className="swaarg-large-title text-white/95 mb-12"
          initial={{ opacity: 0, z: -100 }}
          animate={{ opacity: 1, z: 0 }}
          transition={{ 
            duration: 1.8, 
            delay: 2.5
          }}
          style={{
            textShadow: "0 0 20px rgba(255,255,255,0.3)",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))"
          }}
        >
          Cyprus Properties
        </motion.h2>
      </div>

      {/* Chat Interface - Style glassmorphism */}
      <motion.div
        className="relative w-full max-w-5xl mx-auto mb-24 px-4 z-10"
        initial={{ opacity: 0, y: 50, rotateX: 45 }}
        animate={{ opacity: showChat ? 1 : 0, y: showChat ? 0 : 50, rotateX: showChat ? 0 : 45 }}
        transition={{ 
          delay: 3.5, 
          duration: 1.2,
          ease: "easeOut"
        }}
      >
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-black/20">
          {/* Effet de reflet sur le verre */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-3xl pointer-events-none" />
          
          {/* Header glassmorphism */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50"
                animate={{ 
                  boxShadow: [
                    "0 0 10px rgba(34, 211, 238, 0.5)",
                    "0 0 20px rgba(34, 211, 238, 0.8)",
                    "0 0 10px rgba(34, 211, 238, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Zap className="w-5 h-5 text-cyan-300" />
              <span className="text-sm text-white/90 font-medium">ENKI-AI Quantum</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </div>

          {/* Message du bot glassmorphism */}
          <div className="mb-6 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="text-white/95 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-cyan-400/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm mb-4 text-white/80 font-medium">
                  Intelligence artificielle avancée • Analysez vos critères immobiliers :
                </p>
                <div className="text-white/95 text-sm leading-relaxed min-h-[120px] p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
                  <span>{typewriterText}</span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1 text-cyan-300"
                  >
                    |
                  </motion.span>
                </div>
              </div>
            </div>
          </div>

          {/* Input glassmorphism */}
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Décrivez votre vision immobilière parfaite..."
              className="flex-1 h-12 bg-white/10 backdrop-blur-xl border-white/20 focus:border-cyan-300/50 text-white placeholder:text-white/60"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              className="h-12 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-cyan-500/30"
              disabled={!inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Indicateur scroll glassmorphism */}
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
          <div className="w-6 h-10 border border-white/40 backdrop-blur-md rounded-full relative group-hover:border-white/70 transition-colors shadow-lg shadow-white/10">
            <motion.div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[2px] h-3 bg-gradient-to-b from-white to-cyan-300 rounded-full shadow-lg shadow-cyan-300/50"
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

export default ChatAlternative4;