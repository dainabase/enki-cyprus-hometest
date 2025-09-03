import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import { Property } from '@/data/mockData';

interface PropertyCardProps {
  property: Property;
  index?: number;
  onClick?: () => void;
  className?: string;
}

const PropertyCard = ({ property, index = 0, onClick, className = '' }: PropertyCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
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
      <Card className="overflow-hidden card-hover bg-gradient-card cursor-pointer">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] bg-muted bg-gradient-to-br from-muted to-accent">
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Square className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm opacity-60">Image à venir</p>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <Badge 
            className={`absolute top-3 left-3 ${getStatusColor(property.status)}`}
          >
            {getStatusText(property.status)}
          </Badge>

          {/* Type Badge */}
          <Badge variant="secondary" className="absolute top-3 right-3">
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </Badge>

          {/* Hover Overlay */}
          <motion.div 
            className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          >
            <Button className="btn-premium">
              <Eye className="w-4 h-4 mr-2" />
              Voir Détails
            </Button>
          </motion.div>
        </div>

        <CardContent className="p-6">
          {/* Price */}
          <div className="text-2xl font-bold text-primary mb-2">
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
                <Bed className="w-4 h-4 mr-1 text-primary" />
                <span>{property.bedrooms} chambres</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1 text-primary" />
                <span>{property.bathrooms} sdb</span>
              </div>
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1 text-primary" />
                <span>{property.area}</span>
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
          <Button className="w-full btn-outline-premium">
            En savoir plus
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PropertyCard;