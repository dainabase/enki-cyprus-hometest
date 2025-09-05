import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useFilters } from '@/contexts/FilterContext';
import { Building2, MapPin, Filter, Trophy, Star, Users, Home, Target } from 'lucide-react';
import FeaturedProjectCard from '@/components/FeaturedProjectCard';
import { ScrollRevealText } from '@/components/ui/ScrollRevealText';

const Projects = () => {
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
      status: "disponible",
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
      status: "en_construction",
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
      status: "disponible",
      description: "Programme neuf avec appartements et villas",
      features: ["Golf", "Club house", "Sécurité", "Commerces"],
      image: "/placeholder.svg",
      nombre_biens: 28,
      types_biens: ["Appartements", "Villas", "Townhouses"],
      biens: []
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-hero" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"
            animate={{ 
              background: [
                "linear-gradient(45deg, hsl(var(--primary))/0.2, transparent, hsl(var(--accent))/0.2)",
                "linear-gradient(135deg, hsl(var(--accent))/0.2, transparent, hsl(var(--primary))/0.2)",
                "linear-gradient(45deg, hsl(var(--primary))/0.2, transparent, hsl(var(--accent))/0.2)"
              ] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <ScrollRevealText
              text="Nos Programmes Immobiliers"
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
            />
            <motion.p 
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Découvrez notre portfolio exclusif de résidences et complexes immobiliers premium à Chypre
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <stat.icon className="w-8 h-8" />
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs and Filters */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Portfolio Programmes
                </h2>
                <p className="text-lg text-muted-foreground">
                  Résidences et complexes immobiliers d'exception
                </p>
              </div>
              <Button variant="outline" className="btn-outline-premium">
                <Filter className="w-4 h-4 mr-2" />
                Filtres avancés
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <Badge
                  key={category.name}
                  variant={category.active ? "default" : "outline"}
                  className="px-6 py-3 cursor-pointer hover:scale-105 transition-transform text-sm font-medium"
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <FeaturedProjectCard 
                key={project.id} 
                project={project} 
                index={index}
              />
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Button size="lg" className="btn-premium px-8 py-4">
              <Building2 className="w-5 h-5 mr-2" />
              Découvrir plus de programmes
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <ScrollRevealText
              text="Nos Destinations Premium"
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorez nos programmes immobiliers dans les plus belles régions de Chypre
            </p>
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

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-hero" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/30"
            animate={{ 
              background: [
                "linear-gradient(45deg, hsl(var(--primary))/0.3, transparent, hsl(var(--accent))/0.3)",
                "linear-gradient(135deg, hsl(var(--accent))/0.3, transparent, hsl(var(--primary))/0.3)",
                "linear-gradient(45deg, hsl(var(--primary))/0.3, transparent, hsl(var(--accent))/0.3)"
              ] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white space-y-8"
          >
            <ScrollRevealText
              text="Programme sur Mesure ?"
              className="text-4xl md:text-5xl font-bold mb-4"
            />
            <motion.p 
              className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Notre équipe d'experts peut vous aider à identifier le programme immobilier 
              parfait selon vos critères d'investissement spécifiques.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center pt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all group"
              >
                <Target className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Recherche Ciblée
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold transition-all group"
              >
                <Trophy className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Conseil VIP
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;