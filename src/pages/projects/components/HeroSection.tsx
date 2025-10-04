'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatPrice, formatArea } from '@/lib/utils/formatters';
import { MapPin, Calendar, Chrome as Home, Ruler, Euro } from 'lucide-react';

interface HeroSectionProps {
  project: any;
}

export default function HeroSection({ project }: HeroSectionProps) {
  const [videoError, setVideoError] = useState(false);
  const [imageFallback, setImageFallback] = useState<string | null>(null);

  // Extract hero image URL from various sources
  const getHeroImage = () => {
    // Check project_images table first
    const primaryImage = project.project_images?.find((i: any) => i.is_primary);
    if (primaryImage?.url) return primaryImage.url;

    // Check photos array (objects with url property)
    const primaryPhoto = project.photos?.find((p: any) => p.isPrimary);
    if (primaryPhoto?.url) return primaryPhoto.url;
    if (project.photos?.[0]?.url) return project.photos[0].url;

    // Check photo_gallery_urls array (direct URLs)
    if (project.photo_gallery_urls?.[0]) return project.photo_gallery_urls[0];

    // Fallback
    return project.main_image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200';
  };

  const heroImage = getHeroImage();
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
    <section className="relative w-full h-screen bg-black flex flex-col overflow-hidden">
      {/* Background with Ken Burns Zoom */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {videoUrl && !videoError ? (
          <video
            className="w-full h-full object-cover opacity-60"
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
            alt={project.title}
            className="w-full h-full object-cover opacity-60"
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

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Location with slide from left */}
        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <MapPin className="w-4 h-4 text-white/60" />
          <p className="text-white/60 text-sm tracking-[0.2em] uppercase font-light">
            {project.city}{project.district && `, ${project.district}`}, Cyprus
          </p>
        </motion.div>

        {/* Title with clip path reveal */}
        <motion.div
          className="overflow-hidden mb-12 max-w-7xl"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{
            duration: 1.2,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <motion.h1
            className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight leading-[0.95]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {project.title}
          </motion.h1>
        </motion.div>

        {/* Buttons with stagger and scale */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.8
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
                  stiffness: 200,
                  damping: 15
                }
              }
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(255,255,255,0.5)"
            }}
            whileTap={{ scale: 0.95 }}
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
                  stiffness: 200,
                  damping: 15
                }
              }
            }}
            whileHover={{
              scale: 1.05,
              borderColor: "rgba(255,255,255,1)",
              boxShadow: "0 0 30px rgba(255,255,255,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              console.log('Download brochure');
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
      <div className="absolute bottom-12 left-0 right-0 z-10">
        <div className="max-w-[1190px] mx-auto px-6 lg:px-12">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 1.2
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
                    y: 50
                  },
                  visible: {
                    rotateX: 0,
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 12
                    }
                  }
                }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  transition: { duration: 0.2 }
                }}
                style={{
                  perspective: 1000,
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
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
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
