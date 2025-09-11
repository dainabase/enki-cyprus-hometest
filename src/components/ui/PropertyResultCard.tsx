import { memo } from 'react';
import { motion } from 'framer-motion';

interface Property {
  id: number;
  title: string;
  image: string;
  price: string | number;
  location: string;
  size: number;
  description: string;
  matching: number;
  missingFeatures: string[];
}

interface PropertyResultCardProps {
  property: Property;
  onClick?: () => void;
}

const PropertyResultCard = memo(({ property, onClick }: PropertyResultCardProps) => {
  const matchColor = property.matching >= 95 ? 'text-success' : 
                     property.matching >= 90 ? 'text-warning' : 
                     'text-error';
  
  const priceValue = typeof property.price === 'string' ? 
    parseInt(property.price.replace(/\s/g, '')) : 
    property.price;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      className="flex gap-4 p-5 
               bg-white rounded-2xl 
               border-2 border-secondary/30
               hover:border-primary/30 hover:shadow-lg
               transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="w-1/3 relative">
        <img 
          src={property.image}
          alt={property.title}
          className="w-full h-32 object-cover rounded-xl"
        />
        {/* Badge Golden Visa si éligible */}
        {priceValue >= 300000 && (
          <div className="absolute top-2 left-2 
                        px-2 py-1 bg-gradient-to-r from-golden to-golden-dark
                        text-white text-xs font-bold rounded-full">
            Golden Visa ✓
          </div>
        )}
      </div>
      
      {/* Infos */}
      <div className="w-2/3 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-lg text-muted">
            {property.title}
          </h4>
          <span className={`font-bold text-lg ${matchColor}`}>
            {property.matching}%
          </span>
        </div>
        
        <p className="text-sm text-foreground/70 mb-3">
          {property.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm mb-3">
          <span className="font-bold text-2xl text-primary">
            €{typeof property.price === 'string' ? property.price : property.price.toLocaleString()}
          </span>
          <span className="text-muted/70">📍 {property.location}</span>
          <span className="text-muted/70">📐 {property.size}m²</span>
        </div>
        
        {property.matching < 100 && property.missingFeatures.length > 0 && (
          <div className="text-xs text-warning bg-warning/10 
                        p-2 rounded-lg mb-3">
            ⚠️ Critères manquants: {property.missingFeatures.join(', ')}
          </div>
        )}
        
        <button 
          className="self-start px-6 py-2 
                   bg-gradient-ocean text-white 
                   rounded-full text-sm font-semibold
                   hover:shadow-md transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          Voir détails →
        </button>
      </div>
    </motion.div>
  );
});

PropertyResultCard.displayName = 'PropertyResultCard';

export default PropertyResultCard;