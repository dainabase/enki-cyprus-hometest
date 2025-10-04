import { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ArrowRight, LogIn, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ModernMenu = () => {
  const [active, setActive] = useState(false);
  const { isAuthenticated, isAdmin, signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  useScrollLock(active);

  const LINKS = [
    { title: "Accueil", href: "/" },
    { title: "Projets", href: "/projects" },
    { title: "Recherche IA", href: "/search" },
    { title: "Conseil Fiscal IA", href: "/lexaia" },
    { title: "Blog", href: "/blog" },
    { title: "À propos", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

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

  // VARIANTS pour les animations
  const UNDERLAY_VARIANTS: Variants = {
    open: {
      width: "calc(100vw - 32px)",
      height: "calc(100vh - 32px)",
      transition: {
        type: "spring" as const,
        mass: 3,
        stiffness: 400,
        damping: 50
      },
    },
    closed: {
      width: "48px",
      height: "48px",
      transition: {
        delay: 0.2,
        type: "spring" as const,
        mass: 3,
        stiffness: 400,
        damping: 50
      },
    },
  };

  return (
    <>
      {/* HAMBURGER BUTTON */}
      <motion.div
        initial={false}
        animate={active ? "open" : "closed"}
        variants={UNDERLAY_VARIANTS}
        style={{ top: 16, right: 16 }}
        className="fixed z-30 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg"
      />
      
      <motion.button
        initial={false}
        animate={active ? "open" : "closed"}
        onClick={() => setActive(!active)}
        className={`group fixed right-4 top-4 z-50 h-12 w-12 bg-primary hover:bg-primary-hover transition-all rounded-lg ${
          active ? "rounded-bl-lg rounded-tr-lg" : "rounded-lg"
        }`}
      >
        <motion.span
          animate={active ? { rotate: 45, top: "50%" } : { rotate: 0, top: "35%" }}
          transition={{ duration: 0.3 }}
          className="absolute block h-[1px] w-6 bg-white"
          style={{ y: "-50%", left: "50%", x: "-50%" }}
        />
        <motion.span
          animate={active ? { rotate: -45, opacity: 1 } : { rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute block h-[1px] w-6 bg-white"
          style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
        />
        <motion.span
          animate={active ? { rotate: 45, bottom: "50%", opacity: 0 } : { rotate: 0, bottom: "35%", opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute block h-[1px] w-3 bg-white"
          style={{ x: "-50%", y: "50%", left: "calc(50% + 10px)" }}
        />
      </motion.button>

      {/* MENU OVERLAY */}
      <AnimatePresence>
        {active && (
          <motion.nav 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gradient-to-br from-primary/95 via-primary/90 to-background/95 backdrop-blur-2xl"
          >
            {/* Logo ENKI-REALTY */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                transition: { delay: 0.3, duration: 0.5 } 
              }}
              exit={{ opacity: 0, y: -30 }}
              className="absolute left-8 md:left-16 top-8 md:top-12"
            >
              <Link 
                to="/" 
                onClick={() => setActive(false)}
                className="swaarg-large-title text-white hover:text-white/80 transition-colors"
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
                        delay: 0.4 + idx * 0.08,
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }}
                    exit={{ 
                      opacity: 0, 
                      x: -60,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setActive(false)}
                      className="block group"
                    >
                      <span className="swaarg-large-title text-white/70 hover:text-white transition-all duration-300 whitespace-nowrap">
                        {link.title}
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">.</span>
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
                            delay: 0.4 + LINKS.length * 0.08,
                            duration: 0.6,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          },
                        }}
                        exit={{ 
                          opacity: 0, 
                          x: -60,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <Link
                          to="/admin"
                          onClick={() => setActive(false)}
                          className="block group"
                        >
                          <span className="swaarg-card-title text-white/70 hover:text-white transition-all duration-300">
                            Admin
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">.</span>
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
                          delay: 0.4 + (LINKS.length + 1) * 0.08,
                          duration: 0.6,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        },
                      }}
                      exit={{ 
                        opacity: 0, 
                        x: -60,
                        transition: { duration: 0.3 }
                      }}
                      className="block group"
                    >
                      <span className="swaarg-card-title text-white/70 hover:text-white transition-all duration-300">
                        Déconnexion
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">.</span>
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
                        delay: 0.4 + LINKS.length * 0.08,
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }}
                    exit={{ 
                      opacity: 0, 
                      x: -60,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Link
                      to="/login"
                      onClick={() => setActive(false)}
                      className="block group"
                    >
                      <span className="swaarg-card-title text-white/70 hover:text-white transition-all duration-300">
                        Connexion
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">.</span>
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
                transition: { delay: 0.8, duration: 0.5 } 
              }}
              exit={{ opacity: 0, y: 30 }}
              className="absolute bottom-8 right-8 md:bottom-12 md:right-16"
            >
              <Link 
                to="/contact"
                onClick={() => setActive(false)}
              >
                <button className="group flex items-center gap-3 bg-white text-primary px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-white/90 transition-all">
                  <span className="swaarg-button">
                    Commencer votre projet
                  </span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </motion.div>

            {/* Contact Info (optionnel) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1, 
                transition: { delay: 1, duration: 0.5 } 
              }}
              exit={{ opacity: 0 }}
              className="absolute bottom-8 left-8 md:bottom-12 md:left-16"
            >
              <p className="swaarg-body text-white/50">
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