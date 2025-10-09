import { Bed, Bath, Maximize2, Home, Calendar, MapPin } from 'lucide-react';
import { formatArea, formatPrice } from '@/lib/utils/formatters';
import type { PropertyData } from '@/types/expansion.types';

interface PropertySpecsListProps {
  property: PropertyData;
}

export const PropertySpecsList = ({ property }: PropertySpecsListProps) => {
  const specs = [
    {
      icon: Home,
      label: 'Price',
      value: formatPrice(property.price),
    },
    {
      icon: Bed,
      label: 'Bedrooms',
      value: property.bedrooms.toString(),
    },
    {
      icon: Bath,
      label: 'Bathrooms',
      value: property.bathrooms.toString(),
    },
    {
      icon: Maximize2,
      label: 'Area',
      value: formatArea(property.area),
    },
    {
      icon: MapPin,
      label: 'Location',
      value: property.location,
    },
    {
      icon: Calendar,
      label: 'Status',
      value: property.goldenVisaEligible ? 'Golden Visa Eligible' : 'Available',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {specs.map((spec) => {
        const Icon = spec.icon;
        return (
          <div
            key={spec.label}
            className="flex items-start gap-3 p-4 bg-white border border-black/10"
          >
            <div className="p-2 bg-black/5">
              <Icon className="w-5 h-5 text-black/60" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-black/60 font-light">
                {spec.label}
              </span>
              <span className="text-base font-medium text-black">
                {spec.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
