'use client';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Star, TrendingUp, Waves, Building2, Award, CircleCheck as CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { FeaturedProjectCardProps } from '@/types/project.types';

// Constants
const DEFAULT_FEATURED_IMAGE = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200';

export function FeaturedProjectCard({ project, index = 0 }: FeaturedProjectCardProps) {
  const heroImage = project.project_images?.find((i: any) => i.is_primary)?.url ||
    project.photos?.[0]?.url ||
    project.photo_gallery_urls?.[0] ||
    DEFAULT_FEATURED_IMAGE;

  const isResidenceEligible = project.price_from >= 300000;

  const highlights = [
    project.proximity_sea_km && { icon: Waves, text: `${project.proximity_sea_km}km de la plage` },
    project.roi_annual && { icon: TrendingUp, text: `ROI ${project.roi_annual}% annuel` },
    project.swimming_pool && { icon: Building2, text: 'Piscine privée' },
    project.energy_certificate && { icon: Award, text: `Certification ${project.energy_certificate}` },
  ].filter(Boolean).slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="group relative bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* Desktop: Side-by-side Layout */}
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Image */}
        <Link to={`/projects/${project.url_slug || project.id}`} className="relative h-[400px] lg:h-full overflow-hidden">
          <motion.img
            src={heroImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <Badge className="bg-yellow-500 text-black border-0 px-3 py-1">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Projet Vedette
            </Badge>
            {isResidenceEligible && (
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-black border-0 px-3 py-1 text-xs">
                Éligible résidence
              </Badge>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
          {/* Tagline */}
          {project.tagline && (
            <p className="text-sm uppercase tracking-[0.2em] text-black/40 font-medium">
              {project.tagline}
            </p>
          )}

          {/* Title */}
          <Link to={`/projects/${project.url_slug || project.id}`}>
            <h3 className="text-3xl md:text-4xl font-light text-black tracking-tight hover:text-black/60 transition-colors">
              {project.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center text-black/60">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="text-lg font-light">
              {project.city || 'Cyprus'}{project.district && `, ${project.district}`}
            </span>
          </div>

          {/* Highlights Grid */}
          {highlights.length > 0 && (
            <div className="grid grid-cols-2 gap-4 py-4">
              {highlights.map((highlight: any, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <highlight.icon className="w-5 h-5 text-black/40 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-light text-black/70">{highlight.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          {project.description && (
            <p className="text-base text-black/60 font-light leading-relaxed line-clamp-3">
              {project.description}
            </p>
          )}

          {/* Price */}
          <div className="pt-4 border-t border-black/10">
            <p className="text-xs uppercase tracking-wider text-black/40 mb-2 font-medium">
              À partir de
            </p>
            <p className="text-3xl font-light text-black tracking-tight">
              €{Number(project.price_from || 0).toLocaleString()}
            </p>
          </div>

          {/* CTA Button */}
          <Link to={`/projects/${project.url_slug || project.id}`}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full lg:w-auto px-8 py-6 bg-black text-white hover:bg-black/90 text-sm uppercase tracking-wider font-medium group">
                Découvrir ce Projet
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
