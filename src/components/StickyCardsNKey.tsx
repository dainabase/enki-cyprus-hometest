import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Search, Calculator, Zap } from "lucide-react";

export const StickyCardsNKey = () => {
  return (
    <div className="relative overflow-hidden bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <section className="relative z-20 py-20 md:py-36">
          <span className="mx-auto mb-3 block w-fit rounded bg-gradient-to-br from-card to-muted p-3 text-3xl shadow-md shadow-primary/20">
            <Zap className="text-primary" />
          </span>
          <h2 className="mb-3 text-center text-3xl font-semibold leading-tight sm:text-4xl text-primary">
            Pourquoi choisir NKey Realty ?
          </h2>
          <p className="mb-6 text-center text-base leading-snug text-muted-foreground sm:text-lg sm:leading-snug md:text-xl md:leading-snug">
            Une expérience d'investissement immobilier redéfinie, alliant expertise, technologie de pointe et service d'excellence pour des résultats exceptionnels.
          </p>
          <FeatureCards />
        </section>
      </div>
      <BGGrid />
    </div>
  );
};

const BGGrid = () => {
  return (
    <div
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='hsl(var(--border))'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
      className="absolute bottom-0 left-0 right-0 top-0"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/0 to-background/80" />
      <Beams />
    </div>
  );
};

const Beams = () => {
  const { width } = useWindowSize();

  const numColumns = width ? Math.floor(width / GRID_BOX_SIZE) : 0;

  const placements = [
    {
      top: GRID_BOX_SIZE * 0,
      left: Math.floor(numColumns * 0.05) * GRID_BOX_SIZE,
      transition: {
        duration: 3.5,
        repeatDelay: 5,
        delay: 2,
      },
    },
    {
      top: GRID_BOX_SIZE * 12,
      left: Math.floor(numColumns * 0.15) * GRID_BOX_SIZE,
      transition: {
        duration: 3.5,
        repeatDelay: 10,
        delay: 4,
      },
    },
    {
      top: GRID_BOX_SIZE * 3,
      left: Math.floor(numColumns * 0.25) * GRID_BOX_SIZE,
    },
    {
      top: GRID_BOX_SIZE * 9,
      left: Math.floor(numColumns * 0.75) * GRID_BOX_SIZE,
      transition: {
        duration: 2,
        repeatDelay: 7.5,
        delay: 3.5,
      },
    },
    {
      top: 0,
      left: Math.floor(numColumns * 0.7) * GRID_BOX_SIZE,
      transition: {
        duration: 3,
        repeatDelay: 2,
        delay: 1,
      },
    },
    {
      top: GRID_BOX_SIZE * 2,
      left: Math.floor(numColumns * 1) * GRID_BOX_SIZE - GRID_BOX_SIZE,
      transition: {
        duration: 5,
        repeatDelay: 5,
        delay: 5,
      },
    },
  ];

  return (
    <>
      {placements.map((p, i) => (
        <Beam
          key={i}
          top={p.top}
          left={p.left - BEAM_WIDTH_OFFSET}
          transition={p.transition || {}}
        />
      ))}
    </>
  );
};

const Beam = ({ top, left, transition = {} }) => {
  return (
    <motion.div
      initial={{
        y: 0,
        opacity: 0,
      }}
      animate={{
        opacity: [0, 1, 0],
        y: 32 * 8,
      }}
      transition={{
        ease: "easeInOut",
        duration: 3,
        repeat: Infinity,
        repeatDelay: 1.5,
        ...transition,
      }}
      style={{
        top,
        left,
      }}
      className="absolute z-10 h-[64px] w-[1px] bg-gradient-to-b from-primary/0 to-primary"
    />
  );
};

const FeatureCards = () => {
  const features = [
    {
      id: 1,
      icon: Target,
      title: "Sélection rigoureuse",
      description: "Tous les projets des promoteurs les plus fiables réunis en un seul endroit, soigneusement sélectionnés pour leur qualité et leur sérieux.",
    },
    {
      id: 2,
      icon: Search,
      title: "Recherche intelligente",
      description: "Une IA qui comprend vos besoins et vous propose les biens les plus adaptés, sans perte de temps ni recherche complexe.",
    },
    {
      id: 3,
      icon: Calculator,
      title: "Optimisation fiscale",
      description: "En un clic, obtenez des scénarios personnalisés pour maximiser votre rentabilité et protéger votre patrimoine, avec des réponses immédiates et concrètes.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} feature={feature} index={index} />
      ))}
    </div>
  );
};

const FeatureCard = ({ feature, index }) => {
  return (
    <Card className="group">
      <div className="text-center">
        <span className="mx-auto mb-4 block w-fit rounded-full bg-gradient-to-br from-primary/10 to-accent/10 p-4 text-3xl">
          <feature.icon className="text-primary w-8 h-8" />
        </span>
        <h3 className="mb-4 text-xl font-semibold text-primary">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
      </div>
      <span className="absolute left-0 top-1/2 h-48 w-[1px] -translate-y-1/2 animate-pulse bg-gradient-to-b from-primary/0 via-primary/80 to-primary/0" />
    </Card>
  );
};

const Card = ({ className, children }) => {
  return (
    <motion.div
      initial={{
        filter: "blur(4px)",
        y: 20,
        opacity: 0,
      }}
      whileInView={{
        filter: "blur(0px)",
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        delay: 0.25,
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={`relative h-full w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card/50 to-muted/30 backdrop-blur-sm p-6 hover:border-primary/30 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};

const GRID_BOX_SIZE = 32;
const BEAM_WIDTH_OFFSET = 1;