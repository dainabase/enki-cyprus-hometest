import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatAlternative4 from './ChatAlternative4';
import ChatVariant1 from './ChatVariant1';
import ChatVariant2 from './ChatVariant2';
import ChatVariant3 from './ChatVariant3';
import ChatVariant4 from './ChatVariant4';
import ChatVariant5 from './ChatVariant5';

const HeroSelector = () => {
  const [currentHero, setCurrentHero] = useState(1);

  const alternatives = [
    { 
      id: 1, 
      name: "Original", 
      description: "Version glassmorphisme originale",
      component: ChatAlternative4 
    },
    { 
      id: 2, 
      name: "Input Intégré", 
      description: "Bouton dans la zone de saisie",
      component: ChatVariant1 
    },
    { 
      id: 3, 
      name: "Ultra Simple", 
      description: "Sans header IA, épuré",
      component: ChatVariant2 
    },
    { 
      id: 4, 
      name: "Circulaire", 
      description: "Design rond premium",
      component: ChatVariant3 
    },
    { 
      id: 5, 
      name: "Horizontal", 
      description: "Layout en ligne",
      component: ChatVariant4 
    },
    { 
      id: 6, 
      name: "Minimaliste", 
      description: "Bordure subtile, ultra sobre",
      component: ChatVariant5 
    }
  ];

  const CurrentComponent = alternatives.find(alt => alt.id === currentHero)?.component || ChatAlternative4;

  return (
    <div className="relative">
      {/* Sélecteur en overlay */}
      <div className="fixed top-20 right-4 z-[60] bg-black/80 backdrop-blur-xl rounded-xl p-3 border border-primary/30 w-72">
        <h3 className="text-white font-medium mb-3 text-xs">Glassmorphisme Variants</h3>
        <div className="space-y-2">
          {alternatives.map((alt) => (
            <motion.button
              key={alt.id}
              onClick={() => setCurrentHero(alt.id)}
              className={`w-full text-left p-2 rounded-lg transition-all text-xs ${
                currentHero === alt.id 
                  ? 'bg-primary text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-medium text-xs">{alt.name}</div>
              <div className="text-[10px] opacity-70 mt-1">{alt.description}</div>
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