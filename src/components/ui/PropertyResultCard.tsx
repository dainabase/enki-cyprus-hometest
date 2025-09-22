import { memo } from 'react';
import { Button } from '@/components/ui/button';

interface Property {
  id: number;
  title: string;
  image: string;
  price: string;
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
  const matchingClass = property.matching >= 95 ? 'text-green-600' : 
                        property.matching >= 90 ? 'text-amber-600' : 
                        'text-orange-600';

  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      {/* Photo 1/3 */}
      <div className="w-1/3">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-32 object-cover rounded-lg"
        />
      </div>
      
      {/* Infos 2/3 */}
      <div className="w-2/3 flex flex-col">
        {/* Badge Matching */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-lg leading-tight">{property.title}</h4>
          <span className={`font-bold text-sm ${matchingClass}`}>
            {property.matching}% Match
          </span>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-2 leading-relaxed">
          {property.description}
        </p>
        
        {/* Prix et détails */}
        <div className="flex items-center gap-4 text-sm mb-3">
          <span className="font-bold text-xl text-primary">{property.price}€</span>
          <span className="text-gray-600">📍 {(property as any).city || property.location || 'Location non définie'}</span>
          <span className="text-gray-600">🏠 {property.size}m²</span>
        </div>
        
        {/* Ce qui manque si < 100% */}
        {property.matching < 100 && property.missingFeatures.length > 0 && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded mb-3">
            ⚠️ Manque: {property.missingFeatures.join(', ')}
          </div>
        )}
        
        {/* Bouton */}
        <Button 
          size="sm" 
          className="self-start mt-auto"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          Voir détails →
        </Button>
      </div>
    </div>
  );
});

PropertyResultCard.displayName = 'PropertyResultCard';

export default PropertyResultCard;