import { ShieldCheck, Search, Calculator } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

const TabsFeaturesAlt6 = () => {
  const [selected, setSelected] = useState(0);

  return (
    <section className="py-36 bg-background relative">
      <div className="mx-auto max-w-7xl px-16">
        {/* Header */}
        <div className="text-center mb-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="w-20 h-px bg-primary mx-auto" />
              <h2 className="text-6xl font-extralight text-foreground tracking-tight leading-none">
                Notre
                <span className="block font-light text-primary mt-2">
                  savoir-faire
                </span>
              </h2>
              <div className="w-20 h-px bg-primary mx-auto" />
            </div>
            
            <p className="text-lg text-muted-foreground font-light max-w-xl mx-auto leading-relaxed tracking-wide">
              L'excellence au service de votre patrimoine immobilier
            </p>
          </motion.div>
        </div>

        {/* Navigation Timeline */}
        <div className="flex justify-center mb-24">
          <div className="relative">
            <Tabs selected={selected} setSelected={setSelected} />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {FEATURES.map((tab, index) => {
            return selected === index ? (
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -60 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
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
    <div className="flex items-center gap-16 relative">
      {/* Timeline line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-border/30 -translate-y-1/2" />
      
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
      
      {/* Progress line */}
      <motion.div
        className="absolute top-1/2 left-0 h-px bg-primary -translate-y-1/2 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: (selected + 1) / FEATURES.length }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ width: "100%" }}
      />
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
      className="relative z-10 flex flex-col items-center gap-4 group"
      whileHover={{ scale: selected ? 1 : 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Circle indicator */}
      <motion.div
        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
          selected
            ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25"
            : "bg-background border-border text-muted-foreground group-hover:border-primary/50"
        }`}
        whileHover={!selected ? { borderColor: "hsl(var(--primary))" } : {}}
      >
        <Icon className="w-7 h-7" />
      </motion.div>
      
      {/* Title */}
      <div className="text-center max-w-32">
        <h3 className={`text-sm font-medium leading-tight transition-colors ${
          selected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
        }`}>
          {title}
        </h3>
        
        {/* Step number */}
        <motion.div 
          className={`text-xs font-light mt-2 tracking-widest transition-colors ${
            selected ? "text-primary" : "text-muted-foreground/50"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          ÉTAPE {tabNum + 1}
        </motion.div>
      </div>
      
      {/* Selection glow */}
      {selected && (
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/10 -z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2, opacity: 1 }}
          transition={{ duration: 0.6 }}
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
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    <div className="grid lg:grid-cols-2 gap-24 items-center">
      {/* Content Section */}
      <div className="space-y-12">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="w-16 h-px bg-primary/50" />
              <div className="w-8 h-px bg-primary/30" />
            </div>
          </div>
          
          <h3 className="text-5xl font-extralight text-foreground leading-tight tracking-tight">
            {title}
          </h3>
          
          <p className="text-xl text-muted-foreground leading-relaxed font-light tracking-wide">
            {description}
          </p>
        </motion.div>
        
        {/* Statistics */}
        <motion.div 
          className="grid grid-cols-3 gap-8 py-8 border-t border-border/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {[
            { number: "99%", label: "Satisfaction client" },
            { number: "500+", label: "Projets analysés" },
            { number: "15+", label: "Années d'expertise" }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <div className="text-2xl font-light text-primary">{stat.number}</div>
              <div className="text-xs text-muted-foreground font-light tracking-wide uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <button className="group relative overflow-hidden px-12 py-4 bg-transparent border border-primary/30 text-primary font-light tracking-wide hover:text-primary-foreground transition-colors duration-500">
            <span className="relative z-10">EXPLORER</span>
            <motion.div
              className="absolute inset-0 bg-primary"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </button>
        </motion.div>
      </div>
      
      {/* Image Section */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
          {imageUrl ? (
            <motion.img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/10">
              <Icon className="w-20 h-20 text-primary/20" />
            </div>
          )}
          
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-8 -right-8 w-24 h-24 border border-primary/20 rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/5 rounded-full" />
      </motion.div>
    </div>
  </motion.div>
);

export default TabsFeaturesAlt6;

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