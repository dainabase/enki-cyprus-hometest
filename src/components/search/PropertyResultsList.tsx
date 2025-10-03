import PropertyResultCard from '@/components/ui/PropertyResultCard';
import { MockProperty } from '@/types/search.types';

interface PropertyResultsListProps {
  properties: MockProperty[];
  onPropertyClick: (property: MockProperty) => void;
}

export const PropertyResultsList = ({ properties, onPropertyClick }: PropertyResultsListProps) => {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Aucune propriété trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      {properties.map((property, idx) => (
        <PropertyResultCard
          key={idx}
          property={property}
          onClick={() => onPropertyClick(property)}
        />
      ))}
    </div>
  );
};
