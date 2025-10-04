export const calculatePricePerSqm = (price: number, surface: number): number => {
  return Math.round(price / surface);
};

export const calculateRentalYield = (
  monthlyRent: number,
  propertyPrice: number
): number => {
  return Number(((monthlyRent * 12 / propertyPrice) * 100).toFixed(2));
};

export const calculateNetRentalYield = (
  monthlyRent: number,
  propertyPrice: number,
  annualCharges: number = 0.20
): number => {
  const grossYield = calculateRentalYield(monthlyRent, propertyPrice);
  return Number((grossYield * (1 - annualCharges)).toFixed(2));
};

export const calculateTotalBudget = (
  price: number,
  vatRate: number = 0.19,
  transferRate: number = 0.04,
  legalRate: number = 0.02
): number => {
  return Math.round(price * (1 + vatRate + transferRate + legalRate));
};

export const calculateMonthlyPayment = (
  loanAmount: number,
  annualRate: number,
  years: number
): number => {
  const monthlyRate = annualRate / 12 / 100;
  const numPayments = years * 12;

  if (monthlyRate === 0) return loanAmount / numPayments;

  const payment = loanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  return Math.round(payment);
};

export const calculateROI = (
  propertyPrice: number,
  monthlyRent: number,
  annualAppreciation: number = 0.05,
  years: number = 5
): {
  rentalIncome: number;
  capitalGain: number;
  totalReturn: number;
  annualizedReturn: number;
} => {
  const rentalIncome = monthlyRent * 12 * years;
  const futureValue = propertyPrice * Math.pow(1 + annualAppreciation, years);
  const capitalGain = futureValue - propertyPrice;
  const totalReturn = rentalIncome + capitalGain;
  const annualizedReturn = (totalReturn / propertyPrice / years) * 100;

  return {
    rentalIncome: Math.round(rentalIncome),
    capitalGain: Math.round(capitalGain),
    totalReturn: Math.round(totalReturn),
    annualizedReturn: Number(annualizedReturn.toFixed(2))
  };
};

export const formatCurrency = (
  amount: number,
  symbol: string = '€'
): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${symbol}0`;
  }
  const formatted = Math.round(amount).toLocaleString('fr-FR');
  return `${formatted}${symbol}`;
};

export const formatNumber = (
  num: number,
  locale: string = 'fr-FR'
): string => {
  return new Intl.NumberFormat(locale).format(num);
};
