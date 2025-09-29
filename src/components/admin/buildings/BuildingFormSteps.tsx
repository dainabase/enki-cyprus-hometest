import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BuildingFormData } from '@/types/building';
import { GeneralStep } from './steps/GeneralStep';
import { StructureStep } from './steps/StructureStep';
import { DimensionsOrientationStep } from './steps/DimensionsOrientationStep';
import { CommercializationStep } from './steps/CommercializationStep';
import { TechnicalDetailsStep } from './steps/TechnicalDetailsStep';
import { InfrastructureStep } from './steps/InfrastructureStep';
import { SecurityStep } from './steps/SecurityStep';
import { AmenitiesStep } from './steps/AmenitiesStep';
import { ServicesStep } from './steps/ServicesStep';
import { AccessibilityStep } from './steps/AccessibilityStep';
import { LeisureStep } from './steps/LeisureStep';
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
    case 'infrastructure':
      return <InfrastructureStep form={form} />;
    case 'security':
      return <SecurityStep form={form} />;
    case 'amenities':
      return <AmenitiesStep form={form} />;
    case 'services':
      return <ServicesStep form={form} />;
    case 'accessibility':
      return <AccessibilityStep form={form} />;
    case 'leisure':
      return <LeisureStep form={form} />;
    case 'documents':
      return <DocumentsStep form={form} />;
    default:
      return <div>Étape non trouvée</div>;
  }
};
