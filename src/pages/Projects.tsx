import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView } from '@/lib/analytics';
import { Building2, TrendingUp, Award, MapPin, Euro, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  title: string;
  description?: string;
  detailed_description?: string;
  type: string;
  price: number;
  location: {
    city?: string;
    lat?: number;
    lng?: number;
  };
  features?: string[];
  detailed_features?: string[];
  photos?: string[];
  plans?: string[];
  virtual_tour?: string;
  created_at: string;
  updated_at?: string;
  url_slug?: string;
}

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Track page view
  useEffect(() => {
    trackPageView('/projects', 'Projets Immobiliers - ENKI Reality Cyprus');
  }, []);

  // Fetch projects from Supabase - adapted to real DB structure
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Calculate statistics from real data
  const statistics = useMemo(() => {
    const projectCount = projects.length;
    const minPrice = projects.length > 0
      ? Math.min(...projects.map((p: Project) => Number(p.price) || 0).filter(Boolean))
      : 250000;

    return [
      {
        icon: Building2,
        label: 'Projets Actifs',
        value: projectCount.toString()
      },
      {
        icon: Euro,
        label: "Prix d'entrée",
        value: `€${(minPrice / 1000).toFixed(0)}K`
      },
      {
        icon: TrendingUp,
        label: 'Rendement Moyen',
        value: '6.5%'
      },
      {
        icon: Award,
        label: "Années d'Expérience",
        value: '15+'
      },
    ];
  }, [projects]);

  // Filter projects based on active category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects;
    if (activeCategory === 'villas') {
      return projects.filter(p => p.type?.toLowerCase().includes('villa'));
    }
    if (activeCategory === 'apartments') {
      return projects.filter(p =>
        p.type?.toLowerCase().includes('apartment') ||
        p.type?.toLowerCase().includes('penthouse')
      );
    }
    return projects;
  }, [projects, activeCategory]);

  // Loading state
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
        keywords="projets immobiliers Chypre, résidences premium, investissements Chypre, villas Limassol, appartements Paphos"
        url="https://enki-reality.com/projects"
        canonical="https://enki-reality.com/projects"
      />

      <div className="min-h-screen bg-white">
        {/* ===== SECTION 1: HERO ===== */}
        <section className="relative bg-black text-white min-h-[90vh] flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-6 text-center">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 tracking-tight leading-tight"
            >
              Découvrez Notre Sélection de<br />
              Programmes Immobiliers à Chypre
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Des programmes neufs d'exception, conçus pour l'investissement et le prestige.
              Qualité architecturale, emplacements privilégiés et rentabilité assurée.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 px-8 py-6 text-sm uppercase tracking-wider font-medium"
                onClick={() => document.getElementById('projects-grid')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explorer les Projets
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-sm uppercase tracking-wider font-medium"
              >
                Télécharger le Catalogue
              </Button>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur p-6"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-white/60" />
                  <p className="text-2xl font-light mb-1">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wider text-white/60">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "reverse" }}
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
        <section className="sticky top-0 z-40 bg-white border-b border-black/10 shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
              {[
                { id: 'all', label: 'Tous les Projets', count: projects.length },
                { id: 'featured', label: 'Projets Vedette', count: 0 },
                { id: 'villas', label: 'Villas de Prestige', count: projects.filter(p => p.type?.toLowerCase().includes('villa')).length },
                { id: 'apartments', label: 'Appartements', count: projects.filter(p => p.type?.toLowerCase().includes('apartment')).length },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    px-6 py-3 text-sm font-medium whitespace-nowrap transition-all
                    ${activeCategory === category.id
                      ? 'bg-black text-white'
                      : 'bg-white text-black border border-black/20 hover:border-black'
                    }
                  `}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 3: FEATURED PROJECTS ===== */}
        {activeCategory === 'all' && projects.length > 0 && (
          <section className="py-24 bg-neutral-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16">
                <div className="h-[1px] w-20 bg-black mb-6" />
                <h2 className="text-4xl md:text-5xl font-light text-black tracking-tight mb-4">
                  Projets Vedette
                </h2>
                <p className="text-lg text-black/60 font-light max-w-2xl">
                  Notre sélection exclusive des programmes les plus exceptionnels
                </p>
              </div>

              {/* Afficher le premier projet en format premium */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <div className="relative aspect-[4/3] bg-black/5 overflow-hidden">
                  {projects[0].photos && projects[0].photos[0] ? (
                    <img
                      src={projects[0].photos[0]}
                      alt={projects[0].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-24 h-24 text-black/20" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-black text-white border-0 text-xs px-4 py-2">
                      Projet Vedette
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-3xl md:text-4xl font-light text-black mb-4 tracking-tight">
                    {projects[0].title}
                  </h3>

                  <div className="flex items-center gap-2 text-black/60 mb-6">
                    <MapPin className="w-5 h-5" />
                    <span className="text-base font-light">
                      {projects[0].location?.city || 'Chypre'}
                    </span>
                  </div>

                  <p className="text-lg text-black/70 font-light mb-8 leading-relaxed">
                    {projects[0].description || projects[0].detailed_description}
                  </p>

                  {/* Features (si disponibles) */}
                  {projects[0].features && projects[0].features.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {projects[0].features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-black" />
                          </div>
                          <span className="text-sm text-black/70 font-light">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-8">
                    <p className="text-sm text-black/40 uppercase tracking-wider mb-2">
                      À partir de
                    </p>
                    <p className="text-4xl font-light text-black">
                      €{Number(projects[0].price).toLocaleString()}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link to={`/projects/${projects[0].url_slug || projects[0].id}`}>
                    <Button
                      size="lg"
                      className="bg-black text-white hover:bg-black/90 px-8 py-6 text-sm uppercase tracking-wider"
                    >
                      Découvrir ce Projet
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===== SECTION 4: PROJECTS GRID ===== */}
        <section id="projects-grid" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="h-[1px] w-20 bg-black mb-6 mx-auto" />
              <h2 className="text-4xl md:text-5xl font-light text-black tracking-tight mb-4">
                {activeCategory === 'all' ? 'Tous les Projets' :
                 activeCategory === 'villas' ? 'Villas de Prestige' :
                 activeCategory === 'apartments' ? 'Appartements' : 'Nos Projets'}
              </h2>
              <p className="text-lg text-black/60 font-light">
                {filteredProjects.length} {filteredProjects.length > 1 ? 'projets disponibles' : 'projet disponible'}
              </p>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project: Project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="group bg-white border border-black/10 overflow-hidden hover:border-black/30 transition-all duration-300"
                  >
                    {/* Project Image */}
                    <div className="relative h-64 bg-black/5 overflow-hidden">
                      {project.photos && project.photos.length > 0 ? (
                        <img
                          src={project.photos[0]}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-black/20" />
                        </div>
                      )}

                      {/* Type Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-black text-white border-0">
                          {project.type}
                        </Badge>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <h3 className="text-2xl font-light text-black mb-2 line-clamp-1">
                        {project.title}
                      </h3>

                      {project.location?.city && (
                        <div className="flex items-center gap-2 text-black/60 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-light">{project.location.city}</span>
                        </div>
                      )}

                      <p className="text-black/60 font-light text-sm mb-4 line-clamp-2">
                        {project.description || project.detailed_description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-black/10">
                        <div>
                          <p className="text-xs text-black/40 uppercase tracking-wider mb-1">
                            À partir de
                          </p>
                          <p className="text-2xl font-light text-black">
                            €{Number(project.price).toLocaleString()}
                          </p>
                        </div>

                        <Link
                          to={`/projects/${project.url_slug || project.id}`}
                          className="text-sm font-medium text-black hover:underline uppercase tracking-wider"
                        >
                          Découvrir
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <Building2 className="w-16 h-16 text-black/20 mx-auto mb-6" />
                <h3 className="text-2xl font-light text-black mb-3">
                  Aucun projet dans cette catégorie
                </h3>
                <p className="text-lg text-black/60 font-light">
                  Essayez une autre catégorie ou consultez tous nos projets.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Projects;
