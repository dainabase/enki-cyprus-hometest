import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowRight, Star, Building2, Waves, Mountain, Users, Map } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView } from '@/lib/analytics';
import { getHeroImage } from '@/utils/gallery';

const GoogleMapComponent = lazy(() => import('@/components/GoogleMap'));

const Projects = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('Fetching projects...');
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      console.log('Projects fetched:', data?.length, 'projects');
      return data || [];
    },
  });

  useEffect(() => {
    trackPageView('/projects', 'Projets - ENKI-REALTY Immobilier Premium Chypre');
  }, []);

  const featuredProjects = useMemo(() => {
    const featured = projects.filter((p: any) => p.featured);
    // Si aucun projet featured, prendre les 3 premiers
    return featured.length > 0 ? featured.slice(0, 3) : projects.slice(0, 3);
  }, [projects]);

  useEffect(() => {
    console.log('Projects state:', projects.length, 'projects');
    console.log('Featured projects:', featuredProjects.length);
  }, [projects, featuredProjects]);

  const districts = useMemo(() => {
    const locs = projects.map((p: any) => {
      if (typeof p.location === 'string') return p.location;
      return p.location?.city || p.location?.district || 'Autre';
    });
    return Array.from(new Set(locs));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedDistrict === 'all') return projects;
    return projects.filter((p: any) => {
      const loc = typeof p.location === 'string' ? p.location : (p.location?.city || p.location?.district || '');
      return loc.includes(selectedDistrict);
    });
  }, [projects, selectedDistrict]);

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
        {/* HERO SECTION */}
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 w-full h-full object-cover scale-125"
              style={{
                backgroundImage: `url(/lovable-uploads/7a1f4c1e-ed5d-401e-98a7-e7d380bb9d99.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60 scale-125"
              style={{
                backgroundImage: `url(/lovable-uploads/7a1f4c1e-ed5d-401e-98a7-e7d380bb9d99.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/45" />

          <div className="relative z-10 text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="swaarg-hero-title text-white mb-6"
            >
              Découvrez nos Programmes<br />Immobiliers à Chypre
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="swaarg-subtitle text-white/90 mb-12 max-w-3xl mx-auto"
            >
              Une sélection de programmes premium conçus pour un art de vivre d'exception
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover text-white"
                onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Découvrir les projets
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* TOP 3 FEATURED PROJECTS */}
        {featuredProjects.length > 0 ? (
          <section id="featured" className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="swaarg-large-title text-primary mb-4">
                Projets en Vedette
              </h2>
              <p className="swaarg-subtitle text-muted-foreground max-w-2xl mx-auto">
                Découvrez notre sélection exclusive des meilleurs programmes immobiliers
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project: any, index: number) => {
                const projectSlug = project.url_slug || project.id;
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group relative"
                  >
                    <Link to={`/projects/${projectSlug}`}>
                    <div className="relative h-[500px] rounded-2xl overflow-hidden">
                      <img
                        src={getHeroImage(project) || 'https://picsum.photos/800/600'}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-black">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Vedette
                        </Badge>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="swaarg-card-title text-white mb-2">
                          {project.title}
                        </h3>
                        <div className="flex items-center text-white/80 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="swaarg-body">{typeof project.location === 'string' ? project.location : project.location?.city || 'Chypre'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="swaarg-card-title text-white">
                            À partir de €{Number(project.price_from || project.price || 0).toLocaleString()}
                          </span>
                          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            </div>
          </section>
        ) : (
          <section className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="swaarg-large-title text-primary mb-4">
                Aucun projet disponible
              </h2>
              <p className="swaarg-subtitle text-muted-foreground">
                Les projets seront bientôt disponibles. Revenez plus tard.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Debug: {projects.length} projets trouvés dans la base de données
              </p>
            </div>
          </section>
        )}

      {/* CYPRUS LIFESTYLE SECTION - Full Width */}
      <section className="w-full py-24 bg-white">
        <div className="px-4 md:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="swaarg-large-title text-primary mb-4">
              L'Art de Vivre à Chypre
            </h2>
            <p className="swaarg-subtitle text-muted-foreground max-w-3xl mx-auto">
              Plus de 300 jours de soleil par an, entre mer Méditerranée et montagnes majestueuses
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Waves, title: 'Bord de Mer', desc: 'Plages de sable fin et eaux cristallines' },
              { icon: Mountain, title: 'Nature', desc: 'Montagnes et paysages préservés' },
              { icon: Building2, title: 'Urbanisme', desc: 'Villes modernes et infrastructure de qualité' },
              { icon: Users, title: 'Communauté', desc: 'Accueil chaleureux et qualité de vie' }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 border border-border/50"
              >
                <item.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="swaarg-card-title mb-2">{item.title}</h3>
                <p className="swaarg-body text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL PROJECTS BY DISTRICT - Full Width */}
      <section className="w-full py-24 bg-secondary/10">
        <div className="px-4 md:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="swaarg-large-title text-primary mb-4">
              Tous nos Programmes
            </h2>
            <p className="swaarg-subtitle text-muted-foreground mb-8">
              Explorez l'ensemble de nos projets par localisation
            </p>

            {/* District Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant={selectedDistrict === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedDistrict('all')}
              >
                Tous
              </Button>
              {districts.map((district: string) => (
                <Button
                  key={district}
                  variant={selectedDistrict === district ? 'default' : 'outline'}
                  onClick={() => setSelectedDistrict(district)}
                >
                  {district}
                </Button>
              ))}
            </div>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project: any, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link to={`/projects/${project.url_slug || project.id}`}>
                    <div className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      <div className="relative h-64">
                        <img
                          src={getHeroImage(project) || 'https://picsum.photos/600/400'}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        {project.featured && (
                          <Badge className="absolute top-3 right-3 bg-yellow-500 text-black">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Vedette
                          </Badge>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="swaarg-card-title mb-2 line-clamp-1">{project.title}</h3>
                        <div className="flex items-center text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="swaarg-body text-sm">{typeof project.location === 'string' ? project.location : project.location?.city || 'Chypre'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="swaarg-card-title text-primary">
                            €{Number(project.price_from || project.price || 0).toLocaleString()}+
                          </span>
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION - Full Width */}
      <section className="w-full py-24 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="swaarg-large-title mb-6">
              Prêt à Découvrir Votre Futur Chez Vous ?
            </h2>
            <p className="swaarg-subtitle mb-12 max-w-2xl mx-auto opacity-90">
              Contactez notre équipe d'experts pour trouver le programme immobilier parfait
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="group"
            >
              <Link to="/contact">
                Contactez-nous
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Projects;
