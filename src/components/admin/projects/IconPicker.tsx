import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

// Liste des icônes les plus utilisées pour les USP immobiliers
const POPULAR_ICONS = [
  'Home', 'Building', 'Building2', 'Warehouse', 'Castle', 'Church',
  'Eye', 'Waves', 'Mountain', 'Trees', 'Sun', 'Sunset',
  'MapPin', 'Navigation', 'Map', 'Compass',
  'Car', 'ParkingCircle', 'Bike', 'Train',
  'ShoppingBag', 'Store', 'Coffee', 'Utensils',
  'Dumbbell', 'Droplets', 'Wind', 'Flame',
  'Shield', 'Lock', 'Key', 'DoorOpen',
  'Wifi', 'Zap', 'Lightbulb', 'Fan',
  'Bed', 'Bath', 'Sofa', 'Armchair',
  'Users', 'User', 'Baby', 'Dog',
  'Heart', 'Star', 'Award', 'Trophy',
  'TrendingUp', 'DollarSign', 'BadgePercent', 'Coins',
  'Leaf', 'Flower', 'Sprout', 'TreePine',
  'Snowflake', 'Thermometer', 'CloudRain', 'CloudSun',
  'Sparkles', 'Gem', 'Crown', 'Gift',
];

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(() => {
    if (!search) return POPULAR_ICONS;
    return POPULAR_ICONS.filter(name => 
      name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const SelectedIcon = value && (Icons as any)[value] as LucideIcon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 w-full justify-start gap-2 text-left font-normal"
          type="button"
        >
          {SelectedIcon ? (
            <>
              <SelectedIcon className="h-4 w-4 shrink-0" />
              <span className="text-xs text-muted-foreground">{value}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Sélectionner une icône</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder="Rechercher une icône..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        <ScrollArea className="h-[280px]">
          <div className="grid grid-cols-6 gap-1 p-2">
            {filteredIcons.map((iconName) => {
              const IconComponent = (Icons as any)[iconName] as LucideIcon;
              if (!IconComponent) return null;
              
              return (
                <Button
                  key={iconName}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => {
                    onChange(iconName);
                    setOpen(false);
                    setSearch('');
                  }}
                  type="button"
                  title={iconName}
                >
                  <IconComponent className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        {filteredIcons.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Aucune icône trouvée
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
