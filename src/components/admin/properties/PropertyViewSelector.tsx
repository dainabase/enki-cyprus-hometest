import { Grid3X3, List, Table, AlignJustify, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type PropertyViewType = 'cards' | 'list' | 'table' | 'compact' | 'detailed';

interface PropertyViewSelectorProps {
  currentView: PropertyViewType;
  onViewChange: (view: PropertyViewType) => void;
}

export const PropertyViewSelector = ({ currentView, onViewChange }: PropertyViewSelectorProps) => {
  const views = [
    { id: 'cards' as PropertyViewType, icon: Grid3X3, label: 'Cartes' },
    { id: 'list' as PropertyViewType, icon: List, label: 'Liste' },
    { id: 'table' as PropertyViewType, icon: Table, label: 'Tableau' },
    { id: 'compact' as PropertyViewType, icon: AlignJustify, label: 'Compact' },
    { id: 'detailed' as PropertyViewType, icon: FileText, label: 'Détaillé' }
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
              ? 'bg-gradient-to-r from-[hsl(199,63%,59%)] to-[hsl(199,63%,65%)] text-white shadow-md'
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
