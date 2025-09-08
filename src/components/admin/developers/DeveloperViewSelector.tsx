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
    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
      {views.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant={currentView === id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange(id)}
          className="h-8 px-3"
          title={label}
        >
          <Icon className="h-4 w-4" />
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  );
};