import type { PropertyData } from '@/types/expansion.types';
import { PropertySpecsList } from './PropertySpecsList';

interface TabDetailsProps {
  property: PropertyData;
}

export const TabDetails = ({ property }: TabDetailsProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-medium text-black mb-3">Description</h3>
        <p className="text-black/70 font-light leading-relaxed">
          {property.description}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-medium text-black mb-4">Specifications</h3>
        <PropertySpecsList property={property} />
      </div>

      {property.goldenVisaEligible && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-6">
          <h3 className="text-lg font-medium text-black mb-2">
            Golden Visa Eligible
          </h3>
          <p className="text-black/70 font-light leading-relaxed">
            This property meets the minimum investment threshold of €300,000
            for the Cyprus Golden Visa program. Enjoy permanent residency
            with minimal stay requirements.
          </p>
        </div>
      )}
    </div>
  );
};
