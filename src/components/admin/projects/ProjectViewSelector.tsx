import { Grid3X3, List, Table, AlignJustify, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ProjectViewType = 'cards' | 'list' | 'table' | 'compact' | 'detailed';

interface ProjectViewSelectorProps {
  currentView: ProjectViewType;
  onViewChange: (view: ProjectViewType) => void;
}

export const ProjectViewSelector = ({ currentView, onViewChange }: ProjectViewSelectorProps) => {
  const views = [
    { id: 'cards' as ProjectViewType, icon: Grid3X3, label: 'Cartes' },
    { id: 'list' as ProjectViewType, icon: List, label: 'Liste' },
    { id: 'table' as ProjectViewType, icon: Table, label: 'Tableau' },
    { id: 'compact' as ProjectViewType, icon: AlignJustify, label: 'Compact' },
    { id: 'detailed' as ProjectViewType, icon: FileText, label: 'Détaillé' }
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