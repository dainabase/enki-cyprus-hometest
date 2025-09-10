import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const DisappearingFeatures = () => {
  return (
    <div className="relative h-fit bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Features />
    </div>
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
    <div className="flex h-fit w-full flex-col justify-start py-12 md:py-24 md:sticky md:top-0 md:h-screen">
      <span className="w-fit rounded-full bg-primary px-4 py-2 text-sm uppercase text-primary-foreground mb-4">
        Excellence • Innovation • Confiance
      </span>
      <h2 className="mb-6 text-5xl font-light leading-tight tracking-tight text-primary">
        Pourquoi choisir NKey Realty ?
      </h2>
      <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
        Une expérience d'investissement immobilier redéfinie, alliant expertise, technologie de pointe et service d'excellence pour des résultats exceptionnels.
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

      <div ref={ref} className="relative z-0 flex flex-col gap-12 py-12">
        <CarouselItem
          scrollYProgress={scrollYProgress}
          position={1}
          numItems={3}
          title="Sélection rigoureuse"
          description="Tous les projets des promoteurs les plus fiables réunis en un seul endroit, soigneusement sélectionnés pour leur qualité et leur sérieux."
          icon="Shield"
        />
        <CarouselItem
          scrollYProgress={scrollYProgress}
          position={2}
          numItems={3}
          title="Recherche intelligente"
          description="Une IA qui comprend vos besoins et vous propose les biens les plus adaptés, sans perte de temps ni recherche complexe."
          icon="Lightbulb"
        />
        <CarouselItem
          scrollYProgress={scrollYProgress}
          position={3}
          numItems={3}
          title="Optimisation fiscale"
          description="En un clic, obtenez des scénarios personnalisés pour maximiser votre rentabilité et protéger votre patrimoine, avec des réponses immédiates et concrètes."
          icon="TrendingUp"
        />
      </div>

      <Buffer />
    </div>
  );
};

const CarouselItem = ({ scrollYProgress, position, numItems, title, description, icon }) => {
  const stepSize = 1 / numItems;
  const end = stepSize * position;
  const start = end - stepSize;

  const opacity = useTransform(scrollYProgress, [start, end], [1, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [1, 0.75]);

  // Import des icones Lucide dynamiquement
  const getIcon = (iconName) => {
    const icons = {
      Shield: (
        <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      Lightbulb: (
        <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      TrendingUp: (
        <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    };
    return icons[iconName];
  };

  return (
    <motion.div
      style={{
        opacity,
        scale,
      }}
      className="h-[70vh] w-full shrink-0 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/50 p-8 relative overflow-hidden flex flex-col justify-center"
    >
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
        animate={{ x: [0, 20, -20, 0], y: [0, -10, 10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="text-center space-y-6 relative z-10">
        <motion.div
          className="flex justify-center mb-6"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", damping: 15 }}
        >
          {getIcon(icon)}
        </motion.div>
        
        <h3 className="text-2xl md:text-3xl font-medium text-primary tracking-tight">
          {title}
        </h3>
        
        <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
          {description}
        </p>
      </div>
      
      <motion.div
        className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
    </motion.div>
  );
};

const Gradient = () => (
  <div className="sticky top-0 z-10 hidden h-24 w-full bg-gradient-to-b from-background to-background/0 md:block" />
);

const Buffer = () => <div className="h-[150vh] w-full" />;