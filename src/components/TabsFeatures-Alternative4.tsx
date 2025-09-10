import { ShieldCheck, Search, Calculator } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

const TabsFeaturesAlt4 = () => {
  const [selected, setSelected] = useState(0);

  return (
    <section className="py-32 bg-background">
      <div className="mx-auto max-w-6xl px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-light text-foreground mb-6 tracking-tight"
          >
            L'Excellence
            <span className="font-medium text-primary block mt-2">
              Enki Realty
            </span>
          </motion.h2>
          <div className="w-12 h-px bg-primary mx-auto"></div>
        </div>

        <Tabs selected={selected} setSelected={setSelected} />

        <AnimatePresence mode="wait">
          {FEATURES.map((tab, index) => {
            return selected === index ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
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
    <div className="flex justify-center mb-16">
      <div className="inline-flex bg-muted/30 rounded-full p-2 border border-border/20">
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
    <motion.button
      onClick={() => setSelected(tabNum)}
      className={`relative px-8 py-4 rounded-full text-sm font-medium transition-all duration-300 ${
        selected
          ? "text-primary-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {selected && (
        <motion.div
          layoutId="pill-tab-4"
          className="absolute inset-0 bg-primary rounded-full"
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span className="hidden md:inline whitespace-nowrap text-xs">
          {title.split(' ')[0]}
        </span>
      </span>
    </motion.button>
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
    className="w-full max-w-5xl mx-auto"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* Content Section */}
      <div className="space-y-8">
        <div className="space-y-6">
          <motion.div
            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
          >
            <Icon className="w-6 h-6 text-primary" />
          </motion.div>
          
          <motion.h3 
            className="text-3xl font-light text-foreground leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {title}
          </motion.h3>
          
          <motion.div 
            className="w-16 h-px bg-primary/50"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
          
          <motion.p 
            className="text-lg text-muted-foreground leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {description}
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <button className="text-primary font-medium text-sm tracking-wide hover:text-primary/80 transition-colors group">
            DÉCOUVRIR
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </motion.div>
      </div>
      
      {/* Image Section */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/10">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/20">
              <Icon className="w-16 h-16 text-primary/30" />
            </div>
          )}
        </div>
        
        {/* Subtle shadow */}
        <div className="absolute inset-0 rounded-lg shadow-lg shadow-black/5 -z-10" />
      </motion.div>
    </div>
  </motion.div>
);

export default TabsFeaturesAlt4;

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