import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Euro, Eye } from 'lucide-react';
import { FeaturedProject } from '@/types/frontend.types';
import { getHeroImage } from '@/utils/gallery';

interface FeaturedProjectCardProps {
  project: FeaturedProject;
  index: number;
}

const FeaturedProjectCard = ({ project, index }: FeaturedProjectCardProps) => {
  // For FeaturedProject, use the image property directly (not using gallery utils since it's a different type)
  const heroImage = project.image;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'en_construction':
        return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'livre':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponible':
        return 'Disponible';
      case 'en_construction':
        return 'En construction';
      case 'livre':
        return 'Livré';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
        {/* Image */}
        <motion.div 
          className="relative h-64 overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={heroImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Status Badge */}
          <Badge className={`absolute top-4 left-4 ${getStatusColor(project.status)}`}>
            {getStatusLabel(project.status)}
          </Badge>

          {/* Prix moyen */}
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center gap-1">
              <Euro className="w-4 h-4" />
              <span className="text-lg font-bold">
                {formatPrice(project.prix_moyen)}
              </span>
              <span className="text-sm opacity-90">moyenne</span>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl font-bold line-clamp-1">
              {project.title}
            </CardTitle>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm">{project.location}</span>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Description */}
          <p className="text-muted-foreground text-sm line-clamp-2">
            {project.description}
          </p>

          {/* Nombre de biens */}
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              {project.nombre_biens} biens
            </span>
            <span className="text-xs text-muted-foreground">
              ({project.types_biens.join(', ')})
            </span>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {project.features.slice(0, 3).map((feature, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {project.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.features.length - 3}
              </Badge>
            )}
          </div>

          {/* Action Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button 
              className="w-full mt-4"
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir le programme
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeaturedProjectCard;