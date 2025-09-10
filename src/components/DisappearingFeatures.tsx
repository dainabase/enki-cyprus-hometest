import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { ShieldCheck, Search, Calculator } from "lucide-react";

export const DisappearingFeatures = () => {
  return (
    <>
      <div className="relative h-fit bg-neutral-50">
        <Features />
      </div>
      <div className="h-[50vh] bg-white" />
    </>
  );
};

const Features = () => {
  return (
    <div className="relative mx-auto grid h-full w-full max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-2">
      <Copy />
      <Carousel />
    </div>
  );
};

const Copy = () => {
  return (
    <div className="flex h-fit w-full flex-col justify-center py-12 md:sticky md:top-0 md:h-screen">
      <span className="w-fit rounded-full bg-black px-4 py-2 text-sm uppercase text-white">
        Excellence · Innovation · Confiance
      </span>
      <h2 className="mb-4 mt-2 text-5xl font-medium leading-tight text-black">
        Pourquoi choisir ENKI Realty ?
      </h2>
      <p className="text-lg text-neutral-700">
        Une expérience d'investissement immobilier exceptionnelle à Chypre, combinant expertise locale et standards internationaux pour maximiser votre retour sur investissement.
      </p>
    </div>
  );
};

const Carousel = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <div className="relative w-full">
      <Gradient />
      <div ref={ref} className="relative z-0 flex flex-col gap-6 md:gap-12">
        <CarouselItem
          scrollYProgress={scrollYProgress}
          position={1}
          numItems={3}
          icon={<ShieldCheck className="w-12 h-12 text-white" />}
          title="Sélection rigoureuse"
          description="Tous les projets des promoteurs les plus fiables réunis en un seul endroit, soigneusement sélectionnés pour leur qualité et leur sérieux."
        />
        <CarouselItem
          scrollYProgress={scrollYProgress}
          position={2}
          numItems={3}
          icon={<Search className="w-12 h-12 text-white" />}
          title="Recherche intelligente"
          description="Une IA qui comprend vos besoins et vous propose les biens les plus adaptés, sans perte de temps ni recherche complexe."
        />
        <CarouselItem
          scrollYProgress={scrollYProgress}
          position={3}
          numItems={3}
          icon={<Calculator className="w-12 h-12 text-white" />}
          title="Optimisation fiscale"
          description="En un clic, obtenez des scénarios personnalisés pour maximiser votre rentabilité et protéger votre patrimoine, avec des réponses immédiates et concrètes."
        />
      </div>
      <Buffer />
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
  const stepSize = 1 / numItems;
  const end = stepSize * position;
  const start = end - stepSize;
  const opacity = useTransform(scrollYProgress, [start, end], [1, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [1, 0.75]);

  return (
    <motion.div
      style={{
        opacity,
        scale,
      }}
      className="flex flex-col items-start justify-center aspect-video w-full shrink-0 rounded-2xl bg-black p-8"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-neutral-300 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const Gradient = () => (
  <div className="sticky top-0 z-10 hidden h-24 w-full bg-gradient-to-b from-neutral-50 to-neutral-50/0 md:block" />
);

const Buffer = () => <div className="h-24 w-full md:h-48" />;