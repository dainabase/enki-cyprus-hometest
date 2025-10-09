import { motion } from 'framer-motion';
import { Bed, Bath, Maximize2, MapPin } from 'lucide-react';
import type { PropertyData } from '@/types/expansion.types';
import { CARD_ANIMATIONS } from '@/constants/expansion.animations';
import { formatPrice, formatArea } from '@/lib/utils/formatters';
import { GoldenVisaBadge } from './GoldenVisaBadge';
import { FiscalPreviewBadge } from './FiscalPreviewBadge';

interface PropertyCardEnhancedProps {
  property: PropertyData;
  onExpand: (propertyId: string) => void;
}

export const PropertyCardEnhanced = ({
  property,
  onExpand,
}: PropertyCardEnhancedProps) => {
  const {
    id,
    title,
    price,
    bedrooms,
    bathrooms,
    area,
    location,
    images,
    goldenVisaEligible,
    fiscalPreview,
  } = property;

  return (
    <motion.article
      whileHover={CARD_ANIMATIONS.hover}
      whileTap={CARD_ANIMATIONS.tap}
      transition={CARD_ANIMATIONS.transition}
      onClick={() => onExpand(id)}
      className="group bg-white border border-black/10 overflow-hidden hover:border-black/30 transition-all duration-300 cursor-pointer"
    >
      <GoldenVisaBadge show={goldenVisaEligible} />

      <div className="relative h-64 bg-black/5 overflow-hidden">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <div>
          <h3 className="text-2xl font-light text-black mb-2 line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-black/60 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-light">{location}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-black/60 font-light mb-4">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4" />
            <span>{bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4" />
            <span>{bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4" />
            <span>{formatArea(area)}</span>
          </div>
        </div>

        <FiscalPreviewBadge
          annualSavings={fiscalPreview.annualSavings}
          originCountry={fiscalPreview.originCountry}
        />

        <div className="flex items-center justify-between pt-4 border-t border-black/10 mt-4">
          <div>
            <p className="text-xs text-black/40 uppercase tracking-wider mb-1">
              À partir de
            </p>
            <p className="text-2xl font-light text-black">
              {formatPrice(price)}
            </p>
          </div>
          <span className="text-sm font-medium text-black hover:underline uppercase tracking-wider">
            Découvrir
          </span>
        </div>
      </div>
    </motion.article>
  );
};
