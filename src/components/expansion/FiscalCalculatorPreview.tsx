import { useState } from 'react';
import { Calculator } from 'lucide-react';

interface FiscalCalculatorPreviewProps {
  originCountry: string;
  originTaxRate: number;
  cyprusTaxRate: number;
}

export const FiscalCalculatorPreview = ({
  originCountry,
  originTaxRate,
  cyprusTaxRate,
}: FiscalCalculatorPreviewProps) => {
  const [annualIncome, setAnnualIncome] = useState(100000);

  const calculateSavings = () => {
    const originTax = annualIncome * (originTaxRate / 100);
    const cyprusTax = annualIncome * (cyprusTaxRate / 100);
    return originTax - cyprusTax;
  };

  const savings = calculateSavings();
  const originTax = annualIncome * (originTaxRate / 100);

  return (
    <div className="bg-white border border-black/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-black" />
        <h4 className="font-medium text-black">Quick Savings Calculator</h4>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-black/60 font-light mb-2">
            Annual Income (€)
          </label>
          <input
            type="range"
            min="30000"
            max="500000"
            step="10000"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            className="w-full h-2 bg-black/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-black/60 font-light mt-1">
            <span>€30k</span>
            <span className="font-medium text-black">
              €{(annualIncome / 1000).toFixed(0)}k
            </span>
            <span>€500k</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/10">
          <div>
            <p className="text-xs text-black/60 font-light mb-1">{originCountry} Tax</p>
            <p className="text-lg font-medium text-black">
              €{((annualIncome * originTaxRate) / 100).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-black/60 font-light mb-1">Cyprus Tax</p>
            <p className="text-lg font-medium text-black">
              €{((annualIncome * cyprusTaxRate) / 100).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-black/5 border border-black/10 p-4 mt-4">
          <p className="text-sm text-black/60 font-light mb-1">Your Annual Savings</p>
          <p className="text-2xl font-light text-black">
            €{savings.toLocaleString()}
          </p>
          <p className="text-xs text-black/60 font-light mt-1">
            {originTax > 0 ? ((savings / originTax) * 100).toFixed(0) : 0}% tax reduction
          </p>
        </div>
      </div>
    </div>
  );
};
