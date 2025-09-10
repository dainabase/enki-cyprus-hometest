import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroAlternative1 from './HeroAlternative1';
import HeroAlternative2 from './HeroAlternative2';
import HeroAlternative4 from './HeroAlternative4';
import HeroAlternative5 from './HeroAlternative5';

const HeroSelector = () => {
  const [currentHero, setCurrentHero] = useState(1);

  const alternatives = [
    { 
      id: 1, 
      name: "Glitch & Particules", 
      description: "Effet de glitch moderne avec particules flottantes",
      component: HeroAlternative1 
    },
    { 
      id: 2, 
      name: "Construction & Terminal", 
      description: "Lettres qui se construisent + style terminal",
      component: HeroAlternative2 
    },
    { 
      id: 4, 
      name: "Holographique & Mesh", 
      description: "Effet holographique avec mesh gradient",
      component: HeroAlternative4 
    },
    { 
      id: 5, 
      name: "Minimaliste & Scanner", 
      description: "Ultra épuré avec effet de scanner",
      component: HeroAlternative5 
    }
  ];

  const CurrentComponent = alternatives.find(alt => alt.id === currentHero)?.component || HeroAlternative1;

  return (
    <div className="relative">
      {/* Sélecteur en overlay */}
      <div className="fixed top-20 right-4 z-[60] bg-black/80 backdrop-blur-xl rounded-xl p-4 border border-primary/30">
        <h3 className="text-white font-medium mb-3 text-sm">Hero Alternatives</h3>
        <div className="space-y-2">
          {alternatives.map((alt) => (
            <motion.button
              key={alt.id}
              onClick={() => setCurrentHero(alt.id)}
              className={`w-full text-left p-3 rounded-lg transition-all text-xs ${
                currentHero === alt.id 
                  ? 'bg-primary text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-medium">{alt.name}</div>
              <div className="text-xs opacity-70 mt-1">{alt.description}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Hero actuel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentHero}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CurrentComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroSelector;