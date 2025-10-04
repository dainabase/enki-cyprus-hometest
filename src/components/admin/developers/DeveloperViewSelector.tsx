import { Grid3X3, List, Table, AlignJustify, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewType } from '@/hooks/useViewPreference';

interface DeveloperViewSelectorProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const DeveloperViewSelector = ({ currentView, onViewChange }: DeveloperViewSelectorProps) => {
  const views = [
    { id: 'cards' as ViewType, icon: Grid3X3, label: 'Cartes' },
    { id: 'list' as ViewType, icon: List, label: 'Liste' },
    { id: 'table' as ViewType, icon: Table, label: 'Tableau' },
    { id: 'compact' as ViewType, icon: AlignJustify, label: 'Compact' },
    { id: 'detailed' as ViewType, icon: FileText, label: 'Détaillé' }
  ];

  return (
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl shadow-sm p-1">
      {views.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant="ghost"
          size="sm"
          onClick={() => onViewChange(id)}
          className={`
            h-10 px-4 rounded-lg transition-all duration-200 
            ${currentView === id 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }
          `}
          title={label}
        >
          <Icon className="h-4 w-4 mr-2" />
          <span className="font-medium">{label}</span>
        </Button>
      ))}
    </div>
  );
};