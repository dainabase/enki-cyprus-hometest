import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PropertyData } from '@/types/expansion.types';

interface SavingsProjectionProps {
  property: PropertyData;
}

export const SavingsProjection = ({ property }: SavingsProjectionProps) => {
  const { fiscalPreview } = property;

  const data = [
    {
      year: 0,
      withCyprus: 0,
      withoutCyprus: 0,
    },
    {
      year: 5,
      withCyprus: fiscalPreview.annualSavings * 5,
      withoutCyprus: 0,
    },
    {
      year: 10,
      withCyprus: fiscalPreview.annualSavings * 10,
      withoutCyprus: 0,
    },
    {
      year: 20,
      withCyprus: fiscalPreview.annualSavings * 20,
      withoutCyprus: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-medium text-black mb-2">
          Long-Term Savings Projection
        </h3>
        <p className="text-black/70 font-light">
          Cumulative tax savings over time
        </p>
      </div>

      <div className="bg-white border border-black/10 p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="year"
                stroke="#71717a"
                style={{ fontSize: '12px', fontWeight: 300 }}
                label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                stroke="#71717a"
                style={{ fontSize: '12px', fontWeight: 300 }}
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                label={{ value: 'Savings (€)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value: number) => `€${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '0px',
                  fontWeight: 300,
                }}
              />
              <Legend
                wrapperStyle={{ fontWeight: 300 }}
              />
              <Line
                type="monotone"
                dataKey="withCyprus"
                stroke="#000000"
                strokeWidth={2}
                name="With Cyprus Tax Optimization"
                dot={{ fill: '#000000', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="withoutCyprus"
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Without Optimization"
                dot={{ fill: '#9ca3af', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
