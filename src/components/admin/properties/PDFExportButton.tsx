import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { usePropertyPDF } from '@/hooks/usePropertyPDF';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PDFExportButtonProps {
  propertyId?: string;
  selectedPropertyIds?: string[];
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  propertyId,
  selectedPropertyIds = [],
  variant = 'outline',
  size = 'sm'
}) => {
  const { generatePDF, generateBatchPDF } = usePropertyPDF();

  const handleSinglePDF = () => {
    if (propertyId) {
      generatePDF(propertyId);
    }
  };

  const handleBatchPDF = () => {
    if (selectedPropertyIds.length > 0) {
      generateBatchPDF(selectedPropertyIds);
    }
  };

  // Single property export
  if (propertyId && !selectedPropertyIds.length) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleSinglePDF}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>
    );
  }

  // Batch export with dropdown
  if (selectedPropertyIds.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF ({selectedPropertyIds.length})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleBatchPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Download All Selected ({selectedPropertyIds.length})
          </DropdownMenuItem>
          {propertyId && (
            <DropdownMenuItem onClick={handleSinglePDF}>
              <FileText className="mr-2 h-4 w-4" />
              Download Current Only
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default state
  return (
    <Button variant={variant} size={size} disabled className="gap-2">
      <FileText className="h-4 w-4" />
      Export PDF
    </Button>
  );
};