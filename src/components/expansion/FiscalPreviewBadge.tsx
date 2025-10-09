import { TrendingDown } from 'lucide-react';
import { formatSavings } from '@/lib/utils/formatters';

interface FiscalPreviewBadgeProps {
  annualSavings: number;
  originCountry: string;
}

export const FiscalPreviewBadge = ({
  annualSavings,
  originCountry,
}: FiscalPreviewBadgeProps) => {
  return (
    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
      <TrendingDown className="w-4 h-4 text-blue-600" />
      <div className="flex flex-col">
        <span className="text-xs text-blue-600 font-medium">
          {originCountry} → Cyprus
        </span>
        <span className="text-sm font-semibold text-blue-700">
          Save €{formatSavings(annualSavings)}/year
        </span>
      </div>
    </div>
  );
};
