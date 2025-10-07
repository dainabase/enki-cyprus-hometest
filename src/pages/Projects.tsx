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

        {/* ===== SECTION 2: PROJECTS GRID (Placeholder) ===== */}
        <section id="projects-grid" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="h-[1px] w-20 bg-black mb-6 mx-auto" />
              <h2 className="text-4xl md:text-5xl font-light text-black tracking-tight mb-4">
                Nos Projets
              </h2>
              <p className="text-lg text-black/60 font-light">
                {projects.length} {projects.length > 1 ? 'projets disponibles' : 'projet disponible'}
              </p>
            </div>

            {/* Projects Grid */}
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project: Project) => (
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
                  Aucun projet disponible pour le moment
                </h3>
                <p className="text-lg text-black/60 font-light">
                  De nouveaux projets seront bientôt disponibles.
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
