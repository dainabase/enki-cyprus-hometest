import { Card } from '@/components/dainabase-ui';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  title: string;
  data: ChartDataPoint[];
  formatValue?: (value: number) => string;
}

export const SimpleBarChart = ({ title, data, formatValue }: SimpleBarChartProps) => {
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
    <Card variant="executive" padding="lg">
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        
        <div className="space-y-6">
          {data.map((item, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">{item.label}</span>
                <span className="text-slate-600 font-medium">{formatter(item.value)}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-700 ${
                    item.color || 'bg-blue-500'
                  }`}
                  style={{
                    width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%'
                  }}
                />
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

export const ZoneDistributionChart = ({ limassol, paphos, larnaca, nicosia }: ZoneDistributionProps) => {
  const total = limassol + paphos + larnaca + nicosia;
  
  const data = [
    { label: 'Limassol', value: limassol, percentage: total > 0 ? (limassol / total) * 100 : 0, color: 'bg-blue-500' },
    { label: 'Paphos', value: paphos, percentage: total > 0 ? (paphos / total) * 100 : 0, color: 'bg-green-500' },
    { label: 'Larnaca', value: larnaca, percentage: total > 0 ? (larnaca / total) * 100 : 0, color: 'bg-yellow-500' },
    { label: 'Nicosia', value: nicosia, percentage: total > 0 ? (nicosia / total) * 100 : 0, color: 'bg-purple-500' }
  ];

  return (
    <Card variant="executive" padding="lg">
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900">Distribution par Zone</h3>
        
        <div className="space-y-6">
          {data.map((zone, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded ${zone.color}`} />
                <span className="font-semibold text-slate-700">{zone.label}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">{zone.value}</div>
                <div className="text-sm text-slate-500">
                  {zone.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Executive pie visualization */}
        <div className="space-y-4">
          <div className="flex h-6 rounded-full overflow-hidden shadow-inner bg-slate-100">
            {data.map((zone, index) => (
              <div
                key={index}
                className={zone.color}
                style={{ width: `${zone.percentage}%` }}
              />
            ))}
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">{total}</div>
            <div className="text-sm text-slate-500">Total propriétés</div>
          </div>
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

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const maxSales = Math.max(...data.map(d => d.sales));
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxLeads = Math.max(...data.map(d => d.leads));

  return (
    <Card variant="executive" padding="lg">
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900">Performance des 6 derniers mois</h3>
        
        <div className="space-y-8">
          {data.map((month, index) => (
            <div key={index} className="space-y-4">
              <div className="text-lg font-semibold text-slate-800">{month.month}</div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Ventes</span>
                    <span className="font-bold text-slate-900">{month.sales}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${maxSales > 0 ? (month.sales / maxSales) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Revenue</span>
                    <span className="font-bold text-slate-900">€{(month.revenue / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Leads</span>
                    <span className="font-bold text-slate-900">{month.leads}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full transition-all duration-500"
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