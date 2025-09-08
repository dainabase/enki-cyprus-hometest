import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ProjectFormData } from '@/schemas/projectSchema';

type PropertySubType = 'villa' | 'apartment' | 'penthouse' | 'townhouse' | 'studio' | 'duplex' | 'triplex' | 'maisonette' | 'office' | 'retail' | 'warehouse' | 'showroom' | 'restaurant' | 'hotel' | 'clinic' | 'workshop' | 'factory' | 'logistics' | 'storage' | 'production' | 'land_residential' | 'land_commercial' | 'land_agricultural' | 'mixed_use' | 'other';

interface PropertySubTypeSelectorProps {
  form: UseFormReturn<ProjectFormData>;
}

const PropertySubTypeSelector: React.FC<PropertySubTypeSelectorProps> = ({ form }) => {
  const category = form.watch('property_category');
  const selectedTypes = form.watch('property_sub_type') || [];

  const propertyTypes = {
    residential: [
      { value: 'villa' as PropertySubType, label: 'Villa' },
      { value: 'apartment' as PropertySubType, label: 'Appartement' },
      { value: 'penthouse' as PropertySubType, label: 'Penthouse' },
      { value: 'townhouse' as PropertySubType, label: 'Maison de ville' },
      { value: 'studio' as PropertySubType, label: 'Studio' },
      { value: 'duplex' as PropertySubType, label: 'Duplex' },
      { value: 'triplex' as PropertySubType, label: 'Triplex' },
      { value: 'maisonette' as PropertySubType, label: 'Maisonette' }
    ],
    commercial: [
      { value: 'office' as PropertySubType, label: 'Bureau' },
      { value: 'retail' as PropertySubType, label: 'Commerce' },
      { value: 'warehouse' as PropertySubType, label: 'Entrepôt' },
      { value: 'showroom' as PropertySubType, label: 'Showroom' },
      { value: 'restaurant' as PropertySubType, label: 'Restaurant' },
      { value: 'hotel' as PropertySubType, label: 'Hôtel' },
      { value: 'clinic' as PropertySubType, label: 'Clinique' },
      { value: 'workshop' as PropertySubType, label: 'Atelier' }
    ],
    industrial: [
      { value: 'factory' as PropertySubType, label: 'Usine' },
      { value: 'logistics' as PropertySubType, label: 'Logistique' },
      { value: 'storage' as PropertySubType, label: 'Stockage' },
      { value: 'production' as PropertySubType, label: 'Production' }
    ],
    land: [
      { value: 'land_residential' as PropertySubType, label: 'Terrain résidentiel' },
      { value: 'land_commercial' as PropertySubType, label: 'Terrain commercial' },
      { value: 'land_agricultural' as PropertySubType, label: 'Terrain agricole' }
    ]
  };

  // Get available types based on category
  const getAvailableTypes = () => {
    if (category === 'mixed') {
      return [...propertyTypes.residential, ...propertyTypes.commercial];
    }
    return propertyTypes[category as keyof typeof propertyTypes] || [];
  };

  const availableTypes = getAvailableTypes();

  const handleToggle = (typeValue: PropertySubType) => {
    if (selectedTypes.includes(typeValue)) {
      form.setValue('property_sub_type', selectedTypes.filter(t => t !== typeValue));
    } else {
      form.setValue('property_sub_type', [...selectedTypes, typeValue]);
    }
  };

  if (!category) {
    return (
      <div className="space-y-3">
        <Label>Sous-types de propriété</Label>
        <p className="text-sm text-muted-foreground">
          Sélectionnez d'abord une catégorie de propriété
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label>
        Sous-types de propriété 
        <span className="text-sm text-muted-foreground ml-2">
          (Sélection multiple)
        </span>
      </Label>
      
      {/* Show by category for mixed */}
      {category === 'mixed' ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-primary">Résidentiel</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {propertyTypes.residential.map((type) => (
                <label
                  key={type.value}
                  className={`
                    flex items-center gap-2 p-2 border rounded-lg cursor-pointer
                    transition-colors hover:bg-accent
                    ${selectedTypes.includes(type.value) 
                      ? 'bg-primary/10 border-primary' 
                      : 'border-border'
                    }
                  `}
                >
                  <Checkbox
                    checked={selectedTypes.includes(type.value)}
                    onCheckedChange={() => handleToggle(type.value)}
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2 text-primary">Commercial</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {propertyTypes.commercial.map((type) => (
                <label
                  key={type.value}
                  className={`
                    flex items-center gap-2 p-2 border rounded-lg cursor-pointer
                    transition-colors hover:bg-accent
                    ${selectedTypes.includes(type.value) 
                      ? 'bg-primary/10 border-primary' 
                      : 'border-border'
                    }
                  `}
                >
                  <Checkbox
                    checked={selectedTypes.includes(type.value)}
                    onCheckedChange={() => handleToggle(type.value)}
                  />
                  <span className="text-sm">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {availableTypes.map((type) => (
            <label
              key={type.value}
              className={`
                flex items-center gap-2 p-2 border rounded-lg cursor-pointer
                transition-colors hover:bg-accent
                ${selectedTypes.includes(type.value) 
                  ? 'bg-primary/10 border-primary' 
                  : 'border-border'
                }
              `}
            >
              <Checkbox
                checked={selectedTypes.includes(type.value)}
                onCheckedChange={() => handleToggle(type.value)}
              />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
      )}
      
      {/* Selection summary */}
      {selectedTypes.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedTypes.length} type(s) sélectionné(s): {selectedTypes.join(', ')}
        </div>
      )}
      
      {/* Error display */}
      {form.formState.errors.property_sub_type && (
        <p className="text-sm text-destructive">
          {form.formState.errors.property_sub_type.message}
        </p>
      )}
    </div>
  );
};

export default PropertySubTypeSelector;