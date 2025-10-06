import { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

// ✅ CONSTANTE CENTRALISÉE - Durée des animations du menu
// Synchronise : animations Framer Motion + protection anti-spam
// Valeur : 300ms = durée des transitions UNDERLAY + menu overlay
const ANIMATION_DURATION = 300;

const ModernMenu = () => {
  const [active, setActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isAuthenticated, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const LINKS = [
    { title: "Accueil", href: "/" },
    { title: "Projets", href: "/projects" },
    { title: "Recherche IA", href: "/search" },
    { title: "Conseil Fiscal IA", href: "/lexaia" },
    { title: "Blog", href: "/blog" },
    { title: "À propos", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  // Fermer le menu automatiquement lors du changement de route
  useEffect(() => {
    setActive(false);
  }, [location.pathname]);

  // 🔒 SCROLL LOCK - Garde la scrollbar visible pour éviter le décalage
  useEffect(() => {
    if (active) {
      const scrollY = window.scrollY;
      
      // ✅ SOLUTION : overflow-y: scroll au lieu de hidden
      // La scrollbar reste visible mais le scroll est bloqué
      // = PAS de décalage du viewport, PAS de décalage des éléments fixed
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflowY = 'scroll';  // Force la scrollbar visible
      
      return () => {
        // Restaurer la position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflowY = '';
        
        // Restaurer le scroll
        window.scrollTo(0, scrollY);
      };
    }
  }, [active]);

  // Toggle menu avec protection anti-spam
  const toggleMenu = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setActive(!active);

    // Débloquer après l'animation (synchronisé avec ANIMATION_DURATION)
    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur de déconnexion",
          description: error.message
        });
      } else {
        toast({
          title: "Déconnexion réussie",
          description: "À bientôt sur ENKI-REALTY!"
        });
        navigate('/');
        setActive(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // ✅ VARIANTS ANIMATIONS SYNCHRONISÉES - 300ms partout
  const UNDERLAY_VARIANTS: Variants = {
    open: {
      width: "calc(100vw - 32px)",
      height: "calc(100vh - 32px)",
      transition: {
        duration: ANIMATION_DURATION / 1000,
        ease: [0.32, 0.72, 0, 1]
      },
    },
    closed: {
      width: "48px",
      height: "48px",
      transition: {
        duration: ANIMATION_DURATION / 1000,
        ease: [0.32, 0.72, 0, 1]
      },
    },
  };

  return (
    <>
      {/* ✅ UNDERLAY - Synchronisé avec le menu via AnimatePresence */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key="underlay"
            initial="closed"
            animate="open"
            exit="closed"
            variants={UNDERLAY_VARIANTS}
            style={{
              top: 16,
              right: 16,
              transformOrigin: "top right"
            }}
            className="fixed z-30 bg-neutral-50 shadow-sm"
          />
        )}
      </AnimatePresence>
      
      {/* HAMBURGER BUTTON */}
      <motion.button
        initial={false}
        animate={active ? "open" : "closed"}
        onClick={toggleMenu}
        disabled={isAnimating}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="group fixed right-4 top-4 z-50 h-12 w-12 bg-white hover:bg-neutral-50 transition-all shadow-sm border border-black/5"
      >
        <motion.span
          animate={active ? { rotate: 45, top: "50%" } : { rotate: 0, top: "35%" }}
          transition={{ duration: 0.3 }}
          className="absolute block h-[1px] w-6 bg-black"
          style={{ y: "-50%", left: "50%", x: "-50%" }}
        />
        <motion.span
          animate={active ? { rotate: -45, opacity: 1 } : { rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute block h-[1px] w-6 bg-black"
          style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
        />
        <motion.span
          animate={active ? { rotate: 45, bottom: "50%", opacity: 0 } : { rotate: 0, bottom: "35%", opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute block h-[1px] w-3 bg-black"
          style={{ x: "-50%", y: "50%", left: "calc(50% + 10px)" }}
        />
      </motion.button>

      {/* ✅ MENU OVERLAY - Synchronisé 300ms */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.nav
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: ANIMATION_DURATION / 1000,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="fixed inset-0 z-40 bg-neutral-50"
          >
            {/* Logo ENKI-REALTY */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                transition: { delay: 0.2, duration: 0.4 } 
              }}
              exit={{ opacity: 0, y: -30, transition: { duration: 0.2 } }}
              className="absolute left-8 md:left-16 top-8 md:top-12"
            >
              <Link
                to="/"
                className="text-4xl md:text-5xl font-light text-black tracking-tight hover:text-black/70 transition-colors"
              >
                ΣNKI<span className="mx-1">-</span>REALTY
              </Link>
            </motion.div>

            {/* Links Container */}
            <div className="flex h-full items-center justify-start px-8 md:px-16">
              <div className="space-y-4 md:space-y-6 w-full max-w-md">
                {LINKS.map((link, idx) => (
                  <motion.div
                    key={link.title}
                    initial={{ opacity: 0, x: -60 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: 0.3 + idx * 0.05,
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }}
                    exit={{ 
                      opacity: 0, 
                      x: -60,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Link
                      to={link.href}
                      className="block group"
                    >
                      <span className="text-2xl md:text-3xl font-light text-black/60 hover:text-black transition-all duration-300 whitespace-nowrap">
                        {link.title}
                      </span>
                    </Link>
                  </motion.div>
                ))}

                {/* Auth Section */}
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: {
                            delay: 0.3 + LINKS.length * 0.05,
                            duration: 0.4,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          },
                        }}
                        exit={{ 
                          opacity: 0, 
                          x: -60,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <Link
                          to="/admin"
                          className="block group"
                        >
                          <span className="text-xl md:text-2xl font-light text-black/60 hover:text-black transition-all duration-300">
                            Admin
                          </span>
                        </Link>
                      </motion.div>
                    )}
                    <motion.button
                      onClick={handleLogout}
                      initial={{ opacity: 0, x: -60 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: {
                          delay: 0.3 + (LINKS.length + 1) * 0.05,
                          duration: 0.4,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        },
                      }}
                      exit={{ 
                        opacity: 0, 
                        x: -60,
                        transition: { duration: 0.2 }
                      }}
                      className="block group"
                    >
                      <span className="text-xl md:text-2xl font-light text-black/60 hover:text-black transition-all duration-300">
                        Déconnexion
                      </span>
                    </motion.button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: 0.3 + LINKS.length * 0.05,
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }}
                    exit={{ 
                      opacity: 0, 
                      x: -60,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Link
                      to="/login"
                      className="block group"
                    >
                      <span className="text-xl md:text-2xl font-light text-black/60 hover:text-black transition-all duration-300">
                        Connexion
                      </span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                transition: { delay: 0.5, duration: 0.4 } 
              }}
              exit={{ opacity: 0, y: 30, transition: { duration: 0.2 } }}
              className="absolute bottom-8 right-8 md:bottom-12 md:right-16"
            >
              <Link to="/contact">
                <button className="group flex items-center gap-3 bg-black text-white px-6 md:px-8 py-3 md:py-4 hover:bg-black/80 transition-all border border-black/10">
                  <span className="text-sm font-light tracking-wide">
                    Commencer votre projet
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1, 
                transition: { delay: 0.6, duration: 0.4 } 
              }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="absolute bottom-8 left-8 md:bottom-12 md:left-16"
            >
              <p className="text-sm font-light text-black/40">
                +357 99 123 456<br />
                info@enki-realty.com
              </p>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModernMenu;