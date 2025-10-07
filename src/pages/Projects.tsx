/**
 * REFONTE PAGE PROJECTS - ENKI REALITY CYPRUS
 *
 * 8 Sections:
 * 1. Hero avec statistiques
 * 2. Navigation par catégories (sticky)
 * 3. Projets Vedette (2-3 projets premium)
 * 4. Grille principale avec filtres et pagination
 * 5. Pourquoi Investir à Chypre (6 bénéfices)
 * 6. Témoignages clients (carousel)
 * 7. CTA Finale
 * 8. Footer enrichi
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView } from '@/lib/analytics';

// Icons
import { Download, Calendar, TrendingUp, Building2, Users, Plane, Home, ShieldCheck, Sun, MapPin, Heart, Star, ChevronLeft, ChevronRight, Award, Banknote, GraduationCap, TrendingDown, Phone, Mail } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { FeaturedProjectCard } from '@/components/projects/FeaturedProjectCard';
import { CategoryNav } from '@/components/projects/CategoryNav';
import { TestimonialCard } from '@/components/projects/TestimonialCard';
import { AdvancedFilters } from '@/components/projects/AdvancedFilters';
import { SortSelector } from '@/components/projects/SortSelector';

// Types
import type {
  Project,
  CategoryType,
  Category,
  Testimonial,
  Statistic,
  ProjectFilters,
  SortOption
} from '@/types/project.types';

// Constants
const PROJECTS_PER_PAGE = 12;
const GOLDEN_VISA_THRESHOLD = 300000;
const NEW_PROJECT_DAYS = 60;
const READY_PROJECT_YEARS = 2;

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('date');
  
  // Parallax scroll setup
  const { scrollY } = useScroll();

  // Fetch projects from Supabase
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          developer:developers(name, logo),
          buildings(count)
        `)
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('project_favorites');
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      localStorage.removeItem('project_favorites');
    }
  }, []);

  // Track page view
  useEffect(() => {
    trackPageView('/projects', 'Projets Immobiliers - ENKI Reality Cyprus');
  }, []);

  // Featured projects (2-3)
  const featuredProjects = useMemo(() => {
    return projects.filter((p: Project) => p.featured).slice(0, 3);
  }, [projects]);

  // Filter projects by category and advanced filters
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Category filter
    switch (activeCategory) {
      case 'featured':
        filtered = filtered.filter((p: Project) => p.featured);
        break;
      case 'residence':
        filtered = filtered.filter((p: Project) => p.price_from && p.price_from >= GOLDEN_VISA_THRESHOLD);
        break;
      case 'villas':
        filtered = filtered.filter((p: Project) =>
          p.property_type?.toLowerCase().includes('villa')
        );
        break;
      case 'apartments':
        filtered = filtered.filter((p: Project) =>
          p.property_type?.toLowerCase().includes('apartment') ||
          p.property_type?.toLowerCase().includes('penthouse')
        );
        break;
      case 'new':
        const newProjectCutoff = new Date();
        newProjectCutoff.setDate(newProjectCutoff.getDate() - NEW_PROJECT_DAYS);
        filtered = filtered.filter((p: Project) =>
          p.created_at && new Date(p.created_at) > newProjectCutoff
        );
        break;
      case 'ready':
        const currentYear = new Date().getFullYear();
        filtered = filtered.filter((p: Project) => {
          const completionYear = p.expected_completion?.match(/\d{4}/)?.[0];
          return completionYear && parseInt(completionYear) <= currentYear + READY_PROJECT_YEARS;
        });
        break;
    }

    // Advanced filters
    if (filters.priceMin !== undefined) {
      filtered = filtered.filter(p => (p.price_from || 0) >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      filtered = filtered.filter(p => (p.price_from || 0) <= filters.priceMax!);
    }
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p =>
        filters.propertyTypes!.some(type =>
          p.property_type?.toLowerCase().includes(type.toLowerCase())
        )
      );
    }
    if (filters.distanceToBeach !== undefined) {
      filtered = filtered.filter(p =>
        !p.proximity_sea_km || p.proximity_sea_km <= filters.distanceToBeach!
      );
    }
    if (filters.goldenVisaEligible) {
      filtered = filtered.filter(p => p.price_from && p.price_from >= GOLDEN_VISA_THRESHOLD);
    }

    return filtered;
  }, [projects, activeCategory, filters]);

  // Sort projects
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.price_from || 0) - (b.price_from || 0);
        case 'price-desc':
          return (b.price_from || 0) - (a.price_from || 0);
        case 'popularity':
          return (b.views || 0) - (a.views || 0);
        case 'distance':
          return (a.proximity_sea_km || 999) - (b.proximity_sea_km || 999);
        case 'roi':
          return (b.roi_annual || 0) - (a.roi_annual || 0);
        case 'date':
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });
  }, [filteredProjects, sortBy]);

  // Pagination
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    return sortedProjects.slice(startIndex, endIndex);
  }, [sortedProjects, currentPage]);

  const totalPages = Math.ceil(sortedProjects.length / PROJECTS_PER_PAGE);
  const hasMore = currentPage < totalPages;

  // Categories for navigation
  const categories = useMemo(() => {
    const isNew = (p: Project) => {
      if (!p.created_at) return false;
      const newProjectCutoff = new Date();
      newProjectCutoff.setDate(newProjectCutoff.getDate() - NEW_PROJECT_DAYS);
      return new Date(p.created_at) > newProjectCutoff;
    };

    const isReady = (p: Project) => {
      const currentYear = new Date().getFullYear();
      const completionYear = p.expected_completion?.match(/\d{4}/)?.[0];
      return completionYear && parseInt(completionYear) <= currentYear + READY_PROJECT_YEARS;
    };

    return [
      { id: 'all' as CategoryType, label: 'Tous les Projets', count: projects.length },
      { id: 'featured' as CategoryType, label: 'Projets Vedette', count: projects.filter((p: Project) => p.featured).length },
      { id: 'residence' as CategoryType, label: 'Éligibles Résidence', count: projects.filter((p: Project) => p.price_from && p.price_from >= GOLDEN_VISA_THRESHOLD).length },
      { id: 'villas' as CategoryType, label: 'Villas de Prestige', count: projects.filter((p: Project) => p.property_type?.toLowerCase().includes('villa')).length },
      { id: 'apartments' as CategoryType, label: 'Appartements & Penthouses', count: projects.filter((p: Project) => p.property_type?.toLowerCase().includes('apartment') || p.property_type?.toLowerCase().includes('penthouse')).length },
      { id: 'new' as CategoryType, label: 'Nouveautés', count: projects.filter(isNew).length },
      { id: 'ready' as CategoryType, label: 'Livraison Immédiate', count: projects.filter(isReady).length },
    ];
  }, [projects]);

  // Statistics for hero
  const statistics = useMemo((): Statistic[] => {
    const avgROI = projects.reduce((acc: number, p: Project) => acc + (p.roi_annual || 0), 0) / projects.length || 6.5;
    const minPrice = Math.min(...projects.map((p: Project) => p.price_from || 0).filter(Boolean)) || 250000;

    return [
      { icon: Building2, label: 'Projets Actifs', value: projects.length.toString() },
      { icon: TrendingUp, label: 'Prix d\'entrée', value: `€${(minPrice / 1000).toFixed(0)}K` },
      { icon: TrendingUp, label: 'Rendement Moyen', value: `${avgROI.toFixed(1)}%` },
      { icon: Award, label: 'Années d\'Expérience', value: '15+' },
    ];
  }, [projects]);

  // Testimonials
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Marie & Pierre Dubois',
      nationality: 'France',
      propertyType: 'Villa 3 chambres',
      rating: 5,
      quote: 'L\'équipe d\'ENKI Reality nous a accompagnés à chaque étape. Leur professionnalisme et leur connaissance du marché chypriote sont exceptionnels. Nous sommes ravis de notre investissement.',
    },
    {
      id: '2',
      name: 'Sophie Laurent',
      nationality: 'Belgique',
      propertyType: 'Penthouse 2 chambres',
      rating: 5,
      quote: 'Investir à Chypre était un rêve. Grâce à ENKI Reality, ce rêve est devenu réalité. Le processus était transparent et le suivi impeccable. Je recommande vivement.',
    },
    {
      id: '3',
      name: 'Thomas Müller',
      nationality: 'Allemagne',
      propertyType: 'Appartement vue mer',
      rating: 5,
      quote: 'Excellente expérience du début à la fin. L\'équipe parle plusieurs langues et comprend parfaitement les besoins des investisseurs internationaux. Mon rendement locatif dépasse mes attentes.',
    },
  ];

  // Toggle favorite
  const handleToggleFavorite = (projectId: string) => {
    const newFavorites = favorites.includes(projectId)
      ? favorites.filter(id => id !== projectId)
      : [...favorites, projectId];

    setFavorites(newFavorites);
    localStorage.setItem('project_favorites', JSON.stringify(newFavorites));
  };

  // Load more projects
  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Testimonial navigation
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-light text-black/60">Chargement des projets...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Projets Immobiliers à Chypre | ENKI Reality"
        description="Découvrez notre sélection exclusive de programmes immobiliers premium à Chypre. Résidences de luxe, villas et appartements dans les meilleurs emplacements."
        keywords="projets immobiliers Chypre, résidences premium, investissements Chypre, villas Limassol, appartements Paphos, résidence européenne"
        url="https://enki-reality.com/projects"
        canonical="https://enki-reality.com/projects"
      />

      <div className="min-h-screen bg-white">
        {/* ===== SECTION 1: HERO AVEC PARALLAX ===== */}
        <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-black">
          {/* Parallax Background */}
          <motion.div 
            className="absolute inset-0"
            style={{
              y: useTransform(scrollY, [0, 1000], [0, 300]),
              scale: useTransform(scrollY, [0, 1000], [1, 1.2])
            }}
          >
            <motion.img
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              src="/lovable-uploads/7a1f4c1e-ed5d-401e-98a7-e7d380bb9d99.png"
              alt="Cyprus Lifestyle"
              className="w-full h-full object-cover"
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            />
          </motion.div>

          {/* Content avec animations échelonnées */}
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {/* Title avec clip-path reveal progressif */}
              <motion.h1
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-tight leading-[0.95]"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Découvrez Notre Sélection de<br />
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="inline-block"
                >
                  Programmes Immobiliers à Chypre
                </motion.span>
              </motion.h1>

              {/* Subtitle avec fade-in et slide-up */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="text-lg md:text-xl text-white/80 font-light max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                Des programmes neufs d'exception, conçus pour l'investissement et le prestige.
                Qualité architecturale, emplacements privilégiés et rentabilité assurée.
              </motion.p>

              {/* CTAs avec spring animations */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.2, delayChildren: 2 } }
                }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              >
                {[
                  { label: 'Explorer les Projets', primary: true },
                  { label: 'Télécharger le Catalogue', primary: false, icon: Download }
                ].map((button, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { scale: 0, opacity: 0, rotate: -180 },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        rotate: 0,
                        transition: { type: "spring", stiffness: 200, damping: 20 }
                      }
                    }}
                  >
                    <Button
                      size="lg"
                      variant={button.primary ? "default" : "outline"}
                      className={
                        button.primary 
                          ? "px-12 py-6 bg-white text-black hover:bg-white/90 text-sm uppercase tracking-wider font-medium" 
                          : "px-12 py-6 border-2 border-white text-white hover:bg-white hover:text-black text-sm uppercase tracking-wider font-medium"
                      }
                      onClick={() => button.primary && document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      {button.icon && <button.icon className="w-4 h-4 mr-2" />}
                      {button.label}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>

              {/* Statistics avec 3D flip effect */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.15, delayChildren: 2.5 } }
                }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                style={{ perspective: "1000px" }}
              >
                {statistics.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { rotateX: -90, opacity: 0, y: 50 },
                      visible: {
                        rotateX: 0,
                        opacity: 1,
                        y: 0,
                        transition: { type: "spring", stiffness: 100, damping: 15 }
                      }
                    }}
                    whileHover={{ 
                      y: -10, 
                      rotateY: 5,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    className="bg-white p-6 shadow-lg"
                    style={{ 
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden"
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="w-8 h-8 text-black/40 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-xs uppercase tracking-wider text-black/40 mb-2 font-medium">
                      {stat.label}
                    </p>
                    <motion.p 
                      className="text-2xl font-light text-black"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 3 + index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      {stat.value}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator animé */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3, repeat: Infinity, repeatType: "reverse" }}
          >
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1 h-2 bg-white/60 rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </section>

        {/* ===== SECTION 2: CATEGORY NAVIGATION (STICKY) ===== */}
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={(category) => {
            setActiveCategory(category);
            setCurrentPage(1); // Reset pagination
          }}
        />

        {/* ===== SECTION 3: FEATURED PROJECTS ===== */}
        {featuredProjects.length > 0 && (
          <section id="featured" className="py-24 lg:py-32 bg-neutral-50">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="mb-20"
              >
                <div className="h-[1px] w-20 bg-black mb-6" />
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black tracking-tight mb-4">
                  Projets Vedette
                </h2>
                <p className="text-lg md:text-xl text-black/60 font-light max-w-3xl">
                  Notre sélection exclusive des programmes les plus exceptionnels
                </p>
              </motion.div>

              <div className="space-y-12">
                {featuredProjects.map((project: any, index: number) => (
                  <FeaturedProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== SECTION 4: MAIN PROJECTS GRID ===== */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            {/* Section Header with Filters & Sort */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-16"
            >
              <div className="h-[1px] w-20 bg-black mb-6" />
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-6">
                <div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black tracking-tight mb-4">
                    {categories.find(c => c.id === activeCategory)?.label}
                  </h2>
                  <p className="text-lg text-black/40 font-light">
                    Affichage {paginatedProjects.length > 0 ? `1-${Math.min(currentPage * PROJECTS_PER_PAGE, sortedProjects.length)}` : '0'} sur {sortedProjects.length} projets
                  </p>
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                  <SortSelector sortBy={sortBy} onSortChange={setSortBy} />
                  <AdvancedFilters
                    filters={filters}
                    onFiltersChange={(newFilters) => {
                      setFilters(newFilters);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Projects Grid */}
            {paginatedProjects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedProjects.map((project: any, index: number) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favorites.includes(project.id)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mt-16"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleLoadMore}
                      className="px-12 py-6 border-2 border-black text-black hover:bg-black hover:text-white text-sm uppercase tracking-wider font-medium"
                    >
                      Charger 12 Projets Supplémentaires
                    </Button>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <Building2 className="w-16 h-16 text-black/20 mx-auto mb-6" />
                <h3 className="text-2xl font-light text-black mb-3">Aucun projet dans cette catégorie</h3>
                <p className="text-lg text-black/60 font-light">
                  Essayez de sélectionner une autre catégorie ou consultez tous nos projets.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* ===== SECTION 5: POURQUOI INVESTIR À CHYPRE ===== */}
        <section className="py-24 lg:py-32 bg-neutral-50">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-20"
            >
              <div className="h-[1px] w-20 bg-black mb-6 mx-auto" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black tracking-tight mb-6">
                Pourquoi Investir à Chypre ?
              </h2>
              <p className="text-lg md:text-xl text-black/60 font-light max-w-3xl mx-auto leading-relaxed">
                Un cadre fiscal avantageux, une qualité de vie exceptionnelle et des rendements attractifs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Résidence Européenne',
                  description: 'Possibilité d\'obtenir une résidence permanente dans l\'UE avec un investissement à partir de €300 000. Accès facilité à l\'espace Schengen.',
                  highlight: 'Seuil: €300K'
                },
                {
                  icon: TrendingUp,
                  title: 'Rendements Attractifs',
                  description: 'Rendement locatif moyen de 5-7% annuel, combiné à une appréciation du capital de +8% par an. Marché en forte croissance.',
                  highlight: '5-7% rendement'
                },
                {
                  icon: TrendingDown,
                  title: 'Fiscalité Avantageuse',
                  description: '0% de taxe sur les successions, 12,5% d\'impôt sur les sociétés (le plus bas de l\'UE). Nombreuses conventions fiscales.',
                  highlight: '12,5% IS'
                },
                {
                  icon: Sun,
                  title: 'Qualité de Vie',
                  description: '340 jours de soleil par an, climat méditerranéen idéal. Sécurité exceptionnelle et infrastructure moderne.',
                  highlight: '340 jours de soleil'
                },
                {
                  icon: Plane,
                  title: 'Position Stratégique',
                  description: 'Carrefour entre Europe, Asie et Afrique. Hub international pour les affaires et le commerce. Connectivité aérienne excellente.',
                  highlight: 'Hub international'
                },
                {
                  icon: GraduationCap,
                  title: 'Infrastructure',
                  description: 'Écoles internationales de qualité, système de santé aux standards européens. Communauté expatriée dynamique.',
                  highlight: 'Standards UE'
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <benefit.icon className="w-12 h-12 text-black/40 mb-6" />
                  <h3 className="text-2xl font-light text-black mb-4 tracking-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-base text-black/60 font-light leading-relaxed mb-4">
                    {benefit.description}
                  </p>
                  <div className="pt-4 border-t border-black/5">
                    <Badge variant="outline" className="bg-black/5 text-black border-0 px-3 py-1">
                      {benefit.highlight}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 6: TESTIMONIALS ===== */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <div className="h-[1px] w-20 bg-black mb-6 mx-auto" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black tracking-tight mb-6">
                Ils Nous Font Confiance
              </h2>
              <p className="text-lg md:text-xl text-black/60 font-light">
                Plus de 2 500 familles accompagnées dans leur projet immobilier
              </p>
            </motion.div>

            {/* Desktop: 3 Testimonials */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-12">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </div>

            {/* Mobile: Carousel */}
            <div className="lg:hidden relative mb-12">
              <TestimonialCard
                testimonial={testimonials[currentTestimonial]}
                index={0}
              />

              {/* Navigation Arrows */}
              <div className="flex justify-center gap-4 mt-8" role="group" aria-label="Navigation du carrousel de témoignages">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevTestimonial}
                  aria-label="Témoignage précédent"
                  className="w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" aria-hidden="true" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextTestimonial}
                  aria-label="Témoignage suivant"
                  className="w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" aria-hidden="true" />
                </motion.button>
              </div>
            </div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            >
              {[
                { label: 'Satisfaction Moyenne', value: '4.9/5', icon: Star },
                { label: 'Taux de Recommandation', value: '98%', icon: TrendingUp },
                { label: 'Familles Accompagnées', value: '2,500+', icon: Users },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 bg-neutral-50"
                >
                  <stat.icon className="w-8 h-8 text-black/40 mx-auto mb-3" />
                  <p className="text-3xl font-light text-black mb-2">{stat.value}</p>
                  <p className="text-sm uppercase tracking-wider text-black/40 font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 7: CTA FINALE ===== */}
        <section className="relative py-32 lg:py-48 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920"
              alt="Family on terrace with sea view"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/70" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-tight">
                Votre Résidence Méditerranéenne<br />Vous Attend
              </h2>
              <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                Explorez nos projets avec un conseiller dédié et trouvez la propriété qui correspond à vos aspirations
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    asChild
                    className="px-12 py-6 bg-white text-black hover:bg-white/90 text-sm uppercase tracking-wider font-medium"
                  >
                    <Link to="/contact">
                      <Calendar className="w-4 h-4 mr-2" />
                      Réserver une Consultation
                    </Link>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-12 py-6 border-2 border-white text-white hover:bg-white hover:text-black text-sm uppercase tracking-wider font-medium"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le Guide Investisseur
                  </Button>
                </motion.div>
              </div>

              {/* Reassurance Badges */}
              <div className="flex flex-wrap justify-center gap-6 text-white/80">
                {[
                  { icon: Users, text: 'Conseiller francophone dédié' },
                  { icon: Calendar, text: 'Réponse sous 2h' },
                  { icon: ShieldCheck, text: 'Sans engagement' },
                ].map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-2 text-sm font-light"
                  >
                    <badge.icon className="w-4 h-4" />
                    <span>{badge.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 8: FOOTER ENRICHI ===== */}
        <footer className="relative bg-black text-white overflow-hidden">
          {/* Background Pattern Animé */}
          <motion.div 
            className="absolute inset-0 opacity-5"
            initial={{ backgroundPosition: '0% 0%' }}
            animate={{ backgroundPosition: '100% 100%' }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '60px 60px'
            }}
          />

          <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12">
            {/* Grid 4 Colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 lg:py-24">
              
              {/* Colonne 1: À Propos + Stats avec animations */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-light mb-6 tracking-tight">À Propos d'ENKI Reality</h3>
                <p className="text-white/60 font-light mb-6 leading-relaxed text-sm">
                  Expert de l'immobilier de prestige à Chypre depuis 15 ans. Nous accompagnons les investisseurs internationaux avec excellence et transparence.
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Volume livré', value: '€2,5Mds' },
                    { label: 'Familles accompagnées', value: '2,500+' },
                    { label: 'Projets actifs', value: projects.length.toString() }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex justify-between items-center text-sm border-b border-white/10 pb-2"
                    >
                      <span className="text-white/40">{stat.label}</span>
                      <span className="text-white font-medium">{stat.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Colonne 2: Navigation Projets */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="text-xl font-light mb-6 tracking-tight">Découvrir</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Tous les Projets', href: '/projects' },
                    { label: 'Projets Vedette', href: '/projects?category=featured' },
                    { label: 'Villas de Prestige', href: '/projects?category=villas' },
                    { label: 'Limassol', href: '/projects?location=limassol' },
                    { label: 'Paphos', href: '/projects?location=paphos' },
                    { label: 'Larnaca', href: '/projects?location=larnaca' }
                  ].map((link, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Link 
                        to={link.href} 
                        className="text-sm font-light text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                      >
                        <motion.span
                          initial={{ width: 0 }}
                          whileHover={{ width: 12 }}
                          className="h-[1px] bg-white"
                        />
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Colonne 3: Ressources */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xl font-light mb-6 tracking-tight">Ressources</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Blog Investissement', href: '/blog' },
                    { label: 'Guide Résidence UE', href: '/residence-guide' },
                    { label: 'Rapports de Marché', href: '/market-reports' },
                    { label: 'Calculateur ROI', href: '/calculator' },
                    { label: 'FAQ', href: '/faq' },
                    { label: 'Contact', href: '/contact' }
                  ].map((link, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Link 
                        to={link.href} 
                        className="text-sm font-light text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                      >
                        <motion.span
                          initial={{ width: 0 }}
                          whileHover={{ width: 12 }}
                          className="h-[1px] bg-white"
                        />
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Colonne 4: Newsletter + Contact */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-xl font-light mb-6 tracking-tight">Restez Informé</h3>
                <p className="text-sm text-white/60 font-light mb-4">
                  Nouveaux projets et opportunités en avant-première
                </p>
                
                {/* Newsletter Form avec animation */}
                <motion.form 
                  className="space-y-3 mb-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // TODO: Implement newsletter subscription
                  }}
                >
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    placeholder="Votre email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-all duration-300 text-sm font-light"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full px-4 py-3 bg-white text-black hover:bg-white/90 transition-all duration-300 text-sm font-medium uppercase tracking-wider"
                  >
                    S'inscrire
                  </motion.button>
                </motion.form>

                {/* Contact Info animé */}
                <div className="space-y-3 mb-6">
                  {[
                    { icon: Phone, text: '+357 25 123 456' },
                    { icon: Mail, text: 'info@enki-reality.cy' },
                    { icon: MapPin, text: 'Limassol Marina, Cyprus' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-light">{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Social Icons avec hover effects */}
                <div className="flex gap-3">
                  {[
                    { name: 'Facebook', initial: 'F' },
                    { name: 'Instagram', initial: 'I' },
                    { name: 'LinkedIn', initial: 'L' },
                    { name: 'YouTube', initial: 'Y' }
                  ].map((social, i) => (
                    <motion.a
                      key={social.name}
                      href={`#${social.name.toLowerCase()}`}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white/10 hover:bg-white hover:text-black flex items-center justify-center transition-all duration-300"
                      aria-label={social.name}
                    >
                      <span className="text-xs font-medium">{social.initial}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer Bottom avec animation reveal */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="pt-8 pb-8 border-t border-white/10"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40 font-light">
                <p>© 2025 ENKI Reality Cyprus. Tous droits réservés.</p>
                <div className="flex gap-6">
                  {['Politique de Confidentialité', 'CGV', 'Mentions Légales'].map((link, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <Link 
                        to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                        className="hover:text-white transition-colors duration-300"
                      >
                        {link}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Projects;
