import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { GeneralStep } from './steps/GeneralStep';
import { StructureStep } from './steps/StructureStep';
import { DimensionsOrientationStep } from './steps/DimensionsOrientationStep';
import { CommercializationStep } from './steps/CommercializationStep';
import { TechnicalDetailsStep } from './steps/TechnicalDetailsStep';
import { InfrastructureSecurityStep } from './steps/InfrastructureSecurityStep'; // ✅ NOUVELLE ÉTAPE CONSOLIDÉE
import { AmenitiesServicesStep } from './steps/AmenitiesServicesStep'; // ✅ NOUVELLE ÉTAPE CONSOLIDÉE
import { AccessibilityStep } from './steps/AccessibilityStep';
import { DocumentsStep } from './steps/DocumentsStep';

interface BuildingFormStepsProps {
  form: UseFormReturn<BuildingFormData>;
  currentStep: string;
  projects: any[];
}

export const BuildingFormSteps: React.FC<BuildingFormStepsProps> = ({ form, currentStep, projects }) => {
  switch (currentStep) {
    case 'general':
      return <GeneralStep form={form} projects={projects} />;
    case 'structure':
      return <StructureStep form={form} />;
    case 'dimensions':
      return <DimensionsOrientationStep form={form} />;
    case 'commercialization':
      return <CommercializationStep form={form} />;
    case 'technical':
      return <TechnicalDetailsStep form={form} />;
    case 'infrastructure-security':
      return <InfrastructureSecurityStep form={form} />; // ✅ FUSIONNÉ Infrastructure + Security
    case 'amenities-services':
      return <AmenitiesServicesStep form={form} />; // ✅ FUSIONNÉ Parking + Amenities + Services + Leisure
    case 'accessibility':
      return <AccessibilityStep form={form} />;
    case 'documents':
      return <DocumentsStep form={form} />;
    default:
      return <div>Étape non trouvée</div>;
  }
};
