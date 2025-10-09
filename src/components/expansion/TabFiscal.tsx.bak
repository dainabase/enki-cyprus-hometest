import { ArrowRight } from 'lucide-react';
import type { PropertyData } from '@/types/expansion.types';
import { FiscalCalculatorPreview } from './FiscalCalculatorPreview';
import { FiscalComparison } from './FiscalComparison';
import { TaxSavingsChart } from './TaxSavingsChart';

interface TabFiscalProps {
  property: PropertyData;
}

export const TabFiscal = ({ property }: TabFiscalProps) => {
  const { fiscalPreview } = property;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-medium text-black mb-2">
          Tax Optimization Analysis
        </h3>
        <p className="text-black/70 font-light">
          Discover how relocating to Cyprus can optimize your tax situation
        </p>
      </div>

      <FiscalCalculatorPreview
        originCountry={fiscalPreview.originCountry}
        originTaxRate={fiscalPreview.comparisonRate}
        cyprusTaxRate={fiscalPreview.taxRate}
      />

      <div>
        <h4 className="text-xl font-medium text-black mb-4">
          Cumulative Tax Savings Over Time
        </h4>
        <div className="bg-white border border-black/10 p-6">
          <TaxSavingsChart
            originCountry={fiscalPreview.originCountry}
            annualSavings={fiscalPreview.annualSavings}
          />
        </div>
      </div>

      <div>
        <h4 className="text-xl font-medium text-black mb-4">
          Tax System Comparison
        </h4>
        <FiscalComparison
          originCountry={fiscalPreview.originCountry}
          originTaxRate={fiscalPreview.comparisonRate}
          cyprusTaxRate={fiscalPreview.taxRate}
          annualSavings={fiscalPreview.annualSavings}
        />
      </div>

      <div className="bg-black/5 border border-black/10 p-8 text-center">
        <h4 className="text-xl font-medium text-black mb-2">
          Want a Complete Personalized Analysis?
        </h4>
        <p className="text-black/70 font-light mb-6">
          Get a detailed tax optimization report tailored to your specific situation
          with Lexaia, our advanced fiscal analysis tool.
        </p>
        <button className="inline-flex items-center gap-2 bg-black hover:bg-black/90 text-white px-6 py-3 font-medium transition-colors">
          Open Complete Lexaia Analysis
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
