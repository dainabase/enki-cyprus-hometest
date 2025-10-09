import { motion, useReducedMotion } from 'framer-motion';
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 300 }}
      dragElastic={0.2}
      onDragEnd={(event, info) => {
        if (info.offset.y > 100 && info.velocity.y > 500) {
          onCollapse();
        }
      }}
      whileDrag={{
        scale: 0.98,
        opacity: 0.9
      }}
      className="relative bg-white border border-black/10 overflow-hidden mb-6"
    >
      <div className="relative p-4 sm:p-6 border-b border-black/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-black">
                {property.title}
              </h2>
              {property.goldenVisaEligible && (
                <div className="bg-yellow-500 text-black text-xs px-3 py-1 font-medium">
                  Golden Visa
                </div>
              )}
            </div>

            <p className="text-lg sm:text-xl font-light text-black mb-2">
              {formatPrice(property.price)}
            </p>

            <p className="text-black/60 font-light">{property.location}</p>
          </div>

          <button
            onClick={onCollapse}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-10 h-10 sm:w-12 sm:h-12 bg-black/5 hover:bg-black/10 border border-black/10 transition-colors"
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
