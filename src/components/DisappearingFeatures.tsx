import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Search, Calculator } from "lucide-react";

export const DisappearingFeatures = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Déterminer quelle carte est active basé sur le scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const cardIndex = Math.min(Math.floor(latest * 3.5), 2);
      setActiveCard(cardIndex);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const cards = [
    {
      icon: <ShieldCheck className="w-12 h-12 text-white" />,
      title: "Sélection Rigoureuse",
      description: "Analyse approfondie de chaque projet : vérification légale, évaluation du potentiel de valorisation et validation Golden Visa"
    },
    {
      icon: <Search className="w-12 h-12 text-white" />,
      title: "Recherche Intelligente",
      description: "Matching personnalisé selon vos critères : budget, rendement attendu, éligibilité Golden Visa et préférences de localisation"
    },
    {
      icon: <Calculator className="w-12 h-12 text-white" />,
      title: "Optimisation Fiscale",
      description: "Conseil expert sur la structuration de votre investissement pour maximiser les avantages fiscaux chypriotes et européens"
    }
  ];

  return (
    <>
      {/* Container scrollable avec hauteur fixe */}
      <div 
        ref={containerRef}
        className="relative h-[300vh] bg-neutral-50"
      >
        {/* Titre FIXED qui suit le scroll */}
        <div className="sticky top-0 h-screen pointer-events-none">
          <div className="h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* Colonne gauche - Titre */}
                <div className="pointer-events-auto">
                  <span className="w-fit rounded-full bg-black px-4 py-2 text-sm uppercase text-white inline-block mb-4">
                    Excellence immobilière
                  </span>
                  <h2 className="text-5xl font-medium leading-tight text-black mb-4">
                    Pourquoi choisir ENKI Realty ?
                  </h2>
                  <p className="text-lg text-gray-700">
                    Une expérience d'investissement immobilier exceptionnelle à Chypre, 
                    combinant expertise locale et standards internationaux pour maximiser 
                    votre retour sur investissement.
                  </p>
                </div>

                {/* Colonne droite - Une seule carte visible à la fois */}
                <div className="relative h-[60vh] flex items-center justify-center pointer-events-auto">
                  {cards.map((card, index) => {
                    const isActive = index === activeCard;
                    const isPrev = index === activeCard - 1;
                    const isNext = index === activeCard + 1;
                    
                    let opacity = 0;
                    let scale = 0.8;
                    let y = 100;
                    
                    if (isActive) {
                      opacity = 1;
                      scale = 1;
                      y = 0;
                    } else if (isPrev) {
                      opacity = 0;
                      scale = 0.9;
                      y = -100;
                    } else if (isNext) {
                      opacity = 0;
                      scale = 0.9;
                      y = 100;
                    }

                    return (
                      <motion.div
                        key={index}
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        animate={{ 
                          opacity,
                          scale,
                          y
                        }}
                        transition={{ 
                          duration: 0.5,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="w-full max-w-lg">
                          <div className="flex flex-col items-start justify-center aspect-[16/10] w-full rounded-2xl bg-black p-8">
                            <div className="mb-4">{card.icon}</div>
                            <h3 className="text-2xl font-semibold text-white mb-3">
                              {card.title}
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateurs de progression */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`h-1 transition-all duration-300 ${
              index === activeCard 
                ? 'w-12 bg-black' 
                : 'w-6 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </>
  );
};