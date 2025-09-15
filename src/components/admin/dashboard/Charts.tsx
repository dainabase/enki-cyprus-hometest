import { Card } from '@/components/dainabase-ui';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ModernBarChartProps {
  title: string;
  data: ChartDataPoint[];
  formatValue?: (value: number) => string;
}

export const ModernBarChart = ({ title, data, formatValue }: ModernBarChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const defaultFormatValue = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}k`;
    }
    return `€${value.toLocaleString()}`;
  };

  const formatter = formatValue || defaultFormatValue;

  return (
    <Card variant="clean" padding="lg">
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-light text-slate-900 mb-2">{title}</h3>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        </div>
        
        <div className="space-y-6">
          {data.map((item, index) => (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="text-lg font-light text-slate-900">{formatter(item.value)}</span>
              </div>
              <div className="relative">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

interface ZoneDistributionProps {
  limassol: number;
  paphos: number;
  larnaca: number;
  nicosia: number;
}

export const ModernZoneChart = ({ limassol, paphos, larnaca, nicosia }: ZoneDistributionProps) => {
  const total = limassol + paphos + larnaca + nicosia;
  
  const data = [
    { label: 'Limassol', value: limassol, percentage: total > 0 ? (limassol / total) * 100 : 0, color: 'from-blue-500 to-blue-600' },
    { label: 'Paphos', value: paphos, percentage: total > 0 ? (paphos / total) * 100 : 0, color: 'from-green-500 to-green-600' },
    { label: 'Larnaca', value: larnaca, percentage: total > 0 ? (larnaca / total) * 100 : 0, color: 'from-orange-500 to-orange-600' },
    { label: 'Nicosia', value: nicosia, percentage: total > 0 ? (nicosia / total) * 100 : 0, color: 'from-purple-500 to-purple-600' }
  ];

  return (
    <Card variant="clean" padding="lg">
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-light text-slate-900 mb-2">Distribution par Zone</h3>
          <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {data.map((zone, index) => (
            <div key={index} className="text-center space-y-3">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full bg-slate-100"></div>
                <div 
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${zone.color} opacity-90`}
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + zone.percentage/2}% 0%, 50% 50%)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-slate-700">
                    {zone.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div>
                <div className="font-medium text-slate-700">{zone.label}</div>
                <div className="text-2xl font-light text-slate-900">{zone.value}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-6 border-t border-slate-100 text-center">
          <div className="text-3xl font-light text-slate-900">{total}</div>
          <div className="text-sm text-slate-500">Total propriétés</div>
        </div>
      </div>
    </Card>
  );
};

interface PerformanceChartProps {
  data: {
    month: string;
    sales: number;
    revenue: number;
    leads: number;
  }[];
}

export const ModernPerformanceChart = ({ data }: PerformanceChartProps) => {
  const maxSales = Math.max(...data.map(d => d.sales));
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxLeads = Math.max(...data.map(d => d.leads));

  return (
    <Card variant="clean" padding="lg">
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-light text-slate-900 mb-2">Performance 6 derniers mois</h3>
          <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        </div>
        
        <div className="space-y-8">
          {data.map((month, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-lg font-medium text-slate-800">{month.month}</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-slate-600">Ventes</span>
                    <span className="text-2xl font-light text-slate-900">{month.sales}</span>
                  </div>
                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
                      style={{ width: `${maxSales > 0 ? (month.sales / maxSales) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-slate-600">Revenue</span>
                    <span className="text-2xl font-light text-slate-900">€{(month.revenue / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-700"
                      style={{ width: `${maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-slate-600">Leads</span>
                    <span className="text-2xl font-light text-slate-900">{month.leads}</span>
                  </div>
                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-700"
                      style={{ width: `${maxLeads > 0 ? (month.leads / maxLeads) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};