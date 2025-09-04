import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import { Property } from '@/lib/supabase';
import OptimizedImage from '@/components/OptimizedImage';

interface PropertyCardProps {
  property: Property;
  index?: number;
  onClick?: () => void;
  className?: string;
}

const PropertyCard = memo(({ property, index = 0, onClick, className = '' }: PropertyCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-gold text-gold-foreground';
      case 'reserved':
        return 'bg-primary text-primary-foreground';
      case 'sold':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'reserved':
        return 'Réservé';
      case 'sold':
        return 'Vendu';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className={`group ${className}`}
      onClick={onClick}
    >
      <Card className="overflow-hidden card-luxury cursor-pointer group glow-gold shimmer-gold">
        {/* Image Container */}
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={property.photos?.[0] 
            ? `https://ccsakftsslurjgnjwdci.supabase.co/functions/v1/image-proxy?url=${encodeURIComponent(property.photos[0])}`
            : '/placeholder.svg'}
          alt={`Photo du bien: ${property.title} - ${property.location}`}
          aspectRatio="4/3"
          className=""
          loading="lazy"
        />
        
        {/* Price Badge */}
          <Badge 
            className="absolute top-3 left-3 bg-primary text-primary-foreground"
          >
            {property.price}
          </Badge>

          {/* Type Badge */}
          <Badge variant="secondary" className="absolute top-3 right-3">
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </Badge>

          {/* Hover Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/80 to-gold/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            initial={false}
          >
            <Button className="bg-white/95 text-primary hover:bg-white hover:scale-105 transition-all duration-300 shadow-xl" asChild>
              <Link to={`/project/${property.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                Voir Détails
              </Link>
            </Button>
          </motion.div>
        </div>

        <CardContent className="p-6">
          {/* Price */}
          <div className="text-2xl font-bold text-luxury mb-2">
            {property.price}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            <span className="text-sm">{property.location}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {property.description}
          </p>

          {/* Property Details */}
          {property.bedrooms && (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1 text-gold" />
                <span>{property.bedrooms} chambres</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1 text-gold" />
                <span>{property.bathrooms} sdb</span>
              </div>
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1 text-gold" />
                <span>{property.area}m²</span>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {property.features.slice(0, 3).map((feature, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {property.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{property.features.length - 3}
              </Badge>
            )}
          </div>

          {/* CTA Button */}
          <Button className="w-full bg-gradient-to-r from-primary to-gold text-white hover:from-gold hover:to-primary transition-all duration-500 transform hover:scale-105 shadow-lg" asChild>
            <Link to={`/project/${property.id}`}>
              En savoir plus
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;