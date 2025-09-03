import { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import PropertyCard from '@/components/ui/PropertyCard';
import GoogleMapComponent from '@/components/GoogleMap';
import PropertyModal from '@/components/PropertyModal';
import { Button } from '@/components/ui/button';
import { mockProperties, Property } from '@/data/mockData';
import { TrendingUp, Shield, Award, Users } from 'lucide-react';

const Home = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const featuredProperties = mockProperties.slice(0, 3);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const features = [
    {
      icon: Shield,
      title: 'Sécurité & Confiance',
      description: 'Transactions sécurisées avec nos partenaires certifiés et notre expertise locale reconnue.'
    },
    {
      icon: Award,
      title: 'Propriétés Premium',
      description: 'Sélection exclusive de biens d\'exception dans les meilleures zones de Chypre.'
    },
    {
      icon: Users,
      title: 'Accompagnement Expert',
      description: 'Équipe multilingue dédiée pour vous guider dans votre projet immobilier.'
    },
    {
      icon: TrendingUp,
      title: 'Investissement Rentable',
      description: 'Analyses de marché et conseils personnalisés pour optimiser votre investissement.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi choisir ENKI-REALTY ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Notre expertise locale et notre réseau de partenaires premium vous garantissent 
              un service d'excellence pour tous vos projets immobiliers à Chypre.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-premium rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explorez nos propriétés sur la carte
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez l'emplacement exact de nos propriétés à travers Chypre 
              et trouvez celle qui correspond parfaitement à vos attentes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl overflow-hidden shadow-lg"
          >
            <GoogleMapComponent 
              properties={mockProperties}
              onPropertySelect={handlePropertySelect}
              height="600px"
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Propriétés en vedette
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre sélection de propriétés d'exception, 
              soigneusement choisies pour leur qualité et leur emplacement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property, index) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                index={index}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Button size="lg" className="btn-premium">
              Voir tous nos projets
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Prêt à investir à Chypre ?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Contactez nos experts pour une consultation personnalisée 
              et découvrez les meilleures opportunités d'investissement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
              >
                Consultation gratuite
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold"
              >
                Télécharger la brochure
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Property Modal */}
      <PropertyModal 
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Home;