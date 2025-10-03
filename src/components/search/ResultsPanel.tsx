import { PropertyResultsList } from './PropertyResultsList';
import { FiscalOptimizationCard } from './FiscalOptimizationCard';
import { MockProperty } from '@/types/search.types';

interface ResultsPanelProps {
  showResults: boolean;
  properties: MockProperty[];
  onPropertyClick: (property: MockProperty) => void;
  onCreateAccount?: () => void;
}

export const ResultsPanel = ({
  showResults,
  properties,
  onPropertyClick,
  onCreateAccount
}: ResultsPanelProps) => {
  return (
    <div className={`results-panel border-l bg-gray-50 transition-all duration-[2500ms] ease-in-out overflow-hidden ${
      showResults ? 'md:w-2/3 w-full' : 'w-0'
    }`}>
      <div className="p-6 h-full overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6">Propriétés Correspondantes</h3>

        <PropertyResultsList
          properties={properties}
          onPropertyClick={onPropertyClick}
        />

        <FiscalOptimizationCard onCreateAccount={onCreateAccount} />
      </div>
    </div>
  );
};
