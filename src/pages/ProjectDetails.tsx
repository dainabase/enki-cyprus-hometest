import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Slider from 'react-slick';
import { 
  MapPin, 
  ArrowLeft, 
  Bed, 
  Bath, 
  Square, 
  Phone, 
  Mail,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Map,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/lib/supabase';
import { useSupabaseProperty } from '@/hooks/useSupabaseProperties';
import { GoogleMapsProvider } from '@/contexts/GoogleMapsContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import FloorPlanModal from '@/components/FloorPlanModal';
import VirtualTourViewer from '@/components/VirtualTourViewer';

// Lazy loading pour la mini carte
const MiniMap = lazy(() => import('@/components/MiniMap'));

// Configuration pour react-slick
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: true,
  prevArrow: <CustomPrevArrow />,
  nextArrow: <CustomNextArrow />,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        dots: false,
        arrows: false
      }
    }
  ]
};

// Flèches personnalisées pour le slider
function CustomPrevArrow(props: any) {
  const { onClick } = props;
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all"
      onClick={onClick}
    >
      <ChevronLeft className="w-6 h-6 text-gray-800" />
    </motion.button>
  );
}

function CustomNextArrow(props: any) {
  const { onClick } = props;
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all"
      onClick={onClick}
    >
      <ChevronRight className="w-6 h-6 text-gray-800" />
    </motion.button>
  );
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, loading, error } = useSupabaseProperty(id);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ url: string; title: string } | null>(null);
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Propriété non trouvée</h1>
          <p className="text-gray-600 mb-6">Cette propriété n'existe pas ou a été supprimée.</p>
          <Button onClick={() => navigate('/search')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la recherche
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-orange-100 text-orange-800';
      case 'sold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'reserved': return 'Réservé';
      case 'sold': return 'Vendu';
      default: return status;
    }
  };

  return (
    <GoogleMapsProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section avec Parallax */}
        <section className="relative h-[70vh] overflow-hidden">
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0"
          >
            <img
              src={`https://placehold.co/1200x600/4A90E2/ffffff?text=${encodeURIComponent(property.title.substring(0, 20))}`}
              alt={property.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </motion.div>

          {/* Navigation et actions */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate('/search')}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 border-0 text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 border-0"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white bg-opacity-90 hover:bg-opacity-100 border-0 text-gray-800"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Contenu Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white"
          >
            <div className="max-w-4xl">
              <Badge className="mb-4 bg-blue-600 text-white" variant="secondary">
                {property.type}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {property.title}
              </h1>
              
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{property.location}</span>
              </div>
              
              <div className="text-3xl md:text-4xl font-bold text-blue-400">
                {property.price}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Contenu Principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Section Description */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Description principale */}
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">À propos de cette propriété</h2>
                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                      {property.detailedDescription}
                    </p>
                    
                    {/* Caractéristiques détaillées */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Caractéristiques</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.detailedFeatures.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Informations clés */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations clés</h3>
                      <div className="space-y-4">
                        {property.bedrooms && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Bed className="w-5 h-5 text-blue-600" />
                              <span className="text-gray-700">Chambres</span>
                            </div>
                            <span className="font-medium">{property.bedrooms}</span>
                          </div>
                        )}
                        
                        {property.bathrooms && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Bath className="w-5 h-5 text-blue-600" />
                              <span className="text-gray-700">Salles de bain</span>
                            </div>
                            <span className="font-medium">{property.bathrooms}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Square className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700">Surface</span>
                          </div>
                          <span className="font-medium">{property.area}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700">Type</span>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {property.type}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Contact rapide */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact rapide</h3>
                      <div className="space-y-3">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                          <Link to="/contact">
                            <Phone className="w-4 h-4 mr-2" />
                            Appeler maintenant
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/contact">
                            <Mail className="w-4 h-4 mr-2" />
                            Envoyer un email
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Galerie Photos */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-8 pb-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Galerie Photos</h2>
                  <p className="text-gray-600">Découvrez cette propriété en images</p>
                </div>
                
                <div className="relative">
                  <style>{`
                    .slick-dots {
                      bottom: 20px;
                    }
                    .slick-dots li button:before {
                      color: white;
                      font-size: 12px;
                    }
                    .slick-dots li.slick-active button:before {
                      color: #3B82F6;
                    }
                  `}</style>
                  
                  <Slider {...sliderSettings}>
                    {property.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="overflow-hidden"
                        >
                          <img
                            src={photo}
                            alt={`${property.title} - Photo ${index + 1}`}
                            className="w-full h-[500px] object-cover cursor-pointer"
                            loading="lazy"
                          />
                        </motion.div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Section Plans */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Map className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Plans de la propriété</h2>
                </div>
                <p className="text-gray-600 mb-8">
                  Découvrez la disposition détaillée de cette propriété avec nos plans interactifs.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {property.plans.map((planUrl, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer group"
                      onClick={() => setSelectedPlan({ 
                        url: planUrl, 
                        title: `Plan ${index + 1} - ${property.title}` 
                      })}
                    >
                      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="relative">
                          <img
                            src={planUrl}
                            alt={`Plan ${index + 1} - ${property.title}`}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              whileHover={{ scale: 1 }}
                              className="bg-white bg-opacity-90 rounded-full p-3"
                            >
                              <ImageIcon className="w-6 h-6 text-blue-600" />
                            </motion.div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            Plan {index + 1}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Cliquez pour agrandir et explorer en détail
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                {/* Instructions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 p-4 bg-blue-50 rounded-lg"
                >
                  <p className="text-sm text-blue-800 text-center">
                    💡 Cliquez sur un plan pour l'ouvrir en mode plein écran avec zoom interactif
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Section Visite Virtuelle */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Play className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Visite Virtuelle</h2>
            </div>
            
            <VirtualTourViewer 
              tourUrl={property.virtualTour}
              propertyTitle={property.title}
            />
          </motion.section>

          {/* Mini Carte */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Localisation</h2>
                <div className="h-96 rounded-lg overflow-hidden">
                  <ErrorBoundary>
                    <Suspense fallback={
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-gray-600">Chargement de la carte...</p>
                        </div>
                      </div>
                    }>
                      <MiniMap property={property} />
                    </Suspense>
                  </ErrorBoundary>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
              <CardContent className="p-12 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold mb-4">Intéressé par cette propriété ?</h2>
                  <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                    Contactez nos experts pour organiser une visite ou obtenir plus d'informations 
                    sur cette propriété exceptionnelle.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Button 
                        size="lg" 
                        className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                        asChild
                      >
                        <Link to="/contact">
                          <Phone className="w-5 h-5 mr-2" />
                          Contactez-nous
                        </Link>
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Demander des infos
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* Modal Plans */}
        <FloorPlanModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          planUrl={selectedPlan?.url || ''}
          planTitle={selectedPlan?.title || ''}
        />

        {/* Footer de retour */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white border-t border-gray-200 py-6"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <Link
                to="/search"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour à la recherche</span>
              </Link>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Réf: {property.id}</span>
                <span>•</span>
                <span>ENKI-REALTY</span>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </GoogleMapsProvider>
  );
};

export default ProjectDetails;