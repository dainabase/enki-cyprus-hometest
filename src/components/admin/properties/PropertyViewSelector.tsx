import React from 'react';
import { Grid3X3, List, Table, AlignJustify, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type PropertyViewType = 'cards' | 'list' | 'table' | 'compact' | 'detailed';

interface PropertyViewSelectorProps {
  currentView: PropertyViewType;
  onViewChange: (view: PropertyViewType) => void;
}

export const PropertyViewSelector: React.FC<PropertyViewSelectorProps> = ({
  currentView,
  onViewChange
}) => {
  const viewOptions = [
    { value: 'cards', label: 'Cartes', icon: Grid3X3 },
    { value: 'list', label: 'Liste', icon: List },
    { value: 'table', label: 'Tableau', icon: Table },
    { value: 'compact', label: 'Compact', icon: AlignJustify },
    { value: 'detailed', label: 'Détaillé', icon: FileText }
  ] as const;

  return (
    <ToggleGroup 
      type="single" 
      value={currentView} 
      onValueChange={(value) => value && onViewChange(value as PropertyViewType)}
      className="bg-white border border-slate-200 rounded-lg p-1"
    >
      {viewOptions.map(({ value, label, icon: Icon }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          aria-label={label}
          className="flex items-center gap-2 px-3 py-2 text-sm data-[state=on]:bg-slate-100 data-[state=on]:text-slate-900"
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};