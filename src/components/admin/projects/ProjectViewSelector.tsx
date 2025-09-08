import { Grid3X3, List, Table, AlignJustify, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export type ProjectViewType = 'cards' | 'list' | 'table' | 'compact' | 'detailed';

interface ProjectViewSelectorProps {
  currentView: ProjectViewType;
  onViewChange: (view: ProjectViewType) => void;
}

export const ProjectViewSelector = ({ currentView, onViewChange }: ProjectViewSelectorProps) => {
  const { t } = useTranslation();
  
  const views = [
    { id: 'cards' as ProjectViewType, icon: Grid3X3, label: t('admin.views.cards') },
    { id: 'list' as ProjectViewType, icon: List, label: t('admin.views.list') },
    { id: 'table' as ProjectViewType, icon: Table, label: t('admin.views.table') },
    { id: 'compact' as ProjectViewType, icon: AlignJustify, label: t('admin.views.compact') },
    { id: 'detailed' as ProjectViewType, icon: FileText, label: t('admin.views.detailed') }
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