import { ShieldCheck, Search, Calculator } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

const TabsFeaturesAlt3 = () => {
  const [selected, setSelected] = useState(0);

  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Nos expertises
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Pourquoi choisir
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Enki Realty ?
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Vertical navigation with content side by side */}
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Sidebar navigation */}
          <div className="lg:col-span-2">
            <Tabs selected={selected} setSelected={setSelected} />
          </div>
          
          {/* Content area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {FEATURES.map((tab, index) => {
                return selected === index ? (
                  <motion.div
                    initial={{ opacity: 0, x: 50, rotateY: -10 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: -50, rotateY: 10 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    key={index}
                    style={{ perspective: "1000px" }}
                  >
                    <tab.Feature />
                  </motion.div>
                ) : undefined;
              })}
            </AnimatePresence>
          </div>
        </div>
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
    <div className="space-y-4 sticky top-8">
      {FEATURES.map((tab, index) => {
        return (
          <Tab
            key={index}
            setSelected={setSelected}
            selected={selected === index}
            Icon={tab.Icon}
            title={tab.title}
            tabNum={index}
            delay={index * 0.1}
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
  delay?: number;
}

const Tab = ({ selected, Icon, title, setSelected, tabNum, delay = 0 }: TabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="relative"
    >
      <button
        onClick={() => setSelected(tabNum)}
        className={`relative w-full text-left p-6 rounded-2xl transition-all duration-500 group ${
          selected
            ? "bg-primary text-primary-foreground shadow-premium"
            : "bg-card/50 text-card-foreground border border-border/50 hover:border-primary/30 hover:bg-card/80"
        }`}
      >
        {/* Connection line */}
        <div className={`absolute left-0 top-1/2 w-1 h-12 -translate-y-1/2 rounded-r-full transition-all duration-300 ${
          selected ? "bg-accent" : "bg-border group-hover:bg-primary/50"
        }`} />
        
        <div className="flex items-start gap-4 ml-4">
          <div className={`p-3 rounded-xl transition-all duration-300 ${
            selected 
              ? "bg-primary-foreground/20" 
              : "bg-primary/10 group-hover:bg-primary/15"
          }`}>
            <Icon className={`w-6 h-6 ${
              selected ? "text-primary-foreground" : "text-primary"
            }`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-base leading-tight mb-2 ${
              selected ? "text-primary-foreground" : "text-foreground"
            }`}>
              {title}
            </h3>
            
            {/* Number indicator */}
            <div className={`text-xs font-medium ${
              selected ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}>
              0{tabNum + 1}
            </div>
          </div>
        </div>
        
        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.02 }}
        />
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
    className="h-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <div className="relative h-full rounded-3xl overflow-hidden bg-card border border-border/50 shadow-elegant">
      {/* Hero image section */}
      <div className="relative h-80 overflow-hidden">
        {imageUrl ? (
          <motion.img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <Icon className="w-24 h-24 text-primary/60" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Icon badge */}
        <motion.div 
          className="absolute top-6 left-6 p-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border/50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
        >
          <Icon className="w-6 h-6 text-primary" />
        </motion.div>
      </div>
      
      {/* Content section */}
      <div className="p-8 space-y-6">
        <motion.h3 
          className="text-3xl font-bold text-foreground leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-muted-foreground text-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {description}
        </motion.p>
        
        {/* Features list */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Mock features for demonstration */}
          {["Expertise reconnue", "Process optimisé", "Résultats garantis"].map((feature, index) => (
            <motion.div 
              key={feature}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">{feature}</span>
            </motion.div>
          ))}
        </motion.div>
        
        {/* CTA */}
        <motion.div 
          className="pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <button className="w-full py-4 px-6 rounded-xl bg-primary/10 border border-primary/20 text-primary font-semibold hover:bg-primary/20 transition-all duration-300 group">
            <span className="flex items-center justify-center gap-2">
              Explorer cette expertise
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="group-hover:translate-x-1 transition-transform"
              >
                →
              </motion.span>
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

export default TabsFeaturesAlt3;

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