import { Card } from '@/components/dainabase-ui';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
}

export const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'blue' 
}: KPICardProps) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    red: 'text-red-600'
  };

  const bgColorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
    red: 'bg-red-100'
  };

  return (
    <Card variant="executive" padding="md" className="hover:shadow-xl transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
            {title}
          </h3>
          <div className={`p-2 rounded-lg ${bgColorClasses[color]}`}>
            <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-slate-900">
            {value}
          </div>
          
          {subtitle && (
            <p className="text-sm text-slate-500">
              {subtitle}
            </p>
          )}
          
          {trend !== undefined && (
            <div className={`text-sm font-medium flex items-center gap-1 ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-slate-500'
            }`}>
              <span className="text-lg">
                {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
              </span>
              {Math.abs(trend)}%
            </div>
          )}
        </div>
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