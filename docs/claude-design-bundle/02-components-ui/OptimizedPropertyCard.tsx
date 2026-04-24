import React, { memo } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { getOptimizedImageUrl } from "@/utils/performance";
import { getHeroImage } from '@/utils/gallery';

interface Property {
  id: string;
  title: string;
  price: number;
  location: {
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  type: string;
  features: string[];
  photos: string[];
  description: string;
}

interface OptimizedPropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onFavorite?: (property: Property) => void;
  isFavorite?: boolean;
  isSelected?: boolean;
}

// Memoized component to prevent unnecessary re-renders
const OptimizedPropertyCard = memo<OptimizedPropertyCardProps>(({ 
  property, 
  onSelect, 
  onFavorite,
  isFavorite = false,
  isSelected = false 
}) => {
  const heroImage = getHeroImage(property);
  const mainImage = heroImage || property.photos?.[0] || '/placeholder.svg';
  const optimizedImageUrl = getOptimizedImageUrl(mainImage, 400, 250);

  const handleSelect = React.useCallback(() => {
    onSelect(property);
  }, [property, onSelect]);

  const handleFavorite = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(property);
  }, [property, onFavorite]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card 
        className={`group cursor-pointer hover:shadow-xl transition-all duration-300 h-full flex flex-col ${
          isSelected ? 'ring-2 ring-primary shadow-lg' : ''
        }`}
        onClick={handleSelect}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={optimizedImageUrl}
            alt={property.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Favorite button */}
          {onFavorite && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={handleFavorite}
            >
              <Heart 
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </Button>
          )}

          {/* Property type badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 bg-white/90"
          >
            {property.type}
          </Badge>
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {(property as any).city || property.location || 'Location non définie'}
          </div>
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col justify-between">
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {property.description}
          </p>

          {/* Property features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {property.features.slice(0, 3).map((feature) => {
              const getFeatureIcon = (feature: string) => {
                if (feature.includes('chambre')) return <Bed className="h-3 w-3" />;
                if (feature.includes('salle')) return <Bath className="h-3 w-3" />;
                if (feature.includes('m²')) return <Square className="h-3 w-3" />;
                return null;
              };

              return (
                <div key={feature} className="flex items-center gap-1 text-xs text-muted-foreground">
                  {getFeatureIcon(feature)}
                  <span>{feature}</span>
                </div>
              );
            })}
          </div>

          {/* Price */}
          <div className="font-bold text-xl text-primary">
            {property.price.toLocaleString('fr-FR')} €
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

OptimizedPropertyCard.displayName = 'OptimizedPropertyCard';

export default OptimizedPropertyCard;