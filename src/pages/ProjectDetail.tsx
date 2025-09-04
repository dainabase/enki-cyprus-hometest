import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Text } from '@react-three/drei';
import Slider from 'react-slick';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Atropos from 'atropos/react';
import 'atropos/css';
import { 
  MapPin, ArrowLeft, Bed, Bath, Square, Phone, Mail, Share2, Heart,
  ChevronLeft, ChevronRight, Image as ImageIcon, Play, ZoomIn, ZoomOut,
  RotateCcw, Eye, Calendar, Trophy, Star, ChevronDown, Building,
  Wifi, Car, Dumbbell, Shield, Waves, TreePine, Camera, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

gsap.registerPlugin(ScrollTrigger);

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

// 3D Unit Visualization Component
const Unit3DVisualization = ({ unit, isVisible }: { unit: Unit; isVisible: boolean }) => {
  return (
    <div className={`h-64 w-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {isVisible && (
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
              <MeshDistortMaterial
                color={unit.status === 'available' ? '#22C55E' : '#EF4444'}
                attach="material"
                distort={0.2}
                speed={2}
                roughness={0.4}
              />
            </Sphere>
          </Float>
          <Text
            position={[0, -2.5, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {unit.type.toUpperCase()}
          </Text>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
        </Canvas>
      )}
    </div>
  );
};

// Advanced slider configuration
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: true,
  prevArrow: <CustomPrevArrow />,
  nextArrow: <CustomNextArrow />,
  fade: true,
  cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
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

function CustomPrevArrow(props: any) {
  const { onClick } = props;
  return (
    <motion.button
      whileHover={{ scale: 1.1, x: -5 }}
      whileTap={{ scale: 0.9 }}
      className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-4 shadow-2xl transition-all backdrop-blur-sm border border-white/20"
      onClick={onClick}
    >
      <ChevronLeft className="w-8 h-8 text-gray-800" />
    </motion.button>
  );
}

function CustomNextArrow(props: any) {
  const { onClick } = props;
  return (
    <motion.button
      whileHover={{ scale: 1.1, x: 5 }}
      whileTap={{ scale: 0.9 }}
      className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-4 shadow-2xl transition-all backdrop-blur-sm border border-white/20"
      onClick={onClick}
    >
      <ChevronRight className="w-8 h-8 text-gray-800" />
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
  const [activeTab, setActiveTab] = useState('overview');
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.1]);

  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const unitsRef = useRef<HTMLDivElement>(null);

  // Mock units data with enhanced properties
  const mockUnits: Unit[] = [
    {
      type: 'appart',
      status: 'available',
      price: '€450,000',
      details: 'Appartement 3 chambres avec vue mer panoramique',
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
      details: 'Villa individuelle avec piscine privée et jardin',
      surface: '200m²',
      bedrooms: 4,
      bathrooms: 3
    },
    {
      type: 'appart',
      status: 'available',
      price: '€380,000', 
      details: 'Studio premium avec terrasse et vue mer',
      surface: '65m²',
      bedrooms: 1,
      bathrooms: 1
    }
  ];

  const propertyFeatures = [
    { icon: Wifi, label: 'WiFi Haut Débit', available: true },
    { icon: Car, label: 'Parking Privé', available: true },
    { icon: Dumbbell, label: 'Salle de Sport', available: true },
    { icon: Shield, label: 'Sécurité 24/7', available: true },
    { icon: Waves, label: 'Piscine', available: true },
    { icon: TreePine, label: 'Jardin Paysager', available: false },
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

      // Advanced GSAP Animations
      const tl = gsap.timeline();
      
      // Animated entrance for content sections
      tl.fromTo(headerRef.current, 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo('.detail-card', 
        { y: 60, opacity: 0, scale: 0.9 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: '.details-container',
            start: 'top 80%',
            end: 'bottom 20%',
          }
        }
      )
      .fromTo('.unit-card', 
        { 
          rotationY: 90, 
          opacity: 0, 
          scale: 0.8 
        },
        { 
          rotationY: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: unitsRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-2xl font-bold text-foreground mb-2">Chargement des détails...</h2>
          <p className="text-muted-foreground">Préparation de votre visite virtuelle</p>
        </motion.div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-6"
          >
            🏠
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Propriété non trouvée</h1>
          <p className="text-muted-foreground mb-8">Cette propriété n'existe pas ou a été supprimée.</p>
          <Button onClick={() => navigate('/search')} size="lg" className="bg-gradient-to-r from-primary to-blue-600 text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à la recherche
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <GoogleMapsProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Advanced Multi-Layer Parallax Hero */}
        <section className="relative h-screen overflow-hidden">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="absolute inset-0"
          >
            <img
              src={property.photos?.[0] || `https://picsum.photos/1920x1080?random=${property.id}`}
              alt={property.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </motion.div>

          {/* 3D Floating Elements */}
          <div className="absolute inset-0 opacity-30">
            <Canvas camera={{ position: [0, 0, 8] }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} />
              <Float speed={1.5} rotationIntensity={2} floatIntensity={3}>
                <Sphere args={[0.3, 16, 16]} position={[-6, 2, -2]}>
                  <MeshDistortMaterial color="#60A5FA" distort={0.3} speed={1.5} />
                </Sphere>
              </Float>
              <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <Sphere args={[0.2, 16, 16]} position={[6, -2, -3]}>
                  <MeshDistortMaterial color="#34D399" distort={0.4} speed={2} />
                </Sphere>
              </Float>
            </Canvas>
          </div>

          {/* Navigation et actions */}
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate('/search')}
                className="bg-white/20 backdrop-blur-xl hover:bg-white/30 border-white/30 text-white shadow-2xl"
                size="lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex gap-4"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleFavorite}
                  disabled={isCheckingFavorite}
                  className="bg-white/20 backdrop-blur-xl hover:bg-white/30 border-white/30 shadow-2xl"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/20 backdrop-blur-xl hover:bg-white/30 border-white/30 text-white shadow-2xl"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Content */}
          <motion.div
            ref={headerRef}
            className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mb-6"
              >
                <Badge className="px-6 py-3 bg-primary/90 backdrop-blur-sm text-white text-lg font-semibold border border-white/20">
                  {property.type}
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {property.title}
                </span>
              </motion.h1>
              
              <motion.div 
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <MapPin className="w-8 h-8 text-blue-300" />
                <span className="text-2xl text-blue-100">
                  {typeof property.location === 'string' 
                    ? property.location 
                    : (property.location as any)?.city || property.location}
                </span>
              </motion.div>
              
              <motion.div 
                className="text-4xl md:text-5xl font-bold text-yellow-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.6, type: "spring" }}
              >
                {property.price}
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.div 
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center backdrop-blur-sm"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-1 h-2 bg-white rounded-full mt-2"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 details-container">
          
          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-muted/50 backdrop-blur-sm rounded-2xl p-1">
                <TabsTrigger value="overview" className="rounded-xl">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="gallery" className="rounded-xl">Galerie</TabsTrigger>
                <TabsTrigger value="plans" className="rounded-xl">Plans</TabsTrigger>
                <TabsTrigger value="units" className="rounded-xl">Unités</TabsTrigger>
                <TabsTrigger value="location" className="rounded-xl">Localisation</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Description */}
                  <div className="lg:col-span-2">
                    <Atropos className="detail-card">
                      <Card className="shadow-2xl bg-gradient-to-br from-background to-muted/30 backdrop-blur-xl border border-white/20">
                        <CardHeader>
                          <CardTitle className="text-3xl font-bold">À propos de cette propriété</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <p className="text-muted-foreground leading-relaxed text-lg">
                            {(property as any).detailed_description || property.description}
                          </p>
                          
                          <div>
                            <h3 className="text-xl font-semibold mb-4">Caractéristiques Premium</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {((property as any).detailed_features || property.features || []).map((feature: string, index: number) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 backdrop-blur-sm"
                                >
                                  <div className="w-3 h-3 bg-gradient-to-r from-primary to-blue-600 rounded-full flex-shrink-0" />
                                  <span>{feature}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xl font-semibold mb-4">Services & Équipements</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {propertyFeatures.map((feature, index) => (
                                <motion.div
                                  key={index}
                                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                                    feature.available 
                                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                                      : 'bg-gray-100 dark:bg-gray-800/20 text-gray-500'
                                  }`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: index * 0.1 }}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <feature.icon className="w-5 h-5" />
                                  <span className="text-sm font-medium">{feature.label}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Atropos>
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-6">
                    <Atropos className="detail-card">
                      <Card className="shadow-xl bg-gradient-to-br from-background to-muted/20">
                        <CardHeader>
                          <CardTitle>Informations Clés</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              <Building className="w-5 h-5 text-primary" />
                              <span>Type</span>
                            </div>
                            <Badge variant="outline" className="capitalize bg-primary/10">
                              {property.type}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-primary" />
                              <span>Localisation</span>
                            </div>
                            <span className="font-medium text-sm">
                              {typeof property.location === 'string' 
                                ? property.location 
                                : (property.location as any)?.city || property.location}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Atropos>

                    <Atropos className="detail-card">
                      <Card className="shadow-xl bg-gradient-to-br from-primary/10 to-blue-600/10">
                        <CardHeader>
                          <CardTitle>Contact Premium</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button className="w-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg" size="lg" asChild>
                              <Link to="/contact">
                                <Phone className="w-5 h-5 mr-2" />
                                Appeler maintenant
                              </Link>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" className="w-full" size="lg" asChild>
                              <Link to="/contact">
                                <Mail className="w-5 h-5 mr-2" />
                                Envoyer un email
                              </Link>
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </Atropos>
                  </div>
                </div>
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery" className="mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="overflow-hidden shadow-2xl detail-card">
                    <CardHeader>
                      <CardTitle className="text-2xl">Galerie Photos Premium</CardTitle>
                      <p className="text-muted-foreground">Découvrez cette propriété d'exception en images haute définition</p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative h-[70vh]">
                        <style>{`
                          .slick-dots {
                            bottom: 30px;
                          }
                          .slick-dots li button:before {
                            color: white;
                            font-size: 14px;
                            opacity: 0.7;
                          }
                          .slick-dots li.slick-active button:before {
                            color: hsl(var(--primary));
                            opacity: 1;
                          }
                        `}</style>
                        
                        <Slider {...sliderSettings}>
                          {(property.photos && property.photos.length > 0 ? property.photos : [
                            `https://picsum.photos/1200x800?random=${property.id}-1`,
                            `https://picsum.photos/1200x800?random=${property.id}-2`,
                            `https://picsum.photos/1200x800?random=${property.id}-3`
                          ]).map((photo, index) => (
                            <div key={index} className="relative h-[70vh]">
                              <motion.img
                                src={photo}
                                alt={`${property.title} - Photo ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1.5 }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                              
                              {/* Photo Counter */}
                              <motion.div 
                                className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                              >
                                {index + 1} / {property.photos?.length || 3}
                              </motion.div>
                            </div>
                          ))}
                        </Slider>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Plans Tab */}
              <TabsContent value="plans" className="mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="detail-card"
                >
                  <ZoomablePlans 
                    plans={[
                      {
                        url: `https://picsum.photos/1200x900?random=${property.id}-plan1`,
                        title: "Plan d'étage principal",
                        type: 'floor_plan'
                      },
                      {
                        url: `https://picsum.photos/1200x900?random=${property.id}-plan2`,
                        title: "Plan d'aménagement paysager",
                        type: 'site_plan'
                      },
                      {
                        url: `https://picsum.photos/1200x900?random=${property.id}-plan3`,
                        title: "Vue 3D architecturale",
                        type: '3d_view'
                      }
                    ]}
                  />
                </motion.div>
              </TabsContent>

              {/* Units Tab */}
              <TabsContent value="units" className="mt-8">
                <motion.div
                  ref={unitsRef}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="shadow-2xl detail-card">
                    <CardHeader>
                      <CardTitle className="text-2xl">Unités Disponibles</CardTitle>
                      <p className="text-muted-foreground">Explorez les différents types d'unités avec visualisation 3D</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockUnits.map((unit, index) => (
                          <Atropos key={index} className="unit-card">
                            <motion.div
                              onClick={() => handleUnitClick(unit)}
                              className={`relative cursor-pointer transition-all duration-300 ${
                                unit.status === 'sold' 
                                  ? 'opacity-60 cursor-not-allowed' 
                                  : 'hover:shadow-xl hover:scale-[1.02]'
                              }`}
                              whileHover={unit.status === 'available' ? { y: -5 } : {}}
                              data-atropos-offset="5"
                            >
                              <Card className={`overflow-hidden border-2 transition-all ${
                                unit.status === 'available' 
                                  ? 'border-green-200 hover:border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' 
                                  : 'border-red-200 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20'
                              }`}>
                                {/* 3D Visualization */}
                                <div className="relative h-48 overflow-hidden" data-atropos-offset="10">
                                  <Unit3DVisualization unit={unit} isVisible={true} />
                                  
                                  {unit.status === 'sold' && (
                                    <motion.div 
                                      className="absolute inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.5 }}
                                    >
                                      <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                                        VENDU
                                      </div>
                                    </motion.div>
                                  )}
                                </div>

                                <CardContent className="p-6" data-atropos-offset="3">
                                  <div className="flex items-center justify-between mb-4">
                                    <Badge 
                                      variant={unit.status === 'available' ? 'default' : 'destructive'}
                                      className="text-xs font-semibold"
                                    >
                                      {unit.status === 'available' ? 'DISPONIBLE' : 'VENDU'}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                      {unit.type}
                                    </span>
                                  </div>
                                  
                                  <h3 className={`text-xl font-bold mb-2 ${
                                    unit.status === 'sold' ? 'text-muted-foreground' : 'text-foreground'
                                  }`}>
                                    {unit.price}
                                  </h3>
                                  
                                  <p className={`text-sm mb-4 ${
                                    unit.status === 'sold' ? 'text-muted-foreground' : 'text-muted-foreground'
                                  }`}>
                                    {unit.details}
                                  </p>
                                  
                                  {unit.status === 'available' && (
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Square className="w-3 h-3" />
                                        {unit.surface}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Bed className="w-3 h-3" />
                                        {unit.bedrooms}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Bath className="w-3 h-3" />
                                        {unit.bathrooms}
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Atropos>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Location Tab */}
              <TabsContent value="location" className="mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  {/* Virtual Tour */}
                  {(property as any).virtual_tour && (
                    <Card className="shadow-2xl detail-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Play className="w-6 h-6 text-primary" />
                          Visite Virtuelle 360°
                        </CardTitle>
                        <p className="text-muted-foreground">Explorez la propriété depuis chez vous</p>
                      </CardHeader>
                      <CardContent>
                        <div className="relative rounded-2xl overflow-hidden">
                          <iframe
                            src={(property as any).virtual_tour}
                            className="w-full h-96"
                            allowFullScreen
                            title="Visite virtuelle"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Map */}
                  <Card className="shadow-2xl detail-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-primary" />
                        Localisation Premium
                      </CardTitle>
                      <p className="text-muted-foreground">Découvrez l'environnement exceptionnel</p>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-2xl overflow-hidden">
                        <ErrorBoundary>
                          <Suspense fallback={
                            <div className="h-64 bg-muted flex items-center justify-center">
                              <div className="text-center">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"
                                />
                                <p className="text-muted-foreground">Chargement de la carte...</p>
                              </div>
                            </div>
                          }>
                            <MiniMap property={property} />
                          </Suspense>
                        </ErrorBoundary>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Unit Details Modal */}
        <AnimatePresence>
          {selectedUnit && (
            <Dialog open={!!selectedUnit} onOpenChange={() => setSelectedUnit(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Détails de l'Unité</DialogTitle>
                  <DialogDescription>
                    {selectedUnit.type.charAt(0).toUpperCase() + selectedUnit.type.slice(1)} - {selectedUnit.surface}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Unit3DVisualization unit={selectedUnit} isVisible={true} />
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Prix</h3>
                      <p className="text-3xl font-bold text-primary">{selectedUnit.price}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">{selectedUnit.details}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-muted rounded-lg">
                        <Square className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm text-muted-foreground">Surface</p>
                        <p className="font-semibold">{selectedUnit.surface}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <Bed className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm text-muted-foreground">Chambres</p>
                        <p className="font-semibold">{selectedUnit.bedrooms}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <Bath className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm text-muted-foreground">Salles de bain</p>
                        <p className="font-semibold">{selectedUnit.bathrooms}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button className="flex-1 bg-gradient-to-r from-primary to-blue-600">
                        <Phone className="w-4 h-4 mr-2" />
                        Contacter
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Brochure
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </GoogleMapsProvider>
  );
};

export default ProjectDetail;