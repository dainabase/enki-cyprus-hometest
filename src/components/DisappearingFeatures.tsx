import React, { useRef, useEffect, useState } from "react";
import { ShieldCheck, Search, Calculator } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const DisappearingFeatures = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [selected, setSelected] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setIsSticky(rect.top <= 100 && rect.bottom >= window.innerHeight);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const FEATURES = [
    {
      title: "Analyse approfondie de chaque projet",
      Icon: ShieldCheck,
      Feature: () => <FeatureContent 
        icon={<ShieldCheck className="w-16 h-16" />}
        title="Sélection Rigoureuse"
        description="Analyse approfondie de chaque projet : vérification légale, évaluation du potentiel de valorisation et validation Golden Visa"
      />,
    },
    {
      title: "Matching personnalisé selon vos critères",
      Icon: Search,
      Feature: () => <FeatureContent 
        icon={<Search className="w-16 h-16" />}
        title="Recherche Intelligente"
        description="Matching personnalisé selon vos critères : budget, rendement attendu, éligibilité Golden Visa et préférences de localisation"
      />,
    },
    {
      title: "Maximisez vos avantages fiscaux",
      Icon: Calculator,
      Feature: () => <FeatureContent 
        icon={<Calculator className="w-16 h-16" />}
        title="Optimisation Fiscale"
        description="Conseil expert sur la structuration de votre investissement pour maximiser les avantages fiscaux chypriotes et européens"
      />,
    },
  ];

  return (
    <div ref={sectionRef} className="relative min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* GAUCHE - Titre Sticky (NE PAS MODIFIER) */}
          <div className={`hidden md:block ${isSticky ? 'fixed top-24' : 'relative'} left-0 w-full z-20 transition-none`}>
            <div className="mx-auto max-w-7xl px-4">
              <div className="w-1/2">
                <div className="py-12 md:py-24">
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
              </div>
            </div>
          </div>

          {/* Mobile version */}
          <div className="md:hidden px-4 py-12">
            <span className="w-fit rounded-full bg-black px-4 py-2 text-sm uppercase text-white inline-block mb-4">
              Excellence immobilière
            </span>
            <h2 className="text-4xl font-medium leading-tight text-black mb-4">
              Pourquoi choisir ENKI Realty ?
            </h2>
            <p className="text-lg text-gray-700">
              Une expérience d'investissement immobilier exceptionnelle à Chypre.
            </p>
          </div>

          {/* DROITE - Tabs Features */}
          <div className="md:ml-[50%] md:pl-8 py-12 md:py-24">
            <div className="w-full">
              {/* Tabs Navigation */}
              <div className="flex overflow-x-auto border-b-2 border-gray-200">
                {FEATURES.map((tab, index) => (
                  <Tab
                    key={index}
                    setSelected={setSelected}
                    selected={selected === index}
                    Icon={tab.Icon}
                    title={tab.title}
                    tabNum={index}
                  />
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {FEATURES.map((tab, index) => {
                  return selected === index ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      key={index}
                      className="py-8"
                    >
                      <tab.Feature />
                    </motion.div>
                  ) : null;
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tab = ({ selected, Icon, title, setSelected, tabNum }: any) => {
  return (
    <div className="relative flex-1">
      <button
        onClick={() => setSelected(tabNum)}
        className="relative z-0 flex w-full flex-col items-center justify-center gap-2 bg-white p-4 transition-colors hover:bg-gray-50"
      >
        <span
          className={`rounded-lg bg-black p-3 text-2xl text-white transition-all duration-300 ${
            selected
              ? "scale-100 opacity-100 shadow-lg"
              : "scale-90 opacity-50"
          }`}
        >
          <Icon />
        </span>
        <span
          className={`text-xs text-gray-600 transition-opacity text-center ${
            selected ? "opacity-100" : "opacity-50"
          }`}
        >
          {title}
        </span>
      </button>
      {selected && (
        <motion.span
          layoutId="tabs-features-underline"
          className="absolute bottom-0 left-0 right-0 z-10 h-1 bg-black"
        />
      )}
    </div>
  );
};

const FeatureContent = ({ icon, title, description }: any) => (
  <div className="w-full">
    <div className="relative bg-black rounded-2xl p-8 shadow-xl">
      <div className="flex items-start gap-6">
        <div className="text-white flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-white mb-3">
            {title}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  </div>
);