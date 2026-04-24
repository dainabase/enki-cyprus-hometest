import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Euro, TrendingUp, Chrome as Home, Globe, Shield, PiggyBank, FileText, Building2, Check, Award, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProjectFinancing } from '@/hooks/useProjectFinancing';
import { trackSectionView } from '../utils/tracking';

interface FinancingInvestmentSectionProps {
  project: any;
}

export function FinancingInvestmentSection({ project }: FinancingInvestmentSectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const { data: financing, isLoading } = useProjectFinancing(project?.id);

  useEffect(() => {
    if (isInView) {
      trackSectionView('financing_investment');
    }
  }, [isInView]);

  if (isLoading) {
    return (
      <section className="w-full bg-gradient-to-br from-slate-50 to-white py-16 sm:py-20">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!financing) return null;

  const hasInvestmentMetrics = financing.rental_yield_percentage || financing.capital_appreciation_5y || financing.cap_rate;
  const hasGoldenVisa = financing.golden_visa_details;
  const hasTaxBenefits = financing.tax_benefits;
  const hasFinancingOptions = financing.financing_options;

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-br from-slate-50 to-white py-16 sm:py-20 md:py-24"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-6">
            Financement & <span className="font-normal">Investissement</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Solutions de financement flexibles et opportunité d'investissement exceptionnelle
          </p>
        </motion.div>

        {hasInvestmentMetrics && (
          <InvestmentMetrics financing={financing} isInView={isInView} />
        )}

        {hasGoldenVisa && (
          <GoldenVisaShowcase goldenVisa={financing.golden_visa_details!} isInView={isInView} />
        )}

        {hasTaxBenefits && (
          <TaxBenefitsTimeline taxBenefits={financing.tax_benefits!} isInView={isInView} />
        )}

        {hasFinancingOptions && (
          <FinancingOptionsGrid options={financing.financing_options!} isInView={isInView} />
        )}
      </div>
    </section>
  );
}

function InvestmentMetrics({ financing, isInView }: { financing: any; isInView: boolean }) {
  const metrics = [
    {
      label: 'Rendement Locatif',
      value: financing.rental_yield_percentage,
      suffix: '%',
      icon: Percent,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Appréciation 5 ans',
      value: financing.capital_appreciation_5y,
      suffix: '%',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Cap Rate',
      value: financing.cap_rate,
      suffix: '%',
      icon: PiggyBank,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Cash-on-Cash Return',
      value: financing.cash_on_cash_return,
      suffix: '%',
      icon: Euro,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Location Mensuelle',
      value: financing.rental_price_monthly,
      prefix: '€',
      suffix: '/mois',
      icon: Home,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ].filter(m => m.value);

  if (metrics.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16"
    >
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-lg ${metric.bgColor} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
              <p className={`text-3xl font-bold ${metric.color}`}>
                {metric.prefix}{metric.value}{metric.suffix}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </motion.div>
  );
}

function GoldenVisaShowcase({ goldenVisa, isInView }: { goldenVisa: any; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mb-16"
    >
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-700 text-white">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8" />
            <div>
              <CardTitle className="text-2xl mb-1">Résidence Permanente UE</CardTitle>
              <p className="text-amber-100 text-sm">Éligible Golden Visa Cyprus</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Détails</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Investissement Minimum</p>
                  <p className="text-2xl font-bold text-amber-700">
                    €{(goldenVisa.minimum_investment / 1000).toFixed(0)}K
                  </p>
                </div>
                {goldenVisa.processing_time && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Délai de Traitement</p>
                    <p className="text-lg font-semibold">{goldenVisa.processing_time}</p>
                  </div>
                )}
                {goldenVisa.fees && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Frais</p>
                    <p className="text-lg font-semibold">{goldenVisa.fees}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Bénéfices</h3>
              <ul className="space-y-2">
                {goldenVisa.benefits?.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {goldenVisa.requirements && goldenVisa.requirements.length > 0 && (
            <div className="mt-6 pt-6 border-t border-amber-200">
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <ul className="grid md:grid-cols-2 gap-2">
                {goldenVisa.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TaxBenefitsTimeline({ taxBenefits, isInView }: { taxBenefits: any; isInView: boolean }) {
  const benefits = [
    { label: 'TVA Propriété Neuve', value: `${taxBenefits.vat_new_property}%`, icon: Building2 },
    { label: 'TVA Revente', value: `${taxBenefits.vat_resale}%`, icon: FileText },
    { label: 'Impôt Sociétés', value: `${taxBenefits.corporate_tax}%`, icon: Euro },
    { label: 'Impôt Succession', value: `${taxBenefits.inheritance_tax}%`, icon: Shield },
    { label: 'Traités Fiscaux', value: taxBenefits.tax_treaties, icon: Globe },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mb-16"
    >
      <h3 className="text-2xl font-light text-center mb-8">
        Avantages <span className="font-normal">Fiscaux</span>
      </h3>

      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-2">{benefit.label}</p>
                <p className="text-2xl font-bold text-blue-600">{benefit.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {taxBenefits.non_dom_benefits && taxBenefits.non_dom_benefits.length > 0 && (
        <Card className="mt-6 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Statut Non-Domicilié
            </h4>
            <ul className="grid md:grid-cols-2 gap-3">
              {taxBenefits.non_dom_benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

function FinancingOptionsGrid({ options, isInView }: { options: any; isInView: boolean }) {
  const localBanks = options.banks?.filter((b: any) => b.type === 'local') || [];
  const internationalBanks = options.banks?.filter((b: any) => b.type === 'international') || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <h3 className="text-2xl font-light text-center mb-8">
        Options de <span className="font-normal">Financement</span>
      </h3>

      <div className="grid gap-6 mb-6">
        <Card className="bg-gradient-to-r from-green-50 to-white border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Acompte Minimum</p>
                <p className="text-3xl font-bold text-green-600">{options.minimum_deposit}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Taux Typique</p>
                <p className="text-3xl font-bold text-blue-600">{options.typical_interest_rate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {localBanks.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Banques Locales
          </h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {localBanks.map((bank: any, index: number) => (
              <BankCard key={index} bank={bank} />
            ))}
          </div>
        </div>
      )}

      {internationalBanks.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            Banques Internationales
          </h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {internationalBanks.map((bank: any, index: number) => (
              <BankCard key={index} bank={bank} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function BankCard({ bank }: { bank: any }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{bank.bank_name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-gray-500">Taux d'intérêt</p>
          <p className="text-lg font-semibold text-blue-600">
            {bank.interest_rate_from}% - {bank.interest_rate_to}%
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-500">LTV Max</p>
            <p className="font-semibold">{bank.ltv_max}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Durée</p>
            <p className="font-semibold">{bank.duration_years} ans</p>
          </div>
        </div>
        {bank.requirements && bank.requirements.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500 mb-2">Requirements</p>
            <ul className="space-y-1">
              {bank.requirements.slice(0, 2).map((req: string, i: number) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                  <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
