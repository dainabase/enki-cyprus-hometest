import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PropertyFormData } from '@/schemas/property.schema';
import { IdentificationStep } from './steps/IdentificationStep';
import { ConfigurationStep } from './steps/ConfigurationStep';
import { EquipmentStep } from './steps/EquipmentStep';
import { OutdoorStep } from './steps/OutdoorStep';
import { FinancialStep } from './steps/FinancialStep';
import { DocumentationStep } from './steps/DocumentationStep';

interface PropertyFormStepsProps {
  form: UseFormReturn<PropertyFormData>;
  currentStep: string;
  projects?: any[];
  buildings?: any[];
  inheritedData?: {
    vat_rate?: number;
    commission_rate?: number;
    energy_rating?: string;
  };
  calculations?: {
    vat_amount: number;
    price_including_vat: number;
    commission_amount: number;
    golden_visa_eligible: boolean;
  };
}

export const PropertyFormSteps: React.FC<PropertyFormStepsProps> = ({
  form,
  currentStep,
  projects = [],
  buildings = [],
  inheritedData = {},
  calculations
}) => {
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
      return <FinancialStep form={form} inheritedData={inheritedData} calculations={calculations} />;
    case 'documentation':
      return <DocumentationStep form={form} inheritedData={inheritedData} />;
    default:
      return <div>Étape non trouvée</div>;
  }
};