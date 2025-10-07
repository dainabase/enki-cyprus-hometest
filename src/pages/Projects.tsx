import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView } from '@/lib/analytics';
import { Building2, MapPin, Euro, Calendar, Star } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  city: string;
  cyprus_zone: string;
  price_from: number;
  total_units: number;
  units_available: number;
  golden_visa_eligible: boolean;
  completion_date?: string;
  url_slug: string;
  photo_gallery_urls?: string[];
  developer?: {
    name: string;
    logo?: string;
  };
}

const Projects = () => {
  const [filter, setFilter] = useState<string>('all');

  // Track page view
  useEffect(() => {
    trackPageView('/projects', 'Projets Immobiliers - ENKI Reality Cyprus');
  }, []);

  // Fetch projects from Supabase
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects-listing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          subtitle,
          description,
          city,
          cyprus_zone,
          price_from,
          total_units,
          units_available,
          golden_visa_eligible,
          completion_date,
          url_slug,
          photo_gallery_urls,
          developer:developers(name, logo)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      console.log('✅ Projects loaded:', data?.length || 0);
      return data || [];
    },
  });

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true;
    if (filter === 'golden-visa') return project.golden_visa_eligible;
    if (filter === 'limassol') return project.cyprus_zone === 'Limassol';
    if (filter === 'paphos') return project.cyprus_zone === 'Paphos';
    if (filter === 'larnaca') return project.cyprus_zone === 'Larnaca';
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-light text-black/60">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-light text-black mb-2">Erreur de chargement</h2>
          <p className="text-black/60">Impossible de charger les projets. Veuillez réessayer.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Projets Immobiliers à Chypre | ENKI Reality"
        description="Découvrez notre sélection de programmes immobiliers premium à Chypre. Résidences de luxe, villas et appartements dans les meilleurs emplacements."
        keywords="projets immobiliers Chypre, résidences premium, investissements Chypre, villas Limassol, appartements Paphos"
        url="https://enki-reality.com/projects"
        canonical="https://enki-reality.com/projects"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-black text-white py-32">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
              Nos Projets Immobiliers
            </h1>
            <p className="text-xl text-white/80 font-light max-w-2xl">
              Découvrez notre sélection de programmes immobiliers premium à Chypre
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex gap-4 overflow-x-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === 'all'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-black/20 hover:border-black'
                }`}
              >
                Tous les projets ({projects.length})
              </button>
              <button
                onClick={() => setFilter('golden-visa')}
                className={`px-6 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === 'golden-visa'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-black/20 hover:border-black'
                }`}
              >
                Golden Visa ({projects.filter(p => p.golden_visa_eligible).length})
              </button>
              <button
                onClick={() => setFilter('limassol')}
                className={`px-6 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === 'limassol'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-black/20 hover:border-black'
                }`}
              >
                Limassol
              </button>
              <button
                onClick={() => setFilter('paphos')}
                className={`px-6 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === 'paphos'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-black/20 hover:border-black'
                }`}
              >
                Paphos
              </button>
              <button
                onClick={() => setFilter('larnaca')}
                className={`px-6 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === 'larnaca'
                    ? 'bg-black text-white'
                    : 'bg-white text-black border border-black/20 hover:border-black'
                }`}
              >
                Larnaca
              </button>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="w-16 h-16 text-black/20 mx-auto mb-4" />
                <h3 className="text-2xl font-light text-black mb-2">Aucun projet trouvé</h3>
                <p className="text-black/60">
                  Aucun projet ne correspond à vos critères de recherche.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.url_slug || project.id}`}
                    className="group block bg-white border border-black/10 hover:border-black transition-colors"
                  >
                    {/* Project Image */}
                    <div className="aspect-[4/3] bg-black/5 overflow-hidden relative">
                      {project.photo_gallery_urls && project.photo_gallery_urls[0] ? (
                        <img
                          src={project.photo_gallery_urls[0]}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-black/20" />
                        </div>
                      )}
                      {project.golden_visa_eligible && (
                        <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-xs font-medium">
                          Golden Visa
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-light text-black mb-2 group-hover:underline">
                        {project.title}
                      </h3>
                      
                      {project.subtitle && (
                        <p className="text-sm text-black/60 mb-4">{project.subtitle}</p>
                      )}

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-black/60">
                          <MapPin className="w-4 h-4" />
                          <span>{project.city}, {project.cyprus_zone}</span>
                        </div>
                        
                        {project.price_from && (
                          <div className="flex items-center gap-2 text-sm text-black/60">
                            <Euro className="w-4 h-4" />
                            <span>À partir de €{project.price_from.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-black/60">
                          <Building2 className="w-4 h-4" />
                          <span>{project.units_available || 0} / {project.total_units || 0} unités disponibles</span>
                        </div>

                        {project.completion_date && (
                          <div className="flex items-center gap-2 text-sm text-black/60">
                            <Calendar className="w-4 h-4" />
                            <span>Livraison {project.completion_date}</span>
                          </div>
                        )}
                      </div>

                      {project.developer && (
                        <div className="pt-4 border-t border-black/10">
                          <p className="text-xs text-black/40 uppercase tracking-wider">
                            {project.developer.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Besoin d'aide pour choisir ?
            </h2>
            <p className="text-lg text-white/80 font-light mb-8">
              Nos conseillers sont à votre disposition pour vous accompagner dans votre projet d'investissement.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-black px-8 py-4 text-sm font-medium hover:bg-white/90 transition-colors uppercase tracking-wider"
            >
              Nous contacter
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Projects;