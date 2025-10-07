'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Chrome as Home, Calendar, Waves, Eye, GitCompare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: any;
  index?: number;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

export function ProjectCard({ project, index = 0, onToggleFavorite, isFavorite = false }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const heroImage = project.project_images?.find((i: any) => i.is_primary)?.url ||
    project.photos?.[0]?.url ||
    project.photo_gallery_urls?.[0] ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800';

  const isNew = project.created_at &&
    (new Date().getTime() - new Date(project.created_at).getTime()) < 60 * 24 * 60 * 60 * 1000;

  const isLowStock = project.total_units && project.units_sold &&
    ((project.total_units - project.units_sold) / project.total_units) < 0.2;

  const isResidenceEligible = project.price_from >= 300000;

  const distanceToBeach = project.proximity_sea_km;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group relative bg-white shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <Link to={`/projects/${project.url_slug || project.id}`} className="block relative h-[280px] overflow-hidden">
        <motion.img
          src={heroImage}
          alt={project.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            "group-hover:scale-110",
            !imageLoaded && "opacity-0"
          )}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {isNew && (
            <Badge className="bg-green-600 text-white border-0">
              Nouveauté
            </Badge>
          )}
          {isLowStock && (
            <Badge className="bg-orange-600 text-white border-0">
              Dernières Unités
            </Badge>
          )}
          {isResidenceEligible && (
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-black border-0 text-xs">
              Éligible résidence
            </Badge>
          )}
        </div>

        {/* Favorite Heart */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite?.(project.id);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-white z-10"
        >
          <Heart className={cn("w-5 h-5", isFavorite ? "fill-red-500 text-red-500" : "text-black")} />
        </motion.button>
      </Link>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Price */}
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-2xl font-light text-black tracking-tight">
              €{Number(project.price_from || project.price || 0).toLocaleString()}
            </p>
            <p className="text-xs text-black/40 font-light">+ TVA</p>
          </div>
        </div>

        {/* Title */}
        <Link to={`/projects/${project.url_slug || project.id}`}>
          <h3 className="text-xl font-light text-black tracking-tight hover:text-black/60 transition-colors line-clamp-1">
            {project.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center text-black/60">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm font-light">
            {project.city || 'Cyprus'}{project.district && `, ${project.district}`}
          </span>
        </div>

        {/* Characteristics */}
        <div className="flex items-center gap-4 text-sm text-black/60 font-light">
          {project.total_units && (
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>{project.total_units} unités</span>
            </div>
          )}
          {project.expected_completion && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{project.expected_completion}</span>
            </div>
          )}
          {distanceToBeach && (
            <div className="flex items-center gap-1">
              <Waves className="w-4 h-4" />
              <span>{distanceToBeach}km</span>
            </div>
          )}
        </div>

        {/* Highlights */}
        {project.unique_selling_points && (
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(project.unique_selling_points)
              ? project.unique_selling_points
              : JSON.parse(project.unique_selling_points || '[]')
            ).slice(0, 4).map((point: string, i: number) => (
              <span key={i} className="text-xs px-2 py-1 bg-neutral-50 text-black/60 font-light">
                {point.slice(0, 30)}{point.length > 30 ? '...' : ''}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {project.description && (
          <p className="text-sm text-black/60 font-light leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Status */}
        {project.expected_completion && (
          <div className="pt-2 border-t border-black/5">
            <p className="text-xs uppercase tracking-wider text-black/40 font-medium">
              Livraison: {project.expected_completion}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link to={`/projects/${project.url_slug || project.id}`} className="flex-1">
            <Button className="w-full bg-black text-white hover:bg-black/90 font-light">
              Découvrir le Projet
            </Button>
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs font-light"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement virtual tour
            }}
          >
            <Eye className="w-3 h-3 mr-1" />
            Visite Virtuelle
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs font-light"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement comparison
            }}
          >
            <GitCompare className="w-3 h-3 mr-1" />
            Comparer
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
