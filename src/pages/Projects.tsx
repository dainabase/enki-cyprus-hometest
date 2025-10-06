import { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowRight, Star, Building2, Waves, Mountain, Users, Award, Euro, Calendar, Download, Phone, Mail, Heart, TrendingUp, Chrome as Home, Sun, GraduationCap, Shield, Plane } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView } from '@/lib/analytics';
import { getHeroImage } from '@/utils/gallery';
import { KPICard } from '@/components/project-page/KPICard';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCount, setShowCount] = useState(12);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          developers(name, logo_url)
        `)
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    trackPageView('/projects', 'Projets - ENKI-REALTY Immobilier Premium Chypre');
  }, []);

  const featuredProjects = useMemo(() => {
    return projects.filter((p: any) => p.featured).slice(0, 3);
  }, [projects]);

  const categories = useMemo(() => {
    const goldenVisaCount = projects.filter((p: any) => p.golden_visa_eligible).length;
    const villasCount = projects.filter((p: any) => p.property_category?.toLowerCase().includes('villa')).length;
    const apartmentsCount = projects.filter((p: any) => p.property_category?.toLowerCase().includes('apartment') || p.property_category?.toLowerCase().includes('penthouse')).length;
    const newCount = projects.filter((p: any) => {
      const createdDate = new Date(p.created_at);
      const daysSinceCreated = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCreated <= 60;
    }).length;
    const readyCount = projects.filter((p: any) => {
      const year = p.completion_year || new Date(p.completion_date).getFullYear();
      return year >= 2025 && year <= 2026;
    }).length;

    return [
      { id: 'all', label: 'Tous les Projets', count: projects.length },
      { id: 'featured', label: 'Projets Vedette', count: featuredProjects.length },
      { id: 'golden-visa', label: 'Golden Visa', count: goldenVisaCount },
      { id: 'villas', label: 'Villas de Prestige', count: villasCount },
      { id: 'apartments', label: 'Appartements & Penthouses', count: apartmentsCount },
      { id: 'new', label: 'Nouveautés', count: newCount },
      { id: 'ready', label: 'Livraison Immédiate', count: readyCount },
    ];
  }, [projects, featuredProjects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (selectedCategory === 'featured') {
      filtered = projects.filter((p: any) => p.featured);
    } else if (selectedCategory === 'golden-visa') {
      filtered = projects.filter((p: any) => p.golden_visa_eligible);
    } else if (selectedCategory === 'villas') {
      filtered = projects.filter((p: any) => p.property_category?.toLowerCase().includes('villa'));
    } else if (selectedCategory === 'apartments') {
      filtered = projects.filter((p: any) =>
        p.property_category?.toLowerCase().includes('apartment') ||
        p.property_category?.toLowerCase().includes('penthouse')
      );
    } else if (selectedCategory === 'new') {
      filtered = projects.filter((p: any) => {
        const createdDate = new Date(p.created_at);
        const daysSinceCreated = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceCreated <= 60;
      });
    } else if (selectedCategory === 'ready') {
      filtered = projects.filter((p: any) => {
        const year = p.completion_year || new Date(p.completion_date).getFullYear();
        return year >= 2025 && year <= 2026;
      });
    }

    return filtered;
  }, [projects, selectedCategory]);

  const visibleProjects = useMemo(() => {
    return filteredProjects.slice(0, showCount);
  }, [filteredProjects, showCount]);

  const totalProjects = projects.length;
  const avgReturn = 6.5;
  const sunnyDays = 340;
  const goldenVisaThreshold = 300000;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Projets Immobiliers à Chypre | ENKI-REALTY"
        description="Découvrez notre sélection exclusive de projets immobiliers premium à Chypre. Résidences de luxe, villas et appartements dans les meilleurs emplacements."
        keywords="projets immobiliers Chypre, résidences premium, investissements Chypre, villas Limassol, appartements Paphos"
        url="https://enki-realty.com/projects"
        canonical="https://enki-realty.com/projects"
        image="/og-projects.jpg"
      />

      <div className="min-h-screen bg-white">
        {/* SECTION 1: HERO PRESTIGE */}
        <section className="relative h-screen overflow-hidden">
          {/* Parallax Background */}
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0 w-full h-full"
          >
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center scale-110"
              style={{
                backgroundImage: `url(/lovable-uploads/7a1f4c1e-ed5d-401e-98a7-e7d380bb9d99.png)`,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
          </motion.div>

          {/* Content */}
          <motion.div
            style={{ opacity: heroOpacity }}
            className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center"
          >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="swaarg-hero-title text-white mb-6 max-w-4xl"
            >
              Programmes Immobiliers d'Exception à Chypre
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="swaarg-subtitle text-white/90 mb-12 max-w-3xl"
            >
              Golden Visa • Rendements attractifs • Art de vivre méditerranéen
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center mb-16"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover text-white px-8"
                onClick={() => document.getElementById('navigation')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Découvrir nos Projets
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary backdrop-blur-md bg-white/10"
              >
                <Download className="mr-2 h-5 w-5" />
                Guide Golden Visa
              </Button>
            </motion.div>
          </motion.div>

          {/* KPI Cards - Fixed Bottom */}
          <div className="absolute bottom-8 left-0 right-0 z-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard
                  icon={<Building2 className="w-8 h-8" />}
                  label="Projets disponibles"
                  value={totalProjects}
                  delay={0.8}
                />
                <KPICard
                  icon={<Euro className="w-8 h-8" />}
                  label="Seuil Golden Visa"
                  value={`€${goldenVisaThreshold.toLocaleString()}`}
                  delay={0.9}
                />
                <KPICard
                  icon={<TrendingUp className="w-8 h-8" />}
                  label="Rendement moyen"
                  value={`${avgReturn}%`}
                  delay={1.0}
                />
                <KPICard
                  icon={<Sun className="w-8 h-8" />}
                  label="Jours de soleil"
                  value={sunnyDays}
                  highlight
                  delay={1.1}
                />
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-2 bg-white rounded-full"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* SECTION 2: NAVIGATION PAR CATÉGORIES (Sticky) */}
        <section
          id="navigation"
          className="sticky top-0 z-40 bg-white shadow-md"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowCount(12);
                  }}
                  className="whitespace-nowrap"
                >
                  {cat.label} ({cat.count})
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: PROJETS VEDETTE (Featured) */}
        {featuredProjects.length > 0 && (
          <section id="featured" className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="swaarg-large-title text-primary mb-4">
                  Projets Vedette
                </h2>
                <p className="swaarg-subtitle text-muted-foreground max-w-2xl mx-auto">
                  Découvrez notre sélection exclusive des meilleurs programmes immobiliers
                </p>
              </motion.div>

              <div className="space-y-12">
                {featuredProjects.map((project: any, index: number) => {
                  const projectSlug = project.url_slug || project.id;
                  const location = typeof project.location === 'string' ? project.location : `${project.location?.city || ''}, ${project.location?.district || ''}`;

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 }}
                      className="group"
                    >
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Image */}
                        <Link to={`/projects/${projectSlug}`} className="relative h-[500px] rounded-2xl overflow-hidden">
                          <img
                            src={getHeroImage(project) || 'https://picsum.photos/800/600'}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-0">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Exclusif
                            </Badge>
                            {project.golden_visa_eligible && (
                              <Badge className="bg-gradient-to-r from-primary to-orange-600 text-white border-0">
                                <Award className="w-3 h-3 mr-1" />
                                Golden Visa
                              </Badge>
                            )}
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="space-y-6">
                          <div>
                            <Link to={`/projects/${projectSlug}`}>
                              <h3 className="swaarg-large-title text-foreground mb-2 hover:text-primary transition-colors">
                                {project.title}
                              </h3>
                            </Link>
                            <div className="flex items-center text-muted-foreground mb-4">
                              <MapPin className="w-5 h-5 mr-2" />
                              <span className="swaarg-body">{location}</span>
                            </div>
                          </div>

                          {/* Highlights */}
                          <div className="grid grid-cols-2 gap-4">
                            {project.distance_to_beach && (
                              <div className="flex items-center gap-2">
                                <Waves className="w-5 h-5 text-primary" />
                                <span className="text-sm">{project.distance_to_beach}m plage</span>
                              </div>
                            )}
                            {project.expected_rental_yield && (
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                <span className="text-sm">{project.expected_rental_yield}% rendement</span>
                              </div>
                            )}
                            {project.smart_home && (
                              <div className="flex items-center gap-2">
                                <Home className="w-5 h-5 text-primary" />
                                <span className="text-sm">Smart Home</span>
                              </div>
                            )}
                            {project.units_available && (
                              <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-primary" />
                                <span className="text-sm">{project.units_available} unités</span>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <p className="swaarg-body text-muted-foreground line-clamp-3">
                            {project.description || 'Un projet d\'exception alliant luxe, confort et emplacement privilégié pour un art de vivre unique à Chypre.'}
                          </p>

                          {/* Price & CTA */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">À partir de</p>
                              <p className="text-3xl font-bold text-primary">
                                €{Number(project.price_from || project.price || 0).toLocaleString()}
                              </p>
                            </div>
                            <Link to={`/projects/${projectSlug}`}>
                              <Button size="lg" className="group">
                                Découvrir le Projet
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: POURQUOI INVESTIR À CHYPRE */}
        <section className="py-24 md:py-32 bg-secondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="swaarg-large-title text-primary mb-4">
                Pourquoi Investir à Chypre ?
              </h2>
              <p className="swaarg-subtitle text-muted-foreground max-w-3xl mx-auto">
                Les avantages uniques qui font de Chypre la destination d'investissement idéale
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Award,
                  title: 'Golden Visa Express',
                  desc: 'Résidence UE en 2-6 mois, dès €300K',
                  highlight: 'Processus rapide'
                },
                {
                  icon: TrendingUp,
                  title: 'Rendements Exceptionnels',
                  desc: '5-7% locatif, +8%/an appréciation',
                  highlight: 'ROI attractif'
                },
                {
                  icon: Euro,
                  title: 'Fiscalité Avantageuse',
                  desc: '0% succession, 12,5% impôt société',
                  highlight: 'Optimisation fiscale'
                },
                {
                  icon: Sun,
                  title: 'Art de Vivre',
                  desc: '340 jours soleil, qualité de vie exceptionnelle',
                  highlight: 'Style de vie'
                },
                {
                  icon: Plane,
                  title: 'Position Stratégique',
                  desc: 'Hub Europe-Asie-Afrique, accès mondial',
                  highlight: 'Connectivité'
                },
                {
                  icon: GraduationCap,
                  title: 'Éducation & Santé',
                  desc: 'Écoles internationales, système européen',
                  highlight: 'Services de qualité'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  className="bg-white p-8 rounded-2xl shadow-md transition-all"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">{item.desc}</p>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    {item.highlight}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: GRILLE PRINCIPALE DES PROJETS */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="swaarg-large-title text-primary mb-4">
                {selectedCategory === 'all' ? 'Tous nos Programmes' : categories.find(c => c.id === selectedCategory)?.label}
              </h2>
              <p className="swaarg-subtitle text-muted-foreground">
                {filteredProjects.length} {filteredProjects.length > 1 ? 'projets disponibles' : 'projet disponible'}
              </p>
            </motion.div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visibleProjects.map((project: any, index: number) => {
                    const projectSlug = project.url_slug || project.id;
                    const location = typeof project.location === 'string' ? project.location : project.location?.city || 'Chypre';
                    const isNew = (() => {
                      const createdDate = new Date(project.created_at);
                      const daysSinceCreated = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
                      return daysSinceCreated <= 60;
                    })();

                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -8 }}
                        className="group"
                      >
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                          <Link to={`/projects/${projectSlug}`}>
                            <div className="relative h-72">
                              <img
                                src={getHeroImage(project) || 'https://picsum.photos/600/400'}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                              {/* Badges */}
                              <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {isNew && (
                                  <Badge className="bg-green-500 text-white border-0">
                                    Nouveauté
                                  </Badge>
                                )}
                                {project.golden_visa_eligible && (
                                  <Badge className="bg-gradient-to-r from-primary to-orange-600 text-white border-0">
                                    Golden Visa
                                  </Badge>
                                )}
                                {project.units_available && project.units_available < 5 && (
                                  <Badge className="bg-red-500 text-white border-0">
                                    Dernières Unités
                                  </Badge>
                                )}
                              </div>

                              {/* Favorite Icon */}
                              <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                                <Heart className="w-5 h-5 text-white" />
                              </button>

                              {/* Price overlay */}
                              <div className="absolute bottom-4 left-4 right-4">
                                <div className="bg-white/90 backdrop-blur-md rounded-xl p-3">
                                  <p className="text-xs text-muted-foreground mb-1">À partir de</p>
                                  <p className="text-2xl font-bold text-primary">
                                    €{Number(project.price_from || project.price || 0).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>

                          <div className="p-6">
                            <Link to={`/projects/${projectSlug}`}>
                              <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 hover:text-primary transition-colors">
                                {project.title}
                              </h3>
                            </Link>
                            <div className="flex items-center text-muted-foreground mb-4">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{location}</span>
                            </div>

                            {/* Specs */}
                            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                              {project.units_available && (
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-4 h-4 text-primary" />
                                  <span>{project.units_available} unités</span>
                                </div>
                              )}
                              {project.completion_month && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4 text-primary" />
                                  <span>{project.completion_month}</span>
                                </div>
                              )}
                              {project.distance_to_beach && (
                                <div className="flex items-center gap-1">
                                  <Waves className="w-4 h-4 text-primary" />
                                  <span>{project.distance_to_beach}m</span>
                                </div>
                              )}
                              {project.expected_rental_yield && (
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4 text-primary" />
                                  <span>{project.expected_rental_yield}%</span>
                                </div>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {project.description || 'Programme immobilier d\'exception offrant un cadre de vie unique.'}
                            </p>

                            {/* CTAs */}
                            <div className="flex gap-2">
                              <Link to={`/projects/${projectSlug}`} className="flex-1">
                                <Button variant="default" className="w-full">
                                  Découvrir le Projet
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Load More */}
                {visibleProjects.length < filteredProjects.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setShowCount(prev => prev + 12)}
                    >
                      Charger 12 projets supplémentaires ({filteredProjects.length - visibleProjects.length} restants)
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>

        {/* SECTION 6: TÉMOIGNAGES CLIENTS */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="swaarg-large-title text-primary mb-4">
                Ils Nous Font Confiance
              </h2>
              <p className="swaarg-subtitle text-muted-foreground">
                2,500+ familles accompagnées dans leur projet immobilier à Chypre
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  name: 'Sophie M.',
                  nationality: 'France',
                  property: 'Villa Marina Bay',
                  quote: 'Une expérience exceptionnelle du début à la fin. L\'équipe Enki Reality nous a accompagnés à chaque étape, rendant notre investissement simple et sécurisé.',
                  rating: 5
                },
                {
                  name: 'Michael K.',
                  nationality: 'Belgique',
                  property: 'Penthouse Limassol',
                  quote: 'La Golden Visa obtenue en 4 mois ! Service professionnel et réactif. Notre appartement génère déjà 6% de rendement locatif.',
                  rating: 5
                },
                {
                  name: 'Anna P.',
                  nationality: 'Suisse',
                  property: 'Appartement Paphos',
                  quote: 'Qualité de vie incroyable et investissement rentable. Les conseils d\'Enki Reality ont été précieux pour optimiser notre achat.',
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-secondary/10 p-8 rounded-2xl"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.nationality} • {testimonial.property}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary mb-2">4.9/5</p>
                <p className="text-muted-foreground">Satisfaction moyenne</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">98%</p>
                <p className="text-muted-foreground">Clients recommandent</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">2,500+</p>
                <p className="text-muted-foreground">Familles accompagnées</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: CTA FINALE (Banner Full-width) */}
        <section
          className="relative py-32 overflow-hidden"
          style={{
            backgroundImage: 'url(/lovable-uploads/marina-bay-sea-view.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="swaarg-large-title text-white mb-6">
                Votre Résidence Méditerranéenne Vous Attend
              </h2>
              <p className="swaarg-subtitle text-white/90 mb-12">
                Explorez nos projets avec un conseiller dédié
              </p>

              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-white px-8">
                  <Phone className="mr-2 h-5 w-5" />
                  Réserver une Consultation Gratuite
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary backdrop-blur-md bg-white/10"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Télécharger le Guide de l'Investisseur
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-8 justify-center text-white">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Conseiller francophone dédié</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">Réponse sous 2h garantie</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="text-sm">Sans engagement</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Projects;
