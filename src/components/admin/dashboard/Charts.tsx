import { Card } from '@/components/dainabase-ui';

interface ZoneData {
  label: string;
  value: number;
  percentage: number;
}

interface ModernZoneChartProps {
  limassol: number;
  paphos: number;
  larnaca: number;
  nicosia: number;
}

export const ModernZoneChart = ({ limassol, paphos, larnaca, nicosia }: ModernZoneChartProps) => {
  const total = limassol + paphos + larnaca + nicosia;
  
  const zones: ZoneData[] = [
    { label: 'Limassol', value: limassol, percentage: total > 0 ? (limassol / total) * 100 : 0 },
    { label: 'Paphos', value: paphos, percentage: total > 0 ? (paphos / total) * 100 : 0 },
    { label: 'Larnaca', value: larnaca, percentage: total > 0 ? (larnaca / total) * 100 : 0 },
    { label: 'Nicosia', value: nicosia, percentage: total > 0 ? (nicosia / total) * 100 : 0 }
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Distribution par Zone</h3>
          <p className="text-sm text-slate-500">Répartition des propriétés</p>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          {zones.map((zone, index) => (
            <div key={zone.label} className="text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 mx-auto relative">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 42 42">
                    <circle
                      cx="21"
                      cy="21"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="3"
                    />
                    <circle
                      cx="21"
                      cy="21"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke={colors[index]}
                      strokeWidth="3"
                      strokeDasharray={`${zone.percentage} ${100 - zone.percentage}`}
                      strokeDashoffset="25"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-900">
                      {Math.round(zone.percentage)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="font-medium text-slate-700">{zone.label}</p>
                <p className="text-2xl font-bold text-slate-900">{zone.value}</p>
                <p className="text-xs text-slate-500">propriétés</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-6 border-t border-slate-100 text-center">
          <p className="text-3xl font-bold text-slate-900">{total}</p>
          <p className="text-sm text-slate-500">Total propriétés</p>
        </div>
      </div>
    </div>
  );
};

interface PerformanceData {
  month: string;
  sales: number;
  revenue: number;
  leads: number;
}

interface ModernPerformanceChartProps {
  data: PerformanceData[];
}

export const ModernPerformanceChart = ({ data }: ModernPerformanceChartProps) => {
  const maxSales = Math.max(...data.map(d => d.sales));
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Performance Mensuelle</h3>
          <p className="text-sm text-slate-500">Évolution des ventes et revenus</p>
        </div>
        
        <div className="space-y-6">
          {data.slice(-4).map((month, index) => (
            <div key={month.month} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-700">{month.month}</h4>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-slate-600">Ventes: {month.sales}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-600">€{(month.revenue / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              </div>
              
              <div className="relative h-12 bg-slate-50 rounded-lg overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg"
                  style={{ 
                    width: `${maxSales > 0 ? (month.sales / maxSales) * 100 : 0}%`,
                    maxWidth: '60%'
                  }}
                />
                <div 
                  className="absolute right-0 top-0 h-full bg-gradient-to-l from-green-500 to-green-600 rounded-lg"
                  style={{ 
                    width: `${maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0}%`,
                    maxWidth: '60%'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface CommissionData {
  label: string;
  value: number;
}

interface ModernBarChartProps {
  title: string;
  data: CommissionData[];
}

export const ModernBarChart = ({ title, data }: ModernBarChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}k`;
    }
    return `€${value.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
          <p className="text-sm text-slate-500">Revenus par zone géographique</p>
        </div>
        
        <div className="space-y-6">
          {data.map((item, index) => (
            <div key={item.label} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">{item.label}</span>
                <span className="text-lg font-bold text-slate-900">{formatValue(item.value)}</span>
              </div>
              
              <div className="relative">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000"
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
    </div>
  );
};