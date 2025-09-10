import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ShieldCheck, Search, Calculator } from "lucide-react";

export const DisappearingFeatures = () => {
  const [isSticky, setIsSticky] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Détection manuelle du scroll pour activer le "fixed" sur desktop
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setIsSticky(rect.top <= 100 && rect.bottom >= window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={sectionRef} className="relative min-h-[300vh] bg-neutral-50">
      {/* Titre fixé par JS sur desktop */}
      <div
        className={`hidden md:block ${isSticky ? "fixed top-24" : "relative"} left-0 w-full z-20 transition-none`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="w-1/2">
            <Copy />
          </div>
        </div>
      </div>

      {/* Spacer pour compenser le fixed (desktop uniquement) */}
      {isSticky && <div className="hidden md:block h-[40vh]" />}

      {/* Affichage normal du titre sur mobile */}
      <div className="md:hidden">
        <div className="mx-auto max-w-7xl px-4">
          <Copy />
        </div>
      </div>

      {/* Carousel avec animation au scroll */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="md:ml-[50%] md:pl-8 pt-24">
          <CarouselWithScroll sectionRef={sectionRef} />
        </div>
      </div>
    </div>
  );
};

const Copy = () => {
  return (
    <div className="flex h-fit w-full flex-col py-12 md:sticky md:top-24 md:h-fit">
      {/* IMPORTANT: md:top-24 pour positionner en haut avec un peu d'espace */}
      <span className="w-fit rounded-full bg-black px-4 py-2 text-sm uppercase text-white">
        Excellence · Innovation · Confiance
      </span>
      <h2 className="mb-4 mt-2 text-5xl font-medium leading-tight text-black">
        Pourquoi choisir ENKI Realty ?
      </h2>
      <p className="text-lg text-gray-700">
        Une expérience d'investissement immobilier exceptionnelle à Chypre, 
        combinant expertise locale et standards internationaux pour maximiser 
        votre retour sur investissement.
      </p>
    </div>
  );
};

// Nouveau composant gérant l'animation des cartes avec la section complète comme référence
const CarouselWithScroll = ({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLDivElement>;
}) => {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const cards = [
    {
      icon: <ShieldCheck className="w-12 h-12 text-white" />,
      title: "Sélection Rigoureuse",
      description:
        "Tous les projets des promoteurs les plus fiables, vérifiés et validés selon nos critères stricts de qualité et de rentabilité",
    },
    {
      icon: <Search className="w-12 h-12 text-white" />,
      title: "Recherche Intelligente",
      description:
        "Une IA qui comprend vos besoins et vous propose les meilleures opportunités d'investissement personnalisées",
    },
    {
      icon: <Calculator className="w-12 h-12 text-white" />,
      title: "Optimisation Fiscale",
      description:
        "En un clic, obtenez des scénarios personnalisés pour maximiser vos avantages fiscaux à Chypre et en Europe",
    },
  ];

  return (
    <div className="space-y-12 pb-24">
      {cards.map((card, index) => (
        <AnimatedCard key={index} scrollYProgress={scrollYProgress} index={index}>
          <CarouselItem {...card} />
        </AnimatedCard>
      ))}
    </div>
  );
};

// Animation pour chaque carte (opacity + translation Y)
const AnimatedCard = ({
  scrollYProgress,
  index,
  children,
}: {
  scrollYProgress: MotionValue<number>;
  index: number;
  children: React.ReactNode;
}) => {
  const start = index * 0.33;
  const end = (index + 1) * 0.33;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0, 1, 1, 0]
  );

  const y = useTransform(scrollYProgress, [start, end], ["40px", "-40px"]);

  return <motion.div style={{ opacity, y }}>{children}</motion.div>;
};

interface CarouselItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Contenu de la carte (inchangé, sans logique d'animation propre)
const CarouselItem = ({ icon, title, description }: CarouselItemProps) => {
  return (
    <div className="flex flex-col items-start justify-center aspect-[16/10] w-full rounded-2xl bg-black p-8">
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};
