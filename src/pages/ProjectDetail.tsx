import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { trackPageView } from '@/lib/analytics';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import { buildGalleryFromProject, getHeroImage, getGalleryUrls } from '@/utils/gallery';
import { 
  MapPin, 
  ArrowRight, 
  ExternalLink, 
  Calendar, 
  Home, 
  Euro, 
  Users,
  Car,
  Download,
  Heart,
  Share2,
  Play,
  MessageCircle,
  Phone,
  Bed,
  Bath,
  Square
} from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const heroRef = useRef<HTMLElement>(null);
  const [isStickyCTAVisible, setIsStickyCTAVisible] = useState(false);
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_images(url, caption, is_primary, display_order)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { scrollY } = useScroll();
  const heroInView = useInView(heroRef, { once: true });

  // Sticky CTA visibility on scroll
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsStickyCTAVisible(latest > window.innerHeight * 0.3);
    });
    return () => unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    if (project) {
      trackPageView(`/project/${id}`, `Projet ${project.title} - ENKI-REALTY`);
    }
  }, [project, id]);

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center p-8">
              <h2 className="text-2xl font-medium text-destructive mb-4">
                Projet introuvable
              </h2>
              <p className="text-muted-foreground mb-6">
                Le projet demandé n'existe pas ou a été supprimé.
              </p>
              <Button asChild>
                <Link to="/projects">Retour aux projets</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Process gallery from project data
  const gallery = buildGalleryFromProject(project);
  const heroImage = getHeroImage(project);
  const galleryUrls = getGalleryUrls(project);

  // Location data
  const locationData = project.location as { ville?: string; adresse?: string; lat?: number; lng?: number };
  const fullAddress = [locationData?.adresse, locationData?.ville].filter(Boolean).join(', ');

  // Units data
  type Unit = {
    type?: string;
    price?: string | number;
    status?: string;
    image?: string;
    description?: string;
    surface?: string;
    rooms?: number;
  };
  
  const units: Unit[] = Array.isArray(project.units) ? (project.units as unknown as Unit[]) : [];

  // Room data for alternating cards
  const roomData = [
    {
      name: "Living Room",
      image: project.photos?.[0] || heroImage,
      description: "The living room is the heart of the home—a space designed for comfort, relaxation, & gathering.",
      specs: {
        size: project.built_area_m2 ? `${Math.round(project.built_area_m2 * 0.3)}` : "250",
        type: "Living Room",
        color: "White"
      }
    },
    {
      name: "Master Bedroom", 
      image: project.photos?.[1] || heroImage,
      description: "A sanctuary of comfort with panoramic views and luxury finishes throughout.",
      specs: {
        size: project.built_area_m2 ? `${Math.round(project.built_area_m2 * 0.2)}` : "180",
        type: "Bedroom",
        color: "Neutral"
      }
    },
    {
      name: "Kitchen",
      image: project.photos?.[2] || heroImage,
      description: "Modern culinary space with premium appliances and elegant design.",
      specs: {
        size: project.built_area_m2 ? `${Math.round(project.built_area_m2 * 0.15)}` : "120",
        type: "Kitchen",
        color: "Modern"
      }
    }
  ];

  return (
    <ErrorBoundary>
      <Layout>
        <SEOHead 
          title={`${project.title} | ENKI-REALTY - Investissement Immobilier Premium`}
          description={project.description || 'Découvrez ce projet immobilier premium à Chypre avec ENKI-REALTY.'}
          keywords={`projet immobilier ${project.title}, ${locationData?.ville || 'Chypre'}, investissement immobilier, résidence premium`}
          url={`https://enki-realty.com/project/${id}`}
          canonical={`https://enki-realty.com/project/${id}`}
          image={heroImage || '/og-image.jpg'}
        />
        
        <main className="bg-background min-h-screen">
          {/* 1. HERO SECTION - Design Premium OneArc */}
          <motion.section 
            ref={heroRef}
            className="relative h-screen overflow-hidden bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Video/Image Background */}
            <div className="absolute inset-0">
              {project.video_url ? (
                <video 
                  className="w-full h-full object-cover opacity-70"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={project.video_url} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={heroImage || 'https://picsum.photos/1920/1080'}
                  alt={`Hero image of ${project.title}`}
                  className="w-full h-full object-cover opacity-70"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            </div>
            
            {/* Content Grid */}
            <div className="relative z-10 h-full flex items-end pb-20">
              <div className="container mx-auto px-8">
                {/* Address Bar */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <p className="text-white/60 text-sm font-light tracking-wider uppercase">
                    {locationData?.ville || 'Chypre'}, {locationData?.adresse?.split(',')[0] || 'Premium Location'}
                  </p>
                </motion.div>
                
                {/* Title */}
                <motion.h1 
                  className="text-white font-bold text-7xl mb-8 max-w-4xl"
                  style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {project.title}
                </motion.h1>
                
                {/* Specs Grid - 3 colonnes */}
                <motion.div 
                  className="grid grid-cols-3 gap-x-12 max-w-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-white text-4xl font-light">
                      {project.built_area_m2 || '250'}
                    </p>
                    <p className="text-white/60 text-sm mt-1">Property size</p>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-white text-4xl font-light">
                      {(project as any).bedrooms || '3'}+
                    </p>
                    <p className="text-white/60 text-sm mt-1">Beds</p>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-white text-4xl font-light">
                      {(project as any).bathrooms || '2'}+
                    </p>
                    <p className="text-white/60 text-sm mt-1">Bath tab</p>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <div className="w-[1px] h-16 bg-white/30 animate-pulse" />
            </div>
          </motion.section>

          {/* 2. MARQUEE TICKER - Texte Défilant Infini */}
          <div className="bg-[#F7F3F0] py-16 overflow-hidden">
            <div className="marquee-container">
              <div className="marquee-content animate-marquee flex gap-x-20 text-6xl font-light text-black">
                <span>Modern living upgrades</span>
                <span className="text-gray-400">•</span>
                <span>Smart home innovations</span>
                <span className="text-gray-400">•</span>
                <span>Intelligent living solutions</span>
                <span className="text-gray-400">•</span>
                <span>Modern living upgrades</span>
                <span className="text-gray-400">•</span>
                <span>Smart home innovations</span>
                <span className="text-gray-400">•</span>
                <span>Intelligent living solutions</span>
                <span className="text-gray-400">•</span>
              </div>
            </div>
          </div>

          {/* 3. OVERVIEW SECTION - Split Design Moderne */}
          <section className="py-32 bg-white">
            <div className="container mx-auto px-8">
              {/* Section Title */}
              <motion.div 
                className="mb-20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                  Why choose our property?
                </p>
                <h2 className="text-5xl font-light max-w-3xl text-black">
                  Discover the story behind this beautiful property.
                </h2>
              </motion.div>
              
              {/* Content Grid */}
              <div className="grid grid-cols-2 gap-20 items-center">
                {/* Left: Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="space-y-8">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {project.detailed_description || project.description}
                    </p>
                    
                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3 mt-8">
                      {project.golden_visa_eligible && (
                        <span className="px-5 py-2 bg-black text-white text-sm rounded-full">
                          Golden Visa Eligible
                        </span>
                      )}
                      <span className="px-5 py-2 bg-gray-100 text-black text-sm rounded-full">
                        Cutting-Edge Architecture
                      </span>
                      <span className="px-5 py-2 bg-gray-100 text-black text-sm rounded-full">
                        Next-Gen Living
                      </span>
                      <span className="px-5 py-2 bg-gray-100 text-black text-sm rounded-full">
                        Quality Living
                      </span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Right: Image with rounded corners */}
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <img 
                    src={project.photos?.[0] || heroImage}
                    alt={`Overview image of ${project.title}`}
                    className="w-full h-[600px] object-cover image-hover"
                    style={{ borderRadius: '40px' }}
                  />
                  {/* Floating Card Overlay */}
                  <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl">
                    <p className="text-4xl font-light mb-2 text-black">
                      €{project.price_from?.toLocaleString() || project.price?.toLocaleString() || 'Sur demande'}
                    </p>
                    <p className="text-sm text-gray-500">Starting price</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* 4. ROOM CARDS - Design Alterné Sophistiqué */}
          <section className="py-32 bg-[#F5F5F5]">
            <div className="container mx-auto px-8">
              {/* Title */}
              <motion.div 
                className="text-center mb-20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-5xl font-light mb-4 text-black">Room overview</h2>
                <p className="text-gray-600">with dope look</p>
              </motion.div>
              
              {/* Room Cards - Alternance gauche/droite */}
              <div className="space-y-32">
                {roomData.map((room, index) => (
                  <motion.div 
                    key={index}
                    className={`grid grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'direction-rtl' : ''}`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    {index % 2 === 0 ? (
                      <>
                        {/* Image à gauche pour les index pairs */}
                        <div className="relative group">
                          <img 
                            src={room.image}
                            alt={`${room.name} in ${project.title}`}
                            className="w-full h-[500px] object-cover image-hover"
                            style={{ borderRadius: '40px' }}
                          />
                          {/* Badge overlay */}
                          <div className="absolute top-8 left-8 bg-white/90 backdrop-blur px-6 py-3 rounded-full">
                            <p className="text-sm font-medium text-black">{room.name}</p>
                          </div>
                        </div>
                        
                        <div className="pl-12">
                          <h3 className="text-4xl font-light mb-6 text-black">{room.name}</h3>
                          <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {room.description}
                          </p>
                          
                          {/* Specs Grid */}
                          <div className="grid grid-cols-3 gap-8">
                            <div>
                              <p className="text-3xl font-light text-black">{room.specs.size}</p>
                              <p className="text-sm text-gray-500 mt-1">m²</p>
                            </div>
                            <div>
                              <p className="text-lg text-black">{room.specs.type}</p>
                              <p className="text-sm text-gray-500 mt-1">Type</p>
                            </div>
                            <div>
                              <p className="text-lg text-black">{room.specs.color}</p>
                              <p className="text-sm text-gray-500 mt-1">Style</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Text à gauche pour les index impairs */}
                        <div className="pr-12">
                          <h3 className="text-4xl font-light mb-6 text-black">{room.name}</h3>
                          <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {room.description}
                          </p>
                          
                          {/* Specs Grid */}
                          <div className="grid grid-cols-3 gap-8">
                            <div>
                              <p className="text-3xl font-light text-black">{room.specs.size}</p>
                              <p className="text-sm text-gray-500 mt-1">m²</p>
                            </div>
                            <div>
                              <p className="text-lg text-black">{room.specs.type}</p>
                              <p className="text-sm text-gray-500 mt-1">Type</p>
                            </div>
                            <div>
                              <p className="text-lg text-black">{room.specs.color}</p>
                              <p className="text-sm text-gray-500 mt-1">Style</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Image à droite pour les index impairs */}
                        <div className="relative group">
                          <img 
                            src={room.image}
                            alt={`${room.name} in ${project.title}`}
                            className="w-full h-[500px] object-cover image-hover"
                            style={{ borderRadius: '40px' }}
                          />
                          {/* Badge overlay */}
                          <div className="absolute top-8 left-8 bg-white/90 backdrop-blur px-6 py-3 rounded-full">
                            <p className="text-sm font-medium text-black">{room.name}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. PROPERTY GALLERY - Grid Moderne */}
          <section className="py-32 bg-white">
            <div className="container mx-auto px-8">
              <motion.h2 
                className="text-5xl font-light text-center mb-20 text-black"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Property overview
              </motion.h2>
              
              {/* Masonry Grid */}
              <motion.div 
                className="grid grid-cols-3 gap-6"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Large Image */}
                <div className="col-span-2 row-span-2">
                  <img 
                    src={project.photos?.[0] || heroImage}
                    alt={`Gallery image 1 of ${project.title}`}
                    className="w-full h-full object-cover image-hover"
                    style={{ borderRadius: '30px' }}
                  />
                </div>
                
                {/* Small Images */}
                <div className="space-y-6">
                  <img 
                    src={project.photos?.[1] || heroImage}
                    alt={`Gallery image 2 of ${project.title}`}
                    className="w-full h-[250px] object-cover image-hover"
                    style={{ borderRadius: '30px' }}
                  />
                  <img 
                    src={project.photos?.[2] || heroImage}
                    alt={`Gallery image 3 of ${project.title}`}
                    className="w-full h-[250px] object-cover image-hover"
                    style={{ borderRadius: '30px' }}
                  />
                </div>
                
                {/* Bottom row images */}
                {project.photos?.slice(3, 6).map((photo, index) => (
                  <img 
                    key={index + 3}
                    src={photo}
                    alt={`Gallery image ${index + 4} of ${project.title}`}
                    className="w-full h-[200px] object-cover image-hover"
                    style={{ borderRadius: '30px' }}
                  />
                ))}
              </motion.div>
            </div>
          </section>

          {/* 6. MAP SECTION - Carte Interactive Premium */}
          <section className="relative h-[600px] bg-black overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 opacity-60">
              <img 
                src={project.map_image || 'https://picsum.photos/1920/600'}
                alt={`Map location of ${project.title}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Points of Interest Overlay */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-8">
                {/* Location Cards flottantes */}
                <motion.div 
                  className="absolute top-20 left-[20%]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="bg-white px-6 py-4 rounded-2xl shadow-xl">
                    <p className="font-medium text-black">Restaurant</p>
                    <p className="text-sm text-gray-500">0.5 km</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute top-40 right-[30%]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="bg-white px-6 py-4 rounded-2xl shadow-xl">
                    <p className="font-medium text-black">School</p>
                    <p className="text-sm text-gray-500">1.5 km</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute bottom-20 left-[30%]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="bg-white px-6 py-4 rounded-2xl shadow-xl">
                    <p className="font-medium text-black">Beach</p>
                    <p className="text-sm text-gray-500">2.0 km</p>
                  </div>
                </motion.div>
                
                {/* Central Property Marker */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">ENKI</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* 7. FLOOR PLANNING - Tabs Modernes */}
          <section className="py-32 bg-[#F7F3F0]">
            <div className="container mx-auto px-8">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-5xl font-light text-center mb-4 text-black">Floor planning</h2>
                <p className="text-center text-gray-600">
                  Explore every level with our detailed floor planning
                </p>
              </motion.div>
              
              <Tabs defaultValue="apartment" className="w-full">
                {/* Tab Navigation */}
                <div className="flex justify-center mb-16">
                  <TabsList className="bg-white p-2 rounded-full">
                    <TabsTrigger value="apartment" className="px-8 py-3 rounded-full text-sm font-medium data-[state=active]:bg-black data-[state=active]:text-white">
                      Apartment
                    </TabsTrigger>
                    <TabsTrigger value="simplex" className="px-8 py-3 rounded-full text-sm font-medium data-[state=active]:bg-black data-[state=active]:text-white">
                      Simplex
                    </TabsTrigger>
                    <TabsTrigger value="duplex" className="px-8 py-3 rounded-full text-sm font-medium data-[state=active]:bg-black data-[state=active]:text-white">
                      Duplex
                    </TabsTrigger>
                    <TabsTrigger value="studio" className="px-8 py-3 rounded-full text-sm font-medium data-[state=active]:bg-black data-[state=active]:text-white">
                      Studio
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Content Grid */}
                <TabsContent value="apartment" className="grid grid-cols-2 gap-20 items-center">
                  {/* Floor Plan Image */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <img 
                      src={project.plans?.[0] || 'https://picsum.photos/600/400'}
                      alt={`Floor plan of ${project.title}`}
                      className="w-full image-hover"
                      style={{ borderRadius: '40px' }}
                    />
                  </motion.div>
                  
                  {/* Details */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <p className="text-lg leading-relaxed mb-12 text-gray-700">
                      The living room is the heart of the home—a space designed for comfort, relaxation, and gathering with loved ones.
                    </p>
                    
                    {/* Specs List */}
                    <div className="space-y-6">
                      <div className="flex justify-between py-4 border-b border-gray-200">
                        <span className="text-gray-600">Apartments:</span>
                        <span className="font-medium text-black">{units.length || 4}</span>
                      </div>
                      <div className="flex justify-between py-4 border-b border-gray-200">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium text-black">{project.built_area_m2 || '2200'} m²</span>
                      </div>
                      <div className="flex justify-between py-4 border-b border-gray-200">
                        <span className="text-gray-600">Architecture:</span>
                        <span className="font-medium text-black">{project.architect_name || 'Premium Design'}</span>
                      </div>
                      <div className="flex justify-between py-4 border-b border-gray-200">
                        <span className="text-gray-600">Completion:</span>
                        <span className="font-medium text-black">{project.completion_date || '2025'}</span>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Duplicate content for other tabs */}
                {['simplex', 'duplex', 'studio'].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="grid grid-cols-2 gap-20 items-center">
                    <div>
                      <img 
                        src={project.plans?.[0] || 'https://picsum.photos/600/400'}
                        alt={`${tabValue} floor plan of ${project.title}`}
                        className="w-full image-hover"
                        style={{ borderRadius: '40px' }}
                      />
                    </div>
                    
                    <div>
                      <p className="text-lg leading-relaxed mb-12 text-gray-700">
                        Discover our {tabValue} layout designed for modern living with premium finishes and thoughtful space planning.
                      </p>
                      
                      <div className="space-y-6">
                        <div className="flex justify-between py-4 border-b border-gray-200">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium text-black capitalize">{tabValue}</span>
                        </div>
                        <div className="flex justify-between py-4 border-b border-gray-200">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-medium text-black">{project.built_area_m2 || '2200'} m²</span>
                        </div>
                        <div className="flex justify-between py-4 border-b border-gray-200">
                          <span className="text-gray-600">Architecture:</span>
                          <span className="font-medium text-black">{project.architect_name || 'Premium Design'}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </section>

          {/* 8. CONTACT FORM - Design Minimaliste */}
          <section className="py-32 bg-[#1A1A1A] text-white">
            <div className="container mx-auto px-8 max-w-4xl">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-sm uppercase tracking-wider text-gray-400 mb-4">
                  Any inquiry
                </p>
                <h2 className="text-6xl font-light">Get in touch</h2>
              </motion.div>
              
              {/* Form Design */}
              <motion.form 
                className="space-y-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="grid grid-cols-2 gap-8">
                  <input 
                    className="bg-transparent border-b border-white/20 pb-4 
                               placeholder-white/40 focus:border-white transition-colors
                               text-lg font-light outline-none"
                    placeholder="First name"
                    type="text"
                  />
                  <input 
                    className="bg-transparent border-b border-white/20 pb-4 
                               placeholder-white/40 focus:border-white transition-colors
                               text-lg font-light outline-none"
                    placeholder="Last name"
                    type="text"
                  />
                </div>
                
                <input 
                  className="w-full bg-transparent border-b border-white/20 pb-4 
                             placeholder-white/40 focus:border-white transition-colors
                             text-lg font-light outline-none"
                  placeholder="Email address"
                  type="email"
                />
                
                <input 
                  className="w-full bg-transparent border-b border-white/20 pb-4 
                             placeholder-white/40 focus:border-white transition-colors
                             text-lg font-light outline-none"
                  placeholder="Phone number"
                  type="tel"
                />
                
                <textarea 
                  className="w-full bg-transparent border-b border-white/20 pb-4 
                             placeholder-white/40 focus:border-white transition-colors
                             text-lg font-light outline-none resize-none"
                  rows={4}
                  placeholder="Your message"
                />
                
                <button className="w-full bg-white text-black py-6 rounded-full
                                  text-lg font-medium hover:bg-gray-100 transition-colors button-hover">
                  Send Message
                </button>
              </motion.form>
              
              {/* Contact Info */}
              <motion.div
                className="mt-20 pt-20 border-t border-white/10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-center text-gray-400">
                  Monday – Sunday, 9am – 7pm EST
                </p>
              </motion.div>
            </div>
          </section>

          {/* 9. STICKY CTA BAR - Design Flottant */}
          {isStickyCTAVisible && (
            <motion.div 
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50
                         bg-black/90 backdrop-blur-lg rounded-full px-8 py-4
                         flex items-center gap-6 shadow-2xl"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3 }}
            >
              {/* WhatsApp */}
              <button className="flex items-center gap-3 text-white hover:text-green-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">WhatsApp</span>
              </button>
              
              <div className="w-[1px] h-6 bg-white/20" />
              
              {/* Schedule Visit */}
              <button className="px-6 py-2 bg-white text-black rounded-full text-sm font-medium
                                 hover:bg-gray-100 transition-colors button-hover">
                Schedule Visit
              </button>
              
              <div className="w-[1px] h-6 bg-white/20" />
              
              {/* Call */}
              <button className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors">
                <Phone className="w-5 h-5" />
                <span className="text-sm font-medium">Call Now</span>
              </button>
            </motion.div>
          )}

          {/* Keep existing metadata section */}
          <section className="py-8 bg-muted/50">
            <div className="max-w-7xl mx-auto px-4">
              <motion.p 
                className="text-center text-sm text-secondary"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Dernière mise à jour : {new Date(project.updated_at).toLocaleDateString('fr-FR')}
              </motion.p>
            </div>
          </section>
        </main>
      </Layout>
    </ErrorBoundary>
  );
};

export default ProjectDetail;
