import { Download } from 'lucide-react';
import type { PropertyData } from '@/types/expansion.types';

interface ExportPDFButtonProps {
  property: PropertyData;
}

export const ExportPDFButton = ({ property }: ExportPDFButtonProps) => {
  const handleExport = () => {
    console.log('PDF Export requested for property:', property.id);
    console.log('Feature will be implemented in Phase 2');
  };

  return (
    <div className="flex justify-center pt-6">
      <button
        onClick={handleExport}
        className="flex items-center gap-3 px-8 py-4 bg-black text-white font-medium transition-colors hover:bg-black/90"
      >
        <Download className="w-5 h-5" />
        <span>Export Complete Analysis (PDF)</span>
      </button>
    </div>
  );
};
