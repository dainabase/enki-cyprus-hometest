import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Slider from 'react-slick';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { 
  MapPin, ArrowLeft, Bed, Bath, Square, Phone, Mail, Share2, Heart,
  ChevronLeft, ChevronRight, Image as ImageIcon, Map, Play, ZoomIn, ZoomOut,
  RotateCcw, Eye, Calendar, Trophy, Star, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Property } from '@/lib/supabase';
import { useSupabaseProperty } from '@/hooks/useSupabaseProperties';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GoogleMapsProvider } from '@/contexts/GoogleMapsContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { trackPageView, trackCustomEvent } from '@/lib/analytics';
import ZoomablePlans from '@/components/ui/ZoomablePlans';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const MiniMap = lazy(() => import('@/components/MiniMap'));

interface Unit {
  type: 'appart' | 'villa';
  status: 'available' | 'sold';
  price: string;
  details: string;
  surface?: string;
  bedrooms?: number;
  bathrooms?: number;
}

// Configuration pour react-slick
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
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

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { property, loading, error } = useSupabaseProperty(id);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ url: string; title: string } | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  // Mock units data (in real app would come from DB)
  const mockUnits: Unit[] = [
    {
      type: 'appart',
      status: 'available',
      price: '€450,000',
      details: 'Appartement 3 chambres avec vue mer',
      surface: '120m²',
      bedrooms: 3,
      bathrooms: 2
    },
    {
      type: 'appart', 
      status: 'sold',
      price: '€420,000',
      details: 'Appartement 2 chambres, étage élevé',
      surface: '95m²',
      bedrooms: 2,
      bathrooms: 2
    },
    {
      type: 'villa',
      status: 'available', 
      price: '€750,000',
      details: 'Villa individuelle avec piscine privée',
      surface: '200m²',
      bedrooms: 4,
      bathrooms: 3
    },
    {
      type: 'appart',
      status: 'available',
      price: '€380,000', 
      details: 'Studio premium avec terrasse',
      surface: '65m²',
      bedrooms: 1,
      bathrooms: 1
    }
  ];

  useEffect(() => {
    if (property) {
      trackPageView(`/project/${id}`, `${property.title} - Détails Projet ENKI-REALTY`);
      trackCustomEvent('project_viewed', { 
        project_id: id,
        project_title: property.title,
        project_type: property.type,
        project_price: property.price
      });
    }
  }, [property, id]);

  // Check if property is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !id) return;
      
      try {
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('project_id', id)
          .single();
        
        setIsLiked(!!data);
      } catch (error) {
        // Property not in favorites, which is fine
      }
    };

    checkFavoriteStatus();
  }, [user, id]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des favoris",
        action: (
          <Button size="sm" onClick={() => navigate('/login')}>
            Se connecter
          </Button>
        )
      });
      return;
    }

    if (!id || isCheckingFavorite) return;

    try {
      setIsCheckingFavorite(true);

      if (isLiked) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user!.id)
          .eq('project_id', id);

        if (error) throw error;

        setIsLiked(false);
        toast({
          title: "Favori supprimé",
          description: "La propriété a été retirée de vos favoris"
        });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user!.id,
            project_id: id
          });

        if (error) throw error;

        setIsLiked(true);
        toast({
          title: "Favori ajouté",
          description: "La propriété a été ajoutée à vos favoris"
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le favori"
      });
    } finally {
      setIsCheckingFavorite(false);
    }
  };

  const handleUnitClick = (unit: Unit) => {
    if (unit.status === 'sold') return;
    
    setSelectedUnit(unit);
    trackCustomEvent('unit_viewed', {
      project_id: id,
      unit_type: unit.type,
      unit_price: unit.price,
      unit_status: unit.status
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <motion.div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-muted-foreground">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-foreground mb-4">Propriété non trouvée</h1>
          <p className="text-muted-foreground mb-6">Cette propriété n'existe pas ou a été supprimée.</p>
          <Button onClick={() => navigate('/search')} className="btn-premium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la recherche
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <GoogleMapsProvider>
      <div className="min-h-screen bg-muted/30">
        {/* Hero Section avec Parallax */}
        <section className="relative h-[70vh] overflow-hidden">
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0"
          >
            <img
              src={property.photos?.[0] || `https://picsum.photos/1200x600?random=${property.id}`}
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
                className="bg-white bg-opacity-90 hover:bg-opacity-100 border-0 text-foreground"
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
                onClick={toggleFavorite}
                disabled={isCheckingFavorite}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 border-0"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white bg-opacity-90 hover:bg-opacity-100 border-0 text-foreground"
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
              <Badge className="mb-4 bg-primary text-white" variant="secondary">
                {property.type}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {property.title}
              </h1>
              
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{typeof property.location === 'string' ? property.location : (property.location as any)?.city || property.location}</span>
              </div>
              
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground">
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
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Description principale */}
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-foreground mb-6">À propos de cette propriété</h2>
                    <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                      {(property as any).detailed_description || property.description}
                    </p>
                    
                    {/* Caractéristiques détaillées */}
                    <h3 className="text-xl font-semibold text-foreground mb-4">Caractéristiques</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {((property as any).detailed_features || property.features || []).map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Informations clés */}
                  <div className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Informations clés</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Square className="w-5 h-5 text-primary" />
                            <span className="text-muted-foreground">Type</span>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {property.type}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span className="text-muted-foreground">Localisation</span>
                          </div>
                          <span className="font-medium text-sm">{typeof property.location === 'string' ? property.location : (property.location as any)?.city || property.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact rapide */}
                    <div className="bg-primary/10 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Contact rapide</h3>
                      <div className="space-y-3">
                        <Button className="w-full btn-premium" asChild>
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
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className="p-8 pb-4">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Galerie Photos</h2>
                  <p className="text-muted-foreground">Découvrez cette propriété en images</p>
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
                      color: hsl(var(--primary));
                    }
                  `}</style>
                  
                  <Slider {...sliderSettings}>
                    {(property.photos || []).map((photo, index) => (
                      <div key={index} className="relative">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
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

          {/* Section Plans avec zoom */}
          {property.plans && property.plans.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Plans et Layouts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {property.plans.map((plan, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedPlan({ 
                          url: plan, 
                          title: `Plan ${index + 1} - ${property.title}` 
                        })}
                      >
                        <div className="relative overflow-hidden rounded-lg border border-border">
                          <img
                            src={plan}
                            alt={`Plan ${index + 1}`}
                            className="w-full h-48 object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 text-center">
                          Plan {index + 1}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {/* Visite Virtuelle Matterport */}
          {(property as any).virtual_tour && (
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">Visite Virtuelle</h2>
                      <p className="text-muted-foreground">Explorez cette propriété en immersion 360°</p>
                    </div>
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div className="relative rounded-lg overflow-hidden">
                    <iframe
                      src={(property as any).virtual_tour}
                      className="w-full h-96"
                      allowFullScreen
                      title="Visite virtuelle"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {/* Section Units avec grille */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Unités Disponibles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mockUnits.map((unit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        scale: unit.status === 'sold' ? 1 : 1.05,
                        transition: { type: "spring", stiffness: 300 }
                      }}
                      className={`relative border border-border rounded-lg p-4 transition-all duration-300 ${
                        unit.status === 'sold' 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'cursor-pointer hover:shadow-lg'
                      }`}
                      onClick={() => handleUnitClick(unit)}
                    >
                      {unit.status === 'sold' && (
                        <div className="absolute inset-0 bg-red-500/10 rounded-lg flex items-center justify-center">
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Vendu
                          </div>
                        </div>
                      )}
                      
                      <div className="mb-3">
                        <Badge variant={unit.type === 'villa' ? 'default' : 'secondary'} className="mb-2">
                          {unit.type === 'villa' ? 'Villa' : 'Appartement'}
                        </Badge>
                        <Badge 
                          variant={unit.status === 'available' ? 'default' : 'destructive'}
                          className="ml-2"
                        >
                          {unit.status === 'available' ? 'Disponible' : 'Vendu'}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-lg text-primary mb-2">{unit.price}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{unit.details}</p>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Surface:</span>
                          <span className="font-medium">{unit.surface}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Chambres:</span>
                          <span className="font-medium">{unit.bedrooms}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">SDB:</span>
                          <span className="font-medium">{unit.bathrooms}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Mini Carte */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Localisation</h2>
                <div className="rounded-lg overflow-hidden">
                  <ErrorBoundary>
                    <Suspense fallback={
                      <div className="h-64 bg-muted flex items-center justify-center">
                        <div className="text-center">
                          <Map className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <p className="text-muted-foreground">Chargement de la carte...</p>
                        </div>
                      </div>
                    }>
                      <MiniMap 
                        property={property}
                        
                      />
                    </Suspense>
                  </ErrorBoundary>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* Plan Modal avec zoom */}
        <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
          <DialogContent className="max-w-6xl max-h-[95vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>{selectedPlan?.title}</DialogTitle>
              <DialogDescription>
                Utilisez les contrôles pour zoomer et explorer le plan en détail
              </DialogDescription>
            </DialogHeader>
            
            {selectedPlan && (
              <div className="h-[70vh] bg-muted/50">
                <TransformWrapper
                  initialScale={1}
                  minScale={0.5}
                  maxScale={3}
                  wheel={{ step: 0.1 }}
                  pinch={{ step: 5 }}
                  doubleClick={{ step: 0.7 }}
                >
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      {/* Contrôles de zoom */}
                      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => zoomIn()}
                          className="bg-white"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => zoomOut()}
                          className="bg-white"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resetTransform()}
                          className="bg-white"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <TransformComponent wrapperClass="w-full h-full">
                        <img
                          src={selectedPlan.url}
                          alt={selectedPlan.title}
                          className="w-full h-full object-contain"
                        />
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Unit Details Modal */}
        <Dialog open={!!selectedUnit} onOpenChange={() => setSelectedUnit(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedUnit?.type === 'villa' ? 'Villa' : 'Appartement'} - Détails
              </DialogTitle>
              <DialogDescription>
                Informations complètes sur cette unité
              </DialogDescription>
            </DialogHeader>
            
            {selectedUnit && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {selectedUnit.price}
                  </div>
                  <Badge variant={selectedUnit.status === 'available' ? 'default' : 'destructive'}>
                    {selectedUnit.status === 'available' ? 'Disponible' : 'Vendu'}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Surface:</span>
                    <span className="font-medium">{selectedUnit.surface}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Chambres:</span>
                    <span className="font-medium">{selectedUnit.bedrooms}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Salles de bain:</span>
                    <span className="font-medium">{selectedUnit.bathrooms}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {selectedUnit.details}
                </p>
                
                <div className="flex gap-3">
                  <Button className="flex-1 btn-premium" asChild>
                    <Link to="/contact">
                      <Phone className="w-4 h-4 mr-2" />
                      Contacter
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/contact">
                      <Calendar className="w-4 h-4 mr-2" />
                      Visiter
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </GoogleMapsProvider>
  );
};

export default ProjectDetail;