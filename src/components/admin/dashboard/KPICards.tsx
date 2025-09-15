import { Card } from '@/components/dainabase-ui';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  variant?: 'primary' | 'success' | 'warning' | 'info';
}

export const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = 'primary'
}: KPICardProps) => {
  const variantClasses = {
    primary: 'border-l-blue-500',
    success: 'border-l-green-500',
    warning: 'border-l-orange-500',
    info: 'border-l-purple-500'
  };

  const trendClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-slate-500'
  };

  const getTrendClass = () => {
    if (trend === undefined) return '';
    if (trend > 0) return trendClasses.positive;
    if (trend < 0) return trendClasses.negative;
    return trendClasses.neutral;
  };

  return (
    <Card variant="clean" padding="lg" className={`border-l-4 ${variantClasses[variant]} hover:shadow-lg transition-all duration-300`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              {title}
            </p>
            <div className="space-y-1">
              <h3 className="text-3xl font-light text-slate-900 tracking-tight">
                {value}
              </h3>
              {subtitle && (
                <p className="text-sm text-slate-500">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <Icon className="w-6 h-6 text-slate-600" />
          </div>
        </div>
        
        {trend !== undefined && (
          <div className={`text-sm font-medium ${getTrendClass()}`}>
            {trend > 0 ? '↗ +' : trend < 0 ? '↘ ' : '→ '}
            {Math.abs(trend)}%
            <span className="text-slate-400 ml-1">vs période précédente</span>
          </div>
        )}
      </div>
    </Card>
  );
};

interface KPIGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5;
}

export const KPIGrid = ({ children, columns = 4 }: KPIGridProps) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6`}>
      {children}
    </div>
  );
};