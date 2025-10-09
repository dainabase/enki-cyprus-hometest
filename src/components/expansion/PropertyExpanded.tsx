import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { PropertyData } from '@/types/expansion.types';
import { formatPrice } from '@/lib/utils/formatters';
import { PropertyTabs } from './PropertyTabs';

interface PropertyExpandedProps {
  property: PropertyData;
  onCollapse: () => void;
}

export const PropertyExpanded = ({
  property,
  onCollapse,
}: PropertyExpandedProps) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-white border border-black/10 overflow-hidden mb-6"
    >
      <div className="relative p-6 border-b border-black/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-light text-black">
                {property.title}
              </h2>
              {property.goldenVisaEligible && (
                <div className="bg-yellow-500 text-black text-xs px-3 py-1 font-medium">
                  Golden Visa
                </div>
              )}
            </div>

            <p className="text-xl font-light text-black mb-2">
              {formatPrice(property.price)}
            </p>

            <p className="text-black/60 font-light">{property.location}</p>
          </div>

          <button
            onClick={onCollapse}
            className="flex items-center justify-center w-10 h-10 bg-black/5 hover:bg-black/10 border border-black/10 transition-colors"
            aria-label="Close property details"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <PropertyTabs property={property} />
      </div>
    </motion.article>
  );
};
