import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyDBData } from '@/schemas/property-db.schema';
import { IdentificationStep } from './steps/IdentificationStep';
import { ConfigurationStep } from './steps/ConfigurationStep';
import { EquipmentStep } from './steps/EquipmentStep';
import { OutdoorStep } from './steps/OutdoorStep';
import { FinancialStep } from './steps/FinancialStep';
import { DocumentationStep } from './steps/DocumentationStep';

interface PropertyFormStepsProps {
  form: UseFormReturn<PropertyDBData>;
  currentStep: string;
  projects?: any[];
  buildings?: any[];
}

export const PropertyFormSteps: React.FC<PropertyFormStepsProps> = ({ form, currentStep, projects, buildings }) => {
  switch (currentStep) {
    case 'identification':
      return <IdentificationStep form={form} projects={projects} buildings={buildings} />;
    case 'configuration':
      return <ConfigurationStep form={form} />;
    case 'equipment':
      return <EquipmentStep form={form} />;
    case 'outdoor':
      return <OutdoorStep form={form} />;
    case 'financial':
      return <FinancialStep form={form} />;
    case 'documentation':
      return <DocumentationStep form={form} />;
    default:
      return <div>Étape non trouvée</div>;
  }
};