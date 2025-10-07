'use client';

import { ArrowUpDown, TrendingDown, TrendingUp, Calendar, Star, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SortOption } from '@/types/project.types';

interface SortSelectorProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SortSelector({ sortBy, onSortChange }: SortSelectorProps) {
  const sortOptions: Array<{ value: SortOption; label: string; icon: any }> = [
    { value: 'date', label: 'Plus Récents', icon: Calendar },
    { value: 'price-asc', label: 'Prix Croissant', icon: TrendingUp },
    { value: 'price-desc', label: 'Prix Décroissant', icon: TrendingDown },
    { value: 'popularity', label: 'Popularité', icon: Star },
    { value: 'distance', label: 'Distance à la Plage', icon: MapPin },
    { value: 'roi', label: 'Rendement (ROI)', icon: TrendingUp },
  ];

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-black/60 font-light">
        <ArrowUpDown className="w-4 h-4" />
        <span className="hidden sm:inline">Trier par:</span>
      </div>
      <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-[200px] border-black/20 font-light">
          <SelectValue placeholder="Sélectionner un tri" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className="w-4 h-4" />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
