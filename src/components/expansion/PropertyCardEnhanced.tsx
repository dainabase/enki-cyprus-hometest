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
      className="relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group"
    >
      <GoldenVisaBadge show={goldenVisaEligible} />

      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location}</span>
          </div>
        </div>

        <div className="text-2xl font-bold text-primary">
          {formatPrice(price)}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

        <div className="pt-2 border-t border-gray-100">
          <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Click to view details →
          </span>
        </div>
      </div>
    </motion.article>
  );
};
