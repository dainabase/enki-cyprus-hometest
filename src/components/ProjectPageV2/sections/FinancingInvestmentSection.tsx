import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Euro, TrendingUp, Chrome as Home, Globe, Shield, Calculator, PiggyBank, FileText, Building2, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, calculateMonthlyPayment, calculateROI } from '../utils/calculations';
import { trackSectionView } from '../utils/tracking';

interface FinancingInvestmentSectionProps {
  project: any;
}

export function FinancingInvestmentSection({ project }: FinancingInvestmentSectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      trackSectionView('financing_investment');
    }
  }, [isInView]);

  const { investment, financing, price } = project;
  const basePrice = price?.from || project.price_from || 450000;

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-br from-gray-50 to-white py-16 sm:py-20 md:py-24"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-6">
            Financement & Opportunite
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Solutions de financement flexibles et opportunite d'investissement exceptionnelle
          </p>
        </motion.div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all">Pour Tous</TabsTrigger>
            <TabsTrigger value="investors">Investisseurs</TabsTrigger>
            <TabsTrigger value="residents">Occupants</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <AllSection
              pricing={price}
              financing={financing}
              basePrice={basePrice}
              isInView={isInView}
            />
          </TabsContent>

          <TabsContent value="investors">
            <InvestorsSection
              investment={investment}
              basePrice={basePrice}
              isInView={isInView}
            />
          </TabsContent>

          <TabsContent value="residents">
            <ResidentsSection
              basePrice={basePrice}
              financing={financing}
              isInView={isInView}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function AllSection({ pricing, financing, basePrice, isInView }: any) {
  const paymentPlan = financing?.paymentPlan || [
    { phase: 'Reservation', percent: 10, timing: 'Signature' },
    { phase: 'Echelonniers construction', percent: 50, timing: '18-24 mois' },
    { phase: 'Solde livraison', percent: 40, timing: 'Remise cles' }
  ];

  const fees = pricing?.fees || {
    vat: 0.19,
    transfer: 0.04,
    legal: 0.02
  };

  const totalFees = fees.vat + fees.transfer + fees.legal;
  const totalBudget = basePrice * (1 + totalFees);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-2xl font-light text-gray-900 mb-6">Echeancier de Paiement</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paymentPlan.map((phase: any, index: number) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-light">{phase.percent}%</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{phase.phase}</h4>
                <p className="text-sm text-gray-600">{phase.timing}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
          <CardContent className="p-8">
            <h3 className="text-2xl font-light mb-6">Transparence Couts Totaux</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Prix affiche</span>
                <span className="text-xl font-medium">{formatCurrency(basePrice)}</span>
              </div>
              <div className="flex justify-between items-center text-white/70">
                <span>+ TVA ({(fees.vat * 100).toFixed(0)}%)</span>
                <span>{formatCurrency(basePrice * fees.vat)}</span>
              </div>
              <div className="flex justify-between items-center text-white/70">
                <span>+ Frais transfert ({(fees.transfer * 100).toFixed(0)}%)</span>
                <span>{formatCurrency(basePrice * fees.transfer)}</span>
              </div>
              <div className="flex justify-between items-center text-white/70">
                <span>+ Notaire/Legal ({(fees.legal * 100).toFixed(0)}%)</span>
                <span>{formatCurrency(basePrice * fees.legal)}</span>
              </div>
              <div className="border-t border-white/20 my-4"></div>
              <div className="flex justify-between items-center text-2xl font-light">
                <span>Budget Total</span>
                <span>{formatCurrency(totalBudget)}</span>
              </div>
              <p className="text-sm text-white/60 text-center mt-2">
                (+{((totalFees) * 100).toFixed(0)}% du prix affiche)
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {financing?.partners && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-light text-gray-900 mb-6">Partenaires Bancaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {financing.partners.slice(0, 4).map((bank: any, index: number) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Building2 className="w-8 h-8 text-gray-700 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{bank.name}</h4>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p>LTV max: {bank.maxLTV}%</p>
                        <p>Taux: {bank.interestRate}%</p>
                        <p>Duree: {bank.termYears} ans</p>
                      </div>
                      <p className="text-xs text-gray-500">{bank.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function InvestorsSection({ investment, basePrice, isInView }: any) {
  const [calculatorValues, setCalculatorValues] = useState({
    purchasePrice: basePrice,
    downPayment: basePrice * 0.3,
    interestRate: 3.5,
    loanTerm: 25
  });

  const roi = calculateROI(
    basePrice,
    investment?.rentalPriceMonthly || 2050,
    0.085,
    5
  );

  return (
    <div className="space-y-8">
      {investment?.goldenVisa && investment?.goldenVisaDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Globe className="w-8 h-8 text-amber-600" />
                <span>Golden Visa - Votre Passeport pour l'Europe</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white border-amber-200">
                  <CardContent className="p-4 text-center">
                    <Euro className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                    <p className="text-sm text-gray-600 mb-1">Investissement Min.</p>
                    <p className="text-2xl font-light text-gray-900">
                      {formatCurrency(investment.goldenVisaDetails.minimumInvestment)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                    <p className="text-sm text-gray-600 mb-1">Delai</p>
                    <p className="text-2xl font-light text-gray-900">
                      {investment.goldenVisaDetails.processingTime}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardContent className="p-4 text-center">
                    <Home className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                    <p className="text-sm text-gray-600 mb-1">Residence</p>
                    <p className="text-xl font-light text-gray-900">Permanente</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-amber-200">
                  <CardContent className="p-4 text-center">
                    <Globe className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                    <p className="text-sm text-gray-600 mb-1">Circulation</p>
                    <p className="text-xl font-light text-gray-900">UE libre</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Avantages</h4>
                  <ul className="space-y-2">
                    {investment.goldenVisaDetails.benefits.map((benefit: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Requis</h4>
                  <ul className="space-y-2">
                    {investment.goldenVisaDetails.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-2xl font-light text-gray-900 mb-6">Rendements & ROI</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <p className="text-sm text-gray-600 mb-1">Rendement Brut</p>
              <p className="text-4xl font-light text-gray-900 mb-2">
                {investment?.rentalYield || 7.03}%
              </p>
              <p className="text-xs text-gray-500">par an</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6 text-center">
              <Euro className="w-8 h-8 mx-auto mb-3 text-gray-700" />
              <p className="text-sm text-gray-600 mb-1">Loyer Mensuel</p>
              <p className="text-3xl font-light text-gray-900 mb-2">
                {formatCurrency(investment?.rentalPriceMonthly || 2050)}
              </p>
              <p className="text-xs text-gray-500">estime</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-6 text-center">
              <PiggyBank className="w-8 h-8 mx-auto mb-3 text-gray-700" />
              <p className="text-sm text-gray-600 mb-1">Plus-value Historique</p>
              <p className="text-3xl font-light text-gray-900 mb-2">
                {investment?.appreciationHistorical || 8.5}%
              </p>
              <p className="text-xs text-gray-500">annuel moyen</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {investment?.taxBenefits && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-light text-gray-900 mb-6">Avantages Fiscaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investment.taxBenefits.map((benefit: any, index: number) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <h4 className="font-medium text-gray-900 mb-2">{benefit.type}</h4>
                  <p className="text-sm text-gray-600 mb-3">{benefit.description}</p>
                  <Badge className="bg-green-100 text-green-800">
                    Economie: {benefit.savingEstimate}%
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ResidentsSection({ basePrice, financing, isInView }: any) {
  const [loanAmount, setLoanAmount] = useState(basePrice * 0.7);
  const monthlyPayment = calculateMonthlyPayment(loanAmount, 3.5, 25);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Calculator className="w-6 h-6" />
              <span>Simulateur Mensualites</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Prix d'achat</label>
                <Input
                  type="text"
                  value={formatCurrency(basePrice)}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">Montant du pret (70%)</label>
                <Input
                  type="text"
                  value={formatCurrency(loanAmount)}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-lg">
                <p className="text-sm text-white/70 mb-2">Mensualites estimees</p>
                <p className="text-4xl font-light mb-1">{formatCurrency(monthlyPayment)}</p>
                <p className="text-sm text-white/60">sur 25 ans a 3.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-2xl font-light text-gray-900 mb-6">Garanties & Securite</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 text-gray-700 mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">Garantie Decennale</h4>
              <p className="text-sm text-gray-600">
                Protection complete 10 ans pour tous les travaux de construction
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <Check className="w-8 h-8 text-green-600 mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">Garantie Achevement</h4>
              <p className="text-sm text-gray-600">
                Livraison garantie selon planning avec clauses penalites
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
