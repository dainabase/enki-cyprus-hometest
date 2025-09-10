import { ShieldCheck, Search, Calculator } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowSize } from "../hooks/useWindowSize";
import { IconType } from "react-icons";

const TabsFeaturesAlt5Accordion = () => {
  const [open, setOpen] = useState(items[0].id);

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

        <div className="flex flex-col lg:flex-row h-fit lg:h-[600px] w-full max-w-6xl mx-auto shadow-elegant overflow-hidden rounded-3xl bg-card border border-border/20">
          {items.map((item) => {
            return (
              <Panel
                key={item.id}
                open={open}
                setOpen={setOpen}
                id={item.id}
                Icon={item.Icon}
                title={item.title}
                fullTitle={item.fullTitle}
                description={item.description}
                imageUrl={item.imageUrl}
                features={item.features}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface PanelProps {
  open: number;
  setOpen: Dispatch<SetStateAction<number>>;
  id: number;
  Icon: IconType;
  title: string;
  fullTitle: string;
  description: string;
  imageUrl: string;
  features: string[];
}

const Panel = ({
  open,
  setOpen,
  id,
  Icon,
  title,
  fullTitle,
  description,
  imageUrl,
  features,
}: PanelProps) => {
  const { width } = useWindowSize();
  const isOpen = open === id;

  return (
    <>
      <button
        className="bg-card hover:bg-card/80 transition-colors p-6 border-r-[1px] border-b-[1px] border-border/20 flex flex-row-reverse lg:flex-col justify-end items-center gap-4 relative group"
        onClick={() => setOpen(id)}
      >
        <span
          style={{
            writingMode: "vertical-lr",
          }}
          className="hidden lg:block text-xl font-light rotate-180 text-muted-foreground"
        >
          {title}
        </span>
        <span className="block lg:hidden text-xl font-light text-muted-foreground">{title}</span>
        <div className="w-12 lg:w-full aspect-square bg-primary text-primary-foreground grid place-items-center rounded-xl">
          <Icon className="w-6 h-6" />
        </div>
        <span className="w-4 h-4 bg-card group-hover:bg-card/80 transition-colors border-r-[1px] border-b-[1px] lg:border-b-0 lg:border-t-[1px] border-border/20 rotate-45 absolute bottom-0 lg:bottom-[50%] right-[50%] lg:right-0 translate-y-[50%] translate-x-[50%] z-20" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`panel-${id}`}
            variants={width && width > 1024 ? panelVariants : panelVariantsSm}
            initial="closed"
            animate="open"
            exit="closed"
            className="w-full h-full overflow-hidden relative bg-card flex"
          >
            {/* Layout à la Alternative 5 : Image 1/3 à gauche, contenu 2/3 à droite */}
            <div className="grid lg:grid-cols-5 w-full h-full">
              {/* Image Section - 2/5 (similaire à 1/3) */}
              <div className="lg:col-span-2 relative">
                <motion.div 
                  className="w-full h-full relative overflow-hidden"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2 }}
                >
                  <img 
                    src={imageUrl} 
                    alt={fullTitle}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </motion.div>
              </div>
              
              {/* Content Section - 3/5 (similaire à 2/3) */}
              <div className="lg:col-span-3 p-8 lg:p-16 flex flex-col justify-center">
                <motion.div
                  variants={descriptionVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="space-y-8 max-w-xl"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                    </div>
                    
                    <h3 className="text-4xl font-light text-foreground leading-tight tracking-tight">
                      {fullTitle}
                    </h3>
                  </div>
                  
                  <p className="text-xl text-muted-foreground leading-relaxed font-light">
                    {description}
                  </p>
                  
                  {/* Features list */}
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <motion.div 
                        key={feature}
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-muted-foreground font-light">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div>
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
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TabsFeaturesAlt5Accordion;

const panelVariants = {
  open: {
    width: "100%",
    height: "100%",
  },
  closed: {
    width: "0%",
    height: "100%",
  },
};

const panelVariantsSm = {
  open: {
    width: "100%",
    height: "400px",
  },
  closed: {
    width: "100%",
    height: "0px",
  },
};

const descriptionVariants = {
  open: {
    opacity: 1,
    y: "0%",
    transition: {
      delay: 0.125,
    },
  },
  closed: { opacity: 0, y: "100%" },
};

const items = [
  {
    id: 1,
    title: "Analyse approfondie",
    fullTitle: "Sélection rigoureuse",
    Icon: ShieldCheck,
    description: "Tous les projets des promoteurs les plus fiables réunis en un seul endroit, soigneusement sélectionnés pour leur qualité et leur sérieux.",
    imageUrl: "/lovable-uploads/908acac7-30e3-4ec8-a596-fceda857b322.png",
    features: ["Processus certifié", "Expertise reconnue", "Accompagnement personnalisé"],
  },
  {
    id: 2,
    title: "Matching personnalisé",
    fullTitle: "Recherche intelligente",
    Icon: Search,
    description: "Une IA qui comprend vos besoins et vous propose les biens les plus adaptés, sans perte de temps ni recherche complexe.",
    imageUrl: "/lovable-uploads/9a75d696-69ab-4957-93c2-70b44f9fc985.png",
    features: ["Processus certifié", "Expertise reconnue", "Accompagnement personnalisé"],
  },
  {
    id: 3,
    title: "Avantages fiscaux",
    fullTitle: "Optimisation fiscale",
    Icon: Calculator,
    description: "En un clic, obtenez des scénarios personnalisés pour maximiser votre rentabilité et protéger votre patrimoine, avec des réponses immédiates et concrètes.",
    imageUrl: "/lovable-uploads/fd97a015-cee3-4fa9-850b-433d2e7ba761.png",
    features: ["Processus certifié", "Expertise reconnue", "Accompagnement personnalisé"],
  },
];