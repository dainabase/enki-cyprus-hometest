import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormData } from '@/schemas/property.schema';
import { IdentificationStep } from '../properties/steps/IdentificationStep';
import { ConfigurationStep } from '../properties/steps/ConfigurationStep';
import { EquipmentStep } from '../properties/steps/EquipmentStep';
import { OutdoorStep } from '../properties/steps/OutdoorStep';
import { FinancialStep } from '../properties/steps/FinancialStep';
import { DocumentationStep } from '../properties/steps/DocumentationStep';

interface PropertyFormStepsProps {
  form: UseFormReturn<PropertyFormData>;
  currentStep: string;
}

export const ProjectFormSteps: React.FC<PropertyFormStepsProps> = ({ form, currentStep }) => {
  switch (currentStep) {
    case 'identification':
      return <IdentificationStep form={form} />;
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