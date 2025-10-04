'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Crown, 
  Calculator, 
  Euro,
  Percent,
  PiggyBank,
  Calendar
} from 'lucide-react';
import { formatPrice, formatPercentage } from '@/lib/utils/formatters';

interface InvestmentProps {
  project: any;
}

export default function Investment({ project }: InvestmentProps) {
  const [loanAmount, setLoanAmount] = useState(project.price || 300000);
  const [downPayment, setDownPayment] = useState(30);
  const [loanTerm, setLoanTerm] = useState(25);
  const [interestRate, setInterestRate] = useState(4.5);

  // Calculate monthly payment
  const principal = loanAmount * (1 - downPayment / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                        (Math.pow(1 + monthlyRate, numPayments) - 1);

  const investmentFeatures = [
    {
      title: 'ROI Estimate',
      value: project.roi_estimate_percent ? formatPercentage(project.roi_estimate_percent) : '8-12%',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Annual return on investment'
    },
    {
      title: 'Rental Yield',
      value: project.rental_yield_percent ? formatPercentage(project.rental_yield_percent) : '6-8%',
      icon: <PiggyBank className="w-5 h-5" />,
      description: 'Annual rental income yield'
    },
    {
      title: 'Price Appreciation',
      value: '5-7%',
      icon: <Percent className="w-5 h-5" />,
      description: 'Expected annual appreciation'
    }
  ];

  const financingOptions = project.financing_options || {
    bank_financing: true,
    developer_financing: true,
    installment_plan: true
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Investment & Financial Information</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the financial opportunities and calculate your investment returns
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Column - Investment Details */}
          <div className="space-y-8">
            
            {/* Golden Visa Section */}
            {project.golden_visa_eligible && (
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-amber-800">
                    <Crown className="w-5 h-5" />
                    <span>Golden Visa Eligible</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-700 mb-4">
                    This property qualifies for the Cyprus Golden Visa program, offering 
                    permanent residency for you and your family.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Investment Required</p>
                      <p className="text-amber-600">€300,000 minimum</p>
                    </div>
                    <div>
                      <p className="font-medium">Processing Time</p>
                      <p className="text-amber-600">2-3 months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Price Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Euro className="w-5 h-5" />
                  <span>Price Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Base Price</span>
                  <span className="font-semibold">{formatPrice(project.price)}</span>
                </div>
                
                {project.vat_rate && (
                  <div className="flex justify-between items-center">
                    <span>VAT ({project.vat_rate}%)</span>
                    <span className="font-semibold">
                      {formatPrice(project.price * (project.vat_rate / 100))}
                    </span>
                  </div>
                )}
                
                {project.transfer_fee && (
                  <div className="flex justify-between items-center">
                    <span>Transfer Fee</span>
                    <span className="font-semibold">{formatPrice(project.transfer_fee)}</span>
                  </div>
                )}
                
                <hr />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Investment</span>
                  <span>
                    {formatPrice(
                      project.price + 
                      (project.vat_rate ? project.price * (project.vat_rate / 100) : 0) + 
                      (project.transfer_fee || 0)
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Investment Features */}
            <div className="grid gap-4">
              {investmentFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-primary">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {feature.value}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Financing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Financing Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {financingOptions.bank_financing && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Bank Financing</Badge>
                      <span className="text-sm text-muted-foreground">Up to 70% LTV</span>
                    </div>
                  )}
                  {financingOptions.developer_financing && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Developer Financing</Badge>
                      <span className="text-sm text-muted-foreground">Flexible payment plans</span>
                    </div>
                  )}
                  {financingOptions.installment_plan && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Installment Plan</Badge>
                      <span className="text-sm text-muted-foreground">During construction</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Calculator */}
          <div className="lg:sticky lg:top-24">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Mortgage Calculator</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Loan Amount */}
                <div className="space-y-2">
                  <Label htmlFor="loan-amount">Property Price (€)</Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                  />
                </div>

                {/* Down Payment */}
                <div className="space-y-2">
                  <Label htmlFor="down-payment">Down Payment (%)</Label>
                  <Input
                    id="down-payment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    min="10"
                    max="100"
                  />
                  <p className="text-sm text-muted-foreground">
                    Amount: {formatPrice(loanAmount * (downPayment / 100))}
                  </p>
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                  <Input
                    id="interest-rate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>

                {/* Loan Term */}
                <div className="space-y-2">
                  <Label htmlFor="loan-term">Loan Term (years)</Label>
                  <Input
                    id="loan-term"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    min="5"
                    max="35"
                  />
                </div>

                {/* Results */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Monthly Payment</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(monthlyPayment)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Loan Amount</p>
                      <p className="font-semibold">{formatPrice(principal)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Total Interest</p>
                      <p className="font-semibold">
                        {formatPrice(monthlyPayment * numPayments - principal)}
                      </p>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Get Pre-Approved
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}