import { motion } from 'framer-motion';
import type { PropertyData } from '@/types/expansion.types';
import { LexaiaHeader } from './LexaiaHeader';
import { FiscalDashboard } from './FiscalDashboard';
import { CountryComparison } from './CountryComparison';
import { SavingsProjection } from './SavingsProjection';
import { TaxStructureRecommendation } from './TaxStructureRecommendation';
import { ExportPDFButton } from './ExportPDFButton';

interface LexaiaPanelProps {
  property: PropertyData;
  onClose: () => void;
}

export const LexaiaPanel = ({ property, onClose }: LexaiaPanelProps) => {
  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: '95%', opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="h-full bg-white border-l border-black/10 overflow-y-auto"
    >
      <div className="sticky top-0 z-10 bg-white border-b border-black/10">
        <LexaiaHeader property={property} onClose={onClose} />
      </div>

      <div className="p-8 space-y-12">
        <FiscalDashboard property={property} />
        <CountryComparison property={property} />
        <SavingsProjection property={property} />
        <TaxStructureRecommendation property={property} />
        <ExportPDFButton property={property} />
      </div>
    </motion.div>
  );
};
