import { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { MenuHoverPreview, MenuItemPreview } from './MenuHoverPreview';

// ✅ CONSTANTE CENTRALISÉE - Durée des animations du menu
// Synchronise : animations Framer Motion + protection anti-spam
// Valeur : 300ms = durée des transitions UNDERLAY + menu overlay
const ANIMATION_DURATION = 300;

const menuItemsWithPreviews: MenuItemPreview[] = [
  {
    label: 'Accueil',
    href: '/',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=1200&fit=crop',
    description: 'Découvrez Enki Reality, votre partenaire immobilier premium à Chypre pour une expérience d\'investissement exceptionnelle.'
  },
  {
    label: 'Projets',
    href: '/projects',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=1200&fit=crop',
    description: 'Découvrez notre portfolio de programmes immobiliers premium à Chypre avec vue mer et montagne.'
  },
  {
    label: 'Recherche IA',
    href: '/search',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=1200&fit=crop',
    description: 'Utilisez notre moteur de recherche IA avancé pour trouver le bien immobilier parfait selon vos critères précis.'
  },
  {
    label: 'Conseil Fiscal IA',
    href: '/lexaia',
    image: 'https://images.unsplash.com/photo-1554224311-beee415c201f?w=800&h=1200&fit=crop',
    description: 'Investissez €300k+ et obtenez votre résidence permanente européenne avec tous les avantages fiscaux.'
  },
  {
    label: 'Blog',
    href: '/blog',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=1200&fit=crop',
    description: 'Actualités immobilières, guides d\'investissement et conseils d\'experts pour réussir à Chypre.'
  },
  {
    label: 'À propos',
    href: '/about',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=1200&fit=crop',
    description: 'Enki Reality, votre partenaire immobilier de confiance à Chypre depuis 2020. Excellence et transparence.'
  },
  {
    label: 'Contact',
    href: '/contact',
    image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&h=1200&fit=crop',
    description: 'Parlons de votre projet immobilier à Chypre. Notre équipe multilingue vous répond sous 24h.'
  },
];

const ModernMenu = () => {
  const [active, setActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<MenuItemPreview | null>(null);
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
              <div className="h-[1px] w-20 bg-black mb-6" />
              <Link
                to="/"
                className="text-4xl md:text-5xl font-light text-black tracking-tight hover:text-black/70 transition-colors"
              >
                ΣNKI<span className="mx-1">-</span>REALTY
              </Link>
            </motion.div>

            {/* Links Container */}
            <div className="flex h-full items-center justify-start px-8 md:px-16">
              <div className="flex flex-col gap-0 w-full max-w-md">
                {menuItemsWithPreviews.map((item, idx) => (
                  <motion.div
                    key={item.href}
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
                    onMouseEnter={() => setHoveredMenuItem(item)}
                    onMouseLeave={() => setHoveredMenuItem(null)}
                    className="relative py-4"
                  >
                    <Link
                      to={item.href}
                      className="block group"
                      onClick={() => setActive(false)}
                    >
                      <span className="text-2xl md:text-3xl font-light text-black/60 hover:text-black transition-all duration-300 whitespace-nowrap">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}

                {/* Séparateur + Réseaux sociaux */}
                <div className="mt-8">
                  {/* Trait séparateur AVANT les icônes - largeur des 5 icônes */}
                  <div className="h-px bg-black/20 my-6" style={{ width: 'calc(5 * 1.5rem + 4 * 1rem)' }} />

                  <div className="flex items-center gap-4">
                    {/* LinkedIn */}
                    <a
                      href="https://linkedin.com/company/enkirealty"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/60 hover:text-black transition-colors duration-200"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>

                    {/* Facebook */}
                    <a
                      href="https://facebook.com/enkirealty"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/60 hover:text-black transition-colors duration-200"
                      aria-label="Facebook"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>

                    {/* YouTube */}
                    <a
                      href="https://youtube.com/@enkirealty"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/60 hover:text-black transition-colors duration-200"
                      aria-label="YouTube"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://instagram.com/enkirealty"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/60 hover:text-black transition-colors duration-200"
                      aria-label="Instagram"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>

                    {/* TikTok */}
                    <a
                      href="https://tiktok.com/@enkirealty"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/60 hover:text-black transition-colors duration-200"
                      aria-label="TikTok"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Hover Preview - PASSE TOUTES LES IMAGES */}
            <MenuHoverPreview
              hoveredItem={hoveredMenuItem}
              allItems={menuItemsWithPreviews}
            />

            {/* Admin/Déconnexion - Footer gauche */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.6, duration: 0.4 }
              }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="absolute bottom-8 left-8 md:bottom-12 md:left-16"
            >
              <div className="flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setActive(false)}
                        className="text-lg md:text-xl font-light text-black/60 hover:text-black transition-colors duration-200"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-left text-lg md:text-xl font-light text-black/60 hover:text-black transition-colors duration-200"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setActive(false)}
                    className="text-lg md:text-xl font-light text-black/60 hover:text-black transition-colors duration-200"
                  >
                    Connexion
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModernMenu;
