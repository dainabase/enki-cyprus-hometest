import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroAlternative5 from './HeroAlternative5';
import HeroAlternative6 from './HeroAlternative6';
import HeroAlternative7 from './HeroAlternative7';
import HeroAlternative8 from './HeroAlternative8';
import HeroAlternative9 from './HeroAlternative9';
import HeroAlternative10 from './HeroAlternative10';

const HeroSelector = () => {
  const [currentHero, setCurrentHero] = useState(5);

  const alternatives = [
    { 
      id: 5, 
      name: "Original", 
      description: "Zone blanche épurée",
      component: HeroAlternative5 
    },
    { 
      id: 6, 
      name: "Terminal", 
      description: "Style console/terminal",
      component: HeroAlternative6 
    },
    { 
      id: 7, 
      name: "Chat Moderne", 
      description: "Interface de chat IA",
      component: HeroAlternative7 
    },
    { 
      id: 8, 
      name: "Holographique", 
      description: "Effet hologramme futuriste",
      component: HeroAlternative8 
    },
    { 
      id: 9, 
      name: "Matrix", 
      description: "Style Matrix avec code",
      component: HeroAlternative9 
    },
    { 
      id: 10, 
      name: "Clean", 
      description: "Interface ultra propre",
      component: HeroAlternative10 
    }
  ];

  const CurrentComponent = alternatives.find(alt => alt.id === currentHero)?.component || HeroAlternative5;

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