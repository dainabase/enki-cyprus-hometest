import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Property } from '@/lib/supabase';
import { 
  MapPin, 
  Home, 
  Bath, 
  Square, 
  Euro,
  Phone,
  Mail,
  Star,
  X
} from 'lucide-react';

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyModal = ({ property, isOpen, onClose }: PropertyModalProps) => {
  if (!property) return null;

  const locationText = typeof property.location === 'string' ? property.location : (property.location as any)?.city || (property.location as any)?.name || '';

  // Status functionality removed as it's not in the new Property structure

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <DialogHeader className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 h-8 w-8 p-0"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                  {property.title}
                </DialogTitle>
                
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{locationText}</span>
                  <Badge variant="secondary">
                    {property.type}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    {property.photos && property.photos.length > 0 ? (
                      <img 
                        src={property.photos[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Home className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Image de la propriété</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    {property.bedrooms && (
                      <div className="text-center">
                        <Home className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <p className="text-sm font-medium">{property.bedrooms}</p>
                        <p className="text-xs text-muted-foreground">Chambres</p>
                      </div>
                    )}
                    
                    {property.bathrooms && (
                      <div className="text-center">
                        <Bath className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <p className="text-sm font-medium">{property.bathrooms}</p>
                        <p className="text-xs text-muted-foreground">Salles de bain</p>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <Square className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm font-medium">{property.area}m²</p>
                      <p className="text-xs text-muted-foreground">Surface</p>
                    </div>
                  </div>
                </motion.div>

                {/* Details */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Price */}
                  <div className="p-4 bg-gradient-premium rounded-lg text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Euro className="w-5 h-5" />
                      <span className="text-sm opacity-90">Prix</span>
                    </div>
                    <p className="text-3xl font-bold">{property.price}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {property.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Équipements</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                        >
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {feature}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <h3 className="font-semibold mb-2 text-foreground">Type de bien</h3>
                    <Badge variant="secondary" className="capitalize">
                      {property.type}
                    </Badge>
                  </div>

                  {/* Contact Actions */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <Button className="w-full btn-premium" size="lg">
                      <Phone className="w-4 h-4 mr-2" />
                      Contacter un agent
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        <Mail className="w-4 h-4 mr-2" />
                        Demander infos
                      </Button>
                      <Button variant="outline" className="w-full">
                        <MapPin className="w-4 h-4 mr-2" />
                        Planifier visite
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default PropertyModal;