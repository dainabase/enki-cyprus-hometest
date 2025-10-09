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
    <div className="flex items-center gap-2 bg-black/5 border border-black/10 px-3 py-2">
      <TrendingDown className="w-4 h-4 text-black/60" />
      <div className="flex flex-col">
        <span className="text-xs text-black/60 font-light">
          {originCountry} → Cyprus
        </span>
        <span className="text-sm font-medium text-black">
          Save €{formatSavings(annualSavings)}/year
        </span>
      </div>
    </div>
  );
};
