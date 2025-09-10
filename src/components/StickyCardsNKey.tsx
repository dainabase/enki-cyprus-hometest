import { useScroll, motion, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { Search, Target, Calculator } from "lucide-react";

export const StickyCardsNKey = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <>
      <div ref={ref} className="relative">
        {CARDS.map((c, idx) => (
          <Card
            key={c.id}
            card={c}
            scrollYProgress={scrollYProgress}
            position={idx + 1}
          />
        ))}
      </div>
      <div className="h-screen bg-background" />
    </>
  );
};

const Card = ({ position, card, scrollYProgress }) => {
  const scaleFromPct = (position - 1) / CARDS.length;
  const y = useTransform(scrollYProgress, [scaleFromPct, 1], [0, -CARD_HEIGHT]);

  const isOddCard = position % 2;

  return (
    <motion.div
      style={{
        height: CARD_HEIGHT,
        y: position === CARDS.length ? undefined : y,
      }}
      className={`sticky top-0 flex w-full origin-top flex-col items-center justify-center px-4 ${
        isOddCard ? "bg-background text-foreground" : "bg-primary text-primary-foreground"
      }`}
    >
      <card.Icon className="mb-4 text-4xl md:text-6xl" />
      <h3 className="mb-6 text-center text-4xl font-semibold md:text-6xl">
        {card.title}
      </h3>
      <p className="mb-8 max-w-2xl text-center text-lg md:text-xl px-4">
        {card.description}
      </p>
      <motion.button
        className={`flex items-center gap-2 rounded-lg px-8 py-4 text-base font-medium uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 md:text-lg ${
          card.ctaClasses
        } ${
          isOddCard
            ? "shadow-[4px_4px_0px_hsl(var(--primary))] hover:shadow-[8px_8px_0px_hsl(var(--primary))]"
            : "shadow-[4px_4px_0px_hsl(var(--background))] hover:shadow-[8px_8px_0px_hsl(var(--background))]"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>En savoir plus</span>
      </motion.button>
    </motion.div>
  );
};

const CARD_HEIGHT = 400;

const CARDS = [
  {
    id: 1,
    Icon: Target,
    title: "Sélection rigoureuse",
    description:
      "Tous les projets des promoteurs les plus fiables réunis en un seul endroit, soigneusement sélectionnés pour leur qualité et leur sérieux.",
    ctaClasses: "bg-accent text-accent-foreground",
  },
  {
    id: 2,
    Icon: Search,
    title: "Recherche intelligente", 
    description:
      "Une IA qui comprend vos besoins et vous propose les biens les plus adaptés, sans perte de temps ni recherche complexe.",
    ctaClasses: "bg-secondary text-secondary-foreground",
  },
  {
    id: 3,
    Icon: Calculator,
    title: "Optimisation fiscale",
    description:
      "En un clic, obtenez des scénarios personnalisés pour maximiser votre rentabilité et protéger votre patrimoine, avec des réponses immédiates et concrètes.",
    ctaClasses: "bg-success text-success-foreground",
  },
];