import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TaxSavingsChartProps {
  originCountry: string;
  annualSavings: number;
}

export const TaxSavingsChart = ({ originCountry, annualSavings }: TaxSavingsChartProps) => {
  const data = [
    {
      period: '1 Year',
      savings: annualSavings,
    },
    {
      period: '5 Years',
      savings: annualSavings * 5,
    },
    {
      period: '10 Years',
      savings: annualSavings * 10,
    },
    {
      period: '20 Years',
      savings: annualSavings * 20,
    },
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="period"
            stroke="#71717a"
            style={{ fontSize: '12px', fontWeight: 300 }}
          />
          <YAxis
            stroke="#71717a"
            style={{ fontSize: '12px', fontWeight: 300 }}
            tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value: number) => [`€${value.toLocaleString()}`, 'Tax Savings']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '0px',
              fontWeight: 300,
            }}
          />
          <Legend wrapperStyle={{ fontWeight: 300 }} />
          <Bar
            dataKey="savings"
            fill="#000000"
            name="Cumulative Tax Savings"
            radius={[0, 0, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
