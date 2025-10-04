'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils/formatters';
import { MapPin, Crown, ArrowDown, Play } from 'lucide-react';

interface HeroSectionProps {
  project: any;
}

export default function HeroSection({ project }: HeroSectionProps) {
  const [videoError, setVideoError] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

  const heroImage =
    project.project_images?.find((i: any) => i.is_primary)?.url ||
    project.photos?.[0] ||
    project.photo_gallery_urls?.[0] ||
    project.main_image_url;

  const videoUrl = project.video_url || project.drone_footage_urls?.[0];
  const city = project.location?.city || project.location?.address || 'Cyprus';

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale }}
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
            src={heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-end pb-24 px-6 md:px-12 lg:px-24"
        style={{ opacity }}
      >
        <div className="max-w-7xl w-full">
          {/* Top Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white px-4 py-1.5">
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              {city}
            </Badge>

            {project.golden_visa_eligible && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-white px-4 py-1.5">
                <Crown className="w-3.5 h-3.5 mr-1.5" />
                Golden Visa Eligible
              </Badge>
            )}

            <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white px-4 py-1.5">
              {project.type || 'Residential'}
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.95] tracking-tight"
          >
            {project.title}
          </motion.h1>

          {/* Price and Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8"
          >
            <div>
              {project.subtitle && (
                <p className="text-xl md:text-2xl text-white/80 mb-2 max-w-2xl">
                  {project.subtitle}
                </p>
              )}
              <div className="text-3xl md:text-4xl font-bold text-white">
                {project.price_from_new || project.price || project.price_from ? (
                  <>
                    From {formatPrice(project.price_from_new || project.price_from || project.price)}
                    {project.vat_rate && (
                      <span className="text-lg md:text-xl ml-2 text-white/60">+ {project.vat_rate}% VAT</span>
                    )}
                  </>
                ) : (
                  'Price on Request'
                )}
              </div>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 px-8 py-6 text-base font-semibold rounded-full transition-all duration-300 hover:scale-105"
              onClick={() => {
                document.getElementById('contact-form')?.scrollIntoView({
                  behavior: 'smooth'
                });
              }}
            >
              Book a Viewing
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/60 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
