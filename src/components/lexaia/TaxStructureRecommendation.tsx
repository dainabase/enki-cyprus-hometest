import { Lightbulb, Building2, Calendar } from 'lucide-react';
import type { PropertyData } from '@/types/expansion.types';

interface TaxStructureRecommendationProps {
  property: PropertyData;
}

export const TaxStructureRecommendation = ({ property }: TaxStructureRecommendationProps) => {
  const recommendations = [
    {
      icon: Lightbulb,
      title: 'Non-Domiciled (Non-Dom) Status',
      description: 'Apply for Cyprus non-dom status to benefit from 0% tax on dividends, interest, and capital gains for 17 years.',
      benefits: [
        'No tax on foreign-source income',
        'No tax on dividends and interest',
        '0% capital gains tax (except real estate)',
        'Valid for 17 consecutive years',
      ],
    },
    {
      icon: Building2,
      title: 'Holding Company Structure',
      description: 'Establish a Cyprus holding company to optimize your investment returns and benefit from extensive tax treaty network.',
      benefits: [
        '12.5% corporate tax rate',
        'No withholding tax on dividends',
        'Access to 60+ tax treaties',
        'IP Box regime available',
      ],
    },
    {
      icon: Calendar,
      title: '60-Day Rule Optimization',
      description: 'Become a Cyprus tax resident with only 60 days of physical presence per year while maintaining flexibility.',
      benefits: [
        'Only 60 days required in Cyprus',
        'No other tax residence worldwide',
        'Business ties to Cyprus required',
        'Maintain permanent home in Cyprus',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-medium text-black mb-2">
          AI-Powered Tax Structure Recommendations
        </h3>
        <p className="text-black/70 font-light">
          Optimized strategies based on your profile
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <div
              key={rec.title}
              className="bg-white border border-black/10 p-6 space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-black/5">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-xl font-medium text-black">
                    {rec.title}
                  </h4>
                  <p className="text-black/70 font-light">
                    {rec.description}
                  </p>
                </div>
              </div>

              <div className="pl-[60px] space-y-2">
                <p className="text-sm font-medium text-black/60">
                  Key Benefits:
                </p>
                <ul className="space-y-1">
                  {rec.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="text-sm text-black/70 font-light flex items-start gap-2"
                    >
                      <span className="text-black">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
