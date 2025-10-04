'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  TrendingUp,
  Crown,
  Calculator,
  Euro,
  Percent,
  PiggyBank,
  Calendar,
  ArrowRight
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

  const { scrollYProgress } = useScroll();
  const calculatorY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const calculatorOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

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
    <section className="bg-white py-32 lg:py-48">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-black mb-6 tracking-tight">
            Investment & Financial Information
          </h2>
          <p className="text-lg md:text-xl text-black/60 font-light max-w-3xl">
            Explore the financial opportunities and calculate your investment returns
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left Column - Investment Details */}
          <div className="space-y-12">

            {/* Golden Visa Section */}
            {project.golden_visa_eligible && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-8 lg:p-12 border border-amber-200/50"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    whileInView={{ rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <Crown className="w-8 h-8 text-amber-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-light text-amber-900 mb-3 tracking-tight">
                      Golden Visa Eligible
                    </h3>
                    <p className="text-base md:text-lg text-amber-800/80 font-light leading-relaxed">
                      This property qualifies for the Cyprus Golden Visa program, offering
                      permanent residency for you and your family.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="border-l-2 border-amber-400 pl-4">
                    <p className="text-sm text-amber-600/60 font-light mb-1">Investment Required</p>
                    <p className="text-xl font-light text-amber-900">€300,000 minimum</p>
                  </div>
                  <div className="border-l-2 border-amber-400 pl-4">
                    <p className="text-sm text-amber-600/60 font-light mb-1">Processing Time</p>
                    <p className="text-xl font-light text-amber-900">2-3 months</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Price Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="border border-black/10 p-8 lg:p-12"
            >
              <div className="flex items-center space-x-3 mb-8">
                <Euro className="w-6 h-6 text-black/70" />
                <h3 className="text-2xl md:text-3xl font-light text-black tracking-tight">
                  Price Breakdown
                </h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-black/5">
                  <span className="text-base md:text-lg text-black/60 font-light">Base Price</span>
                  <span className="text-lg md:text-xl text-black font-light">{formatPrice(project.price)}</span>
                </div>

                {project.vat_rate && (
                  <div className="flex items-center justify-between py-4 border-b border-black/5">
                    <span className="text-base md:text-lg text-black/60 font-light">VAT ({project.vat_rate}%)</span>
                    <span className="text-lg md:text-xl text-black font-light">
                      {formatPrice(project.price * (project.vat_rate / 100))}
                    </span>
                  </div>
                )}

                {project.transfer_fee && (
                  <div className="flex items-center justify-between py-4 border-b border-black/5">
                    <span className="text-base md:text-lg text-black/60 font-light">Transfer Fee</span>
                    <span className="text-lg md:text-xl text-black font-light">{formatPrice(project.transfer_fee)}</span>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex items-center justify-between pt-6 mt-6 border-t-2 border-black"
                >
                  <span className="text-xl md:text-2xl text-black font-light">Total Investment</span>
                  <span className="text-2xl md:text-3xl text-black font-light">
                    {formatPrice(
                      project.price +
                      (project.vat_rate ? project.price * (project.vat_rate / 100) : 0) +
                      (project.transfer_fee || 0)
                    )}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Investment Features */}
            <div className="space-y-6">
              {investmentFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex items-center justify-between p-6 lg:p-8 border border-black/10 hover:border-black/20 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="text-black/70"
                    >
                      {feature.icon}
                    </motion.div>
                    <div>
                      <h4 className="text-lg md:text-xl font-light text-black mb-1">{feature.title}</h4>
                      <p className="text-sm text-black/40 font-light">{feature.description}</p>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-light text-black group-hover:scale-110 transition-transform duration-300">
                    {feature.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Financing Options */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="border border-black/10 p-8 lg:p-12"
            >
              <h3 className="text-2xl md:text-3xl font-light text-black mb-8 tracking-tight">
                Financing Options
              </h3>
              <div className="space-y-6">
                {financingOptions.bank_financing && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-between py-4 border-b border-black/5"
                  >
                    <span className="text-base md:text-lg text-black font-light">Bank Financing</span>
                    <span className="text-sm text-black/40 font-light">Up to 70% LTV</span>
                  </motion.div>
                )}
                {financingOptions.developer_financing && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex items-center justify-between py-4 border-b border-black/5"
                  >
                    <span className="text-base md:text-lg text-black font-light">Developer Financing</span>
                    <span className="text-sm text-black/40 font-light">Flexible payment plans</span>
                  </motion.div>
                )}
                {financingOptions.installment_plan && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="flex items-center justify-between py-4 border-b border-black/5"
                  >
                    <span className="text-base md:text-lg text-black font-light">Installment Plan</span>
                    <span className="text-sm text-black/40 font-light">During construction</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Calculator (Sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              style={{ y: calculatorY, opacity: calculatorOpacity }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border border-black/10 p-8 lg:p-12 bg-white"
            >
              <div className="flex items-center space-x-3 mb-10">
                <Calculator className="w-6 h-6 text-black/70" />
                <h3 className="text-2xl md:text-3xl font-light text-black tracking-tight">
                  Mortgage Calculator
                </h3>
              </div>

              <div className="space-y-8">

                {/* Loan Amount */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="space-y-3"
                >
                  <label htmlFor="loan-amount" className="text-sm text-black/60 font-light block">
                    Property Price (€)
                  </label>
                  <input
                    id="loan-amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full px-4 py-4 border border-black/10 bg-white text-black font-light text-lg focus:border-black transition-colors outline-none"
                  />
                </motion.div>

                {/* Down Payment */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="space-y-3"
                >
                  <label htmlFor="down-payment" className="text-sm text-black/60 font-light block">
                    Down Payment (%)
                  </label>
                  <input
                    id="down-payment"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    min="10"
                    max="100"
                    className="w-full px-4 py-4 border border-black/10 bg-white text-black font-light text-lg focus:border-black transition-colors outline-none"
                  />
                  <p className="text-sm text-black/40 font-light">
                    Amount: {formatPrice(loanAmount * (downPayment / 100))}
                  </p>
                </motion.div>

                {/* Interest Rate */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="space-y-3"
                >
                  <label htmlFor="interest-rate" className="text-sm text-black/60 font-light block">
                    Interest Rate (%)
                  </label>
                  <input
                    id="interest-rate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-4 py-4 border border-black/10 bg-white text-black font-light text-lg focus:border-black transition-colors outline-none"
                  />
                </motion.div>

                {/* Loan Term */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="space-y-3"
                >
                  <label htmlFor="loan-term" className="text-sm text-black/60 font-light block">
                    Loan Term (years)
                  </label>
                  <input
                    id="loan-term"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    min="5"
                    max="35"
                    className="w-full px-4 py-4 border border-black/10 bg-white text-black font-light text-lg focus:border-black transition-colors outline-none"
                  />
                </motion.div>

                {/* Results */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="pt-8 mt-8 border-t border-black/10 space-y-8"
                >
                  <div className="text-center">
                    <p className="text-sm text-black/40 font-light mb-3">Monthly Payment</p>
                    <motion.p
                      key={monthlyPayment}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-4xl md:text-5xl font-light text-black tracking-tight"
                    >
                      {formatPrice(monthlyPayment)}
                    </motion.p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center border-l-2 border-black/10 pl-4">
                      <p className="text-sm text-black/40 font-light mb-2">Loan Amount</p>
                      <p className="text-lg font-light text-black">{formatPrice(principal)}</p>
                    </div>
                    <div className="text-center border-l-2 border-black/10 pl-4">
                      <p className="text-sm text-black/40 font-light mb-2">Total Interest</p>
                      <p className="text-lg font-light text-black">
                        {formatPrice(monthlyPayment * numPayments - principal)}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#000' }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="w-full py-5 bg-black/90 text-white font-light text-lg tracking-wide flex items-center justify-center space-x-2 group"
                  >
                    <span>Get Pre-Approved</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
