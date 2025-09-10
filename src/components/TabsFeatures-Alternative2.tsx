import { ShieldCheck, Search, Calculator } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

const TabsFeaturesAlt2 = () => {
  const [selected, setSelected] = useState(0);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with geometric patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6"
          >
            Pourquoi choisir Enki Realty ?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Trois expertises au service de votre réussite immobilière
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {FEATURES.map((tab, index) => (
            <Tab
              key={index}
              setSelected={setSelected}
              selected={selected === index}
              Icon={tab.Icon}
              title={tab.title}
              tabNum={index}
              delay={index * 0.1}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {FEATURES.map((tab, index) => {
            return selected === index ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
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

interface TabProps {
  selected: boolean;
  Icon: any;
  title: string;
  setSelected: Function;
  tabNum: number;
  delay?: number;
}

const Tab = ({ selected, Icon, title, setSelected, tabNum, delay = 0 }: TabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="relative group"
    >
      <button
        onClick={() => setSelected(tabNum)}
        className={`relative w-full h-full p-8 rounded-3xl transition-all duration-500 ${
          selected
            ? "bg-primary text-primary-foreground shadow-premium scale-105"
            : "bg-card/80 backdrop-blur-sm text-card-foreground border border-border/50 hover:border-primary/30 hover:shadow-elegant group-hover:bg-card"
        }`}
      >
        {/* Gradient overlay for selected state */}
        {selected && (
          <motion.div
            layoutId="selected-gradient"
            className="absolute inset-0 rounded-3xl bg-gradient-premium opacity-90"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        
        <div className="relative flex flex-col items-center text-center space-y-6">
          {/* Icon with animated background */}
          <div className="relative">
            <motion.div
              className={`p-6 rounded-2xl transition-all duration-300 ${
                selected 
                  ? "bg-primary-foreground/20" 
                  : "bg-primary/10 group-hover:bg-primary/15"
              }`}
              whileHover={{ rotate: 5 }}
            >
              <Icon className={`w-10 h-10 ${
                selected ? "text-primary-foreground" : "text-primary"
              }`} />
            </motion.div>
            
            {/* Floating indicator */}
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full"
              />
            )}
          </div>
          
          <h3 className={`font-bold text-lg leading-tight ${
            selected ? "text-primary-foreground" : "text-foreground"
          }`}>
            {title}
          </h3>
          
          {/* Progress indicator */}
          <div className="w-full h-1 bg-background/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: selected ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
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
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <div className="relative rounded-3xl bg-card/60 backdrop-blur-xl border border-border/30 shadow-elegant overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      </div>
      
      <div className="relative p-12 lg:p-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image section with enhanced effects */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[5/4] rounded-2xl overflow-hidden shadow-lg">
              {imageUrl ? (
                <motion.img 
                  src={imageUrl} 
                  alt={title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <Icon className="w-24 h-24 text-primary/60" />
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 top-4 left-4 w-full h-full rounded-2xl bg-primary/10" />
            <motion.div 
              className="absolute top-0 right-0 w-20 h-20 bg-accent/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
          
          {/* Content section */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="flex items-center gap-4">
              <motion.div 
                className="p-4 rounded-xl bg-primary/10 border border-primary/20"
                whileHover={{ rotate: 10 }}
              >
                <Icon className="w-8 h-8 text-primary" />
              </motion.div>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 via-accent/30 to-transparent" />
            </div>
            
            <motion.h3 
              className="text-4xl font-bold text-foreground leading-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h3>
            
            <motion.p 
              className="text-muted-foreground text-xl leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {description}
            </motion.p>
            
            <motion.div 
              className="pt-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold hover:bg-primary/20 transition-colors cursor-pointer group">
                <span>Découvrir cette expertise</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="group-hover:translate-x-1 transition-transform"
                >
                  →
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default TabsFeaturesAlt2;

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