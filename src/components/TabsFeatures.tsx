import { ShieldCheck, Search, Calculator } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

const TabsFeatures = () => {
  const [selected, setSelected] = useState(0);

  return (
    <section className="py-8">
      <div className="mx-auto max-w-5xl">
        <Tabs selected={selected} setSelected={setSelected} />

        <AnimatePresence mode="wait">
          {FEATURES.map((tab, index) => {
            return selected === index ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                key={index}
              >
                <tab.Feature />
              </motion.div>
            ) : undefined;
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};

interface TabsProps {
  selected: number;
  setSelected: Dispatch<SetStateAction<number>>;
}

const Tabs = ({ selected, setSelected }: TabsProps) => {
  return (
    <div className="flex overflow-x-scroll border-b-4 border-border/20">
      {FEATURES.map((tab, index) => {
        return (
          <Tab
            key={index}
            setSelected={setSelected}
            selected={selected === index}
            Icon={tab.Icon}
            title={tab.title}
            tabNum={index}
          />
        );
      })}
    </div>
  );
};

interface TabProps {
  selected: boolean;
  Icon: any;
  title: string;
  setSelected: Function;
  tabNum: number;
}

const Tab = ({ selected, Icon, title, setSelected, tabNum }: TabProps) => {
  return (
    <div className="relative w-full">
      <button
        onClick={() => setSelected(tabNum)}
        className="relative z-0 flex w-full flex-row items-center justify-center gap-4 bg-card p-6 transition-colors hover:bg-muted/50 md:flex-col"
      >
        <span
          className={`rounded-lg bg-gradient-to-br from-primary to-primary/80 p-6 text-5xl text-white shadow-lg transition-all duration-300 ${
            selected
              ? "scale-100 opacity-100 shadow-lg"
              : "scale-90 opacity-50 shadow"
          }`}
        >
          <Icon />
        </span>
        <span
          className={`min-w-[150px] max-w-[200px] text-start text-sm text-muted-foreground transition-opacity md:text-center ${
            selected ? "opacity-100" : "opacity-50"
          }`}
        >
          {title}
        </span>
      </button>
      {selected && (
        <motion.span
          layoutId="tabs-features-underline"
          className="absolute bottom-0 left-0 right-0 z-10 h-1 bg-primary"
        />
      )}
    </div>
  );
};

interface FeatureContentProps {
  Icon: any;
  title: string;
  description: string;
  imageUrl?: string;
}

const FeatureContent = ({ Icon, title, description, imageUrl }: FeatureContentProps) => (
  <div className="w-full px-0 py-8 md:px-8">
    <div className="relative w-full rounded-2xl bg-card border border-border/50 p-8 shadow-xl">
      <div className="flex items-start gap-8 flex-col md:flex-row">
        {/* Image section - 1/3 width */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted/20 border border-border/30">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover object-center"
                loading="lazy"
                decoding="async"
                style={{ transform: 'scale(1.08)', transformOrigin: 'center', imageRendering: 'auto' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                <Icon className="w-24 h-24 text-primary/40" />
              </div>
            )}
          </div>
        </div>
        
        {/* Content section - 2/3 width */}
        <div className="w-full md:w-2/3">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-primary flex-shrink-0">
              <Icon className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-semibold text-primary">
              {title}
            </h3>
          </div>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {description}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default TabsFeatures;

const FEATURES = [
  {
    title: "Analyse approfondie de chaque projet",
    Icon: ShieldCheck,
    Feature: () => (
      <FeatureContent 
        Icon={ShieldCheck}
        title="Sélection rigoureuse"
        description="Tous les projets des promoteurs les plus fiables réunis en un seul endroit, soigneusement sélectionnés pour leur qualité et leur sérieux."
        imageUrl="/lovable-uploads/908acac7-30e3-4ec8-a596-fceda857b322.png"
      />
    ),
  },
  {
    title: "Matching personnalisé selon vos critères",
    Icon: Search,
    Feature: () => (
      <FeatureContent 
        Icon={Search}
        title="Recherche intelligente"
        description="Une IA qui comprend vos besoins et vous propose les biens les plus adaptés, sans perte de temps ni recherche complexe."
        imageUrl="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1000&auto=format&fit=crop" // Placeholder - sera remplacé par l'image fournie
      />
    ),
  },
  {
    title: "Maximisez vos avantages fiscaux",
    Icon: Calculator,
    Feature: () => (
      <FeatureContent 
        Icon={Calculator}
        title="Optimisation fiscale"
        description="En un clic, obtenez des scénarios personnalisés pour maximiser votre rentabilité et protéger votre patrimoine, avec des réponses immédiates et concrètes."
        imageUrl="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop" // Placeholder - sera remplacé par l'image fournie
      />
    ),
  },
];