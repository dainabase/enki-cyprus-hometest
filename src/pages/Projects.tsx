import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useFilters } from '@/contexts/FilterContext';
import { Building2, MapPin, Filter, Trophy, Star, Users, Home, Target, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import FeaturedProjectCard from '@/components/FeaturedProjectCard';
import { ScrollRevealText, ScrollRevealParagraph } from '@/components/ui/ScrollRevealText';

const Projects = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  
  const { state } = useFilters();
  const { filteredProperties: properties } = state;
  
  const categories = [
    { name: 'Tous', count: 25, active: true },
    { name: 'Résidences de Luxe', count: 12, active: false },
    { name: 'Complexes Résidentiels', count: 8, active: false },
    { name: 'Programmes Neufs', count: 5, active: false },
    { name: 'Investissement', count: 10, active: false },
  ];

  const stats = [
    { value: '25+', label: 'Programmes immobiliers', icon: Building2 },
    { value: '5', label: 'Villes Premium', icon: MapPin },
    { value: '15+', label: 'Promoteurs Partenaires', icon: Users },
    { value: '98%', label: 'Satisfaction Client', icon: Star },
  ];

  // Mock data for residential projects
  const featuredProjects = [
    {
      id: "1",
      title: "Cyprus Marina Residences",
      location: "Limassol Marina",
      prix_moyen: 850000,
      status: "disponible" as const,
      description: "Résidence de luxe face à la marina avec services 5 étoiles",
      features: ["Vue mer", "Plage privée", "Concierge 24h", "Spa"],
      image: "/placeholder.svg",
      nombre_biens: 45,
      types_biens: ["Appartements", "Penthouses"],
      biens: []
    },
    {
      id: "2",
      title: "Golden Bay Heights",
      location: "Paphos",
      prix_moyen: 425000,
      status: "en_construction" as const,
      description: "Complexe résidentiel moderne avec vue panoramique",
      features: ["Piscine", "Gym", "Jardins", "Parking"],
      image: "/placeholder.svg",
      nombre_biens: 32,
      types_biens: ["Appartements", "Villas"],
      biens: []
    },
    {
      id: "3",
      title: "Sunset Hills Development",
      location: "Ayia Napa",
      prix_moyen: 380000,
      status: "disponible" as const,
      description: "Programme neuf avec appartements et villas",
      features: ["Golf", "Club house", "Sécurité", "Commerces"],
      image: "/placeholder.svg",
      nombre_biens: 28,
      types_biens: ["Appartements", "Villas", "Townhouses"],
      biens: []
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Exact same style as Home page */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Complex Animated Background - Same as Home page */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-hero" />
          <motion.div 
            className="absolute inset-0"
            style={{ y: y1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/20" />
          </motion.div>
          <motion.div 
            className="absolute inset-0"
            style={{ y: y2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tl from-accent/20 via-transparent to-primary/30" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <ScrollRevealText
                text="Programmes Immobiliers"
                className="swaarg-hero-title text-white mb-8"
              />
              <ScrollRevealParagraph
                text="Découvrez notre portfolio exclusif de résidences et complexes immobiliers premium à Chypre. Des programmes soigneusement sélectionnés pour votre investissement."
                className="swaarg-hero-subtitle text-white/90 max-w-4xl mx-auto mb-12"
              />
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <Button 
                  size="lg" 
                  className="btn-premium text-lg px-8 py-4 group"
                >
                  <Building2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Explorer les Programmes
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold transition-all group"
                >
                  <Filter className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Filtres Avancés
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Swaarg style */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <ScrollRevealText
              text="Portfolio d'Excellence"
              className="swaarg-large-title text-foreground mb-6"
            />
            <ScrollRevealParagraph
              text="Des chiffres qui témoignent de notre expertise et de la confiance de nos clients"
              className="swaarg-body-large text-muted-foreground max-w-2xl mx-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div 
                  className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-premium text-white shadow-premium"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-10 h-10" />
                </motion.div>
                <div className="swaarg-card-title text-primary mb-3 group-hover:text-primary-hover transition-colors">
                  {stat.value}
                </div>
                <div className="swaarg-body text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs Section - Swaarg style */}
      <section className="py-24 bg-gradient-to-br from-muted/20 via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <ScrollRevealText
              text="Programmes Immobiliers"
              className="swaarg-large-title text-foreground mb-6"
            />
            <ScrollRevealParagraph
              text="Résidences et complexes immobiliers d'exception soigneusement sélectionnés pour votre investissement à Chypre"
              className="swaarg-body-large text-muted-foreground max-w-3xl mx-auto mb-12"
            />
            
            {/* Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Badge
                    variant={category.active ? "default" : "outline"}
                    className={`px-6 py-3 cursor-pointer transition-all duration-300 swaarg-button ${
                      category.active 
                        ? 'bg-gradient-premium text-white shadow-premium border-0' 
                        : 'border-2 border-primary/30 text-primary hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    {category.name} ({category.count})
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <FeaturedProjectCard 
                  project={project} 
                  index={index}
                />
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Button 
              size="lg" 
              className="btn-premium px-12 py-4 text-lg group"
            >
              <Building2 className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Découvrir plus de programmes
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Locations - Swaarg style */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <ScrollRevealText
              text="Destinations Premium"
              className="swaarg-large-title text-foreground mb-6"
            />
            <ScrollRevealParagraph
              text="Explorez nos programmes immobiliers dans les plus belles régions de Chypre, soigneusement sélectionnées pour leur potentiel d'investissement"
              className="swaarg-body-large text-muted-foreground max-w-3xl mx-auto"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Limassol Marina', count: '8 programmes', image: 'luxury-marina', projects: ['Marina Residences', 'Seafront Tower'] },
              { name: 'Paphos', count: '5 programmes', image: 'coastal-paphos', projects: ['Golden Bay', 'Sunset Hills'] },
              { name: 'Nicosie Centre', count: '6 programmes', image: 'modern-nicosia', projects: ['City Center Plaza', 'Modern Heights'] },
              { name: 'Ayia Napa', count: '3 programmes', image: 'beach-ayia-napa', projects: ['Beach Resort', 'Coastal Villas'] },
              { name: 'Larnaca', count: '4 programmes', image: 'historic-larnaca', projects: ['Airport District', 'Historic Quarter'] },
              { name: 'Protaras', count: '2 programmes', image: 'resort-protaras', projects: ['Resort Complex', 'Villa Paradise'] },
            ].map((location, index) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="overflow-hidden card-hover cursor-pointer group">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <motion.div 
                      className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center mb-2">
                        <Home className="w-4 h-4 mr-1 text-accent" />
                        <span className="text-sm opacity-90">{location.count}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{location.name}</h3>
                      <div className="text-xs opacity-75">
                        {location.projects.slice(0, 2).join(' • ')}
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Building2 className="w-12 h-12 text-white/20" />
                      </motion.div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-accent text-accent-foreground">
                        Premium
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Swaarg style */}
      <section className="relative py-32 overflow-hidden">
        {/* Complex Animated Background - Same as Home page */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-hero" />
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              background: [
                "linear-gradient(45deg, hsl(200 100% 45%) 0%, hsl(190 85% 50%) 100%)",
                "linear-gradient(135deg, hsl(190 85% 50%) 0%, hsl(200 100% 45%) 100%)",
                "linear-gradient(45deg, hsl(200 100% 45%) 0%, hsl(190 85% 50%) 100%)"
              ] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Floating particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-white space-y-12"
            >
              <ScrollRevealText
                text="Programme sur Mesure ?"
                className="swaarg-section-title text-white mb-8"
              />
              <ScrollRevealParagraph 
                text="Notre équipe d'experts peut vous aider à identifier le programme immobilier parfait selon vos critères d'investissement spécifiques à Chypre."
                className="swaarg-hero-subtitle text-white/90 max-w-3xl mx-auto leading-relaxed mb-12"
              />
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 px-12 py-4 swaarg-button shadow-premium hover:shadow-xl transition-all group"
                >
                  <Target className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                  Recherche Ciblée
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary px-12 py-4 swaarg-button transition-all group"
                >
                  <Trophy className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  Conseil VIP
                  <Sparkles className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;