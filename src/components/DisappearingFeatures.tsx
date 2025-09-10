import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { ShieldCheck, Search, Calculator } from "lucide-react";

export const DisappearingFeatures = () => {
  return (
    <>
      {/* Container avec hauteur = viewport × nombre de cartes */}
      <div className="relative h-[300vh] bg-neutral-50">
        <Features />
      </div>
    </>
  );
};

const Features = () => {
  const containerRef = useRef(null);
  
  return (
    <div 
      ref={containerRef}
      className="relative mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-2"
    >
      <Copy />
      <Carousel containerRef={containerRef} />
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

const Carousel = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) => {
  // IMPORTANT: Utiliser le container principal comme référence
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"], // Quand le container touche le haut et quitte par le haut
  });

  const cards = [
    {
      icon: <ShieldCheck className="w-12 h-12 text-white" />,
      title: "Sélection Rigoureuse",
      description: "Tous les projets des promoteurs les plus fiables, vérifiés et validés selon nos critères stricts de qualité et de rentabilité"
    },
    {
      icon: <Search className="w-12 h-12 text-white" />,
      title: "Recherche Intelligente",
      description: "Une IA qui comprend vos besoins et vous propose les meilleures opportunités d'investissement personnalisées"
    },
    {
      icon: <Calculator className="w-12 h-12 text-white" />,
      title: "Optimisation Fiscale",
      description: "En un clic, obtenez des scénarios personnalisés pour maximiser vos avantages fiscaux à Chypre et en Europe"
    }
  ];

  return (
    <div className="relative w-full flex items-center md:py-24">
      <div className="w-full space-y-8">
        {cards.map((card, index) => (
          <CarouselItem
            key={index}
            scrollYProgress={scrollYProgress}
            position={index + 1}
            numItems={3}
            {...card}
          />
        ))}
      </div>
    </div>
  );
};

interface CarouselItemProps {
  scrollYProgress: MotionValue<number>;
  position: number;
  numItems: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CarouselItem = ({
  scrollYProgress,
  position,
  numItems,
  icon,
  title,
  description,
}: CarouselItemProps) => {
  // Calcul simplifié pour 3 cartes
  const start = (position - 1) / numItems;
  const end = position / numItems;
  
  // Animations
  const opacity = useTransform(
    scrollYProgress, 
    [start, start + 0.1, end - 0.1, end], 
    [0, 1, 1, 0]
  );
  
  const scale = useTransform(
    scrollYProgress, 
    [start, start + 0.1, end - 0.1, end], 
    [0.8, 1, 1, 0.8]
  );
  
  const y = useTransform(
    scrollYProgress,
    [start, end],
    ["50px", "-50px"]
  );

  return (
    <motion.div
      style={{
        opacity,
        scale,
        y,
      }}
      className="flex flex-col items-start justify-center aspect-[16/10] w-full rounded-2xl bg-black p-8"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </motion.div>
  );
};
