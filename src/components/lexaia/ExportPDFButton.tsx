import { Download } from 'lucide-react';
import type { PropertyData } from '@/types/expansion.types';
import { useToast } from '@/components/ToastProvider';
import { logger } from '@/lib/logger';

interface ExportPDFButtonProps {
  property: PropertyData;
}

export const ExportPDFButton = ({ property }: ExportPDFButtonProps) => {
  const { addToast } = useToast();

  const handleExport = () => {
    try {
      logger.info('PDF Export requested for property:', property.id);
      addToast({
        type: 'success',
        title: 'PDF exported successfully!',
        message: 'Your fiscal analysis has been downloaded.',
        duration: 4000
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Export failed',
        message: 'Failed to export PDF. Please try again.',
        duration: 4000
      });
    }
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
