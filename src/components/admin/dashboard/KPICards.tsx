import { Card } from '@/components/dainabase-ui';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  isLarge?: boolean;
}

export const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  isLarge = false
}: KPICardProps) => {
  const getTrendColor = () => {
    if (trend === undefined) return '';
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-500';
    return 'text-slate-400';
  };

  return (
    <Card 
      variant="clean" 
      padding={isLarge ? "lg" : "md"} 
      className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-slate-50 rounded-lg">
            <Icon className="w-5 h-5 text-slate-600" />
          </div>
          {trend !== undefined && (
            <div className={`text-sm font-medium ${getTrendColor()}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            {title}
          </h3>
          <div className={`font-semibold text-slate-900 ${isLarge ? 'text-4xl' : 'text-2xl'}`}>
            {value}
          </div>
          {subtitle && (
            <p className="text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon: LucideIcon;
}

export const MetricCard = ({ title, value, change, icon: Icon }: MetricCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        {change && (
          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
            change.value > 0 
              ? 'text-green-700 bg-green-50' 
              : change.value < 0 
                ? 'text-red-700 bg-red-50'
                : 'text-slate-600 bg-slate-50'
          }`}>
            {change.value > 0 ? '+' : ''}{change.value}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {change && (
          <p className="text-xs text-slate-500">vs {change.period}</p>
        )}
      </div>
    </div>
  );
};

interface KPIGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const KPIGrid = ({ children, columns = 4 }: KPIGridProps) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-4`}>
      {children}
    </div>
  );
};