import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Search, Calculator } from "lucide-react";

export const DisappearingFeatures = () => {
  const [isSticky, setIsSticky] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // Le sticky est actif tant qu'on est dans la section
      setIsSticky(rect.top <= 0 && rect.bottom >= window.innerHeight);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hook de scroll pour l'animation des cartes
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

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
    <div ref={sectionRef} className="relative h-[200vh] bg-neutral-50">
      {/* Container principal avec grid */}
      <div className="mx-auto max-w-7xl px-4 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full relative">
          
          {/* COLONNE GAUCHE - Titre Sticky */}
          <div className="relative">
            <div className={`${isSticky ? 'md:fixed md:top-24' : 'md:absolute md:top-0'} md:w-[calc(50%-2rem)] md:max-w-[600px] transition-none`}>
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

          {/* COLONNE DROITE - Cartes animées */}
          <div className="relative md:py-24">
            {/* Container pour aligner les cartes avec le titre */}
            <div className="relative h-full flex items-start">
              <div className="w-full space-y-8 relative">
                {cards.map((card, index) => {
                  // Animation timing pour chaque carte
                  const cardStart = index * 0.25;
                  const cardEnd = (index + 1) * 0.25;
                  
                  const opacity = useTransform(
                    scrollYProgress,
                    [cardStart, cardStart + 0.02, cardEnd - 0.02, cardEnd],
                    [0, 1, 1, 0]
                  );
                  
                  const y = useTransform(
                    scrollYProgress,
                    [cardStart, cardEnd],
                    ["50px", "-50px"]
                  );
                  
                  const scale = useTransform(
                    scrollYProgress,
                    [cardStart, cardStart + 0.02, cardEnd - 0.02, cardEnd],
                    [0.9, 1, 1, 0.9]
                  );

                  return (
                    <motion.div
                      key={index}
                      style={{ opacity, y, scale }}
                      className="w-full"
                    >
                      <div className="flex flex-col items-start justify-center aspect-[16/10] w-full rounded-2xl bg-black p-8">
                        <div className="mb-4">{card.icon}</div>
                        <h3 className="text-2xl font-semibold text-white mb-3">
                          {card.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {card.description}
                        </p>
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
  );
};