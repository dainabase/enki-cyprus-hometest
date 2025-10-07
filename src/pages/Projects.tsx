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

        {/* ===== SECTION 5: POURQUOI INVESTIR À CHYPRE ===== */}
        <section className="py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <div className="h-[1px] w-20 bg-black mb-6 mx-auto" />
              <h2 className="text-4xl md:text-5xl font-light text-black tracking-tight mb-6">
                Pourquoi Investir à Chypre ?
              </h2>
              <p className="text-lg text-black/60 font-light max-w-3xl mx-auto">
                Un cadre fiscal avantageux, une qualité de vie exceptionnelle et des rendements attractifs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                {
                  icon: '🏛️',
                  title: 'Résidence Européenne',
                  description: 'Possibilité d\'obtenir une résidence permanente dans l\'UE avec un investissement à partir de €300 000. Accès facilité à l\'espace Schengen.',
                  highlight: 'Seuil: €300K'
                },
                {
                  icon: '📈',
                  title: 'Rendements Attractifs',
                  description: 'Rendement locatif moyen de 5-7% annuel, combiné à une appréciation du capital de +8% par an. Marché en forte croissance.',
                  highlight: '5-7% rendement'
                },
                {
                  icon: '💰',
                  title: 'Fiscalité Avantageuse',
                  description: '0% de taxe sur les successions, 12,5% d\'impôt sur les sociétés (le plus bas de l\'UE). Nombreuses conventions fiscales.',
                  highlight: '12,5% IS'
                },
                {
                  icon: '☀️',
                  title: 'Qualité de Vie',
                  description: '340 jours de soleil par an, climat méditerranéen idéal. Sécurité exceptionnelle et infrastructure moderne.',
                  highlight: '340 jours de soleil'
                },
                {
                  icon: '✈️',
                  title: 'Position Stratégique',
                  description: 'Carrefour entre Europe, Asie et Afrique. Hub international pour les affaires et le commerce. Connectivité aérienne excellente.',
                  highlight: 'Hub international'
                },
                {
                  icon: '🎓',
                  title: 'Infrastructure',
                  description: 'Écoles internationales de qualité, système de santé aux standards européens. Communauté expatriée dynamique.',
                  highlight: 'Standards UE'
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-8 border border-black/10"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-2xl font-light text-black mb-4 tracking-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-base text-black/60 font-light leading-relaxed mb-4">
                    {benefit.description}
                  </p>
                  <div className="pt-4 border-t border-black/10">
                    <Badge variant="outline" className="bg-black/5 text-black border-0 px-3 py-1 text-xs">
                      {benefit.highlight}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 6: TÉMOIGNAGES ===== */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="h-[1px] w-20 bg-black mb-6 mx-auto" />
              <h2 className="text-4xl md:text-5xl font-light text-black tracking-tight mb-6">
                Ils Nous Font Confiance
              </h2>
              <p className="text-lg text-black/60 font-light">
                Plus de 2 500 familles accompagnées dans leur projet immobilier
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  name: 'Marie & Pierre Dubois',
                  nationality: 'France',
                  propertyType: 'Villa 3 chambres',
                  rating: 5,
                  quote: 'L\'équipe d\'ENKI Reality nous a accompagnés à chaque étape. Leur professionnalisme et leur connaissance du marché chypriote sont exceptionnels.',
                },
                {
                  name: 'Sophie Laurent',
                  nationality: 'Belgique',
                  propertyType: 'Penthouse 2 chambres',
                  rating: 5,
                  quote: 'Investir à Chypre était un rêve. Grâce à ENKI Reality, ce rêve est devenu réalité. Le processus était transparent et le suivi impeccable.',
                },
                {
                  name: 'Thomas Müller',
                  nationality: 'Allemagne',
                  propertyType: 'Appartement vue mer',
                  rating: 5,
                  quote: 'Excellente expérience du début à la fin. L\'équipe parle plusieurs langues et comprend parfaitement les besoins des investisseurs internationaux.',
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-neutral-50 p-8 border border-black/10"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-black text-lg">★</span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-base text-black/70 font-light leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="pt-6 border-t border-black/10">
                    <p className="text-sm font-medium text-black mb-1">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-black/40 uppercase tracking-wider">
                      {testimonial.nationality} · {testimonial.propertyType}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { label: 'Satisfaction Moyenne', value: '4.9/5' },
                { label: 'Taux de Recommandation', value: '98%' },
                { label: 'Familles Accompagnées', value: '2,500+' },
              ].map((stat, index) => (
                <div key={index} className="p-6 bg-neutral-50">
                  <p className="text-3xl font-light text-black mb-2">{stat.value}</p>
                  <p className="text-sm uppercase tracking-wider text-black/40 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 7: CTA FINALE ===== */}
        <section className="relative py-32 bg-black text-white overflow-hidden">
          <div className="absolute inset-0 bg-black" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
                Votre Résidence Méditerranéenne<br />Vous Attend
              </h2>
              <p className="text-lg text-white/80 font-light max-w-2xl mx-auto mb-12">
                Explorez nos projets avec un conseiller dédié et trouvez la propriété qui correspond à vos aspirations
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/contact">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 px-8 py-6 text-sm uppercase tracking-wider"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Réserver une Consultation
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-sm uppercase tracking-wider"
                >
                  Télécharger le Guide Investisseur
                </Button>
              </div>

              {/* Reassurance */}
              <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
                {[
                  'Conseiller francophone dédié',
                  'Réponse sous 2h',
                  'Sans engagement',
                ].map((badge, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    <span className="font-light">{badge}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 8: FOOTER ENRICHI ===== */}
        <footer className="bg-black text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            {/* 4 Colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

              {/* Colonne 1: À Propos */}
              <div>
                <h3 className="text-xl font-light mb-6 tracking-tight">À Propos d'ENKI Reality</h3>
                <p className="text-white/60 font-light mb-6 leading-relaxed text-sm">
                  Expert de l'immobilier de prestige à Chypre depuis 15 ans. Nous accompagnons les investisseurs internationaux avec excellence et transparence.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/40">Volume livré</span>
                    <span className="text-white font-medium">€2,5Mds</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/40">Familles</span>
                    <span className="text-white font-medium">2,500+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Projets actifs</span>
                    <span className="text-white font-medium">{projects.length}</span>
                  </div>
                </div>
              </div>

              {/* Colonne 2: Navigation Projets */}
              <div>
                <h3 className="text-xl font-light mb-6 tracking-tight">Découvrir</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Tous les Projets', href: '/projects' },
                    { label: 'Projets Vedette', href: '/projects?category=featured' },
                    { label: 'Villas de Prestige', href: '/projects?category=villas' },
                    { label: 'Limassol', href: '/projects?zone=limassol' },
                    { label: 'Paphos', href: '/projects?zone=paphos' },
                    { label: 'Larnaca', href: '/projects?zone=larnaca' },
                  ].map((link, i) => (
                    <li key={i}>
                      <Link
                        to={link.href}
                        className="text-sm font-light text-white/60 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Colonne 3: Ressources */}
              <div>
                <h3 className="text-xl font-light mb-6 tracking-tight">Ressources</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Blog Investissement', href: '/blog' },
                    { label: 'Guide Résidence UE', href: '/residence-guide' },
                    { label: 'Rapports de Marché', href: '/market-reports' },
                    { label: 'Calculateur ROI', href: '/calculator' },
                    { label: 'FAQ', href: '/faq' },
                    { label: 'Contact', href: '/contact' },
                  ].map((link, i) => (
                    <li key={i}>
                      <Link
                        to={link.href}
                        className="text-sm font-light text-white/60 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Colonne 4: Contact */}
              <div>
                <h3 className="text-xl font-light mb-6 tracking-tight">Contact</h3>
                <div className="space-y-4 text-sm text-white/60 font-light">
                  <div>
                    <p className="text-white/40 uppercase tracking-wider text-xs mb-1">Téléphone</p>
                    <p>+357 25 123 456</p>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase tracking-wider text-xs mb-1">Email</p>
                    <p>info@enki-reality.cy</p>
                  </div>
                  <div>
                    <p className="text-white/40 uppercase tracking-wider text-xs mb-1">Bureau</p>
                    <p>Limassol Marina, Cyprus</p>
                  </div>
                </div>

                {/* Social */}
                <div className="flex gap-3 mt-6">
                  {['F', 'I', 'L', 'Y'].map((social, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-10 h-10 bg-white/10 hover:bg-white hover:text-black flex items-center justify-center transition-all text-xs font-medium"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40 font-light">
              <p>© 2025 ENKI Reality Cyprus. Tous droits réservés.</p>
              <div className="flex gap-6">
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Politique de Confidentialité
                </Link>
                <Link to="/terms" className="hover:text-white transition-colors">
                  CGV
                </Link>
                <Link to="/legal" className="hover:text-white transition-colors">
                  Mentions Légales
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Projects;
