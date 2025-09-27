import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Heart, Zap, Trees } from 'lucide-react';
import type { ProjectAmenitiesExtension } from '@/types/project-amenities-extension';

interface ProjectAmenitiesSectionProps {
  amenities: ProjectAmenitiesExtension;
  onChange: (amenities: ProjectAmenitiesExtension) => void;
  t: (key: string) => string;
}

export const ProjectAmenitiesSection: React.FC<ProjectAmenitiesSectionProps> = ({ 
  amenities, 
  onChange,
  t 
}) => {
  const handleBooleanChange = (field: keyof ProjectAmenitiesExtension) => (checked: boolean) => {
    onChange({
      ...amenities,
      [field]: checked
    });
  };

  const handleParkingTypeChange = (value: string) => {
    onChange({
      ...amenities,
      parking_type: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Trees className="h-5 w-5" />
          {t('projectForm.commonEquipment') || 'Équipements en commun'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Wellness & Recreation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-medium text-muted-foreground">
              {t('projectForm.wellnessRecreation') || 'Bien-être & Loisirs'}
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="has_pool"
                checked={amenities.has_pool || false}
                onCheckedChange={handleBooleanChange('has_pool')}
              />
              <Label htmlFor="has_pool" className="cursor-pointer">
                {t('amenities.pool') || 'Piscine'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="has_gym"
                checked={amenities.has_gym || false}
                onCheckedChange={handleBooleanChange('has_gym')}
              />
              <Label htmlFor="has_gym" className="cursor-pointer">
                {t('amenities.gym') || 'Salle de sport'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="has_spa"
                checked={amenities.has_spa || false}
                onCheckedChange={handleBooleanChange('has_spa')}
              />
              <Label htmlFor="has_spa" className="cursor-pointer">
                {t('amenities.spa') || 'Spa & Bien-être'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="has_playground"
                checked={amenities.has_playground || false}
                onCheckedChange={handleBooleanChange('has_playground')}
              />
              <Label htmlFor="has_playground" className="cursor-pointer">
                {t('amenities.playground') || "Aire de jeux"}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="has_garden"
                checked={amenities.has_garden || false}
                onCheckedChange={handleBooleanChange('has_garden')}
              />
              <Label htmlFor="has_garden" className="cursor-pointer">
                {t('amenities.garden') || 'Jardin / Espaces verts'}
              </Label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-medium text-muted-foreground">
              {t('projectForm.security') || 'Sécurité'}
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="has_security_system"
                checked={amenities.has_security_system || false}
                onCheckedChange={handleBooleanChange('has_security_system')}
              />
              <Label htmlFor="has_security_system" className="cursor-pointer">
                {t('amenities.securitySystem') || 'Système de sécurité'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="has_cctv"
                checked={amenities.has_cctv || false}
                onCheckedChange={handleBooleanChange('has_cctv')}
              />
              <Label htmlFor="has_cctv" className="cursor-pointer">
                {t('amenities.cctv') || 'Vidéosurveillance'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="has_concierge"
                checked={amenities.has_concierge || false}
                onCheckedChange={handleBooleanChange('has_concierge')}
              />
              <Label htmlFor="has_concierge" className="cursor-pointer">
                {t('amenities.concierge') || 'Conciergerie'}
              </Label>
            </div>
          </div>
        </div>

        {/* Infrastructure */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-medium text-muted-foreground">
              {t('projectForm.infrastructure') || 'Infrastructure'}
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="has_generator"
                checked={amenities.has_generator || false}
                onCheckedChange={handleBooleanChange('has_generator')}
              />
              <Label htmlFor="has_generator" className="cursor-pointer">
                {t('amenities.generator') || 'Générateur de secours'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="has_solar_panels"
                checked={amenities.has_solar_panels || false}
                onCheckedChange={handleBooleanChange('has_solar_panels')}
              />
              <Label htmlFor="has_solar_panels" className="cursor-pointer">
                {t('amenities.solarPanels') || 'Panneaux solaires'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="has_parking"
                checked={amenities.has_parking || false}
                onCheckedChange={handleBooleanChange('has_parking')}
              />
              <Label htmlFor="has_parking" className="cursor-pointer">
                {t('amenities.parking') || 'Parking disponible'}
              </Label>
            </div>
          </div>
          
          {/* Parking Type - Only show if has_parking is true */}
          {amenities.has_parking && (
            <div className="mt-4 max-w-sm">
              <Label htmlFor="parking_type">{t('amenities.parkingType') || 'Type de parking'}</Label>
              <Select
                value={amenities.parking_type || ''}
                onValueChange={handleParkingTypeChange}
              >
                <SelectTrigger id="parking_type" className="mt-2">
                  <SelectValue placeholder={t('amenities.selectParkingType') || 'Sélectionner le type de parking'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="underground">{t('amenities.underground') || 'Souterrain'}</SelectItem>
                  <SelectItem value="covered">{t('amenities.covered') || 'Couvert'}</SelectItem>
                  <SelectItem value="open">{t('amenities.open') || 'Extérieur'}</SelectItem>
                  <SelectItem value="garage">{t('amenities.garage') || 'Garage privé'}</SelectItem>
                  <SelectItem value="street">{t('amenities.street') || 'Stationnement rue'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {countAmenities(amenities)} {t('projectForm.amenitiesSelected') || 'équipements sélectionnés'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to count selected amenities
function countAmenities(amenities: ProjectAmenitiesExtension): number {
  const booleanFields = [
    'has_pool', 'has_gym', 'has_spa', 'has_playground', 'has_garden',
    'has_security_system', 'has_cctv', 'has_concierge', 
    'has_generator', 'has_solar_panels', 'has_parking'
  ] as const;
  
  return booleanFields.filter(field => amenities[field]).length;
}
