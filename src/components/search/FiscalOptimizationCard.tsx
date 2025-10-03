interface FiscalOptimizationCardProps {
  onCreateAccount?: () => void;
}

export const FiscalOptimizationCard = ({ onCreateAccount }: FiscalOptimizationCardProps) => {
  return (
    <div className="fiscal-section bg-blue-50 p-6 rounded-lg">
      <h4 className="text-lg font-bold mb-3">
        📊 Scénario d'Optimisation Fiscale
      </h4>
      <p className="text-sm text-gray-700 mb-4">
        Basé sur votre profil de résident fiscal français avec un budget de 250 000€...
      </p>
      <button
        onClick={onCreateAccount}
        className="text-blue-600 font-medium underline"
      >
        Créer un compte pour l'analyse complète →
      </button>
    </div>
  );
};
