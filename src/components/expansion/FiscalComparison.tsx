import { Check, X } from 'lucide-react';

interface FiscalComparisonProps {
  originCountry: string;
  originTaxRate: number;
  cyprusTaxRate: number;
  annualSavings: number;
}

export const FiscalComparison = ({
  originCountry,
  originTaxRate,
  cyprusTaxRate,
  annualSavings,
}: FiscalComparisonProps) => {
  const comparisonItems = [
    {
      label: 'Income Tax Rate',
      origin: `${originTaxRate}%`,
      cyprus: `${cyprusTaxRate}%`,
      better: 'cyprus',
    },
    {
      label: 'Capital Gains Tax',
      origin: 'Up to 30%',
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
      label: 'Residency Requirement',
      origin: '183+ days/year',
      cyprus: '60 days/year',
      better: 'cyprus',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 p-4 bg-black/5 border border-black/10 font-medium text-sm">
        <div className="text-black">Criteria</div>
        <div className="text-black text-center">{originCountry}</div>
        <div className="text-black text-center">Cyprus</div>
      </div>

      {comparisonItems.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-3 gap-4 p-4 bg-white border border-black/10 items-center"
        >
          <div className="text-black font-medium">{item.label}</div>

          <div className="text-center flex items-center justify-center gap-2">
            <span className="text-black/70 font-light">{item.origin}</span>
            {item.better === 'cyprus' && (
              <X className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
          </div>

          <div className="text-center flex items-center justify-center gap-2">
            <span className="text-black/70 font-light">{item.cyprus}</span>
            {item.better === 'cyprus' && (
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
            )}
          </div>
        </div>
      ))}

      <div className="bg-black/5 border border-black/10 p-6 mt-6">
        <h4 className="font-medium text-black mb-2">Annual Tax Savings</h4>
        <p className="text-3xl font-light text-black mb-2">
          €{annualSavings.toLocaleString()}
        </p>
        <p className="text-sm text-black/70 font-light">
          By relocating from {originCountry} to Cyprus as a tax resident
        </p>
      </div>
    </div>
  );
};
