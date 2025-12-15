import { X } from 'lucide-react';
import type { PropertyData } from '@/types/expansion.types';

interface LexaiaHeaderProps {
  property: PropertyData;
  onClose: () => void;
}

export const LexaiaHeader = ({ property, onClose }: LexaiaHeaderProps) => {
  const { fiscalPreview } = property;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-black/60 tracking-wider uppercase">
            LEXAIA FISCAL ANALYSIS
          </h2>
          <h1 className="text-3xl font-medium text-black">
            {property.title}
          </h1>
          <p className="text-xl text-black/70 font-light">
            €{property.price.toLocaleString()}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-2 hover:bg-black/5 transition-colors"
          aria-label="Close Lexaia Analysis"
        >
          <X className="w-6 h-6 text-black" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-black/60 font-light">
        <span className="font-medium">{fiscalPreview.originCountry}</span>
        <span>→</span>
        <span className="font-medium">Cyprus Tax Optimization</span>
      </div>
    </div>
  );
};
