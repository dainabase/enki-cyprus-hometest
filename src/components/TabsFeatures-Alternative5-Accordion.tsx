import { ShieldCheck, Search, Calculator } from "lucide-react";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { IconType } from "react-icons";

const TabsFeaturesAlt5Accordion = () => {
  const [open, setOpen] = useState(items[0].id);
  
  // Préchargement des images
  useEffect(() => {
    items.forEach((it) => {
      const img = new Image();
      img.src = it.imageUrl;
      // @ts-ignore - not all browsers support decode
      img.decode?.();
    });
  }, []);

  return (
    <section className="py-6 md:py-8 bg-transparent relative">
      <div className="relative mx-auto max-w-7xl px-12">
        <div className="text-center mb-24">
          <div className="space-y-6">
            <h2 className="text-5xl font-light text-foreground tracking-tight leading-tight">
              Pourquoi nous faire confiance ?
            </h2>
            
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              Trois piliers d'excellence pour votre succès immobilier
            </p>
          </div>
        </div>

        {/* Design récupéré de l'Alternative 6 - rond + icône + texte */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-16 max-w-6xl mx-auto">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setOpen(item.id)}
                className="relative z-10 flex flex-col items-center gap-4 group transition-opacity duration-200"
              >
                {/* Circle indicator - exactement comme Alternative 6 */}
                <div
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    open === item.id
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-background border-border text-muted-foreground group-hover:border-primary/50"
                  }`}
                >
                  <item.Icon className="w-7 h-7" />
                </div>
                
                {/* Title - exactement comme Alternative 6 */}
                <div className="text-center max-w-32">
                  <h3 className={`text-sm font-medium leading-tight transition-colors duration-200 ${
                    open === item.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  }`}>
                    {item.title}
                  </h3>
                  
                  <div className={`text-xs font-light mt-2 tracking-widest transition-colors duration-200 ${
                    open === item.id ? "text-primary" : "text-muted-foreground/50"
                  }`}>
                    ÉTAPE {index + 1}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Accordéon premium avec boutons latéraux (animation d'origine) */}
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

// Variants pour l'animation d'accordéon (version plus fluide)
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
  open: { opacity: 1 },
  closed: { opacity: 0 }
};

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
  const isOpen = open === id;

  return (
    <>
      {/* Bouton latéral vertical avec séparations très marquées */}
      <button
        className="bg-card hover:bg-card/80 hover:bg-muted/10 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] p-6 border-r-4 border-b-4 lg:border-b-0 border-border/60 flex flex-row-reverse lg:flex-col justify-end items-center gap-4 relative group shadow-lg"
        onClick={() => setOpen(id)}
        style={{
          borderRightColor: isOpen ? 'hsl(var(--border) / 0.8)' : 'hsl(var(--border) / 0.6)',
          borderBottomColor: isOpen ? 'hsl(var(--border) / 0.8)' : 'hsl(var(--border) / 0.6)',
          backgroundColor: isOpen ? 'hsl(var(--card))' : 'hsl(var(--card))',
          boxShadow: isOpen ? '0 4px 12px hsl(var(--border) / 0.25)' : '0 2px 4px hsl(var(--border) / 0.2)',
          willChange: 'auto'
        }}
      >
        <span
          style={{ writingMode: "vertical-lr" }}
          className="hidden lg:block text-xl font-light rotate-180 text-muted-foreground group-hover:text-primary transition-colors duration-150"
        >
          {title}
        </span>
        <span className="block lg:hidden text-xl font-light text-muted-foreground group-hover:text-primary transition-colors duration-150">{title}</span>
        <div className="w-12 lg:w-full aspect-square bg-primary text-primary-foreground grid place-items-center rounded-xl shadow-lg">
          <Icon className="w-6 h-6" />
        </div>
        <span 
          className="w-5 h-5 bg-card group-hover:bg-card/80 transition-colors duration-150 border-r-4 border-b-4 lg:border-b-0 lg:border-t-4 border-border/60 rotate-45 absolute bottom-0 lg:bottom-[50%] right-[50%] lg:right-0 translate-y-[50%] translate-x-[50%] z-20 shadow-lg" 
          style={{
            borderColor: isOpen ? 'hsl(var(--border) / 0.8)' : 'hsl(var(--border) / 0.6)',
          }}
        />
      </button>

      {/* Contenu de l'accordéon avec transitions CSS fluides */}
      <div
        className={`w-full transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          isOpen ? 'h-[600px] opacity-100' : 'h-0 opacity-0'
        } overflow-hidden`}
      >
        <div
          className="w-full h-full relative bg-card flex"
          style={{ 
            transform: isOpen ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
            transitionDelay: isOpen ? '0.1s' : '0s'
          }}
        >
          {/* Layout à la Alternative 5 : Image 1/3 à gauche, contenu 2/3 à droite */}
          <div className="grid lg:grid-cols-5 w-full h-full">
            {/* Image Section - 2/5 (similaire à 1/3) */}
            <div className="lg:col-span-2 relative">
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src={imageUrl}
                  alt={fullTitle}
                  className="w-full h-full object-cover grayscale"
                  loading="lazy"
                  style={{ 
                    opacity: isOpen ? 1 : 0.3,
                    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
                    transition: 'all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
                    transitionDelay: isOpen ? '0.3s' : '0s'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>

            {/* Content Section - 3/5 (similaire à 2/3) */}
            <div className="lg:col-span-3 p-8 lg:p-16 flex flex-col justify-center">
              <div 
                className="space-y-8 max-w-xl"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateX(0)' : 'translateX(-30px)',
                  transition: 'all 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
                  transitionDelay: isOpen ? '0.4s' : '0s'
                }}
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
                <div 
                  className="space-y-4"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                    transitionDelay: isOpen ? '0.6s' : '0s'
                  }}
                >
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-4"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground font-light">{feature}</span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(15px)',
                    transition: 'all 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
                    transitionDelay: isOpen ? '0.8s' : '0s'
                  }}
                >
                  <button className="inline-flex items-center gap-3 px-8 py-4 border border-primary/20 rounded-full text-primary font-medium hover:bg-primary/5 transition-colors duration-300 group">
                    <span>Explorer cette expertise</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default TabsFeaturesAlt5Accordion;

const items = [
  {
    id: 1,
    title: "Promoteurs Élite",
    fullTitle: "Sélection rigoureuse",
    Icon: ShieldCheck,
    description: "Nous sélectionnons exclusivement les meilleurs promoteurs, développeurs et constructeurs de Chypre pour vous offrir un accès privilégié aux projets immobiliers d'exception. NK Realty centralise l'excellence immobilière chypriote en un seul endroit.",
    imageUrl: "/lovable-uploads/908acac7-30e3-4ec8-a596-fceda857b322.png",
    features: ["Promoteurs certifiés et vérifiés", "Projets premium exclusifs", "Garantie qualité NK Realty"],
  },
  {
    id: 2,
    title: "Matching IA",
    fullTitle: "Recherche intelligente",
    Icon: Search,
    description: "Notre intelligence artificielle analyse vos critères de recherche pour vous proposer des biens qui matchent à 100% avec vos besoins. Recherche ultra-personnalisée, sans perte de temps, avec des recommandations précises et adaptées à votre profil d'investisseur.",
    imageUrl: "/lovable-uploads/9a75d696-69ab-4957-93c2-70b44f9fc985.png",
    features: ["IA de recommandation avancée", "Matching à 100% avec vos critères", "Recommandations personnalisées"],
  },
  {
    id: 3,
    title: "Conseil Fiscal IA",
    fullTitle: "Optimisation fiscale",
    Icon: Calculator,
    description: "Notre IA experte en fiscalité européenne et suisse génère des scénarios d'optimisation fiscale personnalisés. Montages société, acquisition en nom propre, processus d'acquisition à Chypre : obtenez le meilleur conseil fiscal pour maximiser votre investissement.",
    imageUrl: "/lovable-uploads/fd97a015-cee3-4fa9-850b-433d2e7ba761.png",
    features: ["IA fiscaliste européenne", "Scénarios de montage personnalisés", "Optimisation patrimoine garantie"],
  },
];