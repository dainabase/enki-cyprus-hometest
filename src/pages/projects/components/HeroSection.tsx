/**
 * HeroSection Component
 *
 * OPTIMIZATIONS APPLIED (6 Oct 2025):
 *
 * 1. IMAGE PRELOADING
 *    - Image is preloaded in parent (ProjectPage) before Hero renders
 *    - Eliminates initial black screen flash
 *    - Falls back to local preload if parent didn't preload
 *
 * 2. SEQUENTIAL TRANSITION
 *    - Background fades in first (0.6s)
 *    - Then overlay fades out (0.3s)
 *    - Prevents semi-transparent gray flash
 *    - Total transition: 0.9s smooth
 *
 * 3. CACHE DETECTION
 *    - Detects if image is already cached
 *    - Skips preload on navigation back
 *    - Instant loading on cached images
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { formatPrice, formatArea } from '@/lib/utils/formatters';
import { MapPin, Calendar, Chrome as Home, Ruler, Euro } from 'lucide-react';
import { logger } from '@/lib/logger';

type ProjectImageRef = { url?: string; is_primary?: boolean; isPrimary?: boolean };

interface ProjectHero {
  project_images?: ProjectImageRef[];
  photos?: ProjectImageRef[];
  photo_gallery_urls?: string[];
  main_image_url?: string;
  [key: string]: unknown;
}

interface HeroSectionProps {
  project: ProjectHero;
  imagePreloaded?: boolean;
}

export default function HeroSection({ project, imagePreloaded = false }: HeroSectionProps) {
  const [videoError, setVideoError] = useState(false);
  const [imageFallback, setImageFallback] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(imagePreloaded);
  const [showBackground, setShowBackground] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Extract hero image URL with simplified fallback chain - memoized to avoid multiple calls
  const heroImage = useMemo(() => {
    // Priority order: project_images (primary) > photos (primary) > photos[0] > photo_gallery_urls[0] > main_image_url > fallback
    return (
      project.project_images?.find((i) => i.is_primary)?.url ||
      project.photos?.find((p) => p.isPrimary)?.url ||
      project.photos?.[0]?.url ||
      project.photo_gallery_urls?.[0] ||
      project.main_image_url ||
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200'
    );
  }, [project]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Sync imageLoaded state when imagePreloaded prop changes
  useEffect(() => {
    if (imagePreloaded && !imageLoaded) {
      setImageLoaded(true);
    }
  }, [imagePreloaded, imageLoaded]);

  // Preload hero image (only if not already preloaded by parent)
  useEffect(() => {
    // Skip if already preloaded by parent component
    if (imagePreloaded) {
      return;
    }

    const img = new Image();

    const handleLoad = () => {
      setImageLoaded(true);
    };

    const handleError = () => {
      console.warn('⚠️ Hero: Local preload failed, using fallback');
      setImageFallback('/og-image.jpg');
      setImageLoaded(true);
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = heroImage;

    if (img.complete) {
      handleLoad();
    }

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [heroImage, imagePreloaded]);

  // Sequential transition: Background fade in → Then overlay fade out
  useEffect(() => {
    if (!imageLoaded) return;

    // Step 1: Show background image (0.6s)
    setShowBackground(true);

    // Step 2: After background is visible, hide overlay (0.3s)
    const overlayTimeout = setTimeout(() => {
      setHideOverlay(true);
    }, 600); // Wait for background animation to complete

    return () => clearTimeout(overlayTimeout);
  }, [imageLoaded]);

  const videoUrl = project.video_url || project.drone_footage_urls?.[0];

  const quickStats = [
    {
      icon: <Euro className="w-8 h-8" />,
      label: 'Price From',
      value: project.price_from ? formatPrice(project.price_from) : 'On Request',
    },
    {
      icon: <Home className="w-8 h-8" />,
      label: 'Units',
      value: `${project.total_units || 'Multiple'} units`,
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      label: 'Completion',
      value: project.completion_date || project.expected_completion || 'To be announced',
    },
    {
      icon: <Ruler className="w-8 h-8" />,
      label: 'Size Range',
      value: project.square_meters_min && project.square_meters_max
        ? `${formatArea(project.square_meters_min)} - ${formatArea(project.square_meters_max)}`
        : 'Various sizes',
    },
  ];

  return (
    <section id="hero-section" className="relative w-full h-screen bg-black flex flex-col overflow-hidden">
      {/*
        SEQUENTIAL TRANSITION (Fixed flash issue):
        1. imageLoaded=true triggers useEffect (line ~98)
        2. Background fades in: 0 → 1 (0.6s)
        3. After 600ms, overlay fades out: 1 → 0 (0.3s)
        4. Total transition: 0.9s (no semi-transparent overlap)
      */}

      {/* Loading overlay - fades out AFTER background is visible (sequential) */}
      <motion.div
        className="absolute inset-0 bg-black z-40"
        initial={{ opacity: 1 }}
        animate={{ opacity: hideOverlay ? 0 : 1 }}
        transition={{
          opacity: { duration: 0.3, ease: "easeOut" }
        }}
        style={{ pointerEvents: hideOverlay ? 'none' : 'auto' }}
      />

      {/* Background - fades in FIRST (sequential) */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: showBackground ? 1 : 0 }}
        transition={{
          opacity: { duration: 0.6, ease: "easeOut" }
        }}
      >
        <motion.div
          className="w-full h-full"
          initial={{ scale: 1 }}
          animate={shouldReduceMotion || !imageLoaded ? { scale: 1 } : { scale: 1.08 }}
          transition={{
            duration: 30,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {videoUrl && !videoError ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={heroImage}
              onError={() => setVideoError(true)}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : heroImage ? (
            <img
              src={imageFallback || heroImage}
              alt={project.title || 'Project hero image'}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                if (!imageFallback) {
                  setImageFallback('/og-image.jpg');
                } else {
                  e.currentTarget.onerror = null;
                }
              }}
            />
          ) : null}
        </motion.div>

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start pt-[23vh] px-6 text-center">
        {/* Location with slide from left */}
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ x: -100, opacity: 0 }}
          animate={imageLoaded ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{
            duration: 1,
            delay: 0.9,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <MapPin className="w-4 h-4 text-white/60" />
          <p className="text-white/60 text-sm tracking-[0.2em] uppercase font-light">
            {project.city || ''}{project.district ? `, ${project.district}` : ''}, Cyprus
          </p>
        </motion.div>

        {/* Title with clip path reveal and fallback */}
        <motion.div
          className="overflow-hidden mb-8 max-w-7xl"
          initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
          animate={imageLoaded ? {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1
          } : {
            clipPath: "inset(0 100% 0 0)",
            opacity: 0
          }}
          transition={{
            duration: 1.4,
            delay: 0.9,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <motion.h1
            className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight leading-[0.95]"
          >
            {project.title || 'Project'}
          </motion.h1>
        </motion.div>

        {/* Buttons with stagger and scale */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center"
          initial="hidden"
          animate={imageLoaded ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 2.4
              }
            }
          }}
        >
          <motion.button
            className="relative px-12 py-4 bg-white text-black text-sm tracking-wider uppercase font-medium overflow-hidden group"
            variants={{
              hidden: { scale: 0, opacity: 0 },
              visible: {
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 160,
                  damping: 22
                }
              }
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 25px rgba(255,255,255,0.4)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              document.getElementById('contact-form')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-white to-gray-200"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative z-10">Je suis intéressé</span>
          </motion.button>

          <motion.button
            className="relative px-12 py-4 bg-transparent border border-white text-white text-sm tracking-wider uppercase font-medium group"
            variants={{
              hidden: { scale: 0, opacity: 0 },
              visible: {
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 250,
                  damping: 18
                }
              }
            }}
            whileHover={{
              scale: 1.03,
              borderColor: "rgba(255,255,255,1)",
              boxShadow: "0 0 25px rgba(255,255,255,0.3)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              logger.info('Download brochure');
            }}
          >
            <motion.span
              className="absolute inset-0 bg-white"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0, opacity: 0.1 }}
            />
            <span className="relative z-10">Télécharger la brochure</span>
          </motion.button>
        </motion.div>
      </div>

      {/* KPI Stats cards with 3D flip */}
      <div className="absolute bottom-6 left-0 right-0 z-10">
        <div className="max-w-[1190px] mx-auto px-6 lg:px-12">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
            initial="hidden"
            animate={imageLoaded ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 2.8
                }
              }
            }}
          >
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-[2px] p-4 text-center shadow-lg relative"
                variants={{
                  hidden: {
                    rotateX: -90,
                    opacity: 0,
                    y: 40
                  },
                  visible: {
                    rotateX: 0,
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 20
                    }
                  }
                }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 15px 35px rgba(0,0,0,0.18)",
                  transition: { duration: 0.2 }
                }}
                style={{
                  perspective: "1000px",
                  transformStyle: "preserve-3d"
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-[2px] opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <motion.div
                    className="flex justify-center mb-3 text-black/60"
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 350, damping: 15 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <p className="text-xs uppercase tracking-wider text-black/60 mb-1.5 font-light">
                    {stat.label}
                  </p>
                  <p className="text-base md:text-lg font-light text-black">
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
