import { Check, X } from 'lucide-react';
import type { PropertyData } from '@/types/expansion.types';

interface CountryComparisonProps {
  property: PropertyData;
}

export const CountryComparison = ({ property }: CountryComparisonProps) => {
  const { fiscalPreview } = property;

  const comparisonItems = [
    {
      label: 'Income Tax Rate',
      origin: `${fiscalPreview.comparisonRate}%`,
      cyprus: `${fiscalPreview.taxRate}%`,
      better: 'cyprus',
    },
    {
      label: 'Capital Gains Tax',
      origin: 'Up to 30%',
      cyprus: '0% (non-dom)',
      better: 'cyprus',
    },
    {
      label: 'Dividend Tax',
      origin: 'Up to 35%',
      cyprus: '0% (non-dom)',
      better: 'cyprus',
    },
    {
      label: 'Inheritance Tax',
      origin: 'Up to 40%',
      cyprus: '0%',
      better: 'cyprus',
    },
    {
      label: 'Wealth Tax',
      origin: 'Yes',
      cyprus: 'No',
      better: 'cyprus',
    },
    {
      label: 'Social Security',
      origin: 'High contributions',
      cyprus: 'Lower contributions',
      better: 'cyprus',
    },
    {
      label: 'Residency Requirement',
      origin: '183+ days/year',
      cyprus: '60 days/year',
      better: 'cyprus',
    },
    {
      label: 'Tax Treaties',
      origin: 'Limited',
      cyprus: '60+ countries',
      better: 'cyprus',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-medium text-black mb-2">
          Detailed Country Comparison
        </h3>
        <p className="text-black/70 font-light">
          Comprehensive tax system analysis
        </p>
      </div>

      <div className="bg-white border border-black/10">
        <div className="grid grid-cols-3 gap-px bg-black/10">
          <div className="bg-white p-4 font-medium text-black">
            Criteria
          </div>
          <div className="bg-white p-4 font-medium text-black">
            {fiscalPreview.originCountry}
          </div>
          <div className="bg-white p-4 font-medium text-black">
            Cyprus
          </div>
        </div>

        {comparisonItems.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-3 gap-px bg-black/10"
          >
            <div className="bg-white p-4 text-black/70 font-light">
              {item.label}
            </div>
            <div className="bg-white p-4 flex items-center justify-between">
              <span className="text-black font-light">{item.origin}</span>
              {item.better === 'origin' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="bg-white p-4 flex items-center justify-between">
              <span className="text-black font-light">{item.cyprus}</span>
              {item.better === 'cyprus' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
