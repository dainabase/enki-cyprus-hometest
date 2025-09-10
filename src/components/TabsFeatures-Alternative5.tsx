import { ShieldCheck, Search, Calculator } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

const TabsFeaturesAlt5 = () => {
  const [selected, setSelected] = useState(0);

  return (
    <section className="py-40 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-primary/20 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-accent/20 rounded-full" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-12">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-primary/20 bg-primary/5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary tracking-wide">EXCELLENCE</span>
            </div>
            
            <h2 className="text-5xl font-light text-foreground tracking-tight leading-tight">
              Pourquoi nous
              <span className="block font-medium mt-2">
                faire confiance ?
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              Trois piliers d'excellence pour votre succès immobilier
            </p>
          </motion.div>
        </div>

        <Tabs selected={selected} setSelected={setSelected} />

        <AnimatePresence mode="wait">
          {FEATURES.map((tab, index) => {
            return selected === index ? (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.98 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
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
    <div className="flex justify-center mb-20">
      <div className="grid grid-cols-3 gap-8 max-w-4xl w-full">
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
      className={`relative p-8 text-center transition-all duration-500 ${
        selected
          ? ""
          : "hover:scale-105"
      }`}
      whileHover={{ y: selected ? 0 : -8 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
        selected 
          ? "bg-card border-2 border-primary/20 shadow-elegant" 
          : "bg-card/50 border border-border/20 hover:border-primary/30"
      }`} />
      
      {/* Content */}
      <div className="relative space-y-6">
        <motion.div
          className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            selected 
              ? "bg-primary text-primary-foreground shadow-lg" 
              : "bg-primary/10 text-primary"
          }`}
          whileHover={{ rotate: selected ? 0 : 5 }}
        >
          <Icon className="w-8 h-8" />
        </motion.div>
        
        <div className="space-y-3">
          <h3 className={`font-medium text-lg leading-tight transition-colors ${
            selected ? "text-foreground" : "text-muted-foreground"
          }`}>
            {title}
          </h3>
          
          {/* Number indicator */}
          <div className={`text-xs font-light tracking-wider transition-colors ${
            selected ? "text-primary" : "text-muted-foreground/50"
          }`}>
            0{tabNum + 1}
          </div>
        </div>
      </div>
      
      {/* Selection indicator */}
      {selected && (
        <motion.div
          layoutId="selected-indicator-5"
          className="absolute -bottom-1 left-1/2 w-12 h-1 bg-primary rounded-full transform -translate-x-1/2"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
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
    className="w-full max-w-6xl mx-auto"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    <div className="relative rounded-3xl bg-card border border-border/20 overflow-hidden shadow-elegant">
      <div className="grid lg:grid-cols-5 items-stretch">
        {/* Image Section */}
        <div className="lg:col-span-2 relative">
          <div className="aspect-[4/5] lg:aspect-auto lg:h-full relative overflow-hidden">
            {imageUrl ? (
              <motion.img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/20">
                <Icon className="w-20 h-20 text-primary/30" />
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        </div>
        
        {/* Content Section */}
        <div className="lg:col-span-3 p-16 flex flex-col justify-center">
          <div className="space-y-8 max-w-xl">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>
              
              <h3 className="text-4xl font-light text-foreground leading-tight tracking-tight">
                {title}
              </h3>
            </motion.div>
            
            <motion.p 
              className="text-xl text-muted-foreground leading-relaxed font-light"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {description}
            </motion.p>
            
            {/* Features list */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {["Processus certifié", "Expertise reconnue", "Accompagnement personnalisé"].map((feature, index) => (
                <motion.div 
                  key={feature}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground font-light">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <button className="inline-flex items-center gap-3 px-8 py-4 border border-primary/20 rounded-full text-primary font-medium hover:bg-primary/5 transition-all duration-300 group">
                <span>Explorer cette expertise</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="group-hover:translate-x-1 transition-transform"
                >
                  →
                </motion.span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default TabsFeaturesAlt5;

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