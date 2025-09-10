import { ShieldCheck, Search, Calculator } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

const TabsFeaturesAlt1 = () => {
  const [selected, setSelected] = useState(0);

  return (
    <section className="py-16 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pourquoi choisir Enki Realty ?
          </h2>
          <p className="text-muted-foreground text-lg">
            Découvrez nos trois piliers d'excellence
          </p>
        </div>
        
        <Tabs selected={selected} setSelected={setSelected} />

        <AnimatePresence mode="wait">
          {FEATURES.map((tab, index) => {
            return selected === index ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
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
    <div className="flex flex-col lg:flex-row gap-6 mb-12">
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
    <motion.div 
      className="flex-1"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <button
        onClick={() => setSelected(tabNum)}
        className={`relative w-full p-8 rounded-2xl border-2 transition-all duration-300 ${
          selected
            ? "bg-primary text-primary-foreground border-primary shadow-premium"
            : "bg-card text-card-foreground border-border hover:border-primary/50 hover:shadow-lg"
        }`}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`p-4 rounded-full ${
            selected 
              ? "bg-primary-foreground/20" 
              : "bg-primary/10"
          }`}>
            <Icon className={`w-8 h-8 ${
              selected ? "text-primary-foreground" : "text-primary"
            }`} />
          </div>
          <h3 className={`font-semibold text-sm leading-tight ${
            selected ? "text-primary-foreground" : "text-foreground"
          }`}>
            {title}
          </h3>
        </div>
        
        {selected && (
          <motion.div
            layoutId="selected-indicator"
            className="absolute inset-0 rounded-2xl bg-gradient-premium opacity-20"
          />
        )}
      </button>
    </motion.div>
  );
};

interface FeatureContentProps {
  Icon: any;
  title: string;
  description: string;
  imageUrl?: string;
}

const FeatureContent = ({ Icon, title, description, imageUrl }: FeatureContentProps) => (
  <motion.div 
    className="w-full"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <div className="relative overflow-hidden rounded-3xl bg-gradient-card border border-border/50 shadow-elegant">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative p-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
            </div>
            
            <h3 className="text-3xl font-bold text-foreground leading-tight">
              {title}
            </h3>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              {description}
            </p>
            
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 text-primary font-medium">
                <span>En savoir plus</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Image section */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted/10 border border-border/30 shadow-lg">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <Icon className="w-24 h-24 text-primary/60" />
                </div>
              )}
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-accent/30 animate-pulse delay-700" />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default TabsFeaturesAlt1;

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
        imageUrl="/lovable-uploads/9a75d696-69ab-4957-93c2-70b44f9fc985.png"
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
        imageUrl="/lovable-uploads/fd97a015-cee3-4fa9-850b-433d2e7ba761.png"
      />
    ),
  },
];