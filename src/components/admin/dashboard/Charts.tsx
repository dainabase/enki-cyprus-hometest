import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">{formatter(item.value)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    item.color || 'bg-primary'
                  }`}
                  style={{
                    width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
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
    <Card>
      <CardHeader>
        <CardTitle>Distribution par Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((zone, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${zone.color}`} />
                <span className="font-medium">{zone.label}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">{zone.value}</div>
                <div className="text-xs text-muted-foreground">
                  {zone.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Simple pie visualization */}
        <div className="mt-6 flex h-4 rounded-full overflow-hidden">
          {data.map((zone, index) => (
            <div
              key={index}
              className={zone.color}
              style={{ width: `${zone.percentage}%` }}
            />
          ))}
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Total: {total} propriétés
        </div>
      </CardContent>
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
    <Card>
      <CardHeader>
        <CardTitle>Performance des 6 derniers mois</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((month, index) => (
            <div key={index} className="space-y-2">
              <div className="text-sm font-medium">{month.month}</div>
              
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Ventes</span>
                    <span>{month.sales}</span>
                  </div>
                  <div className="w-full bg-muted rounded h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded"
                      style={{ width: `${maxSales > 0 ? (month.sales / maxSales) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Revenue</span>
                    <span>€{(month.revenue / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="w-full bg-muted rounded h-2">
                    <div 
                      className="bg-green-500 h-2 rounded"
                      style={{ width: `${maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Leads</span>
                    <span>{month.leads}</span>
                  </div>
                  <div className="w-full bg-muted rounded h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded"
                      style={{ width: `${maxLeads > 0 ? (month.leads / maxLeads) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};