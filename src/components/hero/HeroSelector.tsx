import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatAlternative1 from './ChatAlternative1';
import ChatAlternative2 from './ChatAlternative2';
import ChatAlternative3 from './ChatAlternative3';
import ChatAlternative4 from './ChatAlternative4';
import ChatAlternative5 from './ChatAlternative5';
import ChatAlternative6 from './ChatAlternative6';

const HeroSelector = () => {
  const [currentHero, setCurrentHero] = useState(1);

  const alternatives = [
    { 
      id: 1, 
      name: "Premium Blanc", 
      description: "Interface élégante avec exemples immobiliers",
      component: ChatAlternative1 
    },
    { 
      id: 2, 
      name: "Terminal Noir", 
      description: "Style développeur avec effet matrice",
      component: ChatAlternative2 
    },
    { 
      id: 3, 
      name: "Interactif Plus", 
      description: "Suggestions rapides et badges premium",
      component: ChatAlternative3 
    },
    { 
      id: 4, 
      name: "Glassmorphism", 
      description: "Effets de verre et bulles flottantes",
      component: ChatAlternative4 
    },
    { 
      id: 5, 
      name: "Luxury Gold", 
      description: "Design doré avec conciergerie royale",
      component: ChatAlternative5 
    },
    { 
      id: 6, 
      name: "Cyber Futur", 
      description: "Interface futuriste avec IA quantique",
      component: ChatAlternative6 
    }
  ];

  const CurrentComponent = alternatives.find(alt => alt.id === currentHero)?.component || ChatAlternative1;

  return (
    <div className="relative">
      {/* Sélecteur en overlay */}
      <div className="fixed top-20 right-4 z-[60] bg-black/80 backdrop-blur-xl rounded-xl p-3 border border-primary/30 w-72">
        <h3 className="text-white font-medium mb-3 text-xs">Chat Styles</h3>
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