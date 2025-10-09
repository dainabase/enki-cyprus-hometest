import { TrendingDown, Calendar, Percent, TrendingUp } from 'lucide-react';
import type { PropertyData } from '@/types/expansion.types';

interface FiscalDashboardProps {
  property: PropertyData;
}

export const FiscalDashboard = ({ property }: FiscalDashboardProps) => {
  const { fiscalPreview } = property;
  const tenYearProjection = fiscalPreview.annualSavings * 10;
  const roi = ((fiscalPreview.annualSavings * 10) / property.price) * 100;

  const kpis = [
    {
      icon: TrendingDown,
      label: 'Annual Tax Savings',
      value: `€${fiscalPreview.annualSavings.toLocaleString()}`,
      change: `vs ${fiscalPreview.originCountry}`,
    },
    {
      icon: Calendar,
      label: '10-Year Projection',
      value: `€${tenYearProjection.toLocaleString()}`,
      change: 'Cumulative savings',
    },
    {
      icon: Percent,
      label: 'Effective Tax Rate',
      value: `${fiscalPreview.taxRate}%`,
      change: `vs ${fiscalPreview.comparisonRate}% in ${fiscalPreview.originCountry}`,
    },
    {
      icon: TrendingUp,
      label: 'ROI on Investment',
      value: `${roi.toFixed(1)}%`,
      change: '10-year tax savings',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl sm:text-2xl font-medium text-black mb-2">
          Fiscal Dashboard
        </h3>
        <p className="text-black/70 font-light">
          Key metrics for your tax optimization analysis
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white border border-black/10 p-4 sm:p-6 space-y-3 sm:space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black/5">
                  <Icon className="w-5 h-5 text-black" />
                </div>
                <span className="text-sm text-black/60 font-light">
                  {kpi.label}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-medium text-black">
                  {kpi.value}
                </div>
                <div className="text-sm text-black/60 font-light">
                  {kpi.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
