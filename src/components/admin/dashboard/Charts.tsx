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
  // Prendre les 6 derniers mois pour l'affichage
  const recentData = data.slice(-6);
  
  // Calculer les totaux pour les graphiques circulaires
  const totalSales = recentData.reduce((sum, month) => sum + month.sales, 0);
  const totalRevenue = recentData.reduce((sum, month) => sum + month.revenue, 0);
  const totalLeads = recentData.reduce((sum, month) => sum + month.leads, 0);
  
  // Meilleur mois pour chaque métrique
  const bestSalesMonth = recentData.reduce((prev, current) => 
    current.sales > prev.sales ? current : prev, recentData[0]
  );
  const bestRevenueMonth = recentData.reduce((prev, current) => 
    current.revenue > prev.revenue ? current : prev, recentData[0]
  );

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Performance Mensuelle</h3>
          <p className="text-sm text-slate-500">Évolution des 6 derniers mois</p>
        </div>
        
        {/* Résumé avec graphiques circulaires */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Total Ventes */}
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 42 42">
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="2"
                />
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray={`${(totalSales / 200) * 100} ${100 - (totalSales / 200) * 100}`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{totalSales}</span>
                <span className="text-xs text-slate-500">ventes</span>
              </div>
            </div>
            <div>
              <p className="font-medium text-slate-700">Total Ventes</p>
              <p className="text-sm text-slate-500">6 derniers mois</p>
              <p className="text-xs text-blue-600 mt-2">
                Meilleur: {bestSalesMonth.month} ({bestSalesMonth.sales})
              </p>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 42 42">
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="2"
                />
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray={`${(totalRevenue / 30000000) * 100} ${100 - (totalRevenue / 30000000) * 100}`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-slate-900">
                  €{(totalRevenue / 1000000).toFixed(1)}M
                </span>
                <span className="text-xs text-slate-500">revenue</span>
              </div>
            </div>
            <div>
              <p className="font-medium text-slate-700">Total Revenue</p>
              <p className="text-sm text-slate-500">6 derniers mois</p>
              <p className="text-xs text-green-600 mt-2">
                Meilleur: {bestRevenueMonth.month} (€{(bestRevenueMonth.revenue / 1000).toFixed(0)}k)
              </p>
            </div>
          </div>

          {/* Total Leads */}
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 42 42">
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="2"
                />
                <circle
                  cx="21"
                  cy="21"
                  r="15.91549430918954"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  strokeDasharray={`${(totalLeads / 500) * 100} ${100 - (totalLeads / 500) * 100}`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{totalLeads}</span>
                <span className="text-xs text-slate-500">leads</span>
              </div>
            </div>
            <div>
              <p className="font-medium text-slate-700">Total Leads</p>
              <p className="text-sm text-slate-500">6 derniers mois</p>
              <p className="text-xs text-purple-600 mt-2">
                Moyenne: {Math.round(totalLeads / 6)}/mois
              </p>
            </div>
          </div>
        </div>

        {/* Timeline mensuelle */}
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-slate-900">Timeline Mensuelle</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentData.map((month, index) => (
              <div key={month.month} className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-slate-900">{month.month}</h5>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{month.sales}</p>
                      <p className="text-xs text-slate-500">Ventes</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">
                        €{(month.revenue / 1000).toFixed(0)}k
                      </p>
                      <p className="text-xs text-slate-500">Revenue</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-purple-600">{month.leads}</p>
                      <p className="text-xs text-slate-500">Leads</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note sur la phase de test */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">Phase de test en cours</p>
              <p className="text-xs text-amber-700 mt-1">
                Les données affichées sont des exemples. Les vraies métriques commenceront lors du lancement officiel de la plateforme.
              </p>
            </div>
          </div>
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